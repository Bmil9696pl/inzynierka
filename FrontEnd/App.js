import React, { useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { VictoryCandlestick, VictoryLine, VictoryChart, VictoryTheme, VictoryZoomContainer } from "victory-native";
import * as Progress from 'react-native-progress';
import NumericInput from 'react-native-numeric-input'


/*sampleDataDates=[
  {x: new Date(year = 2016, month = 6, day = 1, hours = 16, minutes = 0), open: 5, close: 10, high: 15, low: 0},
  {x: new Date(year = 2016, month = 6, day = 1, hours = 16, minutes = 5), open: 10, close: 15, high: 20, low: 5},
  {x: new Date(year = 2016, month = 6, day = 1, hours = 16, minutes = 10), open: 15, close: 20, high: 22, low: 20},
  {x: new Date(year = 2016, month = 6, day = 1, hours = 16, minutes = 15), open: 20, close: 10, high: 25, low: 7},
  {x: new Date(year = 2016, month = 6, day = 1, hours = 16, minutes = 20), open: 10, close: 8, high: 15, low: 5},
]*/


sampleDataMA=[
  {x: new Date(year = 2016, month = 6, day = 1, hours = 16, minutes = 0), y: 7},
  {x: new Date(year = 2016, month = 6, day = 1, hours = 16, minutes = 5), y: 14},
  {x: new Date(year = 2016, month = 6, day = 1, hours = 16, minutes = 10), y: 15},
  {x: new Date(year = 2016, month = 6, day = 1, hours = 16, minutes = 15), y: 8},
  {x: new Date(year = 2016, month = 6, day = 1, hours = 16, minutes = 20), y: 2}
]


export default function App() {
  const [numberOfDataPoints1, setNumberOfDataPoints1] = React.useState(5);
  const [numberOfDataPoints2, setNumberOfDataPoints2] = React.useState(10);


  function generateRandomStockData() {
    const open = Math.random() * 100;
    const close = open + (Math.random() - 0.5) * 30;
    const high = Math.max(open, close) + Math.random() * 5;
    const low = Math.min(open, close) - Math.random() * 5;

    return { open, close, high, low };
  }

// Generate an array with 100 data points
  const sampleDataDates = [];
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
          sum = data[pastDataIterator].close;
        }
      }
      console.log(numberOfIterations);
      returnValue.push({x: data[dataIterator].x ,y: sum/numberOfIterations});
    }
    return returnValue;
  }

  dataMA1 = simpleMovingAverage(numberOfDataPoints1, sampleDataDates)
  dataMA2 = simpleMovingAverage(numberOfDataPoints2, sampleDataDates)

  let positiveSum = 0
  let sum = 0
  sampleDataDates.forEach(setRatio)
  let ratio = positiveSum/sum
  return (
    <View style={styles.container}>
      <View style={styles.tile}>
        <VictoryChart width={400} containerComponent={<VictoryZoomContainer zoomDomain={{x: [sampleDataDates[0].x, sampleDataDates[sampleDataDates.length - 1].x], y: [sampleDataDates[0].low, sampleDataDates[sampleDataDates.length - 1].high]}}/>} domainPadding={{ x: 0 }} theme={{
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
        style={{
          data: {
            stroke: "#FFFFFF"
          }
        }}
          candleColors={{
          positive: "#34D17B", negative: "#EF4242" }}
          data={sampleDataDates}
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
            fontSize: 27,
            fontWeight: 400,
          }}>
            {Math.round((ratio + Number.EPSILON) * 100) / 100}
          </Text>
          </View>
          <View style={styles.textContainer}>
          <Text style={{
            color: "#EF4242",
            fontSize: 27,
            fontWeight: 400,
          }}>
            {Math.round(((1-ratio) + Number.EPSILON) * 100) / 100}
          </Text>
          </View>
        </View>
        <Progress.Bar progress={ratio} width={320} height={30} color="#34D17B" unfilledColor="#EF4242"/>
      </View>
      <View style={styles.tile}>
        <Text style={{color: '#D1348A', fontSize: 27, fontWeight: 400}}>
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
        <Text style={{color: '#42EFEF', fontSize: 27, fontWeight: 400}}>
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
    fontSize: 27,
    fontWeight: 400
  }
});