import sleep from 'js-util/sleep';
import loadImgs from '../../common/loadImgs';
import HomeFullscreenSlider from '../../index/HomeFullscreenSlider.js';
import WebGLContent from '../../index/webgl/';
import ServiceContent from '../../common/ServiceContent';
import OurClients from '../../common/OurClients';
import LatestStudio from '../../common/LatestStudio';
import BePart from '../../common/BePart';
import Dreamkast from '../../common/Dreamkast';
import DreamkastSubscribe from '../../common/DreamkastSubscribe';

let fs;
let webglContent;
let serviceContent;
let ourClients;
let latestStudio;
let bepart;
let dreamkast;
let dreamkastSubscribe;

// initBeforeTransit method: before scrollManager.resize run.
const initBeforeTransit = async (contents, contentsBefore, contentsAfter, modules) => {
  modules.gh.hide();
  modules.gh.showBar(0);

  serviceContent = new ServiceContent();
  ourClients = new OurClients(contents);
  latestStudio = new LatestStudio(contents);
  bepart = new BePart(contents);
  dreamkast = new Dreamkast(contents);
  dreamkastSubscribe = new DreamkastSubscribe();
};

// initAfterTransit method: after scrollManager.resize run.
const initAfterTransit = async (contents, contentsBefore, contentsAfter, modules) => {
  webglContent = new WebGLContent(contents, modules);
  fs = new HomeFullscreenSlider(contents, webglContent, modules);

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
    './img/common/logo_am.svg',
    './img/index/bg.jpg',
    './img/index/man.png',
    './img/index/pillars.png',
  ]);

  fs.start();
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
  webglContent.destroy();
  serviceContent = null;
  ourClients = null;
  latestStudio = null;
  bepart = null;
  dreamkast = null;
  dreamkastSubscribe = null;
};

export {
  initBeforeTransit,
  initAfterTransit,
  clear
}
