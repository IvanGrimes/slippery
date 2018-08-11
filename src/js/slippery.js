/* eslint-env browser */
import defaultConfig from './utils/config';
import nav from './components/nav';
import dots from './components/dots';
import autoplay from './components/autoplay';
import swipes from './components/swipes';
import './utils/polyfills';

const prototypes = {
  nav,
  dots,
  autoplay,
  swipes,
};

export default class Slippery {
  constructor(block, { ...args }) {
    this.block = document.querySelector(block);
    if (!this.block) return;
    this.opts = args;
    Slippery.applyRestOptions(defaultConfig, this.opts);
    this.selectors = Slippery.makeSelectorsFromClassnames(this.opts.classNames);
    this.slides = this.block.querySelectorAll(this.selectors.slider.item);
    this.activeSlide = this.opts.activeSlide;
    if (this.opts.centered) {
      this.activeSlide = Math.ceil(this.slides.length / 2);
      if (this.opts.items) {
        this.activeSlide = Math.floor(this.activeSlide / this.opts.items);
      }
    }

    this.components = [];

    this.addMethodsFromPrototypes().boundEventHandlers();

    this.resizeHandler = this.resizeHandler.bind(this);

    if (this.opts.responsive) this.setResponsive(Slippery.windowWidth);
    this.opts.callbacks.beforeInit();
    if (this.opts.init) this.init();
  }

  get viewport() {
    return this.wrapper.clientWidth;
  }

  get slideWidth() {
    return this.slides[0].clientWidth;
  }

  get breakpoint() {
    if (this.opts.responsive) {
      return (
        Slippery.findClosestNum(Object.keys(this.opts.responsive), Slippery.windowWidth)
      );
    }
    return false;
  }

  get slidesLength() {
    if (this.opts.items) return Math.ceil(this.slides.length / this.opts.items) - 1;

    return this.slides.length - 1;
  }

  length() {
    return this.slidesLength;
  }

  realLength() {
    return this.slides.length - 1;
  }

  elements() {
    return {
      slides: this.slides,
      nav: this.nav,
      dots: this.dots,
    };
  }

  current() {
    return this.activeSlide;
  }

  appendSlide(el, index = this.realLength()) {
    const slide = document.createElement('div');
    slide.classList.add(this.opts.classNames.slider.item);
    slide.appendChild(el.cloneNode(true));

    if (index === this.realLength()) {
      this.wrapper.appendChild(slide);
    } else {
      this.wrapper.insertBefore(slide, this.slides[index + 1]);
    }

    this.slides = this.wrapper.querySelectorAll(this.selectors.slider.item);

    this.destroyDots().initDots();
    this.set().updateControls();

    return slide;
  }

  prependSlide(el, index = this.realLength()) {
    const slide = document.createElement('div');
    slide.classList.add(this.opts.classNames.slider.item);
    slide.appendChild(el.cloneNode(true));

    this.wrapper.insertBefore(slide, this.slides[index]);

    this.slides = this.wrapper.querySelectorAll(this.selectors.slider.item);

    this.destroyDots().initDots();
    this.set().updateControls();

    return slide;
  }

  removeSlide(index = this.realLength()) {
    const before = this.slidesLength;
    let slide = this.slides[index], after;

    slide.remove();

    this.slides = this.wrapper.querySelectorAll(this.selectors.slider.item);

    this.destroyDots().initDots();
    after = this.slidesLength;

    if ( before !== after && this.activeSlide === before ) {
      if (typeof this.opts.margins === 'number') this.setMargins();
      this.setSlidesWidth().moveTo(this.activeSlide - 1);
      return slide;
    }
    this.updateControls();

    return slide;
  }

  setSlidesHeight() {
    if (this.opts.items - 1) {
      let heights = [], biggestHeight;
      this.slides.forEach((el, index) => {
        if (this.activeSlide === 0) {
          if (index <= this.opts.items - 1) heights.push(el.clientHeight);
        }
        if (index >= (this.activeSlide + 1) * this.opts.items - this.opts.items
          && index < (this.activeSlide + 1) * this.opts.items) {
          heights.push(el.clientHeight);
        }
      });

      biggestHeight = Math.max.apply(null, heights);
      this.block.style.height = `${biggestHeight}px`;
    } else {
      this.block.style.height = `${this.slides[this.activeSlide].clientHeight}px`;
    }

    return this;
  }

  isComponentInit(componentName) {
    const index = this.components.indexOf(componentName);

    return index !== -1;
  }

  componentPush(componentName) {
    this.components.push(componentName);
    return this;
  }

  componentPop(componentName) {
    const index = this.components.indexOf(componentName);
    this.components.splice(index, 1);
    return this;
  }

  addMethodsFromPrototypes() {
    Object.keys(prototypes).forEach((group) => {
      Object.keys(prototypes[group]).forEach((method) => {
        if (!Slippery.prototype[method]) {
          Slippery.prototype[method] = prototypes[group][method];
        }
      });
    });

    return this;
  }

  boundEventHandlers() {
    Object.keys(Slippery.prototype).filter(method => method.toLowerCase().match('handler')).forEach((handler) => {
      this[handler] = this[handler].bind(this);
    });

    return this;
  }

  init() {
    window.addEventListener('resize', this.resizeHandler);
    this.defaultOpts = Slippery.deepCloneObject(this.opts);
    this.initWrapper().set().initModules().updateControls();

    this.opts.callbacks.afterInit();

    return this;
  }

  set() {
    if (typeof this.opts.margins === 'number') this.setMargins();

    this.setSlidesWidth().moveTo(this.activeSlide, false);

    return this;
  }

  destroy() {
    this.destroyModules().destroyWrapper();
    window.removeEventListener('resize', this.resizeHandler);

    this.slides.forEach((el) => {
      el.removeAttribute('style');
    });
  }

  initModules() {
    if (this.opts.dots) this.initDots();
    if (this.opts.nav) this.initNav();
    if (this.opts.autoplay) this.initAutoplay();
    if (this.opts.swipes) this.initSwipes();

    return this;
  }

  updateControls() {
    if (this.isComponentInit('dots')) this.updateDots();
    if (this.isComponentInit('nav')) this.updateNav();

    return this;
  }

  destroyModules() {
    if (this.isComponentInit('dots')) this.destroyDots();
    if (this.isComponentInit('nav')) this.destroyNav();
    if (this.isComponentInit('autoplay')) this.destroyAutoplay();
    if (this.isComponentInit('swipes')) this.destroySwipes();

    return this;
  }

  setMargins() {
    this.slides.forEach((el) => {
      const slide = el;
      slide.style.marginLeft = `${this.opts.margins}px`;
    });
    this.wrapper.style.marginLeft = `-${this.opts.margins / 2}px`;
    return this;
  }

  setResponsive(windowWidth) {
    const { breakpoint } = this;

    if (windowWidth < breakpoint) {
      Object.keys(this.opts.responsive[breakpoint]).forEach((prop) => {
        this.opts[prop] = this.opts.responsive[breakpoint][prop];
      });
    }
    return this;
  }

  applyResponsive() {
    if (this.opts.destroy) {
      this.destroy();
      return this;
    }
    if (this.components.length === 0) {
      this.init();
    }
    this.destroyModules().initModules().updateControls().set();
    return this;
  }

  setDefault() {
    Object.keys(this.defaultOpts).forEach((prop) => {
      if (prop === 'responsive') return;

      this.opts[prop] = this.defaultOpts[prop];
    });

    return this;
  }

  resizeHandler() {
    const width = Slippery.windowWidth;
    const { viewport, breakpoint } = this;

    this.setSlidesWidth().moveTo(this.activeSlide, false);

    if (this.opts.responsive) {
      if (width < breakpoint) {
        this.setDefault().setResponsive(width).applyResponsive();
        this.opts.callbacks.onResize(width, viewport, breakpoint);
      } else {
        this.setDefault().set().applyResponsive();
        this.opts.callbacks.onResize(width, viewport, false);
      }
    } else {
      this.opts.callbacks.onResize(width, viewport, false);
    }
  }

  initWrapper() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add(this.opts.classNames.slider.wrapper);

    this.slides.forEach((el) => {
      this.wrapper.appendChild(el);
    });

    this.slides = this.wrapper.querySelectorAll(this.selectors.slider.item);
    this.block.appendChild(this.wrapper);

    return this;
  }

  destroyWrapper() {
    this.slides.forEach((el) => {
      this.block.appendChild(el);
    });

    this.wrapper.remove();

    return this;
  }

  loop(nextIndex) {
    if (nextIndex === -1) {
      this.activeSlide = this.slidesLength;
    } else if (nextIndex === this.slidesLength + 1) {
      this.activeSlide = 0;
    } else {
      this.activeSlide = nextIndex;
    }
  }

  setSlidesWidth() {
    let { viewport } = this;
    if (this.opts.items) viewport /= this.opts.items;

    if (this.opts.margins) viewport -= this.opts.margins;

    this.slides.forEach((el) => {
      const slide = el;
      slide.style.width = `${viewport}px`;
    });

    return this;
  }

  setTranslate() {
    this.wrapper.style.transform = `translateX(-${((this.slideWidth + this.opts.margins) * this.activeSlide) * this.opts.items}px)`;
    return this;
  }

  setSlidesClassNames(prevIndex, nextIndex) {
    this.slides.forEach((el) => {
      const slide = el;
      slide.classList.remove(this.opts.classNames.slider.prev);
    });
    if ( this.opts.loop ) {
      if (nextIndex === -1) {
        if (this.slides[prevIndex]) {
          this.slides[prevIndex].classList.remove(this.opts.classNames.slider.active);
          this.slides[prevIndex].classList.add(this.opts.classNames.slider.prev);
        }

        this.slides[this.slidesLength * this.opts.items].classList.add(this.opts.classNames.slider.active);
        return;
      }
      if (nextIndex === this.slidesLength + 1) {
        if (this.slides[this.slidesLength * this.opts.items]) {
          this.slides[this.slidesLength * this.opts.items].classList.remove(this.opts.classNames.slider.active);
          this.slides[this.slidesLength * this.opts.items].classList.add(this.opts.classNames.slider.prev);
        }
        this.slides[0].classList.add(this.opts.classNames.slider.active);
        return;
      }
    }
    this.slides[nextIndex * this.opts.items].classList.add(this.opts.classNames.slider.active);
    if (prevIndex !== nextIndex) {
      if (this.slides[prevIndex * this.opts.items]) {
        this.slides[prevIndex * this.opts.items].classList.add(this.opts.classNames.slider.prev);
        this.slides[prevIndex * this.opts.items].classList.remove(this.opts.classNames.slider.active);
      }
    }

    return this;
  }

  moveTo(index, transition = true) {
    const { type, duration, delay } = this.opts.transition;
    if ((index > this.slidesLength || index < 0) && !this.opts.loop) return;
    this.opts.callbacks.beforeMove(this.activeSlide, index);

    this.setSlidesClassNames(this.activeSlide, index);

    if (this.opts.loop) this.loop(index);
    else this.activeSlide = index;

    if (transition) this.wrapper.style.transition = `transform ${duration}ms ${type} ${delay}ms`;
    else this.wrapper.style.transition = '';

    this.setTranslate().updateControls();

    if (this.opts.autoplay && this.activeSlide === this.slidesLength) {
      clearInterval(this.autoplay.interval);
      if (!this.autoplay.stop) this.initAutoplay();
    }

    if (this.opts.adaptiveHeight) {
      this.setSlidesHeight();
    }

    this.opts.callbacks.afterMove(this.activeSlide);
  }

  static deepCloneObject(source) {
    const clone = {};

    Object.keys(source).forEach((prop) => {
      if (source[prop] !== null && typeof (source[prop]) === 'object') {
        clone[prop] = Slippery.deepCloneObject(source[prop]);
      } else {
        clone[prop] = source[prop];
      }
    });
    return clone;
  }

  static applyRestOptions(source, target) {
    if (typeof source !== 'object') return; // for ie11

    Object.keys(source).forEach((prop) => {
      if (typeof target[prop] === 'undefined') target[prop] = source[prop];

      if (typeof source === 'object') Slippery.applyRestOptions(source[prop], target[prop]);
    });
  }

  static findClosestNum(array, num) {
    return array.reduce((prev, curr) => (prev < num && num > prev ? curr : prev));
  }

  static makeSelectorsFromClassnames(classNames) {
    const selectors = JSON.parse(JSON.stringify(classNames));

    function findStringAndAddDotToIt(obj) {
      Object.keys(obj).forEach((prop) => {
        if (typeof obj[prop] === 'object') return findStringAndAddDotToIt(obj[prop]);

        if (typeof obj[prop] === 'string') obj[prop] = `.${obj[prop]}`;
      });
    }

    findStringAndAddDotToIt(selectors);

    return selectors;
  }

  static get windowWidth() {
    return window.innerWidth;
  }
}
