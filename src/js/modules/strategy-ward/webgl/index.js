import * as THREE from 'three';

import Triangles1 from '../../index/webgl/Triangles1';
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

    this.triangles1 = new Triangles1();

    this.isRendering = false;
  }
  async init() {
    this.canvas.classList.add('p-canvas-webgl');

    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.camera.far = 1000;
    this.camera.lookAt(new THREE.Vector3());

    this.resize();

    this.scene.add(this.triangles1);

    this.isRendering = true;
  }
  destroy() {
    this.clock.stop();
    this.canvas.classList.remove('p-canvas-webgl');
    this.canvas.classList.remove('is-shown');

    this.scene.remove(this.triangles1);

    this.isRendering = false;
  }
  start() {
    this.clock.start();
    this.renderLoop();
  }
  render() {
    const time = this.clock.getDelta();

    this.triangles1.update(time);

    this.renderer.render(this.scene, this.camera);
  };
  renderLoop() {
    this.render();
    if (this.isRendering === false) return;
    requestAnimationFrame(() => {
      this.renderLoop()
    });
  };
  resizeCamera() {
    this.camera.aspect = this.resolution.x / this.resolution.y;
    this.camera.setViewOffset(
      this.resolution.x, this.resolution.y,
      0, 0,
      this.resolution.x, this.resolution.y
    );
    this.camera.updateProjectionMatrix();
  };
  switchScene(sceneId) {
    this.triangles1.visible = false;

    switch (sceneId) {
      case 3:
        this.triangles1.visible = true;
        return;
      default:
        return;
    }
  }
  resize() {
    this.resolution.set(
      this.modules.scrollManager.resolution.x,
      this.modules.scrollManager.resolution.y
    );
    this.canvas.width = this.resolution.x;
    this.canvas.height = this.resolution.y;
    if (this.resolution.x > 1024) {
      this.camera.position.set(0, 0, 200);
    } else if (this.resolution.x >= 768) {
      if (this.resolution.x > this.resolution.y) {
        this.camera.position.set(0, 0, 250);
      } else {
        this.camera.position.set(0, 0, 400);
      }
    } else {
      if (this.resolution.x > this.resolution.y) {
        this.camera.position.set(0, 0, 250);
      } else {
        this.camera.position.set(0, 0, 400);
      }
    }
    this.renderer.setSize(this.resolution.x, this.resolution.y);
  }
}
