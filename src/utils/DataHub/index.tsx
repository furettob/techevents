import Axios from 'axios' 
import Moment from 'moment';

export function getAllEvents() {
  return Axios.get('/data/events.json').then(
    events => {
      return events.data
    }
  ).catch( e => {
    console.log("ERROR: ", e)
    return {error: e}    
  })
}

export function getAllCities() {
  return Axios.get('/data/cities.json').then(
    cities => {
      return cities.data
    }
  ).catch( e => {
    console.log("ERROR: ", e)
    return {error: e}    
  })
}

export async function getEventsByDate() {
  let events = await getAllEvents()
  let cities = await getAllCities()
  if (events.error) {
    return events
  }
  if (cities.error) {
    return cities
  }
  // Adding the city name
  events = events.map( event => {
    const cityObj = cities.find( city => { return city.id === event.city })
    event.cityName =  cityObj ? cityObj.name : "To be defined"
    return event
  })
  // Ordering and grouping by date
  events = groupByDate(events)
  console.log(events)
  return events
}

function groupByDate(events) {
  const eventsByDate = events.reduce(function(eventsByDate, event) {
    eventsByDate[getDate(event)] = eventsByDate[getDate(event)] || {};
    (eventsByDate[getDate(event)].events = eventsByDate[getDate(event)].events || []).push(event);
    eventsByDate[getDate(event)].title = getFormattedDateWithWeekday(event)
    eventsByDate[getDate(event)].date = getDate(event)
    return eventsByDate;
  }, {});
  return Object.values(eventsByDate).sort(compareEventGroupByDate)
};

function getDate(event) {
  return new Date(event.startDate).setHours(0,0,0,0)
}

function getFormattedDateWithWeekday(event) {
  Moment.locale('en');
  return Moment(new Date(event.startDate)).format('dddd Do MMMM')
}

export function getFormattedDate(event) {
  Moment.locale('en');
  return Moment(new Date(event.startDate)).format('Do MMMM')
}

function compareEventGroupByDate(eventGroupA, eventGroupB) {
  return compareDate(new Date(eventGroupA.date), new Date(eventGroupB.date))
}

function compareDate(dateA, dateB) {
  return dateA.getTime() - dateB.getTime()
}

export async function signUpToEvent(event) {
  console.log("signing up to " + event.id)
  let myEvents: number[] = JSON.parse(localStorage.getItem("myEvents") || "[]")
  if (myEvents.indexOf(event.id) === -1) {
    myEvents.push(event.id)
  } else {
    console.log("Already signed up for event " + event.id)
  }
  localStorage.setItem("myEvents", JSON.stringify(myEvents));
  console.log(localStorage)
}

export async function cancelFromEvent(event) {
  console.log("cancelling from " +  event.id)
  let myEvents: number[] = JSON.parse(localStorage.getItem("myEvents") || "[]")
  if (myEvents.indexOf(event.id) === -1) {
    console.log("Already not signed up for event " + event.id)
  } else {
    myEvents.splice(myEvents.indexOf(event.id),1)
  }
  localStorage.setItem("myEvents", JSON.stringify(myEvents));
  console.log(localStorage)
}

