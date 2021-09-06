import * as THREE from 'three';
import easing from 'easing-js';
import MathEx from 'js-util/MathEx';

const positions = {
  horizontal: [
    new THREE.Vector3(0, -15, -10),
    new THREE.Vector3(0, -14, -15),
    new THREE.Vector3(0, 4, 80),
  ],
  vertical: [
    new THREE.Vector3(0, -15, -10),
    new THREE.Vector3(0, -14, -15),
    new THREE.Vector3(0, 0, 80),
  ]
};

export default class Aurora extends THREE.Mesh {
  constructor(texture) {
    // Define Geometry
    const geometry = new THREE.PlaneBufferGeometry(80, 40);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 't',
          value: 0,
        },
        texture: {
          type: 't',
          value: texture
        },
        opacity: {
          type: 'f',
          value: 0,
        },
      },
      vertexShader: require('./glsl/aurora.vs'),
      fragmentShader: require('./glsl/aurora.fs'),
      transparent: true,
    });

    // Create Object3D
    super(geometry, material);
    this.position.set(0, -16, -5);
    this.name = 'Aurora';
    this.mode = 0;
    this.timeMove = 0;
    this.timeFade = -0.3;
    this.positionPrev = this.position.clone();
    this.positionNext = this.position.clone();
    this.isVertical = false;
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
  }
  goToIndex() {
    this.mode = 3;
    this.timeMove = 0;
    this.timeFade = 0;
    this.setPosition();
  }
  render(time) {
    if (this.isShown === false) return;
    this.material.uniforms.time.value += time;
    this.timeMove += time / 3;
    this.position.lerpVectors(
      this.positionPrev, this.positionNext,
      easing.easeInOutQuart(MathEx.clamp(this.timeMove, 0, 1))
    );
    if (this.mode < 3) {
      this.timeFade += time / 3;
      this.material.uniforms.opacity.value = MathEx.clamp(this.timeFade, 0, 1);
    } else {
      this.timeFade += time / 2.5;
      this.material.uniforms.opacity.value = 1.0 - MathEx.clamp(this.timeFade, 0, 1);
    }
  }
  resize(resolution) {
    this.isVertical = resolution.x < resolution.y;
    this.setPosition();
  }
  setPosition() {
    const key = (this.isVertical) ? 'vertical' : 'horizontal';
    switch (this.mode) {
      case 0:
      case 1:
        this.position.copy(positions[key][0]);
        this.positionPrev.copy(positions[key][0]);
        this.positionNext.copy(positions[key][0]);
        break;
      case 2:
        this.position.copy(positions[key][0]);
        this.positionPrev.copy(positions[key][0]);
        this.positionNext.copy(positions[key][1]);
        break;
      case 3:
        this.position.copy(positions[key][1]);
        this.positionPrev.copy(positions[key][1]);
        this.positionNext.copy(positions[key][2]);
        break;
      default:
        break;
    }
  }
}
