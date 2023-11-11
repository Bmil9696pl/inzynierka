import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { VictoryCandlestick, VictoryLine, VictoryChart, VictoryTheme, VictoryZoomContainer } from "victory-native";
import * as Progress from 'react-native-progress';
import NumericInput from 'react-native-numeric-input'
import { RFPercentage } from "react-native-responsive-fontsize";

const DataScreen = (data) => {
    const [numberOfDataPoints1, setNumberOfDataPoints1] = useState(5);
    const [numberOfDataPoints2, setNumberOfDataPoints2] = useState(10);
    const [boilingersNumberOfDataPoints, setBoilinersBandsNumberOfDataPoints] = useState(15)
    const [movAverage1Hidden, setMovingAverage1Hidden] = useState(true);
    const [movAverage2Hidden, setMovingAverage2Hidden] = useState(true);
    const [boilingersBandsHidden,  setBoilingersBandsHidden] = useState(true);
    const [dataMA1, setDataMA1] = useState(null);
    const [dataMA2, setDataMA2] = useState(null);
    const [dataBBLow, setDataBBLow] = useState(null);
    const [dataBBMean, setDataBBMean] = useState(null);
    const [dataBBHigh, setDataBBHigh] = useState(null);
    const firstUpdate1 = useRef(true);
    const firstUpdate2 = useRef(true);
    const candleStickData = []

    function customSetMovingAverage1Hidden(){
      setMovingAverage1Hidden(!movAverage1Hidden)
      if(dataMA1 == null){
        setDataMA1(simpleMovingAverage(numberOfDataPoints1, candleStickData))
      }
    }

    function customSetMovingAverage2Hidden(){
      setMovingAverage2Hidden(!movAverage2Hidden)
      if(dataMA2 == null){
        setDataMA2(simpleMovingAverage(numberOfDataPoints2, candleStickData))
      }
    }

    function customSetBoilingersBands2Hidden(){
      setBoilingersBandsHidden(!boilingersBandsHidden)
      if(dataBBLow == null){
        let {retLow, retMean, retHigh} = boilingersBands(boilingersNumberOfDataPoints, candleStickData)
        setDataBBLow(retLow);
        setDataBBMean(retMean);
        setDataBBHigh(retHigh);
      }
    }


    for(let i = 0 ; i<data["data"].length; i+=4){
        var first = data["data"][i];
        var second= data["data"][i+1];  
        var third = data["data"][i+2];
        var fourth = data["data"][i+2];
        const x = new Date(first.date)
        const open = first.goldValue
        const close = fourth.goldValue
        const high = Math.max(first.goldValue, second.goldValue, third.goldValue, fourth.goldValue)
        const low = Math.min(first.goldValue, second.goldValue, third.goldValue, fourth.goldValue)
        let pom = {x, open, close, high, low}
        candleStickData.push(pom)
    }
    const[prevBBNumberOfDataPoints, setPrevBBNumberOfDataPoints] = useState(boilingersNumberOfDataPoints)
    if(boilingersBandsHidden == false){
      if(boilingersNumberOfDataPoints != prevBBNumberOfDataPoints){
        setPrevBBNumberOfDataPoints(boilingersNumberOfDataPoints)
        let {retLow, retMean, retHigh} = boilingersBands(boilingersNumberOfDataPoints, candleStickData)
        setDataBBLow(retLow);
        setDataBBMean(retMean);
        setDataBBHigh(retHigh);
      }
    }

    const[prevNumberOfDataPoints1, setPrevNumberOfDataPoints1] = useState(numberOfDataPoints1)
    if(movAverage1Hidden == false){
      if(numberOfDataPoints1 != prevNumberOfDataPoints1){
        setPrevNumberOfDataPoints1(numberOfDataPoints1)
        setDataMA1(simpleMovingAverage(numberOfDataPoints1, candleStickData))
      }
    }

    const[prevNumberOfDataPoints2, setPrevNumberOfDataPoints2] = useState(numberOfDataPoints2)
    if(movAverage2Hidden == false){
      if(numberOfDataPoints2 != prevNumberOfDataPoints2){
        setPrevNumberOfDataPoints2(numberOfDataPoints2)
        setDataMA2(simpleMovingAverage(numberOfDataPoints2, candleStickData))
      }
    }
    
  
    function setRatio(data){
      if(data.open < data.close){
        positiveSum += data.close - data.open
      }
      sum += Math.abs(data.open - data.close)
    }
  
    function simpleMovingAverage(nOfDataPoints, data){
      var length = data.length; 
      var returnValue = [];
      for(dataIterator = 0; dataIterator < length; dataIterator++){
        var numberOfIterations = 0;
        var sum = 0;
        for(pastDataIterator = dataIterator; pastDataIterator >= 0; pastDataIterator--){
          if(numberOfIterations < nOfDataPoints){
            numberOfIterations++;
            sum += (data[pastDataIterator].close + data[pastDataIterator].open + data[pastDataIterator].high + data[pastDataIterator].low)/4;
          }
        }
        returnValue.push({x: data[dataIterator].x ,y: sum/numberOfIterations});
      }
      return returnValue;
    }

    function boilingersBands(nOfDataPoints, data){
      var length = data.length; 
      retLow = [];
      retMean = [];
      retHigh = [];
      for(dataIterator = 0; dataIterator < length; dataIterator++){
        var numberOfIterations = 0;
        var sum = 0;
        var standardDeviation = 0;
        for(pastDataIterator = dataIterator; pastDataIterator >= 0; pastDataIterator--){
          if(!(numberOfIterations < nOfDataPoints)){
            break;
          }
          numberOfIterations++;
          sum += (data[pastDataIterator].close + data[pastDataIterator].open + data[pastDataIterator].high + data[pastDataIterator].low)/4;
          
        }
        mean = sum/numberOfIterations
        numberOfIterations = 0
        for(pastDataIterator = dataIterator; pastDataIterator >= 0; pastDataIterator--){
          if(!(numberOfIterations < nOfDataPoints)){
            break;
          }
          numberOfIterations++;
          standardDeviation += ((data[pastDataIterator].close + data[pastDataIterator].open + data[pastDataIterator].high + data[pastDataIterator].low)/4 - mean) ** 2
        }
        standardDeviation = Math.sqrt(standardDeviation/numberOfIterations)
        retLow.push({x: data[dataIterator].x , y: mean-(standardDeviation*2)})
        retMean.push({x: data[dataIterator].x , y: mean})
        retHigh.push({x: data[dataIterator].x , y: mean+(standardDeviation*2)})
      }
      return {retLow, retMean, retHigh};
    }
  
    let positiveSum = 0
    let sum = 0
    candleStickData.forEach(setRatio)
    let ratio = positiveSum/sum
    //let {retLow, retMean, retHigh} = boilingersBands(10, candleStickData)
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.tile}>
          <Text style={{color: '#FFFFFF', fontSize: RFPercentage(4), alignSelf: "flex-start"}}>
            Current value: {candleStickData[candleStickData.length -1].close}
          </Text>
          <VictoryChart width={400} containerComponent={<VictoryZoomContainer zoomDomain={{x: [candleStickData[0].x, candleStickData[candleStickData.length - 1].x], y: [candleStickData[0].low, candleStickData[candleStickData.length - 1].high]}}/>} domainPadding={{ x: 0 }} 
          padding={{ top: 20, bottom: 20, left:50, right: 20 }}
          scale={{x: "time", y: "linear"}}
          theme={{
              axis: {
                style: {
                  axis: {
                    stroke: "#3C3C3C"
                  },
                  tickLabels: {
                    fill: "#FFFFFF"
                  },
                  grid: {
                    fill: "none",
                    stroke: "none"
                  }
                }
              }
            }}>
          <VictoryCandlestick
          candleRatio={1.2}
          style={{
            data: {
              stroke: "#FFFFFF"            
            }
          }}
            candleColors={{
            positive: "#27D89B", negative: "#D82764" }}
            data={candleStickData}
          />
          <VictoryLine 
            style={{
              data: { stroke: movAverage1Hidden ? "transparent" : "#FF9FC9" },
              parent: { border: "1px solid #ccc"}
            }}
            data={dataMA1}
          />
  
          <VictoryLine 
            style={{
              data: { stroke: movAverage2Hidden ? "transparent" : "#F7F5DD" },
              parent: { border: "1px solid #ccc"}
            }}
            data={dataMA2}
          />
          <VictoryLine 
            style={{
              data: { stroke: boilingersBandsHidden ? "transparent" : "#C73848" },
              parent: { border: "1px solid #ccc"}
            }}
            data={dataBBLow}
          />
          <VictoryLine 
            style={{
              data: { stroke: boilingersBandsHidden ? "transparent" : "#C76F38" },
              parent: { border: "1px solid #ccc"}
            }}
            data={dataBBMean}
          />
          <VictoryLine 
            style={{
              data: { stroke: boilingersBandsHidden ? "transparent" : "#C73848" },
              parent: { border: "1px solid #ccc"}
            }}
            data={dataBBHigh}
          />
          </VictoryChart>
        </View>
        <View style={styles.tile}>
          <Text style={styles.text}>
            RELATIVE STRENGTH INDEX
          </Text>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <View style={styles.textContainer}>
            <Text style={{
              color: "#27D89B",
              fontSize: RFPercentage(4),
            }}>
              {Math.round((ratio + Number.EPSILON) * 100) / 100}
            </Text>
            </View>
            <View style={styles.textContainer}>
            <Text style={{
              color: "#D82764",
              fontSize: RFPercentage(4),
            }}>
              {Math.round(((1-ratio) + Number.EPSILON) * 100) / 100}
            </Text>
            </View>
          </View>
          <Progress.Bar progress={ratio} width={320} height={30} color="#27D89B" unfilledColor="#D82764"/>
        </View>
        <View style={styles.tile}>
          <Text style={{color: '#FF9FC9', fontSize: RFPercentage(4)}}>
            MOVING AVERAGE
          </Text>
          <View style={{alignItems: "center", flexDirection:"row"}}>
            <NumericInput
              value={numberOfDataPoints1}
              onChange={setNumberOfDataPoints1}
              minValue={1}
              textColor='#FFFFFF' 
              rightButtonBackgroundColor='#27D89B'
              leftButtonBackgroundColor='#D82764'
              rounded='true'
              borderColor='#3D3D3D'
            />
            <TouchableOpacity onPress={customSetMovingAverage1Hidden}>
              <Image
              style={styles.hidden}
              source={require("../assets/img/3994371_eye_hidden_hide_invisible_private_icon.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.tile}>
          <Text style={{color: '#F7F5DD', fontSize: RFPercentage(4)}}>
            MOVING AVERAGE
          </Text>
          <View style={{alignItems: "center", flexDirection:"row"}}>
            <NumericInput 
              value={numberOfDataPoints2}
              onChange={setNumberOfDataPoints2}
              minValue={1}
              textColor='#FFFFFF' 
              rightButtonBackgroundColor='#27D89B'
              leftButtonBackgroundColor='#D82764'
              rounded='true'
              borderColor='#3D3D3D'
            />
            <TouchableOpacity onPress={customSetMovingAverage2Hidden}>
              <Image
                style={styles.hidden}
                source={require("../assets/img/3994371_eye_hidden_hide_invisible_private_icon.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.tile}>
          <Text style={{color: '#C76F38', fontSize: RFPercentage(4)}}>
            BOILINGERS BANDS
          </Text>
          <View style={{alignItems: "center", flexDirection:"row"}}>
            <NumericInput 
              value={boilingersNumberOfDataPoints}
              onChange={setBoilinersBandsNumberOfDataPoints}
              minValue={1}
              step={1}
              textColor='#FFFFFF' 
              rightButtonBackgroundColor='#27D89B'
              leftButtonBackgroundColor='#D82764'
              rounded='true'
              borderColor='#3D3D3D'
            />
            <TouchableOpacity onPress={customSetBoilingersBands2Hidden}>
              <Image
                style={styles.hidden}
                source={require("../assets/img/3994371_eye_hidden_hide_invisible_private_icon.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
  
  const styles = StyleSheet.create({
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
    container: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#1E1E1E",
      
    },
    tile: {
      alignItems: 'center',
      borderRadius: 45,
      backgroundColor: "#3D3D3D",
      padding: 10,
      width: '95%'
    },
    textContainer: {
      flex: 1, 
      alignItems: 'center', 
      alignSelf: 'flex-start'
    },
    text: {
      color: "#FFFFFF",
      fontSize: RFPercentage(3.5),
    },
    hidden:{
      resizeMode: "contain",
      height: 30,
      width: 30,
      marginLeft: 50
    }
  });
export default DataScreen;