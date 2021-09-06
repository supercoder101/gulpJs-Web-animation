import * as THREE from 'three';

import Aurora from './Aurora';
import Guy from './Guy';
import Mountain from './Mountain';
import PromiseTextureLoader from '../../common/PromiseTextureLoader';

export default class WebGLContent {
  constructor(contents, modules) {
    this.modules = modules;
    this.resolution = new THREE.Vector2();
    this.canvas = modules.webgl.canvas;
    this.renderer = modules.webgl.renderer;
    this.scene = modules.webgl.scene;
    this.camera = modules.webgl.camera;
    this.clock = modules.webgl.clock;
    this.content = contents.querySelector('.p-intro-content');
    this.aurora;
    this.guy;
    this.mountain;
    this.isRendering = false;
  }
  async init() {
    this.canvas.classList.add('p-intro-canvas-webgl');
    this.content.append(this.canvas);
    this.isRendering = true;

    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.camera.aspect = 1;
    this.camera.far = 1000;
    this.camera.setFocalLength(50);
    this.camera.lookAt(new THREE.Vector3());
    this.camera.position.set(0, 0, 100);

    await Promise.all(
      [
        PromiseTextureLoader('/img/intro/mask_aurora.png'),
        PromiseTextureLoader('/img/intro/guy.png'),
        PromiseTextureLoader('/img/intro/mountain.png'),
        PromiseTextureLoader('/img/intro/mountain_mask.png'),
      ]
    ).then(response => {
      this.aurora = new Aurora(response[0]);
      this.guy = new Guy(response[1]);
      this.mountain = new Mountain(response[2], response[3]);
    });

    this.scene.add(this.aurora);
    this.scene.add(this.guy);
    this.scene.add(this.mountain);

    this.resize();
  }
  destroy() {
    this.clock.stop();
    this.canvas.classList.remove('p-intro-canvas-webgl');
    this.scene.remove(this.aurora);
    this.scene.remove(this.guy);
    this.scene.remove(this.mountain);
    this.isRendering = false;
  }
  start() {
    this.clock.start();
    this.renderLoop();
  }
  async show() {
    this.aurora.show();
    this.mountain.show();
    setTimeout(() => {
      return;
    }, 5000);
  }
  goToScene2() {
    this.aurora.goToScene2();
    this.mountain.goToScene2();
    this.guy.goToScene2();
  }
  goToIndex() {
    this.aurora.goToIndex();
    this.mountain.goToIndex();
    this.guy.goToIndex();
  }
  render() {
    const time = this.clock.getDelta();
    this.aurora.render(time);
    this.guy.render(time);
    this.mountain.render(time);
    this.renderer.render(this.scene, this.camera);
  };
  renderLoop() {
    this.render();
    if (this.isRendering === false) return;
    requestAnimationFrame(() => {
      this.renderLoop();
    });
  };
  resizeCamera() {
    this.camera.updateProjectionMatrix();
    if (this.resolution.x > this.resolution.y) {
      this.camera.setViewOffset(
        this.resolution.x, this.resolution.x,
        0, 0,
        this.resolution.x, this.resolution.x
      );
    } else {
      this.camera.setViewOffset(
        this.resolution.x, this.resolution.x,
        this.resolution.x * 0.3, this.resolution.x * 0.6,
        this.resolution.x * 0.4, this.resolution.x * 0.4
      );
    }
  };
  resize() {
    this.resolution.set(
      this.modules.scrollManager.resolution.x,
      this.modules.scrollManager.resolution.y
    );
    this.canvas.width = this.resolution.x;
    this.canvas.height = this.resolution.x;
    this.resizeCamera();
    this.aurora.resize(this.resolution);
    this.guy.resize(this.resolution);
    this.mountain.resize(this.resolution);
    this.renderer.setSize(this.resolution.x, this.resolution.x);
  }
}
