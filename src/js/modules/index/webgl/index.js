import * as THREE from 'three';

import DnaHelix from './DnaHelix';
import Triangles1 from './Triangles1';
import Triangles2 from './Triangles2';
import Fog from './Fog';
import NodePoints from './NodePoints';
import NodeLine from './NodeLine';
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

    this.dnaHelix = new DnaHelix();
    this.triangles1 = new Triangles1();
    this.triangles2 = new Triangles2();
    this.fog = new Fog();
    this.nodePoints = new NodePoints();
    this.nodeLine = new NodeLine();

    this.isRendering = false;
  }
  async init() {
    this.isRendering = true;
    this.canvas.classList.add('p-canvas-webgl');
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.camera.far = 1000;
    this.camera.lookAt(new THREE.Vector3());

    let fogTex;
    await Promise.all(
      [
        PromiseTextureLoader('./img/index/founder/fog.jpg'),
      ]
    ).then(response => {
      fogTex = response[0];
      fogTex.wrapS = THREE.RepeatWrapping;
      fogTex.wrapT = THREE.RepeatWrapping;
    });

    this.resize();

    this.fog.start(fogTex);
    this.nodePoints.start(this.camera);

    this.scene.add(this.dnaHelix.obj);
    this.scene.add(this.triangles1);
    this.scene.add(this.triangles2);
    this.scene.add(this.fog);
    this.scene.add(this.nodePoints);
    this.scene.add(this.nodeLine);
  }
  destroy() {
    this.clock.stop();
    this.canvas.classList.remove('p-canvas-webgl');
    this.canvas.classList.remove('is-shown');
    this.scene.remove(this.dnaHelix.obj);
    this.scene.remove(this.triangles1);
    this.scene.remove(this.triangles2);
    this.scene.remove(this.fog);
    this.scene.remove(this.nodePoints);
    this.scene.remove(this.nodeLine);
    this.isRendering = false;
  }
  start() {
    this.clock.start();
    this.renderLoop();
  }
  render() {
    const time = this.clock.getDelta();
    this.dnaHelix.render(time);
    this.triangles1.update(time);
    this.triangles2.update(time);
    this.fog.update(time);
    this.nodePoints.update(time, this.camera);
    this.nodeLine.update(this.nodePoints, this.camera);
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
    this.dnaHelix.obj.visible = false;
    this.triangles1.visible = false;
    this.triangles2.visible = false;
    this.fog.visible = false;
    this.nodePoints.visible = false;
    this.nodeLine.visible = false;

    switch (sceneId) {
      case 0:
        this.dnaHelix.obj.visible = true;
        return;
      case 3:
        this.triangles1.visible = true;
        return;
      case 4:
        this.triangles2.visible = true;
        this.fog.visible = true;
        return;
      case 6:
        this.nodePoints.visible = true;
        this.nodeLine.visible = true;
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
    if (this.resolution.x > 1024) {
      this.camera.position.set(0, 0, 200);
      this.dnaHelix.obj.position.y = 30;
    } else if (this.resolution.x >= 768) {
      if (this.resolution.x > this.resolution.y) {
        this.camera.position.set(0, 0, 250);
        this.dnaHelix.obj.position.y = 48;
      } else {
        this.camera.position.set(0, 0, 400);
        this.dnaHelix.obj.position.y = 52;
      }
    } else {
      if (this.resolution.x > this.resolution.y) {
        this.camera.position.set(0, 0, 250);
        this.dnaHelix.obj.position.y = 30;
      } else {
        this.camera.position.set(0, 0, 400);
        this.dnaHelix.obj.position.y = 72;
      }
    }
    this.camera.lookAt(new THREE.Vector3());
    this.renderer.setSize(this.resolution.x, this.resolution.y);
  }
}
