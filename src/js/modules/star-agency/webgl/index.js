import * as THREE from 'three';

import Sun from './Sun';
import Core from './Core';
import Shell from './Shell';
import Points from './Points';
import SunShine from './SunShine';
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

    this.sun = new Sun();
    this.core = new Core();
    this.shell = new Shell();
    this.points = new Points();
    this.sunShine = new SunShine();

    this.isRendering = false;
  }
  async init() {
    this.canvas.classList.add('p-canvas-webgl');

    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.camera.far = 1000;
    this.camera.lookAt(new THREE.Vector3());

    let textures;

    await Promise.all([
      PromiseTextureLoader('../img/star-agency/core.png'),
      PromiseTextureLoader('../img/star-agency/core_normal.png'),
      PromiseTextureLoader('../img/star-agency/sunshine.png'),
    ]).then(response => {
      textures = response;
    });

    if (textures) {
      textures[0].wrapS = THREE.RepeatWrapping;
      textures[0].wrapT = THREE.RepeatWrapping;
      textures[1].wrapS = THREE.RepeatWrapping;
      textures[1].wrapT = THREE.RepeatWrapping;

      this.core.start(textures[0], textures[1]);
      this.shell.start(textures[0], textures[1]);
      this.sunShine.start(textures[2]);
    }

    this.resize();

    this.sun.add(this.core);
    this.sun.add(this.shell);

    this.scene.add(this.sun);
    this.scene.add(this.points);
    this.scene.add(this.sunShine);

    this.isRendering = true;
  }
  destroy() {
    this.clock.stop();
    this.canvas.classList.remove('p-canvas-webgl');
    this.canvas.classList.remove('is-shown');

    this.scene.remove(this.sun);
    this.scene.remove(this.points);
    this.scene.remove(this.sunShine);

    this.isRendering = false;
  }
  start() {
    this.clock.start();
    this.renderLoop();
  }
  render() {
    const time = this.clock.getDelta();

    this.sun.update(time);
    this.core.update(time);
    this.shell.update(time);
    this.points.update(time);
    this.sunShine.update(time);

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
    this.sun.visible = false;
    this.core.visible = false;
    this.shell.visible = false;
    this.points.visible = false;

    switch (sceneId) {
      case 0:
      this.sun.visible = true;
      this.core.visible = true;
      this.shell.visible = true;
      this.points.visible = true;
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
    this.resizeCamera();
    this.camera.position.set(0, 0, 40);
    this.camera.lookAt(new THREE.Vector3());
    this.renderer.setSize(this.resolution.x, this.resolution.y);
  }
}
