import * as THREE from "three";
import { SlotSymbol } from "./slotSymbol/slotSymbol.js";
import { AssetsLoader } from "./assetsLoader/assetsLoader.js";
import { gameData } from "../gameData.js";

export class Game {
  width;
  height;

  scene;
  camera;
  renderer;
  assetsLoader;

  constructor(width, height) {
    this.width = width;
    this.height = height;

    this.setUp();
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.width, this.height);
  }

  createCamera() {
    const aspect = this.width / this.height;

    const viewHeight = this.height;
    const viewWidth = viewHeight * aspect;

    const left = -viewWidth / 2;
    const right = viewWidth / 2;
    const top = viewHeight / 2;
    const bottom = -viewHeight / 2;
    const near = 0;
    const far = 20;

    this.camera = new THREE.OrthographicCamera(
      left,
      right,
      top,
      bottom,
      near,
      far
    );
    this.camera.zoom = 1;
    this.camera.position.z = 5;
  }

  createAssetsLoader() {
    this.assetsLoader = new AssetsLoader();
  }

  async setUp() {
    this.scene = new THREE.Scene();

    this.createRenderer();
    this.createCamera();
    this.createAssetsLoader();

    await this.assetsLoader.startLoadAssets();

    this.start();
    this.update();

    this.renderer.setAnimationLoop(this.update.bind(this));
  }

  //run only once
  start() {
    document.body.appendChild(this.renderer.domElement);

    const s = new SlotSymbol(
      90,
      90,
      this.assetsLoader.loadedMaterials.get(gameData.assets.symbols.apple.key)
    );
    this.scene.add(s.plane);

    this.renderer.render(this.scene, this.camera);
  }

  //run continuously
  update() {
    // this.renderer.render(this.scene, this.camera);
  }

  async loadAssets() {
    return new Promise((res, rej) => {});
  }
}
