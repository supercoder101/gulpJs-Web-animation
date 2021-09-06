require('@babel/polyfill');

import * as THREE from 'three';
import sleep from 'js-util/sleep';
import Pjax from './modules/pjax/Pjax';
import ScrollManager from './modules/scroll_manager/ScrollManager';
import buildGlobalHeader from './modules/common/buildGlobalHeader';

const canvas = document.createElement('canvas');
const webglRenderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
  canvas: canvas,
});
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera();
const clock = new THREE.Clock({
  autoStart: false
});

camera.setFocalLength(50);

const modules = {
  pjax: new Pjax(),
  scrollManager: new ScrollManager(),
  gh: buildGlobalHeader(),
  webgl: {
    canvas: canvas,
    renderer: webglRenderer,
    scene: scene,
    camera: camera,
    clock: clock,
  }
};

// connect core modules each other.
modules.pjax.modules = modules;
modules.scrollManager.modules = modules;

const init = async () => {
  await sleep(100);

  // start to run Pjax.
  await modules.pjax.onLoad();
}
init();
