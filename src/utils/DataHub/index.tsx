import Axios from 'axios' 
import Moment from 'moment';
import {EventType, EventFilterType}  from '../../utils/types';

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

export async function getOptionsForTextInput() {
  /* the text search can match both event name or*/
  let options: string[] = []
  let events = await getAllEvents()
  let cities = await getAllCities()
  // if an orror occurs - just return an empty array of suggestion without raising exeption
  if (events.error || cities.error) {
    return options
  }
  // Adding the city name
  events.forEach( event => {
    if (options.indexOf(event.name) === -1) {
      options.push(event.name)
    }
  })
  cities.forEach( city => {
    if (options.indexOf(city.name) === -1) {
      options.push(city.name)
    }
  })
  return options.sort()
}

export async function getEventsByDate(filter?: EventFilterType) {
  let events = await getAllEvents()
  let cities = await getAllCities()
  if (events.error) {
    return events
  }
  if (cities.error) {
    return cities
  }
  /* If a Filter is set, events will be filtered accordingly */
  /* My Events */
  if (filter && filter.myEvents && filter.myEvents === true) {
    events = events.filter(isMyEvent)
  }
  /* Free */
  if (filter && filter.onlyFreeEvents && filter.onlyFreeEvents === true) {
    events = events.filter(isFreeEvent)
  }
  /* Time range */
  if (filter && filter.timeRangeStart && filter.timeRangeEnd) {
    events = events.filter( event => { return isInTimeRange(event, filter.timeRangeStart, filter.timeRangeEnd)} )
  }
  // Adding the city name to the event object -->
  // - avoid unnecessary future double calls
  // - prepare data for the text filter
  events = events.map( event => {
    const cityObj = cities.find( city => { return city.id === event.city })
    event.cityName =  cityObj ? cityObj.name : "To be defined"
    return event
  })
  /* Text Search */
  if (filter && filter.txtSearch) {
    events = events.filter( event => { return doesContainText(event, filter.txtSearch)} )
  }

  // Ordering and grouping by date
  events = groupByDate(events)
  console.log("Returning " + events.length + " events")
  return events
}

// Routine function for filtering events
function isMyEvent(event) {
  return getMyEvents().indexOf(event.id) > -1
}
function isFreeEvent(event) {
  return event.isFree
}
function isInTimeRange(event, timeRangeStart, timeRangeEnd) {
  const h = Moment(new Date(event.startDate)).utcOffset(0).hours() // aaaaaaaa .hours()
  if (timeRangeStart <= timeRangeEnd) {
    return h >= timeRangeStart && h <= timeRangeEnd
  } else {
    // trick: if the time range include midnight, revert the logic
    // e.g  02:00 is "between" 21:00 and 06:00
    return h >= timeRangeStart || h <= timeRangeEnd
  }
}
function doesContainText(event, text) {
  return (event.name && event.name.toUpperCase().indexOf(text.toUpperCase()) > -1) ||
          (event.cityName && event.cityName.toUpperCase().indexOf(text.toUpperCase()) > -1) ||
          // enable the search of multiple cities or event name and city together
          (event.name && text.toUpperCase().indexOf(event.name.toUpperCase()) > -1) ||
          (event.cityName && text.toUpperCase().indexOf(event.cityName.toUpperCase()) > -1)
}

// Group by date routine functions
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
  return Moment(new Date(event.startDate)).utcOffset(0).format('dddd Do MMMM')
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

// Mock function toward database
export async function signUpToEvent(event: EventType) {
  console.log("signing up to " + event.id)
  let myEvents: number[] = getMyEvents()
  if (myEvents.indexOf(event.id) === -1) {
    myEvents.push(event.id)
    setMyEvents(myEvents)
  } else {
    console.log("Already signed up for event " + event.id)
  }
}
export function cancelFromEvent(event) {
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
// getter for "myEvents": will always return an array
export function getMyEvents() {
  let myEvents: number[] = JSON.parse(localStorage.getItem("myEvents") || "[]")
  return myEvents
}
// setter for "myEvents"
function setMyEvents(myEvents: number[]) {
  localStorage.setItem("myEvents", JSON.stringify(myEvents));
  console.log("Set my event: ", localStorage)
}

// Util: enumerator for timetable
export const timeTable = {
      none:{timeRangeStart:undefined, timeRangeEnd: undefined},
      morning:{timeRangeStart:6, timeRangeEnd: 12},
      afternoon:{timeRangeStart:12, timeRangeEnd: 17},
      evening:{timeRangeStart:17, timeRangeEnd: 21},
      night:{timeRangeStart:21, timeRangeEnd: 6}
    }
