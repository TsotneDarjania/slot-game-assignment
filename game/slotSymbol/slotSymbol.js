import * as THREE from "three";

export class SlotSymbol {
  geometry;
  plane;

  constructor(x, y, width, height, material) {
    this.geometry = new THREE.PlaneGeometry(width, height);

    this.plane = new THREE.Mesh(this.geometry, material);
    this.plane.position.set(x - width / 2, y, 0);
  }
}
