import moment from 'moment';

const hourOpen = 20;
const minOpen = 0;

const dur = moment.duration(5, 'hours').add(0, 'minutes');

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

export function isDuringDebate(isLive?: boolean) {
  if (isLive === false) {
    return true;
  }
  const m = moment().utc();
  return (
    m.isBetween(todaysStart(), todaysEnd()) ||
    m.isBetween(yestStart(), yestEnd())
  );
  //.isBetween(_getDebateStart(), _getDebateEnd());
}

export function todaysStart() {
  return moment()
    .utc()
    .hour(hourOpen)
    .minute(minOpen)
    .seconds(0);
  // .add(hourOpen)
  // .add(minOpen);
}

export function yestStart() {
  return todaysStart().subtract(1, 'day');
}
export function yestEnd() {
  return yestStart().add(dur);
}

export function todaysEnd() {
  return todaysStart().add(dur);
}

export function pastDaysEnd() {
  return moment()
    .utc()
    .isAfter(todaysEnd());
}

export function pastDaysStart() {
  return moment()
    .utc()
    .isAfter(todaysStart());
}

// export function

export function _getDebateStart() {
  const m = moment().utc();
  const todayStart = todaysStart();
  return m.isBetween(yestEnd(), todayStart) // return !pastDaysEnd()
    ? todayStart
    : todayStart.add('1', 'day');
}

export function _getDebateEnd() {
  // return _getDebateStart().add(dur);
  const m = moment().utc();
  const yend = yestEnd();
  return m.isBetween(yestStart(), yend) // return !pastDaysEnd()
    ? yend
    : yend.add('1', 'day');
}

export function getDebateStart() {
  return _getDebateStart().toDate();
}

export function getDebateEnd() {
  return _getDebateEnd().toDate();
}
