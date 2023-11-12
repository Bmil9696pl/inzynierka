import React, { useEffect, useState } from "react";
import {TouchableOpacity, Text, View, Image, StyleSheet, ScrollView} from "react-native"
import DataScreen from "./data-screen";
import Collapsible from 'react-native-collapsible';
import { RFPercentage } from "react-native-responsive-fontsize";
import DateTimePicker from '@react-native-community/datetimepicker';
import RNDateTimePicker from "@react-native-community/datetimepicker";



const HomeScreen = () => {

    const [dataFromApi, setData] = useState();
    const [disabled, setDisabled] = useState(false);
    const [date, setDate] = useState(new Date(2015, 1, 1));
    console.log(date)

    const customSetDate = (event, date) => {
      setDate(date)
    }

    const [sidebarOpen, setSideBarOpen] = useState(false);
    const handleViewSidebar = () => {
      setSideBarOpen(!sidebarOpen);
    };

    //2015-01-01
    //2023-08-28
  
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
      <View style={styles.container}>
        <View style={{marginTop: 20}}>
          <TouchableOpacity onPress={handleViewSidebar}>
            <Image
              style={styles.hidden}
              source={require("../assets/img/3994371_eye_hidden_hide_invisible_private_icon.png")}
            />
          </TouchableOpacity>
          <Collapsible collapsed={sidebarOpen}>
            <View style={styles.tile}>
              <Text style={styles.text}>
                Choose:
              </Text>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.text}>
                  Last 24 hours
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.text}>
                  Historical data
                </Text>
              </TouchableOpacity>
              {disabled && (
                <DateTimePicker 
              
              mode="date" 
              display="spinner"
              value={date}
              onChange={customSetDate}
              
              minimumDate={new Date(2015, 1, 1)}
              maximumDate={new Date(2023, 18, 28)}
              disabled={disabled}
              >
              </DateTimePicker>
                )}
              
            </View>
          </Collapsible>
          <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 60}}>
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