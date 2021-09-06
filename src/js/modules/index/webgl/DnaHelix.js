import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

export default class DnaHelix {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      pixelRatio: {
        type: 'f',
        value: window.devicePixelRatio
      },
    };
    this.obj;
    this.createObj();
  }
  createObj() {
    // Define Geometry
    const geometry = new THREE.BufferGeometry();

    // Define attributes of the instancing geometry
    const xMax = 160;
    const yMax = 60;
    const amount = xMax * yMax;
    const baPositions = new THREE.BufferAttribute(new Float32Array(amount * 3), 3);
    const baIsInsides = new THREE.BufferAttribute(new Float32Array(amount), 1);

    for (var y = 0; y < yMax; y++) {
      const py = y / yMax * 2 - 1;
      for (var x = 0; x < xMax; x++) {
        const px = x / xMax * 2 - 1;
        const index = y * xMax + x;
        baPositions.setXYZ(
          index,
          px * 160,
          Math.sin(MathEx.radians(py * 45)) * 20 + Math.cos(MathEx.radians(px * 180)) * -14,
          Math.cos(MathEx.radians(py * 45)) * 20
        );
        baIsInsides.setX(index, MathEx.step(Math.abs(y / yMax * 2 - 1), 0.5));
      }
    }
    geometry.addAttribute('position', baPositions);
    geometry.addAttribute('isInside', baIsInsides);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/dnaHelix.vs'),
      fragmentShader: require('./glsl/dnaHelix.fs'),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // Create Object3D
    this.obj = new THREE.Points(geometry, material);
    this.obj.name = 'DNA Herix';
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
