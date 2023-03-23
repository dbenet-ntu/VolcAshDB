import { volcanoStyle } from "./volcanoCard.style";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import * as constants from '../../../Constants'
import { useState, useEffect } from "react";
import { PersonPinSharp } from "@material-ui/icons";
export default function VolcanoCard(props) {
    const proxy = constants.PROXY
    const classes=volcanoStyle();
    const imgPath = "images/optimizedImages" + props.info.imgURL.slice(7)
    const [flag,setFlag] = useState(null)
    const handleOnClick = ()=>{
      if(props.tagsRef){
        setFlag(1)
        let choice = props.info.volc_name
        props.tagsRef.current.handleAddVolcano(choice)
      }
    }
    useEffect(()=>{
      if(props.selectedTags && props.selectedTags.length >0 && flag){
        props.handleSearch()
        setFlag(null)
      }
    },[props.selectedTags])
  return (
    <div className={classes.container}>
      {props.type=="Volcanoes"? 
        <div>     
            <img
            style={props.tagsRef?{width:"100%" ,height:"200px", cursor:"pointer"}:{width:"100%" ,height:"200px"}}
            className={classes.poster}
            src={`${proxy}/${props.info.imgURL}`}
            onClick={()=>{handleOnClick();}}
            />
          <div className={classes.name}>{props.info.volc_name}</div>
        </div>:
        <div>
          <LazyLoadImage
          style={{width:"100%" ,height:"200px"}}
          className={classes.poster}
          src={`${proxy}/${imgPath}`}
          threshold="500"
        />
          <div className={classes.cardOver}>
            <h3 style={{fontWeight:700}}>Basic Information </h3>
            <p><span style={{fontWeight:700}}>ID: </span> {props.info.id}</p>
            {props.info.index?<p><span style={{fontWeight:700}}>Index: </span> {props.info.index}</p>:null}
            <p><span style={{fontWeight:700}}>Volcano Name: </span> {props.info.volc_name}</p>
            {props.info.afe_code?<p><span style={{fontWeight:700}}>Eruption Code: </span> {props.info.afe_code}</p>:null}
            {props.info.main_type?<p><span style={{fontWeight:700}}>Main Type: </span> {props.info.main_type}</p>:null}
            {props.info.main_type?<p><span style={{fontWeight:700}}>Main Type: </span> {props.info.main_type}</p>:null}
            {props.info.sub_type?<p><span style={{fontWeight:700}}>Sub Type: </span> {props.info.sub_type}</p>:null}
            {props.info.color?<p><span style={{fontWeight:700}}>Color: </span> {props.info.color}</p>:null}
            {props.info.crystallinity?<p><span style={{fontWeight:700}}>Crystallinity: </span> {props.info.crystallinity}</p>:null}
            {props.info.hydro_alter_degree?<p><span style={{fontWeight:700}}>Hydrothermally Alteration Degree: </span> {props.info.hydro_alter_degree}</p>:null}
            {props.info.shape?<p><span style={{fontWeight:700}}>Shape: </span> {props.info.shape}</p>:null}
            {props.info.eruptive_style?<p><span style={{fontWeight:700}}>Eruptive Style: </span> {props.info.eruptive_style}</p>:null}
          </div>
        </div>
        }
    </div>
  )
};
