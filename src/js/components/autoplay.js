/* eslint-env browser */
export default {
  initAutoplay(delay = this.opts.autoplay.delay) {
    this.autoplay = {
      interval: setInterval(() => {
        if (this.activeSlide === this.slidesLength) {
          if (!this.opts.loop) {
            this.destroyAutoplay();
            if (this.opts.nav) this.updateNav();
            if (this.opts.dots) this.updateDots();
            return;
          }
        }
        this.moveTo(this.activeSlide + 1);
      }, delay),
      stop: false,
    };

    this.block.addEventListener('mouseenter', this.hoverInHandler);
    this.block.addEventListener('mouseleave', this.hoverOutHandler);

    this.componentPush('autoplay');


    return this;
  },
  destroyAutoplay() {
    if (this.isComponentInit('autoplay') > -1) {
      clearInterval(this.autoplay.interval);
      this.componentPop('autoplay')
    }

    this.block.removeEventListener('mouseenter', this.hoverInHandler);
    this.block.removeEventListener('mouseleave', this.hoverOutHandler);

    return this;
  },
  hoverInHandler() {
    if (this.opts.autoplay.stopOnHover) {
      this.autoplay.stop = true;
      clearInterval(this.autoplay.interval);
    }
  },
  hoverOutHandler() {
    if (this.opts.autoplay.stopOnHover) {
      this.autoplay.stop = false;
      this.initAutoplay();
    }
  },
};
