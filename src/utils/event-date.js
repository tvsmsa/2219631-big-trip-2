import dayjs from 'dayjs';
import { getRandomInteger } from './common';

const eventTimeGap = 480;
const maxEventDuration = 48;
const minEventDuration = 1;

const maxMinutes = 60;
const maxHours = 24;

const humanizeEventTime = (dateTime, format) => dayjs(dateTime).format(format).toUpperCase();

const transformTimeDifference = (difference) => {
  let format = 'DD[D] HH[H] mm[M]';
  if(difference < maxMinutes){
    format = 'mm[M]';
  }
  else if (difference / maxMinutes < maxHours) {
    format = 'HH[H] mm[M]';
  }
  return humanizeEventTime(dayjs().date(difference/(maxMinutes*maxHours)).hour((difference/maxMinutes)%maxHours).minute(difference%maxMinutes), format);
};

const getTimeDifference = (dateFrom, dateTo) => transformTimeDifference(dayjs(dateTo).diff(dayjs(dateFrom), 'minute'));

const generateDate = () => getRandomInteger(0, 1)
  ? dayjs().add(getRandomInteger(0, eventTimeGap), 'hour').toString()
  : dayjs().subtract(getRandomInteger(0, eventTimeGap), 'hour').toString();

const generateDateTo = (dateFrom) => dayjs(dateFrom).add(getRandomInteger(minEventDuration, maxEventDuration), 'hour').toString();

const isPast = (date, unit) => dayjs().isAfter(dayjs(date), unit);

const isFuture = (date, unit) => dayjs().isBefore(dayjs(date), unit) || dayjs().isSame(dayjs(date), unit);

const getEarliestEvent = (tripEvents) => {
  let earliestEvent = tripEvents[0];
  for(let i = 1; i < tripEvents.length; i++) {
    if(dayjs(tripEvents[i].dateFrom).diff(dayjs(earliestEvent.dateFrom), 'M') < 0
      || dayjs(tripEvents[i].dateFrom).diff(dayjs(earliestEvent.dateFrom), 'M') === 0
      && dayjs(tripEvents[i].dateFrom).diff(dayjs(earliestEvent.dateFrom), 'D') < 0) {
      earliestEvent = tripEvents[i];
    }
  }
  return earliestEvent;
};

const getLatestEvent = (tripEvents) => {
  let latestEvent = tripEvents[0];
  for(let i = 1; i < tripEvents.length; i++) {
    if(dayjs(tripEvents[i].dateTo).diff(dayjs(latestEvent.dateTo), 'M') > 0
      || dayjs(tripEvents[i].dateTo).diff(dayjs(latestEvent.dateTo), 'M') === 0
      && dayjs(tripEvents[i].dateTo).diff(dayjs(latestEvent.dateTo), 'D') > 0) {
      latestEvent = tripEvents[i];
    }
  }
  return latestEvent;
};

const sortByDate = (currentEvent, nextEvent) => {
  const dateFromDifference = dayjs(currentEvent.dateFrom).diff(dayjs(nextEvent.dateFrom));
  return dateFromDifference === 0 ? dayjs(nextEvent.dateTo).diff(dayjs(currentEvent.dateTo)) : dateFromDifference;
};

const sortByDuration = (currentEvent, nextEvent) => dayjs(nextEvent.dateTo).diff(dayjs(nextEvent.dateFrom)) - dayjs(currentEvent.dateTo).diff(dayjs(currentEvent.dateFrom));

export {humanizeEventTime, getTimeDifference, generateDate, generateDateTo, isPast, isFuture, getEarliestEvent, getLatestEvent, sortByDate, sortByDuration};
