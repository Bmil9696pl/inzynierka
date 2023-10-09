import React, { useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { VictoryCandlestick, VictoryLine, VictoryChart, VictoryTheme, VictoryZoomContainer } from "victory-native";
import * as Progress from 'react-native-progress';
import NumericInput from 'react-native-numeric-input'
import { RFPercentage } from "react-native-responsive-fontsize";

const DataScreen = (data) => {
    const [numberOfDataPoints1, setNumberOfDataPoints1] = useState(5);
    const [numberOfDataPoints2, setNumberOfDataPoints2] = useState(10);

    const candleStickData = []
    console.log("data from api")
    
    console.log(data["data"][2].goldValue)
    for(let i = 0 ; i<96; i++){
        var first = data["data"][i];
        var second= data["data"][i+1];  
        var third = data["data"][i+2];
        const x = new Date(first.date)
        const open = first.goldValue
        const close = third.goldValue
        const high = Math.max(first.goldValue, second.goldValue, third.goldValue)
        const low = Math.min(first.goldValue, second.goldValue, third.goldValue)
        let pom = {x, open, close, high, low}
        candleStickData.push(pom)
    }
    
    //console.log(candleStickData)

    function generateRandomStockData() {
      const open = Math.random() * 100;
      const close = open + (Math.random() - 0.5) * 30;
      const high = Math.max(open, close) + Math.random() * 5;
      const low = Math.min(open, close) - Math.random() * 5;
  
      return { open, close, high, low };
    }
  
  // Generate an array with 100 data points
    /*const sampleDataDates = [];
    const startDate = new Date(2016, 6, 1, 16, 0); // July 1, 2016, 16:00
    const incrementMinutes = 5;
  
    for (let i = 0; i < 25; i++) {
        const currentDate = new Date(startDate);
        currentDate.setMinutes(startDate.getMinutes() + i * incrementMinutes);
        const stockData = generateRandomStockData();
        sampleDataDates.push({ x: currentDate, ...stockData });
    }
   
    // Output the resulting array
    console.log(sampleDataDates);
  */
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
            sum += data[pastDataIterator].close;
          }
        }
        returnValue.push({x: data[dataIterator].x ,y: sum/numberOfIterations});
      }
      return returnValue;
    }
  
    dataMA1 = simpleMovingAverage(numberOfDataPoints1, candleStickData)
    dataMA2 = simpleMovingAverage(numberOfDataPoints2, candleStickData)
  
    let positiveSum = 0
    let sum = 0
    candleStickData.forEach(setRatio)
    let ratio = positiveSum/sum
    return (
      <View style={styles.container}>
        <View style={styles.tile}>
          <VictoryChart width={400} containerComponent={<VictoryZoomContainer zoomDomain={{x: [candleStickData[0].x, candleStickData[candleStickData.length - 1].x], y: [candleStickData[0].low, candleStickData[candleStickData.length - 1].high]}}/>} domainPadding={{ x: 0 }} theme={{
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
              stroke: "transparent"            
            }
          }}
            candleColors={{
            positive: "#34D17B", negative: "#EF4242" }}
            data={candleStickData}
          />
          <VictoryLine 
            style={{
              data: { stroke: "#D1348A" },
              parent: { border: "1px solid #ccc"}
            }}
            data={dataMA1}
          />
  
          <VictoryLine 
            style={{
              data: { stroke: "#42EFEF" },
              parent: { border: "1px solid #ccc"}
            }}
            data={dataMA2}
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
              color: "#34D17B",
              fontSize: RFPercentage(4),
            }}>
              {Math.round((ratio + Number.EPSILON) * 100) / 100}
            </Text>
            </View>
            <View style={styles.textContainer}>
            <Text style={{
              color: "#EF4242",
              fontSize: RFPercentage(4),
            }}>
              {Math.round(((1-ratio) + Number.EPSILON) * 100) / 100}
            </Text>
            </View>
          </View>
          <Progress.Bar progress={ratio} width={320} height={30} color="#34D17B" unfilledColor="#EF4242"/>
        </View>
        <View style={styles.tile}>
          <Text style={{color: '#D1348A', fontSize: RFPercentage(4)}}>
            MOVING AVERAGE
          </Text>
          <NumericInput 
            value={numberOfDataPoints1}
            onChange={setNumberOfDataPoints1}
            minValue={1}
            textColor='#FFFFFF' 
            rightButtonBackgroundColor='#34D17B'
            leftButtonBackgroundColor='#EF4242'
            rounded='true'
            borderColor='#3D3D3D'
          />
        </View>
        <View style={styles.tile}>
          <Text style={{color: '#42EFEF', fontSize: RFPercentage(4)}}>
            MOVING AVERAGE
          </Text>
          <NumericInput 
            value={numberOfDataPoints2}
            onChange={setNumberOfDataPoints2}
            minValue={1}
            textColor='#FFFFFF' 
            rightButtonBackgroundColor='#34D17B'
            leftButtonBackgroundColor='#EF4242'
            rounded='true'
            borderColor='#3D3D3D'
          />
        </View>
      </View>
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
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#1E1E1E"
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
    }
  });
export default DataScreen;