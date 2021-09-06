import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

import vs from './glsl/Butterfly.vs';
import fs from './glsl/Butterfly.fs';

export default class Butterfly extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.PlaneBufferGeometry(40, 40, 24, 12);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
        texture: {
          type: 't',
          value: null
        },
        delay: {
          type: 'f',
          value: Math.random()
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
      side: THREE.DoubleSide,
      transparent: true,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Butterfly';

    this.rotation.set(
      MathEx.radians(-45),
      0,
      0
    );
  }
  start(i, texture) {
    this.material.uniforms.texture.value = texture;
    this.position.set(
      (Math.random() * 2 - 1) * 70,
      (Math.random() * 2 - 1) * 10,
      this.position.z = 60 * (i + 1) + 50
    )
  }
  update(time) {
    this.material.uniforms.time.value += time;
    this.position.z -= 0.4;
    if (this.position.z <= -200) {
      this.position.set(
        (Math.random() * 2 - 1) * 70,
        (Math.random() * 2 - 1) * 10,
        200
      )
    }
  }
}
