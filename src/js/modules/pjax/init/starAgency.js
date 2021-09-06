import sleep from 'js-util/sleep';
import loadImgs from '../../common/loadImgs';
import SaFullscreenSlider from '../../star-agency/SaFullscreenSlider.js';
import WebGLContent from '../../star-agency/webgl/';

let fs;
let webglContent;

// initBeforeTransit method: before scrollManager.resize run.
const initBeforeTransit = async (contents, contentsBefore, contentsAfter, modules) => {
  modules.gh.hide();
  modules.gh.showBar(3);
};

// initAfterTransit method: after scrollManager.resize run.
const initAfterTransit = async (contents, contentsBefore, contentsAfter, modules) => {
  webglContent = new WebGLContent(contents, modules);
  fs = new SaFullscreenSlider(contents, webglContent, modules);

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
    '../img/star-agency/guy.png',
    '../img/star-agency/bg.jpg',
  ]);

  fs.start();
  webglContent.start();
};

// clear any variables.
const clear = (modules) => {
  fs.destroy();
  webglContent.destroy();
};

export {
  initBeforeTransit,
  initAfterTransit,
  clear
}
