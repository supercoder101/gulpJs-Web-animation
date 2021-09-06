import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

import Butterfly from './Butterfly';
import ButterflyPoints from './ButterflyPoints';
import Triangles1 from '../../index/webgl/Triangles1';
import PromiseTextureLoader from '../../common/PromiseTextureLoader';

const BUTTERFLY_NUM = 10;

export default class WebGLContent {
  constructor(contents, modules) {
    this.modules = modules;
    this.resolution = new THREE.Vector2();
    this.canvas = modules.webgl.canvas;
    this.renderer = modules.webgl.renderer;
    this.scene = modules.webgl.scene;
    this.camera = modules.webgl.camera;
    this.clock = modules.webgl.clock;

    this.butterflies = [];
    this.triangles1 = new Triangles1();

    this.sceneId = 0;
    this.isRendering = false;
  }
  async init() {
    this.canvas.classList.add('p-canvas-webgl');

    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.camera.far = 1000;

    let butterflyTex;
    await Promise.all([
      PromiseTextureLoader('../img/creative-studio/tex.png'),
    ]).then(response => {
      butterflyTex = response[0];
    });

    this.resize();

    for (var i = 0; i < BUTTERFLY_NUM; i++) {
      const body = new Butterfly();
      const points = new ButterflyPoints();
      this.butterflies[i] = {
        body: body,
        points:points ,
      };
      body.start(i, butterflyTex);
      this.scene.add(body);
      this.scene.add(points);
    }

    this.scene.add(this.triangles1);

    this.isRendering = true;
  }
  destroy() {
    this.clock.stop();
    this.canvas.classList.remove('p-canvas-webgl');
    this.canvas.classList.remove('is-shown');

    for (var i = 0; i < this.butterflies.length; i++) {
      this.scene.remove(this.butterflies[i].body);
      this.scene.remove(this.butterflies[i].points);
    }
    this.scene.remove(this.triangles1);

    this.isRendering = false;
  }
  start() {
    this.clock.start();
    this.renderLoop();
  }
  render() {
    const time = this.clock.getDelta();

    for (var i = 0; i < this.butterflies.length; i++) {
      this.butterflies[i].body.update(time);
      this.butterflies[i].points.update(time, this.butterflies[i].body);
    }
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
    this.sceneId = sceneId;

    for (var i = 0; i < this.butterflies.length; i++) {
      this.butterflies[i].body.visible = false;
      this.butterflies[i].points.visible = false;
    }
    this.triangles1.visible = false;

    switch (sceneId) {
      case 0:
        for (var i = 0; i < this.butterflies.length; i++) {
          this.butterflies[i].body.visible = true;
          this.butterflies[i].points.visible = true;
        }
        break;
      case 4:
        this.triangles1.visible = true;
        break;
      default:
        break;
    }

    this.resize();
  }
  resize() {
    this.resolution.set(
      this.modules.scrollManager.resolution.x,
      this.modules.scrollManager.resolution.y
    );
    this.canvas.width = this.resolution.x;
    this.canvas.height = this.resolution.y;
    this.resizeCamera();

    switch (this.sceneId) {
      case 0:
        this.camera.position.set(-80, 80, 160);
        break;
      case 4:
        if (this.resolution.x > 1024) {
          this.camera.position.set(0, 0, 200);
        } else {
          if (this.resolution.x > this.resolution.y) {
            this.camera.position.set(0, 0, 250);
          } else {
            this.camera.position.set(0, 0, 400);
          }
        }
        break;
      default:
        break;
    }
    this.camera.lookAt(new THREE.Vector3());
    this.renderer.setSize(this.resolution.x, this.resolution.y);
  }
}
