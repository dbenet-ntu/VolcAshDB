import React from 'react';
import { useState, useEffect } from 'react';
import SwitchBar from './SwitchBar';
import OverviewPlot from './OverviewPlot';
import DetailPlots from './DetailPLots';
import './NewDashBoardStyling.css'

const NewDashBoard = () =>{
	const[mode,setMode] = useState('Overview');

const PassMode = (a) =>{
	setMode(a)
}
	return(
		<div >
				<div style={{display:"flex",justifyContent:"center"}}>
					<SwitchBar style={{marginTop:"50px"}} onPassMode = {PassMode}/>
				</div>
			<div>
				<div style={{display:"flex",justifyContent:"center"}}>
					{mode === 'Overview' ? <OverviewPlot/> : <DetailPlots/>}
				</div>
				
			</div>
		</div>
	);
}

export default NewDashBoard