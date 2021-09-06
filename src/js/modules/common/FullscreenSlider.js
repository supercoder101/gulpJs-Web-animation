import normalizeWheel from 'normalize-wheel';

import sleep from 'js-util/sleep';

const CLASSNAME_WRAP      = 'js-fullscreen-wrap';
const CLASSNAME_SECTION   = 'js-fullscreen-section';
const CLASSNAME_PAGER     = 'js-fullscreen-pager';
const CLASSNAME_POINTER   = 'js-fullscreen-pager-pointer';
const CLASSNAME_BG        = 'js-fullscreen-bg';
const CLASSNAME_SHOW      = 'is-shown';
const CLASSNAME_SHOW_ASC  = 'is-shown-asc';
const CLASSNAME_SHOW_DESC = 'is-shown-desc';
const CLASSNAME_HIDE      = 'is-hidden';
const CLASSNAME_HIDE_ASC  = 'is-hidden-asc';
const CLASSNAME_HIDE_DESC = 'is-hidden-desc';
const CLASSNAME_STAYED_ASC  = 'is-stayed-asc';
const CLASSNAME_STAYED_DESC = 'is-stayed-desc';
const CLASSNAME_CURRENT   = 'is-current';
const CLASSNAME_ANIMATE   = 'has-animate';

const INTERVAL_TO_FIRE_WHEEL = 1000;

export default class FullscreenSlider {
  constructor(contents, webglContent, modules) {
    this.webglContent = webglContent;
    this.modules = modules;

    this.elmWrap = contents.querySelector(`.${CLASSNAME_WRAP}`);
    this.elmSection = contents.querySelectorAll(`.${CLASSNAME_SECTION}`);
    this.elmPager = contents.querySelector(`.${CLASSNAME_PAGER}`);
    this.elmPagerPointers = contents.querySelectorAll(`.${CLASSNAME_POINTER}`);

    this.currentId = 0;
    this.previousId = 0;
    this.maxId = this.elmSection.length - 1;
    this.isAscend = true;
    this.wheelTimer = null;
    this.isWheeling = false;
    this.touchStartY = 0;
    this.touchStartX = 0;
    this.isTouchMoved = false;

    this.changeSectionAfter = null;

    this.elmSection[0].appendChild(this.modules.webgl.canvas);

    this.resize(modules.scrollManager.resolution);
    for (var i = 0; i < this.elmSection.length; i++) {
      if (i < this.currentId) {
        this.elmSection[i].classList.remove(CLASSNAME_STAYED_DESC);
        this.elmSection[i].classList.add(CLASSNAME_STAYED_ASC);
      } else if (i > this.currentId) {
        this.elmSection[i].classList.remove(CLASSNAME_STAYED_ASC);
        this.elmSection[i].classList.add(CLASSNAME_STAYED_DESC);
      }
    }
  }
  async start() {
    this.on();
    document.body.style.overscrollBehavior = 'none';
    this.elmSection[this.currentId].classList.add(CLASSNAME_SHOW);
    this.elmSection[this.currentId].classList.add(CLASSNAME_SHOW_ASC);
    this.elmPager.classList.add(CLASSNAME_ANIMATE);
    this.elmPagerPointers[this.currentId].classList.add(CLASSNAME_CURRENT);
    this.webglContent.switchScene(this.currentId);

    await sleep(400);

    this.modules.webgl.canvas.classList.add('is-shown');
  }
  goToPrev() {
    if (this.currentId === 0) return;
    this.previousId = this.currentId;
    this.currentId--;
    this.isAscend = false;
    this.changeSection();
  }
  goToNext() {
    if (this.currentId >= this.maxId) return;
    this.previousId = this.currentId;
    this.currentId++;
    this.isAscend = true;
    this.changeSection();
  }
  goToTarget(id) {
    if (this.currentId === id) return;
    this.isAscend = id > this.currentId;
    this.previousId = this.currentId;
    this.currentId = id;
    this.changeSection();
  }
  async changeSection() {
    for (var i = 0; i < this.elmSection.length; i++) {
      if (i === this.previousId) {
        this.elmSection[i].classList.remove(CLASSNAME_SHOW);
        this.elmSection[i].classList.remove(CLASSNAME_SHOW_ASC);
        this.elmSection[i].classList.remove(CLASSNAME_SHOW_DESC);
        this.elmSection[i].classList.add(CLASSNAME_HIDE);
        this.elmSection[i].classList.remove(CLASSNAME_STAYED_ASC);
        this.elmSection[i].classList.remove(CLASSNAME_STAYED_DESC);
        if (this.isAscend) {
          this.elmSection[i].classList.add(CLASSNAME_HIDE_ASC);
        } else {
          this.elmSection[i].classList.add(CLASSNAME_HIDE_DESC);
        }
      } else if (i === this.currentId) {
        this.elmSection[i].classList.remove(CLASSNAME_HIDE);
        this.elmSection[i].classList.remove(CLASSNAME_HIDE_ASC);
        this.elmSection[i].classList.remove(CLASSNAME_HIDE_DESC);
        this.elmSection[i].classList.remove(CLASSNAME_STAYED_ASC);
        this.elmSection[i].classList.remove(CLASSNAME_STAYED_DESC);
        this.elmSection[i].classList.add(CLASSNAME_SHOW);
        if (this.isAscend) {
          this.elmSection[i].classList.add(CLASSNAME_SHOW_ASC);
        } else {
          this.elmSection[i].classList.add(CLASSNAME_SHOW_DESC);
        }
      } else {
        this.elmSection[i].classList.remove(CLASSNAME_SHOW);
        this.elmSection[i].classList.remove(CLASSNAME_SHOW_ASC);
        this.elmSection[i].classList.remove(CLASSNAME_SHOW_DESC);
        this.elmSection[i].classList.remove(CLASSNAME_HIDE);
        this.elmSection[i].classList.remove(CLASSNAME_HIDE_ASC);
        this.elmSection[i].classList.remove(CLASSNAME_HIDE_DESC);
        if (i < this.currentId) {
          this.elmSection[i].classList.remove(CLASSNAME_STAYED_DESC);
          this.elmSection[i].classList.add(CLASSNAME_STAYED_ASC);
        } else if (i > this.currentId) {
          this.elmSection[i].classList.remove(CLASSNAME_STAYED_ASC);
          this.elmSection[i].classList.add(CLASSNAME_STAYED_DESC);
        }
      }
    }
    this.elmPagerPointers[this.previousId].classList.remove(CLASSNAME_CURRENT);
    this.elmPagerPointers[this.currentId].classList.add(CLASSNAME_CURRENT);

    if (this.changeSectionAfter) this.changeSectionAfter();
  }
  reset() {
    this.elmWrap.style.width = 0;
    this.elmWrap.style.height = 0;
  }
  resize(resolution) {
    this.elmWrap.style.width = `${resolution.x}px`
    this.elmWrap.style.height = `${resolution.y}px`
  }
  on() {
    // For wheel events
    // =====
    const wheel = (e) => {
      e.preventDefault();

      const n = normalizeWheel(e);

      // Run at the first wheel event only.
      if (this.isWheeling === false) {
        if (Math.abs(n.pixelY) < 10) return;

        if (n.pixelY < 0) {
          this.goToPrev();
        } else {
          this.goToNext();
        }

        // Prevent repeated wheel events fire with a timer.
        this.isWheeling = true;
        this.wheelTimer = setTimeout(() => {
          this.isWheeling = false;
        }, INTERVAL_TO_FIRE_WHEEL);
      }
    };
    this.elmWrap.addEventListener('wheel', wheel, { capture: true });
    this.elmWrap.addEventListener('DOMMouseScroll', wheel, { capture: true });

    // For touch events
    // =====
    this.elmWrap.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
    }, false);

    this.elmWrap.addEventListener('touchmove', (e) => {
      if (this.isTouchMoved === true) return;

      const diffX = this.touchStartX - e.touches[0].clientX;
      const diffY = this.touchStartY - e.touches[0].clientY;

      if (Math.abs(diffX) > 20) {
        return;
      } else if (diffY < -20) {
        e.preventDefault();
        this.goToPrev();
      } else if (diffY > 20) {
        e.preventDefault();
        this.goToNext();
      }

      if (Math.abs(diffY) > 20) {
        this.isTouchMoved = true;
      }
    }, false);

    this.elmWrap.addEventListener('touchend', (e) => {
      this.isTouchMoved = false;
    }, false);

    // For pager
    // ======
    for (var i = 0; i < this.elmPagerPointers.length; i++) {
      const id = i;
      this.elmPagerPointers[i].addEventListener('click', (e) => {
        e.preventDefault();
        this.goToTarget(id);
      });
    }
  }
  destroy() {
    this.elmPager.classList.remove(CLASSNAME_SHOW);
  }
}
