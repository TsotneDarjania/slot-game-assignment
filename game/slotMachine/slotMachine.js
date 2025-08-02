import * as THREE from "three";
import { gameData } from "../../gameData.js";
import { Reel } from "./reel/reel.js";

export class SlotMachine extends THREE.Group {
  reels = [];
  reelWidth = 120;
  reelHeight = 300;

  constructor(scene, x, y, width, height) {
    super();

    this.position.x = x;
    this.position.y = y;
    this.width = width;
    this.height = height;

    this.scene = scene;

    this.init();
  }

  init() {
    this.addReels();

    this.scene.add(this);
  }

  addReels() {
    let posX = -this.width / 2 + this.reelWidth / 2;
    const padding = this.width / (gameData.reelsCount - 1);

    for (let i = 0; i < gameData.reelsCount; i++) {
      const reel = new Reel(this.scene, posX, this.reelWidth, this.reelHeight);
      posX += padding;

      this.add(reel);
      this.reels.push(reel);
    }
  }

  startSpin() {
    this.reels.forEach((reel) => reel.startSpin());
  }

  stopSpin() {
    this.reels.forEach((reel) => reel.stopSpin());
  }
}
