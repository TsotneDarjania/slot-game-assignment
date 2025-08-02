import * as THREE from "three";
import { gsap } from "gsap";

import { gameData } from "../../../gameData.js";
import { SlotSymbol } from "../../slotSymbol/slotSymbol.js";

export class Reel extends THREE.Group {
  paddingBeetveenSynbols;
  state = "readyForSpin";

  symbolHeight;

  constructor(scene, x, width, height) {
    super();

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
        0,
        posY,
        this.width,
        this.width,
        this.scene._materials.get(gameData.assets.symbols.apple.key)
      );
      posY -= this.paddingBeetveenSynbols;
      this.add(symbol.plane);
    }
  }

  addNextSymbols() {
    let posY =
      this.height / 2 + this.paddingBeetveenSynbols + Math.abs(this.position.y);

    for (let i = 0; i < gameData.symbolsCountPerReel; i++) {
      const symbol = new SlotSymbol(
        0,
        posY,
        this.width,
        this.symbolHeight,
        this.scene._materials.get(gameData.assets.symbols.apple.key)
      );
      posY += this.paddingBeetveenSynbols;
      this.add(symbol.plane);
    }
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
          this.addNextSymbols();
          this.spin(
            -this.height - this.paddingBeetveenSynbols + this.position.y,
            0.2,
            "linear"
          );
        }

        if (this.state === "startStop") {
          this.addNextSymbols();
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

  startSpin() {
    if (this.state !== "readyForSpin") return;
    this.state = "spin";
    this.spin(-this.height - this.paddingBeetveenSynbols, 0.5, "back.in");
  }

  stopSpin() {
    this.state = "startStop";
  }

  reset() {
    this.position.y = 0;

    const symbols = this.children;
    let posY = this.height / 2;

    for (let i = 0; i < symbols.length; i++) {
      symbols[i].position.y = posY;
      posY -= this.paddingBeetveenSynbols;
    }

    this.state = "readyForSpin";

    this.addNextSymbols();
  }
}
