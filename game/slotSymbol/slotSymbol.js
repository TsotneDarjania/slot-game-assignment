import * as THREE from "three";
import { gsap } from "gsap";

export class SlotSymbol {
  geometry;
  plane;
  tween;

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
    this.plane.material.transparent = true;
    this.plane.position.set(x, y, 0);
  }

  playWinAnimation(finishAnimation) {
    this.enable();

    let repeatCount = 0;
    if (this.tween) {
      this.tween.kill();
    }

    let isAlreadyFinished = false;

    this.tween = gsap.to(this.plane.scale, {
      yoyo: true,
      x: 1.09,
      y: 1.09,
      duration: 0.3,
      repeat: -1,
      ease: "linear",
      onRepeat: () => {
        repeatCount++;
        if (repeatCount === 2) {
          if (isAlreadyFinished) return;

          isAlreadyFinished = true;
          finishAnimation();
        }
      },
    });
  }

  stopPlayAnimation() {
    if (this.tween) {
      this.tween.kill();
      this.tween = null;
    }
    this.plane.scale.set(1, 1, 1);
  }

  disable() {
    this.plane.material.opacity = 0.5;
  }

  enable() {
    this.plane.material.opacity = 1;
  }
}
