import { volcanoStyle } from "./volcanoCard.style";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import * as constants from '../../../Constants'
export default function VolcanoCard({info,type}) {
    const proxy = constants.PROXY
    const classes=volcanoStyle();
    const imgPath = "images/optimizedImages" + info.imgURL.slice(7)
  return (
    <div className={classes.container}>
      {type=="Volcanoes"? 
        <div>     
          <a href={`/volcano/${info.volc_name}`}>
            <img
            style={{width:"100%" ,height:"200px"}}
            className={classes.poster}
            src={`${proxy}/${info.imgURL}`}
            />
          </a>
          <div className={classes.name}>{info.volc_name}</div>
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
            <p><span style={{fontWeight:700}}>ID: </span> {info.id}</p>
            {info.index?<p><span style={{fontWeight:700}}>Index: </span> {info.index}</p>:null}
            <p><span style={{fontWeight:700}}>Volcano Name: </span> {info.volc_name}</p>
            {info.afe_code?<p><span style={{fontWeight:700}}>Eruption Code: </span> {info.afe_code}</p>:null}
            {info.main_type?<p><span style={{fontWeight:700}}>Main Type: </span> {info.main_type}</p>:null}
            {info.main_type?<p><span style={{fontWeight:700}}>Main Type: </span> {info.main_type}</p>:null}
            {info.sub_type?<p><span style={{fontWeight:700}}>Sub Type: </span> {info.sub_type}</p>:null}
            {info.color?<p><span style={{fontWeight:700}}>Color: </span> {info.color}</p>:null}
            {info.crystallinity?<p><span style={{fontWeight:700}}>Crystallinity: </span> {info.crystallinity}</p>:null}
            {info.hydro_alter_degree?<p><span style={{fontWeight:700}}>Hydrothermally Alteration Degree: </span> {info.hydro_alter_degree}</p>:null}
            {info.shape?<p><span style={{fontWeight:700}}>Shape: </span> {info.shape}</p>:null}
            {info.eruptive_style?<p><span style={{fontWeight:700}}>Eruptive Style: </span> {info.eruptive_style}</p>:null}
          </div>
        </div>
        }
    </div>
  )
};
