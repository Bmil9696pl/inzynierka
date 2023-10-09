import HomeScreen from "./screens/home-screen"


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
  return(
    <HomeScreen/>
  )
}