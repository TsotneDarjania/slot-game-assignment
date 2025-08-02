import * as THREE from "three";
import { SlotSymbol } from "./slotSymbol/slotSymbol.js";
import { AssetsLoader } from "./assetsLoader/assetsLoader.js";
import { gameData } from "../gameData.js";
import { SlotMachine } from "./slotMachine/slotMachine.js";
import { UI } from "./ui/ui.js";

export class Game {
  //Parameters
  width;
  height;

  //Core
  scene;
  camera;
  renderer;
  assetsLoader;
  ui;

  //GameObjects
  slotMachine;

  constructor(width, height) {
    this.width = width;
    this.height = height;

    this.setUp();
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.width, this.height);
    document.body.appendChild(this.renderer.domElement);
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

  createUI() {
    this.ui = new UI();
  }

  async setUp() {
    this.scene = new THREE.Scene();

    this.createRenderer();
    this.createCamera();
    this.createAssetsLoader();
    this.createUI();

    await this.assetsLoader.startLoadAssets();
    //Configure scene with loaded materials
    this.scene._materials = this.assetsLoader.loadedMaterials;

    this.start();
    this.renderer.setAnimationLoop(this.update.bind(this));
  }

  //run only once
  start() {
    this.ui.display();
    this.addSlotMachine();
    this.ui.addEventListeners({
      handleStartSpin: this.handleStartSpin.bind(this),
    });
  }

  //run continuously
  update() {
    this.renderer.render(this.scene, this.camera);
  }

  addSlotMachine() {
    this.slotMachine = new SlotMachine(this.scene, 0, 0, 400, 400);
  }

  //handlers
  handleStartSpin() {
    this.slotMachine.startSpin();
  }
}
