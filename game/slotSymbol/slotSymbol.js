import * as THREE from "three";

export class SlotSymbol {
  geometry;
  plane;

  constructor(width, height, material) {
    this.geometry = new THREE.PlaneGeometry(width, height);

    this.plane = new THREE.Mesh(this.geometry, material);
  }
}
