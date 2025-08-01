import * as THREE from "three";
import { gameData } from "../../gameData.js";

export class AssetsLoader {
  loaderManager;
  textureLoader;
  loadedMaterials = new Map();

  constructor() {
    this.loaderManager = new THREE.LoadingManager();
    this.textureLoader = new THREE.TextureLoader(this.loaderManager);
  }

  async startLoadAssets() {
    Object.values(gameData.assets.symbols).forEach((asset) => {
      const texture = this.textureLoader.load(`/assets/${asset.fileName}`);

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });

      this.loadedMaterials.set(asset.key, material);
    });

    await new Promise((res, rej) => {
      this.loaderManager.onLoad = () => {
        res();
      };
      this.loaderManager.onError = (url) => {
        rej(`Error loading: ${url}`);
      };
    });
  }
}

// loader;
// textures = new Map();
// constructor() {
//   this.loader = new THREE.TextureLoader();
// }
// async startLoadAssets() {
//   const promises = gameData.assets.symbols.map((filename) => {
//     const key = filename.split(".")[0];
//     return new Promise((res, rej) => {
//       this.loader.load(
//         `/assets/${filename}`,
//         (texture) => res({ key, texture }),
//         undefined,
//         () => rej(`texture ${filename} can not load...`)
//       );
//     });
//   });
//   const loadedTextures = await Promise.all(promises);
//   console.log(loadedTextures);
//   for (const { key, texture } of loadedTextures) {
//     this.textures.set(key, texture);
//   }
// }
