export default {
  initSwipes() {
    this.wrapper.addEventListener('mousedown', this.touchstartHandler); // for firefox
    this.wrapper.addEventListener('mousemove', this.touchmoveHandler);
    this.block.addEventListener('mouseup', this.touchendHandler);

    this.wrapper.addEventListener('touchstart', this.touchstartHandler);
    this.wrapper.addEventListener('touchmove', this.touchmoveHandler);
    this.block.addEventListener('touchend', this.touchendHandler);

    this.componentPush('swipes');

    return this;
  },
  destroySwipes() {
    if (this.isComponentInit('swipes')) {
      this.wrapper.removeEventListener('mousedown', this.touchstartHandler); // for firefox
      this.wrapper.removeEventListener('mousemove', this.touchmoveHandler);
      this.block.removeEventListener('mouseup', this.touchendHandler);

      this.wrapper.removeEventListener('touchstart', this.touchstartHandler);
      this.wrapper.removeEventListener('touchmove', this.touchmoveHandler);
      this.block.removeEventListener('touchend', this.touchendHandler);

      this.componentPop('swipes');
    }

    return this;
  },
  touchstartHandler(ev) {
    ev.preventDefault();
    this.swipe = {
      translate: null,
      x: 0,
      prevX: 0,
      start: null,
      diff: null,
    };
    this.wrapper.style.cursor = 'grab';
  },
  touchmoveHandler(ev) {
    ev.preventDefault();

    let direction;
    if (ev.buttons === 1) {
      if (typeof ev.movementX !== 'undefined') {
        if (Math.sign(ev.movementX) === 1) {
          direction = 'right';
        }
        if (Math.sign(ev.movementX) === -1) {
          direction = 'left';
        }
      } else {
        if (this.swipe.start === null) {
          this.swipe.start = ev.clientX;
        }
        this.swipe.prev = ev.clientX;
        if (this.swipe.diff === null) {
          this.swipe.diff = this.swipe.start - ev.clientX;
        } else {
          this.swipe.diff = this.swipe.prev - this.swipe.start;
        }

        if (Math.sign(this.swipe.diff) === 1) {
          direction = 'right';
        }
        if (Math.sign(this.swipe.diff) === -1) {
          direction = 'left';
        }
      }

      this.swipe.translate = parseInt(this.wrapper.style.transform.match(/[\d -]+/g).join(''), 10);
    }

    if (ev.touches) {
      if (this.isComponentInit('autoplay') && this.opts.autoplay.stopOnHover) {
        this.destroyAutoplay();
      }
      if (this.swipe.start === null) {
        this.swipe.start = ev.touches[0].clientX;
      }
      this.swipe.prev = ev.touches[0].clientX;
      if (this.swipe.diff === null) {
        this.swipe.diff = this.swipe.start - ev.touches[0].clientX;
      } else {
        this.swipe.diff = this.swipe.prev - this.swipe.start;
      }

      if (Math.sign(this.swipe.diff) === 1) {
        direction = 'right';
      }
      if (Math.sign(this.swipe.diff) === -1) {
        direction = 'left';
      }
    }

    switch (direction) {
      case 'left':
        if (ev.buttons === 1) {
          if (ev.movementX) {
            this.wrapper.style.transition = 'none';
            this.swipe.translate -= Math.abs(ev.movementX);
            this.wrapper.style.transform = `translateX(${this.swipe.translate}px)`;
          } else {
            this.opts.callbacks.onSwipe(this.activeSlide, this.activeSlide + 1, 'ltr', 'ieSwipe');
            this.moveTo(this.activeSlide + 1);
            this.wrapper.removeEventListener('mousemove', this.touchmoveHandler);
            setTimeout(() => {
              this.wrapper.addEventListener('mousemove', this.touchmoveHandler);
            }, 700);
          }
        }
        if (ev.touches) {
          this.opts.callbacks.onSwipe(this.activeSlide, this.activeSlide + 1, 'ltr', 'touchSwipe');
          this.moveTo(this.activeSlide + 1);
          this.wrapper.removeEventListener('touchmove', this.touchmoveHandler);
          setTimeout(() => {
            this.wrapper.addEventListener('touchmove', this.touchmoveHandler);
          }, 500);
        }
        break;
      case 'right':
        if (ev.buttons === 1) {
          if (ev.movementX) {
            this.wrapper.style.transition = 'none';
            this.swipe.translate += Math.abs(ev.movementX);
            this.wrapper.style.transform = `translateX(${this.swipe.translate}px)`;
          } else {
            this.opts.callbacks.onSwipe(this.activeSlide, this.activeSlide + 1, 'rtl', 'ieSwipe');
            this.moveTo(this.activeSlide - 1);
            this.wrapper.removeEventListener('mousemove', this.touchmoveHandler);
            setTimeout(() => {
              this.wrapper.addEventListener('mousemove', this.touchmoveHandler);
            }, 700);
          }
        }
        if (ev.touches) {
          this.opts.callbacks.onSwipe(this.activeSlide, this.activeSlide - 1, 'rtl', 'touchSwipe');
          this.moveTo(this.activeSlide - 1);
          this.wrapper.removeEventListener('touchmove', this.touchmoveHandler);
          setTimeout(() => {
            this.wrapper.addEventListener('touchmove', this.touchmoveHandler);
          }, 500);
        }
        break;
      default:
        break;
    }
  },
  touchendHandler(ev) {
    this.wrapper.style.cursor = 'default';

    if (ev.type === 'mouseup') ev.preventDefault();

    if (ev.touches) {
      if (this.opts.autoplay && !this.isComponentInit('autoplay') && this.opts.autoplay.stopOnHover) {
        this.initAutoplay();
      }
      return;
    }

    if (typeof ev.movementX === 'undefined') return;

    if (this.swipe) {
      if (this.swipe.translate) {
        let slideWidth = this.slides[0].clientWidth;
        if (this.opts.items) {
          slideWidth *= this.opts.items;
        }

        if (this.swipe.translate > -((slideWidth * this.activeSlide) - (slideWidth / 5))) {
          if (!this.opts.loop && this.activeSlide === 0) {
            this.moveTo(this.activeSlide);
            this.opts.callbacks.onSwipe(this.activeSlide, this.activeSlide, 'same', 'mouseSwipe');
            return;
          }
          this.opts.callbacks.onSwipe(this.activeSlide, this.activeSlide - 1, 'rtl', 'mouseSwipe');
          this.moveTo(this.activeSlide - 1);
        } else if (this.swipe.translate < -((slideWidth * this.activeSlide) + (slideWidth / 5))) {
          if (!this.opts.loop && this.activeSlide === this.slidesLength) {
            this.moveTo(this.activeSlide);
            this.opts.callbacks.onSwipe(this.activeSlide, this.activeSlide, 'same', 'mouseSwipe');
            return;
          }
          this.opts.callbacks.onSwipe(this.activeSlide, this.activeSlide + 1, 'ltr', 'mouseSwipe');
          this.moveTo(this.activeSlide + 1);
        } else {
          this.opts.callbacks.onSwipe(this.activeSlide, this.activeSlide, 'same', 'mouseSwipe');
          this.moveTo(this.activeSlide);
        }

        this.swipe.translate = null;
      }
    }
  },
};
