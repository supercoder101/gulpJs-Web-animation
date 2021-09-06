import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

import vs from './glsl/ButterflyPoints.vs';
import fs from './glsl/ButterflyPoints.fs';

const NUMBER = 30;
const INTERVAL = 8;

export default class ButterflyPoints extends THREE.Points {
  constructor() {
    // Define Geometry
    const geometry = new THREE.BufferGeometry();
    const baPosition = new THREE.BufferAttribute(new Float32Array(NUMBER * 3), 3);
    const baIsValid = new THREE.BufferAttribute(new Float32Array(NUMBER), 1);
    const baNumber = new THREE.BufferAttribute(new Uint16Array(NUMBER), 1);

    geometry.addAttribute('position', baPosition);
    geometry.addAttribute('isValid', baIsValid);
    geometry.addAttribute('number', baNumber);

    for (var i = 0; i < NUMBER; i++) {
      baNumber.setX(i, i);
    }

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        interval: {
          type: 'f',
          value: INTERVAL
        },
        time: {
          type: 'f',
          value: 0
        },
        numberAll: {
          type: 'f',
          value: NUMBER
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'ButterflyPoints';
    this.renderOrder = 10;
  }
  update(time, butterfly) {
    this.material.uniforms.time.value += time;

    for (var i = 0; i < NUMBER; i++) {
      const isValid = this.geometry.attributes.isValid.getX(i);
      const time = (
        this.material.uniforms.time.value
        + this.geometry.attributes.number.getX(i) / NUMBER * INTERVAL
      ) % INTERVAL;

      if (time >= INTERVAL * 0.9) {
        this.geometry.attributes.isValid.setX(i, 0);
      } else if (time <= INTERVAL * 0.9 && isValid == 0) {
        const radian1 = (Math.random() * -90 - 90) * Math.PI / 180;
        const radian2 = (Math.random() * -180) * Math.PI / 180;
        const radius = Math.random() * 20.0;
        const position = MathEx.spherical(radian1, radian2, radius);

        this.geometry.attributes.position.setXYZ(
          i,
          position[0] + butterfly.position.x - 10.0,
          position[1] * 0.2 + butterfly.position.y,
          position[2] * 0.5 + butterfly.position.z
        );
        this.geometry.attributes.isValid.setX(i, 1);
      }
    }
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.position.isValid = true;
  }
}
