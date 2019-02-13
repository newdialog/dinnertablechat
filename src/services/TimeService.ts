import moment from 'moment';

const hourOpen = 21;
const minOpen = 0;
const dur = moment.duration(8, 'hours').add(0, 'minutes');

export function isBeforeEndingTime() {
  return moment()
    .utc()
    .isBefore(_getDebateEnd());
}

export function isAfterEndTime() {
  return moment()
    .utc()
    .isAfter(_getDebateEnd());
}

export function isDuringDebate() {
  return moment()
    .utc()
    .isBetween(_getDebateStart(), _getDebateEnd());
}

export function pastDaysEnd() {
  return moment()
    .utc()
    .isAfter(
      moment()
        .utc()
        .hour(hourOpen)
        .minute(minOpen)
        .seconds(0)
        .add(dur)
    );
}

export function _getDebateStart() {
  return !pastDaysEnd()
    ? moment()
        .utc()
        .hour(hourOpen)
        .minute(minOpen)
        .seconds(0)
    : moment()
        .utc()
        .hour(hourOpen)
        .minute(minOpen)
        .seconds(0)
        .add('1', 'day');
}

export function getDebateStart() {
  return _getDebateStart().toDate();
}

export function _getDebateEnd() {
  return _getDebateStart().add(dur);
}

export function getDebateEnd() {
  return _getDebateEnd().toDate();
}
