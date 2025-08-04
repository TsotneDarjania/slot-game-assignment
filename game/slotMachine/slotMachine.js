import * as THREE from "three";
import { gameData } from "../../gameData.js";
import { Reel } from "./reel/reel.js";

export class SlotMachine extends THREE.Group {
  reels = [];

  state = "default";

  spinDeleyBetweenReels = 150;

  constructor(scene, x, y, width, height) {
    super();

    this.position.set(x, y, 0);
    this.width = width;
    this.height = height;

    this.scene = scene;

    this.init();
  }

  init() {
    this.addStencilMask();
    this.addReels();

    this.scene.add(this);
  }

  addStencilMask() {
    const extraSpace = 20;

    const maskGeometry = new THREE.PlaneGeometry(
      this.width + this.width / gameData.reelsCount + extraSpace,
      this.height + this.width / gameData.reelsCount + extraSpace
    );
    const maskMaterial = new THREE.MeshBasicMaterial({
      colorWrite: false,
      depthWrite: false,
      stencilWrite: true,
      stencilRef: 1,
      stencilFunc: THREE.AlwaysStencilFunc,
      stencilZPass: THREE.ReplaceStencilOp,
    });

    const mask = new THREE.Mesh(maskGeometry, maskMaterial);
    mask.position.set(0, 0, -1);
    this.add(mask);
  }

  addReels() {
    const symbolWidth = this.width / gameData.reelsCount;

    let posX = -this.width / 2 + symbolWidth / 2;
    const padding = this.width / (gameData.reelsCount - 1);

    for (let i = 0; i < gameData.reelsCount; i++) {
      const reel = new Reel(this.scene, posX, symbolWidth, this.height);
      posX += padding;

      this.add(reel);
      this.reels.push(reel);
    }
  }

  startSpin(finishCallback) {
    this.enableAllSymbol();
    let finishReelsCount = 0;

    this.state = "spinning";

    this.reels.forEach((reel, index) => {
      // Stop Previous Animations
      reel.resultSymbols.forEach((symbol) => symbol.stopPlayAnimation());

      setTimeout(() => {
        reel.startSpin(() => {
          finishReelsCount++;
          if (finishReelsCount === gameData.reelsCount) {
            finishCallback();
            this.state = "default";
          }
        });
      }, index * this.spinDeleyBetweenReels);
    });
  }

  async showWinningLines(lines, finishAnimation) {
    this.disableAllSymbol();
    for (let i = 0; i < lines.length; i++) {
      await this.playLineAnimation(lines[i]);
    }

    finishAnimation();
  }

  disableAllSymbol() {
    for (let i = 0; i < this.reels.length; i++) {
      this.reels[i].resultSymbols.forEach((symbol) => {
        symbol.disable();
      });
    }
  }

  enableAllSymbol() {
    for (let i = 0; i < this.reels.length; i++) {
      this.reels[i].resultSymbols.forEach((symbol) => {
        symbol.enable();
      });
    }
  }

  playLineAnimation(line) {
    let animatedSymbolsCount = 0;

    return new Promise((res, rej) => {
      Object.entries(line).forEach(([reelIndex, symbolIndex]) => {
        this.reels[reelIndex].showSymbolAnimation(symbolIndex, () => {
          animatedSymbolsCount++;
          if (animatedSymbolsCount === gameData.symbolsCountPerReel) {
            res();
          }
        });
      });
    });
  }

  stopSpin(result) {
    if (this.state === "stop-is-started") return;

    this.state = "stop-is-started";

    this.reels.forEach((reel, index) => {
      setTimeout(() => {
        reel.stopSpin(result.combination[index]);
      }, index * this.spinDeleyBetweenReels);
    });
  }
}
