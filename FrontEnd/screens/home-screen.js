import React, { useEffect, useState } from "react";
import {TouchableOpacity, Text, View, Image, StyleSheet, ScrollView, StatusBar} from "react-native"
import DataScreen from "./data-screen";
import Collapsible from 'react-native-collapsible';
import { RFPercentage } from "react-native-responsive-fontsize";
import DatePicker from "../components/date-picker";



const HomeScreen = () => {

    const [dataFromApi, setData] = useState();
    const [requestType, setRequestType] = useState("daily")
    const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [date1, setDate1] = useState(new Date(2023, 1, 28));
    const [date2, setDate2] = useState(new Date(2023, 7, 27));

    const setRequestTypeDaily = () => {
      setRequestType("daily")
    }

    const setRequestTypeHistorical = () => {
      setRequestType("historical")
    }

    const customSetDate1 = (event, date) => {
      setDate1(date)
      setVisible1(false)
    }

    const handleDatePicker1 = () => {
      setVisible1(true)
    };

    const customSetDate2 = (event, date) => {
      setDate2(date)
      setVisible2(false)
    }

    const handleDatePicker2 = () => {
      setVisible2(true)
    };

    const [sidebarOpen, setSideBarOpen] = useState(true);
    const handleViewSidebar = () => {
      setSideBarOpen(!sidebarOpen);
    };
  
    const fetchData = async() =>{
      if(requestType == "daily"){
        const response = await fetch('http://192.168.124.186:8000/api/DailyData/')
        const data = await response.json()
        setData(data)
      } else if(requestType == "historical"){
        const response = await fetch('http://192.168.124.186:8000/api/HistoricalData/?start_date='+ date1.getUTCFullYear() +'-'+ (date1.getUTCMonth()+1) +'-'+date1.getUTCDate()+'&end_date='+ date2.getUTCFullYear() +'-'+ (date2.getUTCMonth()+1) +'-'+date2.getUTCDate())
        const data = await response.json()
        setData(data)
      }
    }
  
    useEffect(() => {
       fetchData()
    }, [requestType]);

  
  
    if(dataFromApi){
    return(
      <View style={styles.container}>
        <StatusBar 
        barStyle = 'light-content'
        />
        <View style={{marginTop: (Platform.OS === 'ios')? 50 : 0}}>
          <TouchableOpacity onPress={handleViewSidebar}>
            <Image
              style={styles.hidden}
              source={require("../assets/img/5141110331641180048-512.png")}
            />
          </TouchableOpacity>
          <Collapsible collapsed={sidebarOpen}>
            <View style={styles.tile}>
              <Text style={styles.text}>
                Choose:
              </Text>
              <TouchableOpacity style={styles.button} onPress={setRequestTypeDaily}>
                <Text style={styles.text}>
                  Last 24 hours
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={setRequestTypeHistorical}>
                <Text style={styles.text}>
                  Historical data
                </Text>
              </TouchableOpacity>
              <Text style={{
                color: "#FFFFFF",
                fontSize: RFPercentage(2.5),
                }}>
                From:
              </Text>
              <DatePicker
              visible = {visible1}
              date = {date1}
              customSetDate = {customSetDate1}
              handleDatePicker = {handleDatePicker1}
              />
              <Text style={{
                color: "#FFFFFF",
                fontSize: RFPercentage(2.5),
                }}>
                To:
              </Text>
              <DatePicker
              visible = {visible2}
              date = {date2}
              customSetDate = {customSetDate2}
              handleDatePicker = {handleDatePicker2}
              />
              
            </View>
          </Collapsible>
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <DataScreen data = {dataFromApi}/>
          </ScrollView>
        </View>
      </View>
    );
    }
}
  
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    
  },
  hidden:{
    resizeMode: "contain",
    height: 30,
    width: 30,
    marginLeft: 50
  },
  tile: {
    alignSelf: "center",
    alignItems: 'center',
    borderRadius: 45,
    backgroundColor: "#3D3D3D",
    padding: 10,
    width: '95%'
  },
  text: {
    alignSelf: "center",
    color: "#FFFFFF",
    fontSize: RFPercentage(3.5),
  },
  button: {
    margin: 3,
    width: "70%",
    backgroundColor: "#A848B7",
    borderRadius: 10,
    borderColor: "#000000",
    borderWidth: 2
  }
})

export default HomeScreen;