import moment from 'moment';

const openForNumHours = 1;
const hourOpen = 0;
const minOpen = 0;

export function isBeforeEndingTime() {
  return moment()
    .utc()
    .isBefore(
      moment()
        .utc()
        .hour(hourOpen + openForNumHours)
        .minute(minOpen)
    );
}

export function isAfterEndTime() {
  return moment()
    .utc()
    .isAfter(
      moment()
        .utc()
        .hour(hourOpen + openForNumHours)
        .minute(minOpen)
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
        .subtract('1', 'minute')
        .subtract('1', 'second'),
      moment()
        .utc()
        .hour(hourOpen + openForNumHours)
        .minute(minOpen)
    );
}

export function getDebateStart() {
  return isBeforeEndingTime()
    ? moment()
        .utc()
        .hour(hourOpen)
        .minute(minOpen)
        .toDate()
    : moment()
        .utc()
        .hour(hourOpen)
        .minute(minOpen)
        .add('1', 'day')
        .toDate();
}

export function getDebateEnd() {
  return moment()
    .utc()
    .hour(hourOpen + openForNumHours)
    .minute(minOpen)
    .toDate();
}
