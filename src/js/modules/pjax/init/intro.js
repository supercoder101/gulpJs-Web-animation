import debounce from 'js-util/debounce';
import sleep from 'js-util/sleep';
import loadImgs from '../../common/loadImgs';
import WebGLContent from '../../intro/webgl/';

let webglContent;

// initBeforeTransit method: before scrollManager.resize run.
const initBeforeTransit = async (contents, contentsBefore, contentsAfter, modules) => {
  modules.gh.hide();
  modules.gh.hideBar();
};

// initAfterTransit method: after scrollManager.resize run.
const initAfterTransit = async (contents, contentsBefore, contentsAfter, modules) => {
  const elmContent = contents.querySelector('.p-intro-content');
  const elmScene1 = elmContent.querySelector('.p-intro-scene1');
  const elmScene2 = elmContent.querySelector('.p-intro-scene2');
  const elmClouds = elmContent.querySelector('.p-intro-clouds');
  const elmBg = elmContent.querySelector('.p-intro-bg');
  const elmStar = elmContent.querySelector('.p-intro-star');
  const elmArrow = elmContent.querySelector('.p-intro-scene1__arrow');
  const elmGoToIndex = document.querySelector('.js-go-to-index');
  webglContent = new WebGLContent(contents, modules);

  let vTouchStartY = 0;
  let isTouched = false;
  let isArrivedScene2 = false;

  const goToScene2 = () => {
    if (isArrivedScene2 === true) return;
    isArrivedScene2 = true;
    elmScene1.classList.add('is-hidden');
    elmScene2.classList.add('is-shown');
    elmClouds.classList.add('is-hidden');
    elmBg.classList.add('is-zoomout');
    elmStar.classList.add('is-zoomout');
    webglContent.goToScene2();
  }
  const goToIndex = async (e) => {
    e.preventDefault();
    elmScene2.classList.add('is-hidden');
    elmBg.classList.add('is-hidden');
    elmStar.classList.add('is-hidden');
    webglContent.goToIndex();
    await sleep(2500);
    modules.pjax.transit('/', false);
  }

  modules.scrollManager.resizeNext = () => {
    webglContent.resize();
    elmContent.style = `height: ${modules.scrollManager.resolution.y}px`;
  }

  await webglContent.init();
  elmContent.style = `height: ${modules.scrollManager.resolution.y}px`;
  webglContent.start();
  await loadImgs([
    '/img/intro/bg.png',
    '/img/intro/cloud01.png',
    '/img/intro/cloud02.png',
    '/img/intro/cloud03.png',
    '/img/intro/guy.png',
    '/img/intro/mask_aurora.png',
    '/img/intro/mountain.png',
    '/img/intro/mountain_mask.png',
  ]);
  elmScene1.classList.add('is-shown');
  elmClouds.classList.add('is-shown');
  elmBg.classList.add('is-shown');
  elmStar.classList.add('is-shown');
  webglContent.show().then(() => {
    elmContent.addEventListener('wheel', goToScene2);
    elmContent.addEventListener('mousewheel', goToScene2);
    elmContent.addEventListener('touchstart', (e) => {
      vTouchStartY = e.touches[0].clientY;
    });
    elmContent.addEventListener('touchmove', (e) => {
      if (e.touches[0].clientY - vTouchStartY < -10) {
        goToScene2();
      }
    });
    elmArrow.addEventListener('click', goToScene2);
    elmGoToIndex.addEventListener('click', goToIndex);
  });
};

// clear any variables.
const clear = (modules) => {
  webglContent.destroy();
};

export {
  initBeforeTransit,
  initAfterTransit,
  clear
}
