import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

import vs from './glsl/Triangles.vs';
import fs from './glsl/Triangles.fs';

export default class Triangles2 extends THREE.Mesh {
  constructor() {
    // Define Geometries
    const geometry = new THREE.InstancedBufferGeometry();
    const baseGeometry = new THREE.TetrahedronBufferGeometry(12, 0);

    // Copy attributes of the base Geometry to the instancing Geometry
    geometry.copy(baseGeometry);

    // Define attributes of the instancing geometry
    const num = 40;
    const ibaStartPositions = new THREE.InstancedBufferAttribute(new Float32Array(num * 3), 3);
    const ibaEndPositions = new THREE.InstancedBufferAttribute(new Float32Array(num * 3), 3);
    const ibaRotates = new THREE.InstancedBufferAttribute(new Float32Array(num * 3), 3);
    const ibaDurations = new THREE.InstancedBufferAttribute(new Float32Array(num), 1);
    const ibaDelays = new THREE.InstancedBufferAttribute(new Float32Array(num), 1);
    for (var i = 0, ul = num; i < ul; i++) {
      const zBase = (Math.random() * 2 - 1) * 100;
      ibaStartPositions.setXYZ(
        i,
        200,
        180 + (Math.random() * 2 - 1) * 50,
        zBase
      );
      ibaEndPositions.setXYZ(
        i,
        -200,
        50 + (Math.random() * 2 - 1) * 50,
        zBase
      );
      ibaRotates.setXYZ(
        i,
        MathEx.radians(Math.random() * 360),
        MathEx.radians(Math.random() * 360),
        MathEx.radians(Math.random() * 360)
      );
      const duration = 20 + Math.random() * 10;
      ibaDurations.setXYZ(i, duration);
      ibaDelays.setXYZ(i, Math.random() * duration);
    }
    geometry.addAttribute('iStartPosition', ibaStartPositions);
    geometry.addAttribute('iEndPosition', ibaEndPositions);
    geometry.addAttribute('iRotate', ibaRotates);
    geometry.addAttribute('iDuration', ibaDurations);
    geometry.addAttribute('iDelay', ibaDelays);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
      flatShading: true,
      transparent: true,
      depthWrite: false,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Triangles2';
    this.frustumCulled = false;
  }
  start() {
  }
  update(time) {
    this.material.uniforms.time.value += time;
  }
}
