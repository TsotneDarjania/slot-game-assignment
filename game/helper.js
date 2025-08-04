export function getRandomIntNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function percentage(percent, total) {
  return (percent / 100) * total;
}
