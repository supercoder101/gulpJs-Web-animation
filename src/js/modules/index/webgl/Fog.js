import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

import vs from './glsl/Fog.vs';
import fs from './glsl/Fog.fs';

export default class Fog extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.PlaneBufferGeometry(400, 400);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
        fogTex: {
          type: 't',
          value: null
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true,
      depthWrite: false,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Fog';
  }
  start(fogTex) {
    this.material.uniforms.fogTex.value = fogTex;
  }
  update(time) {
    this.material.uniforms.time.value += time;
  }
}
