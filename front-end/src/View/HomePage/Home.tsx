import React from 'react'
import { Button, Typography } from '@material-ui/core'
import { useNavigate } from 'react-router-dom'
import {HomeStyle} from './Home.styles'
import picture2 from '../../assets/images/Picture2.png'
import picture3 from '../../assets/images/Picture3.png'
import picture4 from '../../assets/images/Picture4.png'
export default function Home(){
  const classes = HomeStyle();
  const navigate = useNavigate();


    return (
        <div className={classes.BodyContainer}>
            <div className={classes.BodyBg}></div>
            <div className={classes.BodyContent}>
                <Typography className={classes.BodyText}>A volcanic ash database for monitoring and comparing</Typography>
                <div className={classes.BodyBtn}>
                    <Button className={classes.Btn} onClick={()=> navigate("/about")}> About Us</Button>
                    <br/>
                </div>
                <br/>
                <span className={classes.BodyOption}>
                    <figure style={{marginRight:"200px"}}>
                        <img src ={picture2} alt = "Logo"/>
                        <br/>
                        <Button style={{marginLeft:"30px"}} className={classes.Btn} onClick={()=> navigate("/catalogue")} > Catalogue</Button>
                    </figure>
                    <br/>
                    <figure>
                        <img src = {picture3}alt = "Logo"/>
                        <br/>
                        <Button className={classes.Btn} onClick={()=> navigate("/analytic")}> Analyze your own data!</Button>
                    </figure>
                    <br/>
                </span>
            </div>
        </div>
    )
}
