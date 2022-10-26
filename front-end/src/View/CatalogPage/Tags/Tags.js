import { Chip } from "@material-ui/core";
import { useState,useEffect } from "react";
import { Menu,MenuItem,Popover } from "@material-ui/core";
import { useRef } from "react";
import axios from "axios";
const Tags = ({
  selectedTags,
  setSelectedTags,
  tags,
  setTags
}) => {
  const [tagList, setTagList] = useState([{
    anchorEl:null,
    oriTag: "Volcano Name",
    currentChoice:"Volcano Name",
    disabled:false,
    selected: false,
    child:<Popover1/>,
    id:1
  },{
    anchorEl: null,
    oriTag: "Eruptions",
    currentChoice: "Eruptions",
    selected: false,
    disabled:true,
    child: <Popover2/>,
    id: 2 
  },{
    anchorEl: null,
    oriTag: "Eruptive Style",
    currentChoice: "Eruptive Style",
    selected: false,
    disabled:false,
    child: <Popover3/>,
    id: 3 
  },{
    anchorEl: null,
    oriTag: "Main Type",
    currentChoice: "Main Type",
    selected: false,
    disabled:false,
    child: <Popover4/>,
    id: 4
  },{
    anchorEl: null,
    oriTag: "Shape",
    currentChoice: "Shape",
    selected: false,
    disabled:false,
    child: <Popover5/>,
    id: 5 
  },{
    anchorEl: null,
    oriTag: "Crystallinity",
    currentChoice: "Crystallinity",
    selected: false,
    disabled:false,
    child: <Popover6/>,
    id: 6 
  },{
    anchorEl: null,
    oriTag: "Color",
    currentChoice: "Color",
    selected: false,
    disabled:false,
    child: <Popover7/>,
    id: 7
  }
  ,{
    anchorEl: null,
    oriTag: "Hydrothermal Alteration Degree",
    currentChoice: "Hydrothermal Alteration Degree",
    selected: false,
    disabled:false,
    child: <Popover8/>,
    id: 8
  },{
    anchorEl: null,
    oriTag: "Juvenile Type",
    currentChoice: "Juvenile Type",
    selected: false,
    disabled:false,
    child: <Popover9/>,
    id: 9
  },{
    anchorEl: null,
    oriTag: "Lithic Type",
    currentChoice: "Lithic Type",
    selected: false,
    disabled:false,
    child: <Popover10/>,
    id: 10 
  },{
    anchorEl: null,
    oriTag: "Altered Material Type",
    currentChoice: "Altered Material Type",
    selected: false,
    disabled:false,
    child: <Popover11/>,
    id: 11 
  },{
    anchorEl: null,
    oriTag: "Free Crystal Type",
    currentChoice: "Free Crystal Type",
    selected: false,
    disabled:false,
    child: <Popover12/>,
    id: 12 
  }])
  const tagListRef=useRef({})
  tagListRef.current=tagList
  const tagsRef=useRef({})
  const selectedTagsRef=useRef({})
  tagsRef.current=tags
  selectedTagsRef.current = selectedTags
  
  let data = require("./Tags.json")
  const volcList = require('./volcano2.json')
  delete data["volcanoName"]
  data["volcanoName"] = {
    "id":1,
    "oriTag": "Volcano Name",
    "choices":[...volcList["volcList"]]
  }
  const [tagsData, setTagsData] = useState(data)
  useEffect(()=>{
    if(tagList[0].selected){
      axios.get(`/volcanoes/afes_by_volcano?volcano=${tagList[0].currentChoice}`)
      .then(res=>{
        let newTagsData = tagsData
        let eruptions =[]
        res.data.map(afe=>{
          eruptions.push(`${afe.afe_code}: ${afe.afe_date.slice(0,10)}`)
        })
        if(eruptions.length == 0) eruptions.push("No Eruptions Found")
        newTagsData["eruptions"].choices = eruptions
        setTagsData(newTagsData)
      })
    }
  },[tagList])
  // useEffect(()=>{
  //   Popover1()
  //   Popover2()
  //   let newTagList = tagList
  //   setTagList(newTagList)
  // },[tagsData])
  // useEffect(()=>{
  //   console.log(tagsData["eruptions"])
  // },[tagsData])
  const handleAdd = (choice,id, newTagList, newSelectedTags, newTags) => {
    newSelectedTags.push(choice)
    newTags.map((tag,index) =>{
      if(tag == tagList[id-1].oriTag){
        newTags.splice(index,1)
      }
    })
    newTagList[id-1].selected = true
    newTagList[id-1].currentChoice = choice
  };
  const disabledLogic = (choice, newTagList) =>{
    switch(choice){
      case "Free Crystal": newTagList[11].disabled = false; newTagList[8].disabled = true; newTagList[9].disabled = true; newTagList[10].disabled = true; break;
      case "Altered Material": newTagList[10].disabled = false; newTagList[8].disabled = true; newTagList[9].disabled = true; newTagList[11].disabled = true; break;
      case "Juvenile": newTagList[8].disabled = false; newTagList[9].disabled = true; newTagList[10].disabled = true; newTagList[11].disabled = true; break;
      case "Lithic": newTagList[9].disabled = false; newTagList[8].disabled = true; newTagList[10].disabled = true; newTagList[11].disabled = true; break;
      default: newTagList[8].disabled = newTagList[9].disabled = newTagList[10].disabled = newTagList[11].disabled = false
    }
  }
  const handleAddLogic = (choice,id)=>{
    let newTagList = [...tagListRef.current]
    let newSelectedTags = [...selectedTagsRef.current]
    let newTags = [...tagsRef.current]
    if(id == 4){
      disabledLogic(choice, newTagList)
    }else if(id == 1){
      newTagList[1].disabled = false
    }else{
      if(!tagList[3].selected){
        switch(id){
          case 12: handleAdd("Free Crystal",4, newTagList, newSelectedTags, newTags); disabledLogic("Free Crystal", newTagList); break;
          case 11: handleAdd("Altered Material",4, newTagList, newSelectedTags, newTags); disabledLogic("Altered Material", newTagList); break;
          case 9: handleAdd("Juvenile",4, newTagList, newSelectedTags, newTags); disabledLogic("Juvenile", newTagList); break;
          case 10: handleAdd("Lithic",4, newTagList, newSelectedTags, newTags); disabledLogic("Lithic", newTagList); break;
        }
      }
    }
    handleAdd(choice,id,newTagList, newSelectedTags, newTags)
    setTagList(newTagList)
    setSelectedTags(newSelectedTags)
    setTags(newTags)
  }
  const handleRemove = (choice,id, newTagList, newSelectedTags, newTags) => {
    newSelectedTags.map((selected,index) => {
      if(selected == choice){
        newSelectedTags.splice(index,1)
      }
    })
    newTags.push(tagList[id-1].oriTag)
    newTagList[id-1].selected = false
    newTagList[id-1].currentChoice = newTagList[id-1].oriTag
  };
  const handleRemoveLogic = (choice,id)=>{
    let newTagList = [...tagListRef.current]
    let newSelectedTags = [...selectedTagsRef.current]
    let newTags = [...tagsRef.current]
    if(id == 1){
      handleRemove(newTagList[1].currentChoice,2,newTagList, newSelectedTags, newTags)
      newTagList[1].disabled = true
    }
    if(id == 4){
      newTagList[9].disabled = newTagList[8].disabled = newTagList[10].disabled = newTagList[11].disabled = false
      if(tagList[8].selected || tagList[9].selected || tagList[10].selected || tagList[11].selected){
        switch(choice){
          case "Free Crystal": handleRemove(tagList[11].currentChoice,12, newTagList, newSelectedTags, newTags); break;
          case "Altered Material": handleRemove(tagList[10].currentChoice,11, newTagList, newSelectedTags, newTags); break;
          case "Juvenile": handleRemove(tagList[8].currentChoice,9, newTagList, newSelectedTags, newTags); break;
          case "Lithic": handleRemove(tagList[9].currentChoice,10, newTagList, newSelectedTags, newTags); break;
        }
      }
    }
    handleRemove(choice,id, newTagList, newSelectedTags, newTags)
    setTagList(newTagList)
    setSelectedTags(newSelectedTags)
    setTags(newTags)
  }
  const handleOpenMenu = (event, _id)=>{
    var newTagList=[...tagListRef.current];
    newTagList[_id-1].anchorEl=event.currentTarget;
    setTagList(newTagList);
  }
  const handleMenuClose = (_id)=>{
    var newTagList=[...tagListRef.current];
    newTagList[_id-1].anchorEl=null;
    setTagList(newTagList);
  }
  function Popover1() {
    return (
      Object.keys(tagsData).map((taglabel)=>
              tagsData[taglabel].id==1?(
                    tagsData[taglabel].choices.map((t)=>(
                    <MenuItem onClick={() => {
                      handleAddLogic(t,tagsData[taglabel].id);
                      handleMenuClose(tagsData[taglabel].id)
                    }}> {t} </MenuItem>
                    ))):null)
    );
  }

  function Popover2() {
    return (
      Object.keys(tagsData).map((taglabel)=>
              tagsData[taglabel].id==2?(
                    tagsData[taglabel].choices.map((t)=>(
                    <MenuItem onClick={() => {
                      let afe_code = t.split(":")[0]
                      console.log(afe_code)
                      handleAddLogic(afe_code,tagsData[taglabel].id);
                      handleMenuClose(tagsData[taglabel].id)
                    }}> {t} </MenuItem>
                    ))):null)
    );
  }
  
  function Popover3() {
    return (
      Object.keys(tagsData).map((taglabel)=>
              tagsData[taglabel].id==3?(
                    tagsData[taglabel].choices.map((t)=>(
                    <MenuItem onClick={() => {
                      handleAddLogic(t,tagsData[taglabel].id);
                      handleMenuClose(tagsData[taglabel].id)
                    }}> {t} </MenuItem>
                    ))):null)
    );
  }

  function Popover4() {
    return (
      Object.keys(tagsData).map((taglabel)=>
              tagsData[taglabel].id==4?(
                    tagsData[taglabel].choices.map((t)=>(
                    <MenuItem onClick={() => {
                      handleAddLogic(t,tagsData[taglabel].id);
                      handleMenuClose(tagsData[taglabel].id)
                    }}> {t} </MenuItem>
                    ))):null)
    );
  }

  function Popover5() {
    return (
      Object.keys(tagsData).map((taglabel)=>
              tagsData[taglabel].id==5?(
                    tagsData[taglabel].choices.map((t)=>(
                    <MenuItem onClick={() => {
                      handleAddLogic(t,tagsData[taglabel].id);
                      handleMenuClose(tagsData[taglabel].id)
                    }}> {t} </MenuItem>
                    ))):null)
    );
  }

  function Popover6() {
    return (
      Object.keys(tagsData).map((taglabel)=>
              tagsData[taglabel].id==6?(
                    tagsData[taglabel].choices.map((t)=>(
                    <MenuItem onClick={() => {
                      handleAddLogic(t,tagsData[taglabel].id);
                      handleMenuClose(tagsData[taglabel].id)
                    }}> {t} </MenuItem>
                    ))):null)
    );
  }

  function Popover7() {
    return (
      Object.keys(tagsData).map((taglabel)=>
              tagsData[taglabel].id==7?(
                    tagsData[taglabel].choices.map((t)=>(
                    <MenuItem onClick={() => {
                      handleAddLogic(t,tagsData[taglabel].id);
                      handleMenuClose(tagsData[taglabel].id)
                    }}> {t} </MenuItem>
                    ))):null)
    );
  }

  function Popover8() {
    return (
      Object.keys(tagsData).map((taglabel)=>
              tagsData[taglabel].id==8?(
                    tagsData[taglabel].choices.map((t)=>(
                    <MenuItem onClick={() => {
                      handleAddLogic(t,tagsData[taglabel].id);
                      handleMenuClose(tagsData[taglabel].id)
                    }}> {t} </MenuItem>
                    ))):null)
    );
  }

  function Popover9() {
    return (
      Object.keys(tagsData).map((taglabel)=>
              tagsData[taglabel].id==9?(
                    tagsData[taglabel].choices.map((t)=>(
                    <MenuItem onClick={() => {
                      handleAddLogic(t,tagsData[taglabel].id);
                      handleMenuClose(tagsData[taglabel].id)
                    }}> {t} </MenuItem>
                    ))):null)
    );
  }

  function Popover10() {
    return (
      Object.keys(tagsData).map((taglabel)=>
              tagsData[taglabel].id==10?(
                    tagsData[taglabel].choices.map((t)=>(
                    <MenuItem onClick={() => {
                      handleAddLogic(t,tagsData[taglabel].id);
                      handleMenuClose(tagsData[taglabel].id)
                    }}> {t} </MenuItem>
                    ))):null)
    );
  }

  function Popover11() {
    return (
      Object.keys(tagsData).map((taglabel)=>
              tagsData[taglabel].id==11?(
                    tagsData[taglabel].choices.map((t)=>(
                    <MenuItem onClick={() => {
                      handleAddLogic(t,tagsData[taglabel].id);
                      handleMenuClose(tagsData[taglabel].id)
                    }}> {t} </MenuItem>
                    ))):null)
    );
  }
  function Popover12() {
    return (
      Object.keys(tagsData).map((taglabel)=>
              tagsData[taglabel].id==12?(
                    tagsData[taglabel].choices.map((t)=>(
                    <MenuItem onClick={() => {
                      handleAddLogic(t,tagsData[taglabel].id);
                      handleMenuClose(tagsData[taglabel].id)
                    }}> {t} </MenuItem>
                    ))):null)
    );
  }

    return (
      <div style={{ padding: "6px 0",display: "flex" }}>
        {tagListRef.current.map(tag=>(
          <div>
            {tag.selected==true?
            <Chip
              style={{ margin:10 }}
              label={tag.currentChoice}
              color="primary"
              onDelete={() => handleRemoveLogic(tag.currentChoice,tag.id)}
            />:
            <Chip 
                aria-controls="menu"
                style={{ margin: 10}}
                label={tag.oriTag}
                disabled = {tag.disabled}
                onClick={(event)=>handleOpenMenu(event,tag.id)}
                />}
            <Popover
            id="menu"
            open={Boolean(tag.anchorEl)}
            onClose={()=>handleMenuClose(tag.id)}
            anchorEl={tag.anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center"
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center"
            }}
            PaperProps={{
              style:{maxHeight:500}
            }}
          >
            {tag.child}
          </Popover>
        </div>
        ))}
        
      </div>
    );
  };

export default Tags;