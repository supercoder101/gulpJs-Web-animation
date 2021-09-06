import * as THREE from 'three';
import easing from 'easing-js';
import MathEx from 'js-util/MathEx';

const positions = {
  horizontal: [
    new THREE.Vector3(-18, 0, 100),
    new THREE.Vector3(-9, -8.1, 49),
    new THREE.Vector3(-12, 0, 110),
  ],
  vertical: [
    new THREE.Vector3(-14, 0, 100),
    new THREE.Vector3(-5, -8.1, 49),
    new THREE.Vector3(-7, 0, 110),
  ]
};

export default class Guy extends THREE.Mesh {
  constructor(texture) {
    // Define Geometry
    const geometry = new THREE.PlaneBufferGeometry(20, 20);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        texture: {
          type: 't',
          value: texture
        },
      },
      vertexShader: require('./glsl/guy.vs'),
      fragmentShader: require('./glsl/guy.fs'),
      transparent: true,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Guy';
    this.mode = 0;
    this.timeMove = 0;
    this.timeFade = 0;
    this.positionPrev = this.position.clone();
    this.positionNext = this.position.clone();
    this.isShown = false;
    this.isVertical = false;
  }
  goToScene2() {
    this.mode = 2;
    this.timeMove = 0;
    this.isShown = true;
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
    this.timeMove += time / 3;
    this.position.lerpVectors(
      this.positionPrev, this.positionNext,
      easing.easeInOutQuart(MathEx.clamp(this.timeMove, 0, 1))
    );
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
