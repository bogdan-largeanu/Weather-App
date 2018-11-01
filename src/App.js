import React, { Component } from "react";
import logo from "./logo.svg";
import cloudSun from "./clouds-sun.png";
import image from "./image.svg";
import axios from "axios";
import moment from "moment";
import "./App.css";

/*
take api date of first entry and return a list with 
  {hour: nameOfDay: date: }
 for the next 5 days
*/
function matchDay(firstDayEntry) {
  let daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  let hour = moment(firstDayEntry).format("HH:mm:ss");
  let dateInput = moment(firstDayEntry).format("dddd");
  let index = daysOfWeek.indexOf(dateInput);
  //make list of days the data is available for
  let weatherDays = [];
  for (let i = 0; i < 5; i++) {
    let entry = {
      nameOfDay: daysOfWeek[(index + i) % 7],
      hour: hour
    };
    weatherDays.push(entry);
  }
  addDates(weatherDays, firstDayEntry);
  return weatherDays;
}
/*
Add to the list of object days, their matching calendar date
*/

function addDates(weatherDays, firstDayEntry) {
  //To-DO: increase day by 1
  let newDate;
  let dateFormated;
  let dateNow = moment().format("YYYY-MM-D");
  let dateInput = firstDayEntry;
  for (let i = 0; i < 5; i++) {
    newDate = moment(dateInput).add(i, "d");
    dateFormated = newDate.format("YYYY-MM-DD");
    weatherDays[i] = { date: dateFormated, ...weatherDays[i] };
  }

  return weatherDays;
}
/*
Add to the list of object days, their matching temperatures and descriptions
*/
function daysMaped(apiData, weatherDays) {
  weatherDays.map(day => {
    apiData.list.map(apiDay => {
      const matchingDate = day.date + " " + day.hour;
      if (apiDay.dt_txt === matchingDate) {
        day.minTemp = Math.round(apiDay.main.temp_min-273.15);
        day.maxTemp = Math.round(apiDay.main.temp_max-273.15);
        day.description = apiDay.weather[0].description;
      }
    });
  });

  return weatherDays;
}

function Card(props) {
  //it only comes here undefined
  let day = [
    {
      date: "",
      description: "",
      hour: "",
      maxTemp: 0,
      minTemp: 0,
      nameOfDay: ""
    }
  ];
  if (typeof props.weather !== "undefined") {
    day = props.weather;
    console.log("Card(props)", day);
  }
  return (
    <div className="flex-container">
      <div className="day"> {day.nameOfDay}</div>
      <div className="img">
        {" "}
        <img src={props.data.img} width="45px" />{" "}
      </div>
      <div className="flex-container-temp">
        {" "}
        {/* ?can I reuse css clases or is better to make a new one for each element?*/}
        <div className="minTemp">{day.minTemp}</div>
        <div className="maxTemp">{day.maxTemp}</div>
      </div>
      <div className="description">{day.description}</div>
    </div>
  );
}

function RowCards(props) {
  const apiData = Object.assign({}, props.data.api);
  let finalDataWeather =[{},{},{},{},{}];

  if (typeof apiData.city != "undefined") {
    //save date and match with day of the week
    let weatherDays = matchDay(apiData.list[0].dt_txt);
    //use same hour for each day to get data -> insdie call method to save variables for temperatures
    finalDataWeather = daysMaped(apiData, weatherDays);
  }
  return (
    <div className="flex-container-day">
    {finalDataWeather.map( day=> <Card data={props.data} weather={day} />)}
    </div>
  );
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      min: 0,
      max: 25,
      day: "Mon",
      img: cloudSun
    };
  }
  componentDidMount() {
    axios
      .get(
        "http://api.openweathermap.org/data/2.5/forecast?id=2643743&appid=b218ffa9d8261b193da591fdc8edb6e3"
      )
      .then(resp => {
        this.setState(prevState => ({ api: resp.data }));
      });
  }

  render() {
    return (
      <div className="App">
        <RowCards data={this.state} />
      </div>
    );
  }
}

export { matchDay, daysMaped };
export default App;
