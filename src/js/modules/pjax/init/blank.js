import loadContentImgs from '../../common/loadContentImgs';

// initBeforeTransit method: before scrollManager.resize run.
const initBeforeTransit = async (contents, contentsBefore, contentsAfter, modules) => {
  modules.gh.hide();
  modules.gh.showBar(-1);
};

// initAfterTransit method: after scrollManager.resize run.
const initAfterTransit = (contents, contentsBefore, contentsAfter, modules) => {
};

// clear any variables.
const clear = (modules) => {
};

export {
  initBeforeTransit,
  initAfterTransit,
  clear
}
