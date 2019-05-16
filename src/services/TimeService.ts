/*global luxon*/
// import DateTime from 'DateTime';
import { DateTime, Duration } from 'luxon';
// const { DateTime, Duration } = (window as any).luxon;
// const {DateTime} = require("luxon");
// import ical from 'ical-generator';

const hourOpen = 20;
// const minOpen = 0;

const dur = Duration.fromObject({ hours: 5, minutes: 0 });

// export function genIcal()

export function isBeforeEndingTime() {
  return DateTime.utc() < _getDebateEnd();
}

export function isAfterEndTime() {
  return DateTime.utc() > _getDebateEnd();
}

export function isDuringDebate(isLive?: boolean) {
  // TESTING Flag: always lock session open
  if (isLive === false) {
    return true; // !window.location.hostname.includes('jadbox');
  }
  const m = DateTime.utc();
  return (
    (m >= todaysStart() && m <= todaysEnd()) ||
    (m >= yestStart() && m <= yestEnd())
  );
  // .isBetween(_getDebateStart(), _getDebateEnd());
}

export function todaysStart() {
  return DateTime.utc().set({ hour: hourOpen, minute: 0, second: 0 });
  // .add(hourOpen)
  // .add(minOpen);
}

export function yestStart() {
  return todaysStart().minus({ day: 1 });
}
export function yestEnd() {
  return yestStart().plus(dur);
}

export function todaysEnd() {
  return todaysStart().plus(dur);
}

export function pastDaysEnd() {
  return DateTime.utc() > todaysEnd();
}

export function pastDaysStart() {
  return DateTime.utc() > todaysStart();
}

// export function

export function _getDebateStart() {
  const m = DateTime.utc();
  const todayStart = todaysStart();
  return m >= yestEnd() && m <= todayStart // return !pastDaysEnd()
    ? todayStart
    : todayStart.plus({ day: 1 });
}

export function _getDebateEnd() {
  // return _getDebateStart().add(dur);
  const m = DateTime.utc();
  const yend = yestEnd();
  return m >= yestStart() && m <= yend // return !pastDaysEnd()
    ? yend
    : yend.plus({ day: 1 });
}

export function getDebateStart() {
  return _getDebateStart().toJSDate();
}

export function getDebateEnd() {
  return _getDebateEnd().toJSDate();
}
