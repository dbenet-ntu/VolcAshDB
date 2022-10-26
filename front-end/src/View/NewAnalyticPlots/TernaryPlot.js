import React from 'react';
import Plot from 'react-plotly.js';
import Selection from '../AnalyticPlots/SelectWithCheckBox';
import Button from '../AnalyticPlots/SubmitButton'
import {useState,useEffect} from 'react'
import * as constants from "../../Constants"
const axios = require('axios')
const proxy = constants.PROXY

let volcColor = {
	'Pinatubo':'red',
	'Taal':'yellow',
	'Kelut':'blue',
	'Toba': 'orange',
	'Alid': 'green'
}

// var variableData = ["convexity","rectangularity","elongation","roundness","circularity","eccentricity_moments","eccentricity_ellipse","solidit","aspect_rat","compactness","circ_rect","comp_elon","circ_elon","rect_comp","contrast","dissimilarity","homogeneity","energy","correlation","asm","blue_mean","blue_std","blue_mode","green_mean","green_std","green_mode","red_mean","red_std","red_mode"];
var volc_name = ["Cumbre Vieja","Kelud","Merapi","Soufrière de Guadaloupe","Nevados de Chillán","Ontake","Pinatubo","Mount St Helens"]
let sample = ['CV_DB1','KEL_DB2','KEL_DB3','MEA_DB1','MEA_DB2','SOG_DB1','SOG_DB2','CIN_DB15','CIN_DB2','ONT_DB1','PIN_DB1','STH_DB1','LAP_DB1']

var main_type = ['juvenile','free crystal','lithic','altered material']

var eruptive_style = ['Subplinian','Dome explosion','Lava fountaining','Phreatic','Plinian']


const TernaryPlot = (props) =>{

	const [TernaryVariable,setTernaryVariable] = useState()
	const [TernaryFinalVariable,setTernaryFinalVariable] = useState([{value:1, label:"juvenile"},{value:2,label:"lithic"},{value:3,label:"altered material"}])
	const [parArray,setParArray] = useState([])
	const [volTable,setVolTable] = useState({})

	// let legendSize = props.onGetLegendSize();

	useEffect(() =>{
		axios.get(`${proxy}/volcanoes/getParticles`)
		.then(data =>{
			setParArray(data.data['particles']) 
			console.log(data.data['particles'])
		

		})

	},[])

	
	let Data = props.onGetData();
	let volT ={}
	let variable = props.onGetVariable();

	for(let i=0;i < Data.length;i++){
		volT[Data[i][variable]] = 1
	}
	console.log(volT)
	console.log(variable)

	

	let side = props.onGetSide()
	

	const PassTernaryVariable = (a) => {
		console.log(a)
	
		setTernaryVariable(a);
	}

	const submitVariable = () =>
{
	setTernaryFinalVariable(TernaryVariable)
}

	let d= []
	let e = []
	let f =[]
	let t = {}


	for(const[key,value] of Object.entries(volT) ){	
			t[key] = {'juvenile':0,'lithic':0,'altered material':0,'total':0,name:key}
	
	}

	
	for(const[key,value] of Object.entries(volT) ){
	
	for(let i=0;i<Data.length;i++){
		
			if(Data[i][variable] === key){
				t[key][Data[i]['main_type']] +=1;
				t[key]['total'] +=1;
			}	
			
		}
	}

	let ternaryData = []
	for(const[key,value] of Object.entries(t)){
		ternaryData.push({
			type: 'scatterternary',
			mode: 'markers',
			a: [value['juvenile']/value['total']],
			b: [value['lithic']/value['total']],
			c: [value['altered material']/value['total']],
			name:key,
			showlegend:true,
			marker: {
			    line: { width: 2 },
			    size:30
			}	
		})
	}

	console.log(ternaryData)
	console.log(t)

	// const doubleClick = () =>{
		
	// 	props.onPassZoomMode(TernaryFinalVariable,"ternaryPlot");
	// }

	return(

	<div>

		<div >
		<Plot 
			data = {
			ternaryData
		}

			layout={ {width: (50/100)*window.screen.width,legend:{orientation:'h'}, height: side[1], title: 'Ternary',autosize:true,uirevision:'true',ternary:
			{
			sum:1,
			aaxis:{title: 'juvenile', min: 0,
					ticklen: 3, autorange:true,
					    linewidth:2, tick0:0.2,dtick:0.2,ntick:3,
					    tickmode:'auto',tickvals:[0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9]
					},
					    
			baxis:{title: 'lithic', min: 0, autorange:true,
				ticklen:3, tick0:0.2,dtick:0.2,ntick:3,
				 linewidth:2,
				 tickmode:'auto',tickvals:[0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9]
				},
				
			caxis:{title: 'altered material', min: 0, 
				ticklen:3,tick0:0.2,dtick:0.2,ntick:3,
				 linewidth:2, ticks:'outside',
				tickmode:'auto',tickvals:[0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9],
				 autorange:true,
				}}
						    
				    }
				 }
			
		/>
	</div>
	</div>
	);
}

export default TernaryPlot;