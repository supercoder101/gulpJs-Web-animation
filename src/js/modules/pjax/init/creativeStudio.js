import sleep from 'js-util/sleep';
import loadImgs from '../../common/loadImgs';
import CsFullscreenSlider from '../../creative-studio/CsFullscreenSlider.js';
import WebGLContent from '../../creative-studio/webgl/';
import LatestStudio from '../../common/LatestStudio';
import OurClients from '../../common/OurClients';

let fs;
let webglContent;
let ourClients;
let latestStudio;

// initBeforeTransit method: before scrollManager.resize run.
const initBeforeTransit = async (contents, contentsBefore, contentsAfter, modules) => {
  modules.gh.hide();
  modules.gh.showBar(1);

  ourClients = new OurClients(contents);
  latestStudio = new LatestStudio(contents);
};

// initAfterTransit method: after scrollManager.resize run.
const initAfterTransit = async (contents, contentsBefore, contentsAfter, modules) => {
  webglContent = new WebGLContent(contents, modules);
  fs = new CsFullscreenSlider(contents, webglContent, modules);

  modules.scrollManager.resizeNext = () => {
    webglContent.resize();
    fs.reset();
    fs.resize(modules.scrollManager.resolution);
  }

  const headerBtn = contents.querySelector('.js-header-btn');
  headerBtn.addEventListener('click', () => {
    fs.goToTarget(1);
  });

  await webglContent.init();

  await loadImgs([
    '../img/creative-studio/cursive.png',
    '../img/creative-studio/bg.jpg',
    '../img/creative-studio/bg_sp.jpg',
  ]);

  fs.start();
  webglContent.start();

  fs.changeSectionAfter = () => {
    ourClients.isTransitedOnce = false;
    if (fs.currentId === 4) {
      ourClients.showCelebrityAuto();
    } else {
      ourClients.stopCelebrityAuto();
    }
  }
};

// clear any variables.
const clear = (modules) => {
  fs.destroy();
  webglContent.destroy();
  ourClients = null;
  latestStudio = null;
};

export {
  initBeforeTransit,
  initAfterTransit,
  clear
}
