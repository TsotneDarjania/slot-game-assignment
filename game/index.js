import * as THREE from "three";
import { AssetsLoader } from "./assetsLoader/assetsLoader.js";
import { SlotMachine } from "./slotMachine/slotMachine.js";
import { UI } from "./ui/ui.js";
import { getSpinResult } from "../mock/mockServer.js";
import { percentage } from "./helper.js";

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

  isStopCommandByUser = false;
  isMinTimePassedBeforeStop = false;

  autoStopTime = 4000;
  minTimeBeforeStop = 0;

  minTimeOut;
  autoStopTimeOut;

  //GameObjects
  slotMachine;

  result;

  constructor(width, height) {
    this.width = width;
    this.height = height;

    this.setUp();
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ stencil: true });
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
      handleStopSpin: this.handleStopSpin.bind(this),
    });
  }

  //run continuously
  update() {
    this.renderer.render(this.scene, this.camera);
  }

  addSlotMachine() {
    const width = window.innerWidth > 580 ? 410 : 200;
    this.slotMachine = new SlotMachine(this.scene, 0, 0, width, width);
  }

  //handlers
  async handleStartSpin() {
    this.slotMachine.startSpin(this.handleSpinIsFinished.bind(this));

    this.ui.hideSpinButton();
    this.ui.showStopButton();

    this.minTimeOut = setTimeout(() => {
      this.isMinTimePassedBeforeStop = true;
      if (this.isStopCommandByUser && this.result) {
        console.log("stop by user");
        this.slotMachine.stopSpin(this.result);
      }
    }, this.minTimeBeforeStop);

    this.autoStopTimeOut = setTimeout(() => {
      if (this.result) {
        console.log("auto stop");
        this.slotMachine.stopSpin(this.result);
      }
    }, this.autoStopTime);

    this.result = await getSpinResult();
    console.log(this.result);

    if (this.isMinTimePassedBeforeStop && this.isStopCommandByUser) {
      console.log("stop by user");
      this.slotMachine.stopSpin(this.result);
    }
  }

  handleStopSpin() {
    this.ui.disableStopButton();
    this.isStopCommandByUser = true;

    if (this.isMinTimePassedBeforeStop && this.result) {
      console.log("stop by user");
      this.slotMachine.stopSpin(this.result);
    }
  }

  handleSpinIsFinished() {
    clearTimeout(this.minTimeOut);
    clearTimeout(this.autoStopTimeOut);

    this.ui.disableStopButton();

    if (this.result.winningLines.length > 0) {
      this.slotMachine.showWinningLines(this.result.winningLines, () => {
        console.log("Finish Selebration");

        this.resetHeld();
      });
    } else {
      this.resetHeld();
    }
  }

  resetHeld() {
    this.result = null;

    this.isStopCommandByUser = false;

    this.ui.hideStopButton();
    this.ui.showSpinButton();
    this.ui.enableStopButton();
  }
}
