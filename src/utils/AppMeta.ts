export function isLive() {
  const h = window.location.hostname;
  return (
    h.indexOf('test') === -1 &&
    h.indexOf('.dinnertable') === -1 &&
    h.indexOf('dinnertable.chat') !== -1
  );
}
