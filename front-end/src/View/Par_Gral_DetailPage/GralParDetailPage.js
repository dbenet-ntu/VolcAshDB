import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import DpPage from './DisplayPage.js'
import './DisplayPage.css';
import * as constants from '../../Constants'

function GralParDetailPage({match}) {
    const proxy = constants.PROXY
    const dispatch = useDispatch();
    const [Volcano, setVolcano] = useState([])
    const [volcanoes, setVolcanoes] = useState([]);
    const [particles, setParticles] = useState([]);
    const [fetchedData, setFetchedData] = useState({})
    const [generals, setGenerals] = useState([]);

    useEffect(()=>{
        
        axios.get(`${proxy}/volcanoes/getVolcanoes`)
         .then(response => {
           if(response.data.success){
             setVolcanoes(response.data.volcanoes)
           } else{
             alert("Failed to fetch data")
           }
         })
        axios.get(`${proxy}/volcanoes/getParticles`)
       .then(response => {
         if(response.data.success){
           setParticles(response.data.particles)
         } else{
           alert("Failed to fetch data")
         }
       })

       axios.get(`${proxy}/volcanoes/getGenerals`)
       .then(res => {
        if(res.data.success){
            setGenerals(res.data.generals)
          } else{
            alert("Failed to fetch data")
          }
       })
   
     },[])

    

     useEffect(()=>{
        setFetchedData({
          Particles: particles,
          Generals: generals
        })
      },[particles])


    useEffect(() => {
        axios.get(`${proxy}/par_gral/par_gralDetailPage`)
            .then(response => {
                setVolcano(response.data[0])
            })  
    }, [])

    

    return (
    <div>
        <DpPage 
        />
    </div>
    )
}

export default GralParDetailPage;