import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  IconButton,
  Typography,
} from '@material-ui/core';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@material-ui/icons/Search';
import CircularProgress from '@mui/material/CircularProgress';
import { useStyles } from './CatalogPage.styles';
import VolcanoCard from './VolcanoCard/volcanoCard';
import Tags from './Tags/Tags.js';
import LoadingCard from './VolcanoCard/loadingCard';
import stringSimilarity from 'string-similarity'
import { saveAs } from 'file-saver';
import * as constants from '../../Constants'
const originalTags=['Volcano Name','Main Type','Free Crystal Type','Altered Material Type','Juvenile Type','Lithic Type','Color','Crystallinity','Hydrothermally Alteration Degree','Shape', 'Eruptive Style']
function CatalogPage() {
  const proxy = constants.PROXY
  const examplePar = require("./examplePar.json")
  const classes = useStyles();
  const [tags,setTags] = useState(originalTags)
  const [selectedTags,setSelectedTags] = useState([]);
  const [fetchedData, setFetchedData] = useState({})
  const [particles,setParticles] = useState([]);
  const [volcanoes,setVolcanoes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSubmit, setSearchSubmit] = useState();
  const [filterSubmit, setFilterSubmit] = useState([]);
  const [searchData, setSearchData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const handleChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
  };

  const getSearchResult = (submit, selectedTags) => {
    setIsLoading(true)
    setSuggest(false)
    let dataList  = {} 
    if (submit !== "" || selectedTags.length!==0) {
      var filter=[]
      if(selectedTags){
        for (var i =0; i<selectedTags.length;i++){
          filter.push(selectedTags[i].toLowerCase());
        }
      }
      if(submit){
        if(!filter.includes(submit.toLowerCase())) filter.push(submit.toLowerCase())
      }
      Object.keys(fetchedData).map(key => {
        const data = fetchedData[key].filter(d=>{
          var props_arr = Object.values(d).map(ele=> typeof(ele)==="string"?ele.toLowerCase():null)      
          return(filter.every(elem => props_arr.includes(elem)))
        })
        dataList[key]=data;
      })
      setSearchData(dataList);
    }
    setTimeout(()=>{setIsLoading(false)},1000)
    return dataList
  };
  const t = require("./Tags/Tags.json")
  let keyword =[]
  Object.keys(t).map((taglabel)=>{
    if(taglabel!=="volcanoName"){
      t[taglabel].choices.map((ele,index)=> index!==0?keyword.push(ele):null)
    }
  })
  useEffect(()=>{
    axios.get(`${proxy}/volcanoes/getVolcanoes2`)
    .then(response => {
      if(response.data.success){
        console.log(response)
        setVolcanoes(response.data.volcanoes)
      } else{
        console.log(response)
        alert("Failed to fetch data")
      }
    })
    axios.get(`${proxy}/volcanoes/getParticles`)
    .then(response => {
      if(response.data.success){
        setParticles(response.data.particles)
      } else{
        alert("Failed to fetch data")
      }
    })
  setTimeout(()=>{setIsLoading(false)},1000)
  },[])
  const [keyWordList, setKeyWordList] = useState()
  useEffect(()=>{
    setFetchedData({
      Volcanoes: volcanoes,
      Particles: particles
    })
    let chosen = ["volc_name","volc_num"]
    particles.map(volc=>{
      Object.keys(volc).map(attr=>{
        if(chosen.includes(attr)){
          if(!keyword.includes(volc[attr])){
            keyword.push(volc[attr])
          }
        }
      })
    })
    setKeyWordList(keyword)
  },[volcanoes,particles])

  const handleKeyPress =(event)=>{
    if(event.key === 'Enter'){
      document.getElementById('search-button').click();
    }
  }
  const [suggestSearch, setSuggestSearch] = useState()
  const [suggest,setSuggest] = useState(false)
  const handleSubmit = (submit) =>{
    setSearchSubmit(submit)
    setFilterSubmit(submit && selectedTags.length!=0?submit+", "+selectedTags.join(","):submit + selectedTags.join(","))
    if (submit !==""){
      let max = 0
      let maxWord = ""
      keyWordList.map(word=>{
        let lowCase 
        if(isNaN(word)){
          lowCase = word.toLowerCase()
        }else{
          lowCase = word.toString()
        }
        let similarity = stringSimilarity.compareTwoStrings(submit,lowCase)
        if (similarity>max) {
          max = similarity
          maxWord = word
        }
      })
      if(max==1){
        getSearchResult(submit,selectedTags)
      }else if(max>0.3 && max<1){
        setSuggestSearch(maxWord)
        setSuggest(true)
        setSearchData({})
      }else{
        setSuggest(false)
        getSearchResult()
        setSearchData({})
      }
    }else if(selectedTags){
      getSearchResult(submit, selectedTags)
    }
  }

  let loadingCards=[1,2,3,4,5]
  let count = 0

  // handle Download Button
  const [isPreparingDownload, setIsPreparingDownload] = useState()
  const downloadOptions = [{
    key:"filtered-compressed",
    value: "Download Filtered Compressed Images"
  },{
    key:"filtered-original",
    value: "Download Filtered Original Images (8x heavier)"
  },{
    key:"all-compressed",
    value: "Download All Compressed Images"
  },{
    key:"all-original",
    value: "Download All Original Images (8x heavier)"
  }]
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOpenDownloadMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseDownloadMenu = () => {
    setAnchorEl(null);
  };
  var JSZip = require("jszip");
  let zip = new JSZip();
  async function chooseDownloadOption(option) {
    if(option == "all-compressed"){
      await saveAs(`${proxy}/images/testimages.zip`)
    }else if(option == "all-original"){
      await saveAs(`${proxy}/images/testimages.zip`)
    }else{
      let imgURLArray =[]
      let dateString = Date.now().toString()
      let photoZip
      if(option=="filtered-compressed"){
        photoZip = zip.folder(`compressed_images_${dateString}`);
        let parArray
        if(filterSubmit.length!=0){
          parArray = searchData["Particles"]
        }else{
          parArray = fetchedData["Particles"]
        }
        parArray.map(par=>{
          let imgPath = "optimizedImages" + par.imgURL.slice(7)
          imgURLArray.push(`${imgPath}`) 
        })
      }else if(option == "filtered-original"){
        photoZip = zip.folder(`original_images_${dateString}`);
        let parArray
        if(filterSubmit.length!=0){
          parArray = searchData["Particles"]
        }else{
          parArray = fetchedData["Particles"]
        }
        parArray.map(par=>{
          imgURLArray.push(`${par.imgURL}`) 
        })
      }    
      for (let i = 0; i < imgURLArray.length; i++) {                                                                                          
        await DownloadImgFromURL(imgURLArray[i],photoZip); 
      }
      zip.generateAsync({type:"blob"})
            .then(function(content) {
              if(option=="compressed"){
                saveAs(content, `compressed_images_${dateString}`);
              }else{
                saveAs(content, `original_images_${dateString}`);
              }
            });
    }
    setIsPreparingDownload(false)
  }

  async function DownloadImgFromURL(imgURL,photoZip) {
    const res = await fetch(`${proxy}/${imgURL}`);
    const imageBlob = await res.blob();
    photoZip.file(imgURL.slice(8), imageBlob)

  }
  return (
    <div className={classes.SearchContainer}>
      <Typography
        className={classes.SearchTitle}
      >
        Explore our DataBase
      </Typography>
      <div className={classes.SearchBoxContainer}>
      <input
        className={classes.SearchBox}
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search by Volcano Name, Particle Type or use our Tags"
        onKeyDown={handleKeyPress}
      ></input>
      <IconButton
        type='submit'
        id = 'search-button'
        className={classes.iconButton}
        aria-label='search'
        onClick={()=>handleSubmit(searchTerm.toLowerCase())}
      >
        <SearchIcon fontSize="large"/>
      </IconButton>
      </div>
      <div style={{display: "flex",flexDirection:"row",flexWrap:"wrap"}}>
        <Tags
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}   
          tags={tags}
          setTags={setTags}
        />
      </div>
      <div style={{marginLeft:"1000px", marginTop:"-15px", marginBottom:"10px"}}>
        <Button variant='contained' style={{backgroundColor:"#388e3c", fontWeight:700, fontSize:12, height:40, marginTop:15, marginLeft:30, borderRadius:"20px", color:"white"}} onClick={()=>handleSubmit(searchTerm.toLowerCase())}> Apply Filters</Button>
          <Button 
            id="demo-positioned-button"
            aria-controls="demo-positioned-menu"
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            variant='contained' 
            style={{backgroundColor:"#f57c00", fontWeight:700, fontSize:12, height:40, marginTop:15, marginLeft:20, borderRadius:"20px", color:"white"}} 
            onClick={handleOpenDownloadMenu}
          > 
            Download Images
          </Button>
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseDownloadMenu}
            style={{top:"45px", left:"20px"}}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
          {filterSubmit.length!=0?downloadOptions.map((option)=>
          <MenuItem onClick={()=>{chooseDownloadOption(option.key); setIsPreparingDownload(true); handleCloseDownloadMenu()}}>{option.value}</MenuItem>
            ):downloadOptions.map((option,index)=>
            index>1?
            <MenuItem onClick={()=>{chooseDownloadOption(option.key); setIsPreparingDownload(true); handleCloseDownloadMenu()}}>{option.value}</MenuItem>:null)}
          </Menu>
          {isPreparingDownload?<CircularProgress style={{marginTop:"15px",marginLeft:"15px"}} />:null}
      </div>
      {filterSubmit.length!=0 && !isLoading?(
        <Typography style={{ marginLeft: 25, paddingBottom: 20 }}>
          {(searchData.Volcanoes && searchData.Volcanoes.length!=0) || (searchData.Particles && searchData.Particles.length!=0)? (
              <Typography
                component='h3'
                variant='h5'
                align='center'
                style={{ marginBottom: 10 }}
              >
                {searchData.Particles.length} search results for "{filterSubmit}":
              </Typography>
          ) : suggest?(
            <Typography
                component='h3'
                variant='h5'
                align='center'
                style={{ marginBottom: 10 }}
              >
                Sorry! There is no result for "{searchSubmit}" in our database.
                <br/>
                Did you mean <span style={{textDecoration:"underline",color:"#1890ff",cursor:"pointer"}} onClick={function(){getSearchResult(suggestSearch.toLowerCase(),selectedTags);setSearchTerm(suggestSearch);setSearchSubmit(suggestSearch);setFilterSubmit(suggestSearch && selectedTags.length!=0?suggestSearch+", "+selectedTags.join(","):suggestSearch + selectedTags.join(","))}}> {suggestSearch}</span>?
              </Typography>
          ):(
              <Typography
              component='h3'
              variant='h5'
              align='center'
              style={{ marginBottom: 10 }}
            >
              Sorry! There is no result for "{filterSubmit}" in our database.
              <br/>
              <a href="/contribute/binocular" style={{textDecoration:"underline"}}>Help us expand our Database!</a>
            </Typography>
          )}
        </Typography>
      ):null}
      <hr
        style={{
          marginLeft: 25,
          marginRight: 25,
          width: "50%",
          border: "1px solid #C0C0C0"
          
        }}/>
      <div className={classes.ResultContainer}>
    
      {isLoading?<div>
        <h2 style={{fontWeight:700,fontSize:"1.8rem", marginBottom:"20px"}}>VOLCANO </h2>
        <div style={{display: "flex",flexDirection:"row",flexWrap:"wrap"}}>
          <LoadingCard/>
        </div>
        <hr
        style={{
          alignSelf:"center",
          marginTop: 50,
          marginBottom:50,
          marginLeft: "40%",
          marginRight:"25%",
          width: "20%",
          border: "1px solid #C0C0C0"
          
        }}/>
        <h2 style={{fontWeight:700,fontSize:"1.8rem", marginBottom:"20px"}}>PARTICLE </h2>
        <div style={{display: "flex",flexDirection:"row",flexWrap:"wrap"}}>
          {loadingCards.map(num=> <LoadingCard/>)}
        </div>
      </div>:filterSubmit.length!=0?
        (searchData && Object.keys(searchData).map((key)=>
            key=="Volcanoes"?(searchData[key].length !=0?
            <div>
              <h2 style={{fontWeight:700,fontSize:"1.8rem", marginBottom:"20px"}}>VOLCANO </h2>
              <div style={{display: "flex",flexDirection:"row",flexWrap:"wrap"}}>
                {searchData[key].map((ele)=>
                <VolcanoCard
                  info={ele}
                  type={key}
                />)}
              </div>
                <hr
                style={{
                  alignSelf:"center",
                  marginTop: 50,
                  marginBottom:50,
                  marginLeft: "40%",
                  marginRight:"25%",
                  width: "20%",
                  border: "1px solid #C0C0C0"
                }}/>
            </div>:null):(
            searchData[key].length!=0?
            <div>
            <h2 style={{fontWeight:700,fontSize:"1.8rem", marginBottom:"20px"}}>PARTICLE </h2>
            <div style={{display: "flex",flexDirection:"row",flexWrap:"wrap"}}>
              {searchData[key].map((ele)=>
              <VolcanoCard
                info={ele}
                type= "Particles"
              />)}
            </div></div>:null)
            
        ))
          :(fetchedData && Object.keys(fetchedData).map((key)=>
          key=="Volcanoes"?(fetchedData[key].length !=0?(
            <div>
            <h2 style={{fontWeight:700,fontSize:"1.8rem", marginBottom:"20px"}}>VOLCANO </h2>
            <div style={{display: "flex",flexDirection:"row",flexWrap:"wrap"}}>
            {fetchedData[key].map((ele)=>
              <VolcanoCard
                info={ele}
                type={key}
              />)}
            </div>
            <hr
                style={{
                  alignSelf:"center",
                  marginTop: 50,
                  marginBottom:50,
                  marginLeft: "40%",
                  marginRight:"25%",
                  width: "20%",
                  border: "1px solid #C0C0C0"
                  
                }}/>
            </div>):null):(
            <div>
            <h2 style={{fontWeight:700,fontSize:"1.8rem", marginBottom:"20px"}}>PARTICLE </h2>
            <div style={{display: "flex",flexDirection:"row",flexWrap:"wrap"}}>
            {examplePar.map((ele)=>
            <VolcanoCard
              info={ele}
              type={key}
            > {count+=1} </VolcanoCard>)}
            </div></div>)
                
            )) }
      </div>
    </div>
  );
}
export default CatalogPage;
