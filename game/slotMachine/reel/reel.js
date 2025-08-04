import * as THREE from "three";
import { gsap } from "gsap";

import { gameData } from "../../../gameData.js";
import { SlotSymbol } from "../../slotSymbol/slotSymbol.js";
import { getRandomIntNumber } from "../../helper.js";

export class Reel extends THREE.Group {
  paddingBeetveenSynbols;
  state = "readyForSpin";

  symbolWidth;
  symbolHeight;

  resultCombination = [];

  spinIsFinishCallback;

  resultSymbols = [];

  constructor(scene, x, width, height) {
    super();

    this.symbolWidth = width;
    this.symbolHeight = width;

    this.position.x = x;

    this.scene = scene;
    this.width = width;
    this.height = height;
    this.paddingBeetveenSynbols =
      this.height / (gameData.symbolsCountPerReel - 1);

    this.addInitSymbols();
    this.addNextSymbols();
  }

  addInitSymbols() {
    let posY = this.height / 2;

    for (let i = 0; i < gameData.symbolsCountPerReel; i++) {
      const symbol = new SlotSymbol(
        -this.symbolWidth / 2,
        posY,
        this.symbolWidth,
        this.symbolHeight,
        this.scene._materials.get(this.getRandomSymbolMaterialKey())
      );

      posY -= this.paddingBeetveenSynbols;
      this.add(symbol.plane);
    }
  }

  addNextSymbols(isLastSpin) {
    let posY =
      this.height / 2 + this.paddingBeetveenSynbols + Math.abs(this.position.y);

    for (let i = 0; i < gameData.symbolsCountPerReel; i++) {
      const symbol = new SlotSymbol(
        -this.symbolWidth / 2,
        posY,
        this.symbolWidth,
        this.symbolHeight,
        isLastSpin
          ? this.scene._materials.get(
              this.getTargetSymbolMaterialKey(this.resultCombination[i])
            )
          : this.scene._materials.get(this.getRandomSymbolMaterialKey())
      );
      posY += this.paddingBeetveenSynbols;
      this.add(symbol.plane);

      if (isLastSpin) {
        this.resultSymbols.push(symbol);
      }
    }
  }

  getTargetSymbolMaterialKey(symbolID) {
    return Object.values(gameData.assets.symbols).find(
      (symbol) => symbol.id === symbolID
    ).key;
  }

  getRandomSymbolMaterialKey() {
    const objectKeys = Object.keys(gameData.assets.symbols);
    const randomKey = objectKeys[getRandomIntNumber(0, objectKeys.length - 1)];

    return gameData.assets.symbols[randomKey].key;
  }

  destroyOldSymbols() {
    for (let i = 0; i < gameData.symbolsCountPerReel; i++) {
      this.remove(this.children[0]);
    }
  }

  spin(y, duration, ease) {
    gsap.to(this.position, {
      y,
      duration,
      ease,
      onComplete: () => {
        this.destroyOldSymbols();

        if (this.state === "spin") {
          this.addNextSymbols(false);
          this.spin(
            -this.height - this.paddingBeetveenSynbols + this.position.y,
            0.12,
            "linear"
          );
        }

        if (this.state === "startStop") {
          this.addNextSymbols(true);
          this.spin(
            -this.height - this.paddingBeetveenSynbols + this.position.y,
            0.5,
            "back.out"
          );

          this.state = "lastSpin";
          return;
        }

        if (this.state === "lastSpin") {
          this.state = "stop";
          this.reset();
        }
      },
    });
  }

  startSpin(callback) {
    if (this.state !== "readyForSpin") return;
    this.resultSymbols = [];
    this.spinIsFinishCallback = callback;
    this.state = "spin";
    this.spin(-this.height - this.paddingBeetveenSynbols, 0.5, "back.in");
  }

  stopSpin(combination) {
    this.resultCombination = combination;
    this.state = "startStop";
  }

  reset() {
    this.children.forEach((slotSymbol) => {
      slotSymbol.position.y += this.position.y;
    });

    this.position.y = 0;

    this.addNextSymbols();

    this.state = "readyForSpin";
    this.spinIsFinishCallback();
  }

  showSymbolAnimation(symbolIndex, finishAnimation) {
    this.resultSymbols[symbolIndex].playWinAnimation(() => {
      finishAnimation();
    });
  }
}
