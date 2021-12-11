// Check if the value is empty
const isEmpty = (value) => ['null', 'undefined', '[]', '{}', '""'].includes(JSON.stringify(value));

const mapIndexed = (callback) => (list) => list.map(callback);

export {
  isEmpty,
  mapIndexed,
};
