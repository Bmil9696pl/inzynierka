import React from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { VictoryCandlestick, VictoryLine, VictoryChart, VictoryTheme } from "victory-native";


sampleDataDates=[
  {x: new Date(year = 2016, month = 6, day = 1, hours = 16, minutes = 0), open: 5, close: 10, high: 15, low: 0},
  {x: new Date(year = 2016, month = 6, day = 1, hours = 16, minutes = 5), open: 10, close: 15, high: 20, low: 5},
  {x: new Date(year = 2016, month = 6, day = 1, hours = 16, minutes = 10), open: 15, close: 20, high: 22, low: 20},
  {x: new Date(year = 2016, month = 6, day = 1, hours = 16, minutes = 15), open: 20, close: 10, high: 25, low: 7},
  {x: new Date(year = 2016, month = 6, day = 1, hours = 16, minutes = 20), open: 10, close: 8, high: 15, low: 5}
]

sampleDataMA=[
  {x: new Date(year = 2016, month = 6, day = 1, hours = 16, minutes = 0), y: 7},
  {x: new Date(year = 2016, month = 6, day = 1, hours = 16, minutes = 5), y: 14},
  {x: new Date(year = 2016, month = 6, day = 1, hours = 16, minutes = 10), y: 15},
  {x: new Date(year = 2016, month = 6, day = 1, hours = 16, minutes = 15), y: 8},
  {x: new Date(year = 2016, month = 6, day = 1, hours = 16, minutes = 20), y: 2}
]

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.tile}>
        <VictoryChart width={350} theme={{
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
            data: { stroke: "#c43a31" },
            parent: { border: "1px solid #ccc"}
          }}
          data={sampleDataMA}
        />
        </VictoryChart>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E1E1E"
  },
  tile: {
    borderRadius: 45,
    backgroundColor: "#3D3D3D",
    padding: 5
  }
});