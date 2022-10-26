import React from 'react';
import ReactDOM from 'react-dom';

import { Menu, Dropdown, Button } from 'antd';
import { useState } from 'react';

import { Plot } from 'react-plotly.js';


const DropDownForHistogram = (props) => {
	const [time,setTime] = useState(0);

	var data;
	var f;

	var d = props.onGetVariableData();
	function handleChange(a){
	}


	
	try{
	data = props.onGetVariableData();
	if(time === 0){
		try{
			props.onPassHistogramVariable1(d[0]);
			f = d[0]
		      }      
		catch(error){
			props.onPassHistogramVariable2(d[1]);
			f = d[1]
		}
		setTime(1);
	}
	else{
		handleChange = function (a){
			try{
				props.onPassHistogramVariable1(a);
			      }      
			catch(error){
				props.onPassHistogramVariable2(a);
			}
		}
	 }
	}
	catch(error){
		f = d[0];
		handleChange = function(a){
			props.onPassHistogramVariable1(a)
		}
	}
	

	
	const [title,setTitle] = useState(f);

	function ChooseVariable (x) {
		setTitle(x);
	}

	

	function mapping(x){



		return (<Menu.Item >
			<a target="_blank" onClick = {() => {ChooseVariable(x)
				handleChange(x);
			}} >
		  		{x}
			</a>
	      		</Menu.Item> );
	}


	const menu = (
		<Menu >	
		  {data.map(x => mapping(x))}
		</Menu>
	      );


	return(
	<div style={{maginBottom:"20px"}}>
		<Dropdown  overlay={menu} placement="bottomCenter" arrow>
      		<Button >{title}</Button>
    		</Dropdown>
	</div>
	);
	
}


export default DropDownForHistogram;