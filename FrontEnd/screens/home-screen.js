import React, { useEffect, useState } from "react";
import DataScreen from "./data-screen";

const HomeScreen = () => {

    const [dataFromApi, setData] = useState();
  
    const fetchData = async() =>{
      const response = await fetch('http://192.168.124.186:8000/api/DailyData/')
      const data = await response.json()
      setData(data)
    }
  
    useEffect(() => {
       fetchData()
    }, []);

    
  
    if(dataFromApi){
    return(
        <DataScreen data = {dataFromApi}/>
    );
    }
  }
  
export default HomeScreen;