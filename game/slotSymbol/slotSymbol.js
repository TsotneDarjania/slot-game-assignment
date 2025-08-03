import * as THREE from "three";

export class SlotSymbol {
  geometry;
  plane;

  constructor(x, y, width, height, material) {
    this.geometry = new THREE.PlaneGeometry(width, height);

    const maskedMaterial = material.clone();
    maskedMaterial.stencilWrite = true;
    maskedMaterial.stencilRef = 1;
    maskedMaterial.stencilFunc = THREE.EqualStencilFunc;
    maskedMaterial.stencilFail = THREE.KeepStencilOp;
    maskedMaterial.stencilZFail = THREE.KeepStencilOp;
    maskedMaterial.stencilZPass = THREE.KeepStencilOp;

    this.plane = new THREE.Mesh(this.geometry, maskedMaterial);
    this.plane.position.set(x, y, 0);
  }
}
