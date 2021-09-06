import normalizeWheel from 'normalize-wheel';

import sleep from 'js-util/sleep';
import FullscreenSlider from '../common/FullscreenSlider';

const CLASSNAME_SHOW    = 'is-shown';
const CLASSNAME_COLOR_B = 'is-black';

export default class SwFullscreenSlider extends FullscreenSlider {
  constructor(contents, webglContent, modules) {
    super(contents, webglContent, modules);
  }
  async changeSection() {
    super.changeSection();

    switch (this.currentId) {
      case 0:
        this.modules.gh.hide();
        this.modules.gh.isBlack = false;
        this.elmPager.classList.remove(CLASSNAME_SHOW);
        this.elmPager.classList.remove(CLASSNAME_COLOR_B);
        break;
      case 1:
      case 2:
      case 4:
        this.modules.gh.show();
        this.modules.gh.isBlack = false;
        this.elmPager.classList.add(CLASSNAME_SHOW);
        this.elmPager.classList.remove(CLASSNAME_COLOR_B);
        break;
      case 3:
        this.modules.gh.show();
        this.modules.gh.isBlack = true;
        this.elmPager.classList.add(CLASSNAME_SHOW);
        this.elmPager.classList.add(CLASSNAME_COLOR_B);
        break;
      default:
        break;
    }
    this.modules.webgl.canvas.classList.remove('is-shown');
    this.modules.webgl.canvas.classList.add('is-hidden');

    await sleep(500);

    switch (this.previousId) {
      case 0:
      case 3:
        this.elmSection[this.previousId].removeChild(this.modules.webgl.canvas);
        break;
      default:
        break;
    }
    switch (this.currentId) {
      case 0:
      case 3:
        this.elmSection[this.currentId].appendChild(this.modules.webgl.canvas);
        break;
      default:
        break;
    }
    this.modules.webgl.canvas.classList.remove('is-hidden');
    this.webglContent.switchScene(this.currentId);

    await sleep(500);

    this.modules.webgl.canvas.classList.add('is-shown');
  }
}
