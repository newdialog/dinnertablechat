import moment from 'moment';

const openForNumHours = 6;
const hourOpen = 0;
const minOpen = 0;

export function isBeforeEndingTime() {
  return moment()
    .utc()
    .isBefore(
      moment()
        .utc()
        .hour(hourOpen)
        .add(openForNumHours, 'h')
        .minute(minOpen)
        .seconds(0)
    );
}

export function isAfterEndTime() {
  return moment()
    .utc()
    .isAfter(
      moment()
        .utc()
        .hour(hourOpen)
        .add(openForNumHours, 'h')
        .minute(minOpen)
        .seconds(0)
    );
}

export function isDuringDebate() {
  return moment()
    .utc()
    .isBetween(
      moment()
        .utc()
        .hour(hourOpen)
        .minute(minOpen)
        .seconds(0),
      moment()
        .utc()
        .hour(hourOpen)
        .add(openForNumHours, 'h')
        .minute(minOpen)
        .seconds(0)
    );
}

export function getDebateStart() {
  return isBeforeEndingTime()
    ? moment()
        .utc()
        .hour(hourOpen)
        .minute(minOpen)
        .seconds(0)
        .toDate()
    : moment()
        .utc()
        .hour(hourOpen)
        .minute(minOpen)
        .seconds(0)
        .add('1', 'day')
        .toDate();
}

export function getDebateEnd() {
  return moment()
    .utc()
    .hour(hourOpen)
    .add(openForNumHours, 'h')
    .minute(minOpen)
    .seconds(0)
    .toDate();
}
