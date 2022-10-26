import React from 'react'
import {useState,useEffect} from 'react'
import {Button} from '@material-ui/core'
const SwitchBoxForHistogram = (props) => {
	const [mode,setMode] = useState('Overview')
	const [overviewVariant, setOverViewVariant] = useState("contained")
	const switchOverview = () =>{
		if(mode !== 'Main Type'){
			props.onPassMode('Main Type')
			setMode('Main Type')
			setOverViewVariant("contained")
		}
	}

	const switchDetail = () =>{
		if(mode !== 'Eruptive Style'){
			props.onPassMode('Eruptive Style')
			setMode('Eruptive Style')
			setOverViewVariant("outlined")
		}
	}

	const highlight = () =>{

	}

	return(
		<div>
			<div style={{display: 'block',marginTop:"20px",marginBottom:"30px"}}>
				<div>
				<Button className = 'OverviewPlotOption' variant={overviewVariant} color="primary" style={{marginRight:"100px"}} onClick = {switchOverview}  >Main Type</Button>
				</div>

				<div>
				<Button className = 'DetailPlotsOption' variant={overviewVariant=='contained'?"outlined":"contained"} color="primary" onClick = {switchDetail} >Eruptive Style</Button>
				</div>
			</div>
		</div>
	);
}

export default SwitchBoxForHistogram