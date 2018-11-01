import React from 'react';
import ReactDOM from 'react-dom';
import App, { matchDay ,daysMaped} from './App';
import api from './apiData.json'
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test ('Test matchDay is array ', ()=>
{
const list = matchDay('2018-10-31 18:00:00');
expect(Array.isArray(list));
} ) ;

test ('Test MatchDay for fix-date and hour', ()=>{
const day = matchDay('2018-10-31 18:00:00');
expect(day[0].date).toBe('2018-10-31');
});

test ('Test MatchDay for invalid date', ()=>{
  const day = matchDay('18:00:00');
  expect(day[0].date).toBe('Invalid date');
  });

test('Test for correct 5th day fix-date only', ()=> {
  const day = matchDay('2018-10-31');
  expect(day[4].date).toBe('2018-11-04')
});

test('Test for correct 5th day fix-date only', ()=> {
  const day = matchDay('2018-10-31 18:00:00');
  expect(day[4].date).toBe('2018-11-04')
});

test('Test matching api object to my week object', ()=> {
  //api.apiData.list[0].dt_txt
  //api.apiData.list[1].main.temp_min
  //api.apiData.list[1].weather[0].description
  const weekData = daysMaped(api.apiData,api.listOfDays);
  expect(weekData[0].nameOfDay).toBe(api.listOfDays[0].nameOfDay);
});

test('Test minimum temperature', ()=>{
  const weekData = daysMaped(api.apiData, api.listOfDays);
 //needs to be list 2 because that one matches with the correct hour & convert tmp
 const tmpApi = Math.round(api.apiData.list[2].main.temp_min-273.15);
  expect(weekData[0].minTemp).toBe(tmpApi)
})

test('Test maximum temperature',() =>{
  const weekData = daysMaped(api.apiData, api.listOfDays);
  const tempApi = Math.round(api.apiData.list[2].main.temp_min-273.15);
  expect(weekData[0].maxTemp).toBe(tempApi)
})

test('Test description', ()=> {
  const weekData = daysMaped(api.apiData, api.listOfDays);
  expect(weekData[0].description).toBe(api.apiData.list[2].weather[0].description)
})