import { getRandomIntNumber } from "../game/helper.js";
import { gameData } from "../gameData.js";

export function getSpinResult() {
  const result = generateResult();

  return new Promise((res, rej) => {
    setTimeout(() => {
      res({
        winningLines: result.winningLines,
        combination: result.combination,
      });
    }, 0);
  });
}

function generateResult() {
  const combination = [generateReel(), generateReel(), generateReel()];
  // const combination = [
  //   [1, 1, 4],
  //   [3, 1, 2],
  //   [4, 1, 1],
  // ];
  const winningLines = generateWinningLines(combination);

  return {
    combination,
    winningLines,
  };
}

function generateWinningLines(combination) {
  const winningLines = [];
  gameData.winningLines.forEach((correctLine) => {
    let first;
    let isWin = true;
    correctLine.forEach((checkIndex, reelIndex) => {
      if (first) {
        if (first !== combination[reelIndex][checkIndex]) {
          isWin = false;
        }
      } else {
        first = combination[reelIndex][checkIndex];
      }
    });

    if (isWin) {
      const obj = {};
      correctLine.forEach((symbol, reel) => {
        obj[reel] = symbol;
      });
      winningLines.push(obj);
    }
  });

  return winningLines;
}

function generateReel() {
  const reel = [];
  for (let i = 0; i < gameData.symbolsCountPerReel; i++) {
    reel.push(getRandomIntNumber(1, 6));
  }

  return reel;
}
