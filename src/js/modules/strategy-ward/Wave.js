export default class Wave {
  constructor() {
    this.wrap = document.querySelector('.js-svg-wave-wrap');
    this.light = document.querySelector('.js-svg-wave-image');
    this.step = 0;
  }
  async start(resolution) {
    this.resize(resolution);

    this.isRendering = true;
    this.renderLoop();
  }
  destroy() {
    this.isRendering = false;
  }
  resize(resolution) {
    if (resolution.x > 768) {
      if (resolution.x / resolution.y < 1920 / 920) {
        this.wrap.style.width = `${resolution.y / 920 * 623}px`;
        this.wrap.style.height = `${resolution.y / 920 * 225}px`;
        this.wrap.style.top = `calc(50% - ${resolution.y / 920 * 60}px)`;
        this.wrap.style.left = `calc(50% - ${resolution.y / 920 * 316}px)`;
      } else {
        this.wrap.style.width = `${resolution.x / 1920 * 623}px`;
        this.wrap.style.height = `${resolution.x / 1920 * 225}px`;
        this.wrap.style.top = `calc(50% - ${resolution.x / 1920 * 60}px)`;
        this.wrap.style.left = `calc(50% - ${resolution.x / 1920 * 316}px)`;
      }
    } else {
      if (resolution.x / resolution.y < 1080 / 1882) {
        this.wrap.style.width = `${resolution.y / 1882 * 770}px`;
        this.wrap.style.height = `${resolution.y / 1882 * 278}px`;
        this.wrap.style.top = `calc(50% - ${resolution.y / 1882 * 102}px)`;
        this.wrap.style.left = `calc(50% - ${resolution.y / 1882 * 420}px)`;
      } else {
        this.wrap.style.width = `${resolution.x / 1080 * 770}px`;
        this.wrap.style.height = `${resolution.x / 1080 * 278}px`;
        this.wrap.style.top = `calc(50% - ${resolution.x / 1080 * 102}px)`;
        this.wrap.style.left = `calc(50% - ${resolution.x / 1080 * 420}px)`;
      }
    }
  }
  update() {
    this.step += 5;
    this.light.setAttribute('x', this.step % 1246 - 623);
  }
  renderLoop() {
    this.update();
    if (this.isRendering === false) return;
    requestAnimationFrame(() => {
      this.renderLoop()
    });
  };
}
