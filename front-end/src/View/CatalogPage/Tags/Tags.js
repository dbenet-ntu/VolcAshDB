import { Chip } from "@material-ui/core";
import { useState,useEffect } from "react";
import { Menu,MenuItem,Popover } from "@material-ui/core";
import { useRef } from "react";
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
    selected: false,
    child:<Popover1/>,
    id:1
  },{
    anchorEl: null,
    oriTag: "Main Type",
    currentChoice: "Main Type",
    selected: false,
    child: <Popover2/>,
    id: 2 
  },{
    anchorEl: null,
    oriTag: "Free Crystal Type",
    currentChoice: "Free Crystal Type",
    selected: false,
    child: <Popover3/>,
    id: 3 
  },{
    anchorEl: null,
    oriTag: "Altered Material Type",
    currentChoice: "Altered Material Type",
    selected: false,
    child: <Popover4/>,
    id: 4 
  },{
    anchorEl: null,
    oriTag: "Juvenile Type",
    currentChoice: "Juvenile Type",
    selected: false,
    child: <Popover5/>,
    id: 5 
  },{
    anchorEl: null,
    oriTag: "Lithic Type",
    currentChoice: "Lithic Type",
    selected: false,
    child: <Popover6/>,
    id: 6
  }
  ,{
    anchorEl: null,
    oriTag: "Color",
    currentChoice: "Color",
    selected: false,
    child: <Popover7/>,
    id: 7
  },{
    anchorEl: null,
    oriTag: "Crystallinity",
    currentChoice: "Crystallinity",
    selected: false,
    child: <Popover8/>,
    id: 8 
  },{
    anchorEl: null,
    oriTag: "Hydrothermally Alteration Degree",
    currentChoice: "Hydrothermally Alteration Degree",
    selected: false,
    child: <Popover9/>,
    id: 9 
  },{
    anchorEl: null,
    oriTag: "Shape",
    currentChoice: "Shape",
    selected: false,
    child: <Popover10/>,
    id: 10 
  },{
    anchorEl: null,
    oriTag: "Eruptive Style",
    currentChoice: "Eruptive Style",
    selected: false,
    child: <Popover11/>,
    id: 11 
  }])
  const tagListRef=useRef({})
  tagListRef.current=tagList
  const tagsRef=useRef({})
  const selectedTagsRef=useRef({})
  tagsRef.current=tags
  selectedTagsRef.current = selectedTags
  let tagsData = require("./Tags.json")
  const volcList = require('./volcano2.json')
  
  const handleAdd = (choice,id) => {
    setSelectedTags([...selectedTagsRef.current, choice]);
    setTags(tagsRef.current.filter((t) => t != tagList[id-1].oriTag));
    let newTagList = [...tagListRef.current]
    newTagList[id-1].selected = true
    newTagList[id-1].currentChoice = choice
    setTagList(newTagList)
  };

  const handleRemove = (choice,id) => {
    setSelectedTags( selectedTagsRef.current.filter((selected) => selected !== choice ));
    setTags([...tagsRef.current,tagList[id-1].oriTag]);
    let newTagList = [...tagListRef.current]
    newTagList[id-1].selected = false
    newTagList[id-1].currentChoice = newTagList[id-1].oriTag
    setTagList(newTagList)
  };
  delete tagsData["volcanoName"]
  tagsData["volcanoName"] = {
    "id":1,
    "oriTag": "Volcano Name",
    "choices":[...volcList["volcList"]]
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
                      handleAdd(t,tagsData[taglabel].id);
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
                      handleAdd(t,tagsData[taglabel].id);
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
                      handleAdd(t,tagsData[taglabel].id);
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
                      handleAdd(t,tagsData[taglabel].id);
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
                      handleAdd(t,tagsData[taglabel].id);
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
                      handleAdd(t,tagsData[taglabel].id);
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
                      handleAdd(t,tagsData[taglabel].id);
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
                      handleAdd(t,tagsData[taglabel].id);
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
                      handleAdd(t,tagsData[taglabel].id);
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
                      handleAdd(t,tagsData[taglabel].id);
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
                      handleAdd(t,tagsData[taglabel].id);
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
              clickable
              onDelete={() => handleRemove(tag.currentChoice,tag.id)}
            />:
            <Chip 
                aria-controls="menu"
                style={{ margin: 10}}
                label={tag.oriTag}
                onClick={(event)=>handleOpenMenu(event,tag.id)}
                clickable
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