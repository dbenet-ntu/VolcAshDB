import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import VolcanoTimeLine from './VolcanoeTimeLine';

const VolcanoDetailPage = ()=> {
    const params = useParams()
    return (
        <VolcanoTimeLine vol = {params.volc_name}/>
    )
}

export default VolcanoDetailPage