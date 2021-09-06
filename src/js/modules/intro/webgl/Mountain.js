import * as THREE from 'three';
import easing from 'easing-js';
import MathEx from 'js-util/MathEx';

const positions = {
  horizontal: [
    new THREE.Vector3(0, -16, 24),
    new THREE.Vector3(0, -20, 12),
    new THREE.Vector3(0, -23, -6),
    new THREE.Vector3(0, -2, 110),
  ],
  vertical: [
    new THREE.Vector3(4.4, -16, 24),
    new THREE.Vector3(4.4, -20, 12),
    new THREE.Vector3(4.4, -23, -6),
    new THREE.Vector3(4.4, -2, 110),
  ]
};

export default class Mountain extends THREE.Mesh {
  constructor(texture1, texture2) {
    // Define Geometry
    const geometry = new THREE.PlaneBufferGeometry(80, 40);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        texture1: {
          type: 't',
          value: texture1
        },
        texture2: {
          type: 't',
          value: texture2
        },
        time: {
          type: 'f',
          value: 0,
        },
        opacity: {
          type: 'f',
          value: 0,
        },
        darkFilter: {
          type: 'f',
          value: 0,
        },
      },
      vertexShader: require('./glsl/mountain.vs'),
      fragmentShader: require('./glsl/mountain.fs'),
      transparent: true,
    });

    // Create Object3D
    super(geometry, material);
    this.position.set(0, -16, 24);
    this.name = 'Mountain';
    this.mode = 0;
    this.timeMove = 0;
    this.timeFade = 0;
    this.timeDarkFilter = 0;
    this.positionPrev = this.position.clone();
    this.positionNext = this.position.clone();
    this.scalePrev = new THREE.Vector3(1, 1, 1);
    this.scaleNext = new THREE.Vector3(1, 1, 1);
    this.isShown = false;
  }
  show() {
    this.mode = 1;
    this.timeMove = 0;
    this.isShown = true;
    this.setPosition();
  }
  goToScene2() {
    this.mode = 2;
    this.timeMove = 0;
    this.setPosition();
    this.scaleNext = new THREE.Vector3(1, 0.71, 1);
  }
  goToIndex() {
    this.mode = 3;
    this.timeMove = 0;
    this.setPosition();
    this.scalePrev = new THREE.Vector3(1, 0.71, 1);
    this.scaleNext = new THREE.Vector3(1, 0.71, 1);
  }
  render(time) {
    if (this.isShown === false) return;
    this.timeMove += time / 3;
    this.position.lerpVectors(
      this.positionPrev, this.positionNext,
      easing.easeInOutQuart(MathEx.clamp(this.timeMove, 0, 1))
    );
    this.scale.lerpVectors(
      this.scalePrev, this.scaleNext,
      easing.easeInOutQuart(MathEx.clamp(this.timeMove, 0, 1))
    );
    this.timeFade += time / 1.5;
    this.material.uniforms.opacity.value = MathEx.clamp(this.timeFade, 0, 1);
    if (this.mode === 2) {
      this.timeDarkFilter += time / 1.5;
      this.material.uniforms.darkFilter.value = MathEx.clamp(this.timeDarkFilter, 0, 1);
    }
    this.material.uniforms.time.value += time;
  }
  resize(resolution) {
    this.isVertical = resolution.x < resolution.y;
    this.setPosition();
  }
  setPosition() {
    const key = (this.isVertical) ? 'vertical' : 'horizontal';
    switch (this.mode) {
      case 0:
        this.position.copy(positions[key][0]);
        this.positionPrev.copy(positions[key][0]);
        this.positionNext.copy(positions[key][0]);
        break;
      case 1:
        this.position.copy(positions[key][0]);
        this.positionPrev.copy(positions[key][0]);
        this.positionNext.copy(positions[key][1]);
        break;
      case 2:
        this.position.copy(positions[key][1]);
        this.positionPrev.copy(positions[key][1]);
        this.positionNext.copy(positions[key][2]);
        break;
      case 3:
        this.position.copy(positions[key][2]);
        this.positionPrev.copy(positions[key][2]);
        this.positionNext.copy(positions[key][3]);
        break;
      default:
        break;
    }
  }
}
