export function getSpinResult() {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res({
        winninLines: [],
        combination: [
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 1],
        ],
      });
    }, 1000);
  });
}
