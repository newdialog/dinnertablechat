import moment from 'moment';

const hourOpen = 0;

export function isBeforeEndingTime() {
  return moment()
    .utc()
    .isBefore(
      moment()
        .utc()
        .hour(hourOpen + 3)
        .minute(0)
    );
}

export function isAfterEndTime() {
  return moment()
    .utc()
    .isAfter(
      moment()
        .utc()
        .hour(hourOpen + 3)
        .minute(0)
    );
}

export function isDuringDebate() {
  return moment()
    .utc()
    .isBetween(
      moment()
        .utc()
        .hour(hourOpen)
        .minute(0),
      moment()
        .utc()
        .hour(hourOpen + 3)
        .minute(0)
    );
}

export function getDebateStart() {
  return isBeforeEndingTime()
    ? moment()
        .utc()
        .hour(hourOpen)
        .minute(0)
        .toDate()
    : moment()
        .utc()
        .hour(hourOpen)
        .minute(0)
        .add('1', 'day')
        .toDate();
}

export function getDebateEnd() {
  return moment()
    .utc()
    .hour(hourOpen + 3)
    .minute(0)
    .toDate();
}
