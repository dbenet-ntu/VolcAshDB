import React from 'react';
import { Chart, registerables } from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { reduce } from 'async';
import Plot from 'react-plotly.js';
import { useState } from 'react';
import DropDownForPie from './DropDownForPieChart';

var volc_name = ["La Palma","Kelut","Merapi","Soufrière Guadaloupe","Chillán, Nevados de","On-take","Pinatubo","St. Helens"]
	
const ComparativePieChart = (props) =>{
 	
	const [check,setCheck] = useState(0);
	const [PieChartVariable,setPieChartVariable] = useState('volc_name')
	
	Chart.register(...registerables);
	let arr = []
	arr = props.onGetData();
	let variable = PieChartVariable;
	let dict = {}
	let total = 0;
	let side = props.onGetSide();
	let legendSize = props.onGetLegendSize();

	const PassPieChartVariable = (a) => {
		setPieChartVariable(a)
	}

	for(let i =0;i<arr.length;i++){
		dict[arr[i][variable]] =0;
		total +=1;	
	}

	for(let i =0;i<arr.length;i++){
		dict[arr[i][variable]] +=1;
	}

	let v = []
	let lable = []

	for(const[key,value] of Object.entries(dict) ){
		v.push(value);
		lable.push(key);
	}

	// console.log(lable)
	// console.log(v)
	var allLabels = ['1st', '2nd', '3rd', '4th', '5th'];

var allValues = [
  [38, 27, 18, 10, 7],
  [28, 26, 21, 15, 10],
  [38, 19, 16, 14, 13],
  [31, 24, 19, 18, 8]
];

var ultimateColors = [
  ['rgb(56, 75, 126)', 'rgb(18, 36, 37)', 'rgb(34, 53, 101)', 'rgb(36, 55, 57)', 'rgb(6, 4, 4)'],
  ['rgb(177, 127, 38)', 'rgb(205, 152, 36)', 'rgb(99, 79, 37)', 'rgb(129, 180, 179)', 'rgb(124, 103, 37)'],
  ['rgb(33, 75, 99)', 'rgb(79, 129, 102)', 'rgb(151, 179, 100)', 'rgb(175, 49, 35)', 'rgb(36, 73, 147)'],
  ['rgb(146, 123, 21)', 'rgb(177, 180, 34)', 'rgb(206, 206, 40)', 'rgb(175, 51, 21)', 'rgb(35, 36, 21)']
];

let table = {}


let d = []

for(let i=0;i<volc_name.length;i++){
	for(let j=0;j< arr.length;j++){

		if(arr[j]['volc_name'] === volc_name[i]){

		if(table[volc_name[i]]){
			if(table[volc_name[i]][arr[j]['main_type']] >=0 ){
				table[volc_name[i]][arr[j]['main_type']] +=1;
			
			}
			else 
				table[volc_name[i]][arr[j]['main_type']] = 0;
		}	
		else{
			table[volc_name[i]] = {}
		}

	}

	}
}

let count = 0

for(let e in table){
	let v = []
	let l = []
	for(let k in table[e]){
		v.push(table[e][k])
		l.push(k)
	}

	d.push(
		{
			values:v,
			labels:l,
			type:'pie',
			name:e,
			domain:{
				row:0,
				column:count
			},
			showlegend:false

		}
	)
	count +=1;
}

console.log(table)

var data = [{
  values: allValues[0],
  labels: allLabels,
  type: 'pie',
  name: 'Starry Night',
  marker: {
    colors: ultimateColors[0]
  },
  domain: {
    row: 0,
    column: 0
  },
  hoverinfo: 'label+percent+name',
  textinfo: 'none',
  showlegend:false,
},{
  values: allValues[1],
  labels: allLabels,
  type: 'pie',
  name: 'Sunflowers',
  marker: {
    colors: ultimateColors[1]
  },
  domain: {
    row: 1,
    column: 0
  },
  hoverinfo: 'label+percent+name',
  textinfo: 'none',
  showlegend:false,
},{
  values: allValues[2],
  labels: allLabels,
  type: 'pie',
  name: 'Irises',
  marker: {
    colors: ultimateColors[2]
  },
  domain: {
    row: 0,
    column: 1
  },
  hoverinfo: 'label+percent+name',
  textinfo: 'none',
  showlegend:false,
},{
  values: allValues[3],
  labels: allLabels,
  type: 'pie',
  name: 'The Night Cafe',
  marker: {
    colors: ultimateColors[3]
  },
  domain: {
    x: [0.52,1],
    y: [0, 0.48]
  },
  hoverinfo: 'label+percent+name',
  textinfo: 'none',
  showlegend:false
}];

var layout = {
  height: 500,
  width: 1440,
  grid: {rows: 1, columns: 7}
};
	
	return(
	<div>

	<div>

	<Plot
        data={
		d
		}
        layout= {layout}
      	/>
		</div>
	</div>
		
	);
}

export default ComparativePieChart;