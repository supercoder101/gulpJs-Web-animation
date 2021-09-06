import sleep from 'js-util/sleep';
import loadImgs from '../../common/loadImgs';
import SwFullscreenSlider from '../../strategy-ward/SwFullscreenSlider';
import Wave from '../../strategy-ward/Wave';
import WebGLContent from '../../strategy-ward/webgl/';
import OurClients from '../../common/OurClients';

let fs;
let wave;
let webglContent;
let ourClients;

// initBeforeTransit method: before scrollManager.resize run.
const initBeforeTransit = async (contents, contentsBefore, contentsAfter, modules) => {
  modules.gh.hide();
  modules.gh.showBar(2);

  ourClients = new OurClients(contents);
};

// initAfterTransit method: after scrollManager.resize run.
const initAfterTransit = async (contents, contentsBefore, contentsAfter, modules) => {
  wave = new Wave();
  webglContent = new WebGLContent(contents, modules);
  fs = new SwFullscreenSlider(contents, webglContent, modules);

  modules.scrollManager.resizeNext = () => {
    webglContent.resize();
    fs.reset();
    fs.resize(modules.scrollManager.resolution);
    wave.resize(modules.scrollManager.resolution);
  }

  const headerBtn = contents.querySelector('.js-header-btn');
  headerBtn.addEventListener('click', () => {
    fs.goToTarget(1);
  });

  webglContent.init();

  // await loadImgs([
  // ]);

  fs.start();
  await wave.start(modules.scrollManager.resolution);
  webglContent.start();

  fs.changeSectionAfter = () => {
    ourClients.isTransitedOnce = false;
    if (fs.currentId === 3) {
      ourClients.showCelebrityAuto();
    } else {
      ourClients.stopCelebrityAuto();
    }
  }
};

// clear any variables.
const clear = (modules) => {
  fs.destroy();
  wave.destroy();
  webglContent.destroy();
  ourClients = null;
};

export {
  initBeforeTransit,
  initAfterTransit,
  clear
}
