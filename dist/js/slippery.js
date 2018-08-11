(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Slippery = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  var config = {
    init: true,
    nav: true,
    dots: true,
    loop: false,
    items: 1,
    destroy: false,
    centered: false,
    swipes: true,
    adaptiveHeight: false,
    appendDots: false,
    appendNav: false,
    margins: 30,
    activeSlide: 0,
    classNames: {
      slider: {
        wrapper: 'slippery__wrapper',
        item: 'slippery__item',
        active: 'slippery__item--active',
        prev: 'slippery__item--prev'
      },
      nav: {
        block: 'slippery__nav',
        item: 'slippery__nav-button',
        prev: 'slippery__nav-button--prev',
        next: 'slippery__nav-button--next',
        disabled: 'slippery__nav-button--disabled'
      },
      dots: {
        block: 'slippery__dots',
        item: 'slippery__dots-item',
        active: 'slippery__dots-item--active'
      }
    },
    transition: {
      type: 'linear',
      delay: 0,
      duration: 750
    },
    callbacks: {
      dotContent: function dotContent() {},
      navContent: function navContent(prev, next) {
        prev.innerText = '‹';
        next.innerText = '›';
      },
      beforeMove: function beforeMove() {},
      afterMove: function afterMove() {},
      onResize: function onResize() {},
      onSwipe: function onSwipe() {},
      beforeInit: function beforeInit() {},
      afterInit: function afterInit() {}
    }
  };

  /* eslint-env browser */
  var nav = {
    initNav: function initNav() {
      this.nav = {
        block: document.createElement('div'),
        prev: document.createElement('button'),
        next: document.createElement('button')
      };
      this.nav.block.classList.add(this.opts.classNames.nav.block);
      this.nav.prev.classList.add(this.opts.classNames.nav.item);
      this.nav.prev.classList.add(this.opts.classNames.nav.prev);
      this.nav.next.classList.add(this.opts.classNames.nav.item);
      this.nav.next.classList.add(this.opts.classNames.nav.next);
      this.opts.callbacks.navContent(this.nav.prev, this.nav.next);
      this.nav.prev.addEventListener('click', this.navHandler);
      this.nav.next.addEventListener('click', this.navHandler);
      this.nav.block.appendChild(this.nav.prev);
      this.nav.block.appendChild(this.nav.next);

      if (this.opts.appendNav) {
        this.opts.appendNav.appendChild(this.nav.block);
      } else {
        this.block.insertBefore(this.nav.block, this.wrapper);
      }

      this.componentPush('nav');
      return this;
    },
    updateNav: function updateNav() {
      if (!this.opts.loop) {
        if (this.activeSlide === 0) {
          this.nav.prev.classList.add(this.opts.classNames.nav.disabled);
        } else {
          this.nav.prev.classList.remove(this.opts.classNames.nav.disabled);
        }

        if (this.activeSlide === this.slidesLength) {
          this.nav.next.classList.add(this.opts.classNames.nav.disabled);
        } else {
          this.nav.next.classList.remove(this.opts.classNames.nav.disabled);
        }
      }

      return this;
    },
    navHandler: function navHandler(ev) {
      var target = ev.currentTarget;
      if (target === this.nav.prev) this.moveTo(this.activeSlide - 1);
      if (target === this.nav.next) this.moveTo(this.activeSlide + 1);
    },
    destroyNav: function destroyNav() {
      if (this.isComponentInit('nav')) {
        this.nav.block.remove();
        this.componentPop('nav');
      }

      return this;
    }
  };

  /* eslint-env browser */
  var dots = {
    initDots: function initDots() {
      var _this = this;

      this.dots = {
        block: document.createElement('ul'),
        items: null
      };
      this.dots.block.classList.add(this.opts.classNames.dots.block);

      for (var i = 0; i < this.slidesLength + 1; i += 1) {
        var dot = document.createElement('li');
        dot.classList.add(this.opts.classNames.dots.item);
        dot.addEventListener('click', this.dotsHandler);
        this.dots.block.appendChild(dot);
      }

      if (this.opts.appendDots) {
        this.opts.appendDots.appendChild(this.dots.block);
      } else {
        this.block.appendChild(this.dots.block);
      }

      this.dots.items = this.dots.block.querySelectorAll(this.selectors.dots.item);
      this.dots.items.forEach(function (el, index) {
        _this.opts.callbacks.dotContent(el, index);
      });
      this.componentPush('dots');
      return this;
    },
    destroyDots: function destroyDots() {
      if (this.isComponentInit('dots')) {
        this.dots.block.remove();
        this.componentPop('dots');
      }

      return this;
    },
    dotsHandler: function dotsHandler(ev) {
      if (ev.currentTarget.classList.contains(this.opts.classNames.dots.active)) return;
      var findDotIndex = [].findIndex.call(this.dots.items, function (el) {
        return el === ev.currentTarget;
      });
      this.dots.items[this.activeSlide].classList.remove(this.opts.classNames.dots.active);
      ev.currentTarget.classList.add(this.opts.classNames.dots.active);
      this.moveTo(findDotIndex);
    },
    updateDots: function updateDots() {
      var _this2 = this;

      this.dots.items.forEach(function (el) {
        if (el.classList.contains(_this2.opts.classNames.dots.active)) {
          el.classList.remove(_this2.opts.classNames.dots.active);
        }
      });
      this.dots.items[this.activeSlide].classList.add(this.opts.classNames.dots.active);
      return this;
    }
  };

  /* eslint-env browser */
  var autoplay = {
    initAutoplay: function initAutoplay() {
      var _this = this;

      var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.opts.autoplay.delay;
      this.autoplay = {
        interval: setInterval(function () {
          if (_this.activeSlide === _this.slidesLength) {
            if (!_this.opts.loop) {
              _this.destroyAutoplay();

              if (_this.opts.nav) _this.updateNav();
              if (_this.opts.dots) _this.updateDots();
              return;
            }
          }

          _this.moveTo(_this.activeSlide + 1);
        }, delay),
        stop: false
      };
      this.block.addEventListener('mouseenter', this.hoverInHandler);
      this.block.addEventListener('mouseleave', this.hoverOutHandler);
      this.componentPush('autoplay');
      return this;
    },
    destroyAutoplay: function destroyAutoplay() {
      if (this.isComponentInit('autoplay') > -1) {
        clearInterval(this.autoplay.interval);
        this.componentPop('autoplay');
      }

      this.block.removeEventListener('mouseenter', this.hoverInHandler);
      this.block.removeEventListener('mouseleave', this.hoverOutHandler);
      return this;
    },
    hoverInHandler: function hoverInHandler() {
      if (this.opts.autoplay.stopOnHover) {
        this.autoplay.stop = true;
        clearInterval(this.autoplay.interval);
      }
    },
    hoverOutHandler: function hoverOutHandler() {
      if (this.opts.autoplay.stopOnHover) {
        this.autoplay.stop = false;
        this.initAutoplay();
      }
    }
  };

  var swipes = {
    initSwipes: function initSwipes() {
      this.wrapper.addEventListener('mousedown', this.touchstartHandler); // for firefox

      this.wrapper.addEventListener('mousemove', this.touchmoveHandler);
      this.block.addEventListener('mouseup', this.touchendHandler);
      this.wrapper.addEventListener('touchstart', this.touchstartHandler);
      this.wrapper.addEventListener('touchmove', this.touchmoveHandler);
      this.block.addEventListener('touchend', this.touchendHandler);
      this.componentPush('swipes');
      return this;
    },
    destroySwipes: function destroySwipes() {
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
    touchstartHandler: function touchstartHandler(ev) {
      ev.preventDefault();
      this.swipe = {
        translate: null,
        x: 0,
        prevX: 0,
        start: null,
        diff: null
      };
      this.wrapper.style.cursor = 'grab';
    },
    touchmoveHandler: function touchmoveHandler(ev) {
      var _this = this;

      ev.preventDefault();
      var direction;

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
              this.wrapper.style.transform = "translateX(".concat(this.swipe.translate, "px)");
            } else {
              this.opts.callbacks.onSwipe(this.activeSlide, this.activeSlide + 1, 'ltr', 'ieSwipe');
              this.moveTo(this.activeSlide + 1);
              this.wrapper.removeEventListener('mousemove', this.touchmoveHandler);
              setTimeout(function () {
                // троттлинг
                _this.wrapper.addEventListener('mousemove', _this.touchmoveHandler);
              }, 700);
            }
          }

          if (ev.touches) {
            this.opts.callbacks.onSwipe(this.activeSlide, this.activeSlide + 1, 'ltr', 'touchSwipe');
            this.moveTo(this.activeSlide + 1);
            this.wrapper.removeEventListener('touchmove', this.touchmoveHandler);
            setTimeout(function () {
              // троттлинг
              _this.wrapper.addEventListener('touchmove', _this.touchmoveHandler);
            }, 500);
          }

          break;

        case 'right':
          if (ev.buttons === 1) {
            if (ev.movementX) {
              this.wrapper.style.transition = 'none';
              this.swipe.translate += Math.abs(ev.movementX);
              this.wrapper.style.transform = "translateX(".concat(this.swipe.translate, "px)");
            } else {
              this.opts.callbacks.onSwipe(this.activeSlide, this.activeSlide + 1, 'rtl', 'ieSwipe');
              this.moveTo(this.activeSlide - 1);
              this.wrapper.removeEventListener('mousemove', this.touchmoveHandler);
              setTimeout(function () {
                // троттлинг
                _this.wrapper.addEventListener('mousemove', _this.touchmoveHandler);
              }, 700);
            }
          }

          if (ev.touches) {
            this.opts.callbacks.onSwipe(this.activeSlide, this.activeSlide - 1, 'rtl', 'touchSwipe');
            this.moveTo(this.activeSlide - 1);
            this.wrapper.removeEventListener('touchmove', this.touchmoveHandler);
            setTimeout(function () {
              // троттлинг
              _this.wrapper.addEventListener('touchmove', _this.touchmoveHandler);
            }, 500);
          }

          break;

        default:
          break;
      }
    },
    touchendHandler: function touchendHandler(ev) {
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
          var slideWidth = this.slides[0].clientWidth;

          if (this.opts.items) {
            slideWidth *= this.opts.items;
          }

          if (this.swipe.translate > -(slideWidth * this.activeSlide - slideWidth / 5)) {
            if (!this.opts.loop && this.activeSlide === 0) {
              this.moveTo(this.activeSlide);
              this.opts.callbacks.onSwipe(this.activeSlide, this.activeSlide, 'same', 'mouseSwipe');
              return;
            }

            this.opts.callbacks.onSwipe(this.activeSlide, this.activeSlide - 1, 'rtl', 'mouseSwipe');
            this.moveTo(this.activeSlide - 1);
          } else if (this.swipe.translate < -(slideWidth * this.activeSlide + slideWidth / 5)) {
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
    }
  };

  if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function value(target, firstSource) {

        if (target === undefined || target === null) {
          throw new TypeError('Cannot convert first argument to object');
        }

        var to = Object(target);

        for (var i = 1; i < arguments.length; i++) {
          var nextSource = arguments[i];

          if (nextSource === undefined || nextSource === null) {
            continue;
          }

          var keysArray = Object.keys(Object(nextSource));

          for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
            var nextKey = keysArray[nextIndex];
            var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);

            if (desc !== undefined && desc.enumerable) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }

        return to;
      }
    });
  }

  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
      thisArg = thisArg || window;

      for (var i = 0; i < this.length; i++) {
        callback.call(thisArg, this[i], i, this);
      }
    };
  }

  (function () {
    var arr = [window.Element, window.CharacterData, window.DocumentType];
    var args = [];
    arr.forEach(function (item) {
      if (item) {
        args.push(item.prototype);
      }
    }); // from:https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md

    (function (arr) {
      arr.forEach(function (item) {
        if (item.hasOwnProperty('remove')) {
          return;
        }

        Object.defineProperty(item, 'remove', {
          configurable: true,
          enumerable: true,
          writable: true,
          value: function remove() {
            this.parentNode.removeChild(this);
          }
        });
      });
    })(args);
  })();

  Math.sign = Math.sign || function (x) {
    x = +x; // преобразуем в число

    if (x === 0 || isNaN(x)) {
      return x;
    }

    return x > 0 ? 1 : -1;
  };

  if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function (predicate) {
      if (this == null) {
        throw new TypeError('Array.prototype.findIndex called on null or undefined');
      }

      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      var list = Object(this);
      var length = list.length >>> 0;
      var thisArg = arguments[1];
      var value;

      for (var i = 0; i < length; i++) {
        value = list[i];

        if (predicate.call(thisArg, value, i, list)) {
          return i;
        }
      }

      return -1;
    };
  }

  if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
      value: function value(searchElement, fromIndex) {
        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        } // 1. Let O be ? ToObject(this value).


        var o = Object(this); // 2. Let len be ? ToLength(? Get(O, "length")).

        var len = o.length >>> 0; // 3. If len is 0, return false.

        if (len === 0) {
          return false;
        } // 4. Let n be ? ToInteger(fromIndex).
        //    (If fromIndex is undefined, this step produces the value 0.)


        var n = fromIndex | 0; // 5. If n ≥ 0, then
        //  a. Let k be n.
        // 6. Else n < 0,
        //  a. Let k be len + n.
        //  b. If k < 0, let k be 0.

        var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        function sameValueZero(x, y) {
          return x === y || typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y);
        } // 7. Repeat, while k < len


        while (k < len) {
          // a. Let elementK be the result of ? Get(O, ! ToString(k)).
          // b. If SameValueZero(searchElement, elementK) is true, return true.
          if (sameValueZero(o[k], searchElement)) {
            return true;
          } // c. Increase k by 1.


          k++;
        } // 8. Return false


        return false;
      }
    });
  }

  var prototypes = {
    nav: nav,
    dots: dots,
    autoplay: autoplay,
    swipes: swipes
  };

  var Slippery =
  /*#__PURE__*/
  function () {
    function Slippery(block, _ref) {
      var args = _extends({}, _ref);

      _classCallCheck(this, Slippery);

      this.block = document.querySelector(block);
      if (!this.block) return;
      this.opts = args;
      Slippery.applyRestOptions(config, this.opts);
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

    _createClass(Slippery, [{
      key: "length",
      value: function length() {
        // public возвращает количество сгрупированных слайдов
        return this.slidesLength;
      }
    }, {
      key: "realLength",
      value: function realLength() {
        // public возвращает количество элементов с классом this.opts.classNames.slider.item
        return this.slides.length - 1;
      }
    }, {
      key: "elements",
      value: function elements() {
        // public
        return {
          slides: this.slides,
          nav: this.nav,
          dots: this.dots
        };
      }
    }, {
      key: "current",
      value: function current() {
        // public
        return this.activeSlide;
      }
    }, {
      key: "appendSlide",
      value: function appendSlide(el) {
        var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.realLength();
        // public
        var slide = document.createElement('div');
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
    }, {
      key: "prependSlide",
      value: function prependSlide(el) {
        var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.realLength();
        // public
        var slide = document.createElement('div');
        slide.classList.add(this.opts.classNames.slider.item);
        slide.appendChild(el.cloneNode(true));
        this.wrapper.insertBefore(slide, this.slides[index]);
        this.slides = this.wrapper.querySelectorAll(this.selectors.slider.item);
        this.destroyDots().initDots();
        this.set().updateControls();
        return slide;
      }
    }, {
      key: "removeSlide",
      value: function removeSlide() {
        var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.realLength();
        // public
        var before = this.slidesLength;
        var slide = this.slides[index],
            after;
        slide.remove();
        this.slides = this.wrapper.querySelectorAll(this.selectors.slider.item);
        this.destroyDots().initDots();
        after = this.slidesLength;

        if (before !== after && this.activeSlide === before) {
          if (typeof this.opts.margins === 'number') this.setMargins();
          this.setSlidesWidth().moveTo(this.activeSlide - 1);
          return slide;
        }

        this.updateControls();
        return slide;
      }
    }, {
      key: "setSlidesHeight",
      value: function setSlidesHeight() {
        var _this = this;

        if (this.opts.items - 1) {
          var heights = [],
              biggestHeight;
          this.slides.forEach(function (el, index) {
            if (_this.activeSlide === 0) {
              if (index <= _this.opts.items - 1) heights.push(el.clientHeight);
            }

            if (index >= (_this.activeSlide + 1) * _this.opts.items - _this.opts.items && index < (_this.activeSlide + 1) * _this.opts.items) {
              heights.push(el.clientHeight);
            }
          });
          biggestHeight = Math.max.apply(null, heights);
          this.block.style.height = "".concat(biggestHeight, "px");
        } else {
          this.block.style.height = "".concat(this.slides[this.activeSlide].clientHeight, "px");
        }

        return this;
      }
    }, {
      key: "isComponentInit",
      value: function isComponentInit(componentName) {
        var index = this.components.indexOf(componentName);
        return index !== -1;
      }
    }, {
      key: "componentPush",
      value: function componentPush(componentName) {
        this.components.push(componentName);
        return this;
      }
    }, {
      key: "componentPop",
      value: function componentPop(componentName) {
        var index = this.components.indexOf(componentName);
        this.components.splice(index, 1);
        return this;
      }
    }, {
      key: "addMethodsFromPrototypes",
      value: function addMethodsFromPrototypes() {
        Object.keys(prototypes).forEach(function (group) {
          Object.keys(prototypes[group]).forEach(function (method) {
            if (!Slippery.prototype[method]) {
              Slippery.prototype[method] = prototypes[group][method];
            }
          });
        });
        return this;
      }
    }, {
      key: "boundEventHandlers",
      value: function boundEventHandlers() {
        var _this2 = this;

        Object.keys(Slippery.prototype).filter(function (method) {
          return method.toLowerCase().match('handler');
        }).forEach(function (handler) {
          _this2[handler] = _this2[handler].bind(_this2);
        });
        return this;
      }
    }, {
      key: "init",
      value: function init() {
        window.addEventListener('resize', this.resizeHandler);
        this.defaultOpts = Slippery.deepCloneObject(this.opts);
        this.initWrapper().set().initModules().updateControls();
        this.opts.callbacks.afterInit();
        return this;
      }
    }, {
      key: "set",
      value: function set() {
        if (typeof this.opts.margins === 'number') this.setMargins();
        this.setSlidesWidth().moveTo(this.activeSlide, false);
        return this;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.destroyModules().destroyWrapper();
        window.removeEventListener('resize', this.resizeHandler);
        this.slides.forEach(function (el) {
          el.removeAttribute('style');
        });
      }
    }, {
      key: "initModules",
      value: function initModules() {
        if (this.opts.dots) this.initDots();
        if (this.opts.nav) this.initNav();
        if (this.opts.autoplay) this.initAutoplay();
        if (this.opts.swipes) this.initSwipes();
        return this;
      }
    }, {
      key: "updateControls",
      value: function updateControls() {
        if (this.isComponentInit('dots')) this.updateDots();
        if (this.isComponentInit('nav')) this.updateNav();
        return this;
      }
    }, {
      key: "destroyModules",
      value: function destroyModules() {
        if (this.isComponentInit('dots')) this.destroyDots();
        if (this.isComponentInit('nav')) this.destroyNav();
        if (this.isComponentInit('autoplay')) this.destroyAutoplay();
        if (this.isComponentInit('swipes')) this.destroySwipes();
        return this;
      }
    }, {
      key: "setMargins",
      value: function setMargins() {
        var _this3 = this;

        this.slides.forEach(function (el) {
          var slide = el;
          slide.style.marginLeft = "".concat(_this3.opts.margins, "px");
        });
        this.wrapper.style.marginLeft = "-".concat(this.opts.margins / 2, "px");
        return this;
      }
    }, {
      key: "setResponsive",
      value: function setResponsive(windowWidth) {
        var _this4 = this;

        var breakpoint = this.breakpoint;

        if (windowWidth < breakpoint) {
          Object.keys(this.opts.responsive[breakpoint]).forEach(function (prop) {
            _this4.opts[prop] = _this4.opts.responsive[breakpoint][prop];
          });
        }

        return this;
      }
    }, {
      key: "applyResponsive",
      value: function applyResponsive() {
        if (this.opts.destroy) {
          this.destroy();
          return this;
        }

        if (!this.components) {
          console.log('reinit');
          this.init();
        }

        this.destroyModules().initModules().updateControls().set();
        return this;
      }
    }, {
      key: "setDefault",
      value: function setDefault() {
        var _this5 = this;

        Object.keys(this.defaultOpts).forEach(function (prop) {
          if (prop === 'responsive') return;
          _this5.opts[prop] = _this5.defaultOpts[prop];
        });
        return this;
      }
    }, {
      key: "resizeHandler",
      value: function resizeHandler() {
        var width = Slippery.windowWidth;
        var viewport = this.viewport,
            breakpoint = this.breakpoint;
        this.setSlidesWidth().moveTo(this.activeSlide, false);

        if (this.opts.responsive) {
          if (width < breakpoint) {
            this.setDefault().setResponsive(width).applyResponsive();
            this.opts.callbacks.onResize(width, viewport, breakpoint);
          } else {
            this.opts.callbacks.onResize(width, viewport, false);
          }
        } else {
          this.opts.callbacks.onResize(width, viewport, false);
        }
      }
    }, {
      key: "initWrapper",
      value: function initWrapper() {
        var _this6 = this;

        this.wrapper = document.createElement('div');
        this.wrapper.classList.add(this.opts.classNames.slider.wrapper);
        this.slides.forEach(function (el) {
          _this6.wrapper.appendChild(el);
        });
        this.slides = this.wrapper.querySelectorAll(this.selectors.slider.item);
        this.block.appendChild(this.wrapper);
        return this;
      }
    }, {
      key: "destroyWrapper",
      value: function destroyWrapper() {
        var _this7 = this;

        this.slides.forEach(function (el) {
          _this7.block.appendChild(el);
        });
        this.wrapper.remove();
        return this;
      }
    }, {
      key: "loop",
      value: function loop(nextIndex) {
        if (nextIndex === -1) {
          this.activeSlide = this.slidesLength;
        } else if (nextIndex === this.slidesLength + 1) {
          this.activeSlide = 0;
        } else {
          this.activeSlide = nextIndex;
        }
      }
    }, {
      key: "setSlidesWidth",
      value: function setSlidesWidth() {
        var viewport = this.viewport;
        if (this.opts.items) viewport /= this.opts.items;
        if (this.opts.margins) viewport -= this.opts.margins;
        this.slides.forEach(function (el) {
          var slide = el;
          slide.style.width = "".concat(viewport, "px");
        });
        return this;
      }
    }, {
      key: "setTranslate",
      value: function setTranslate() {
        this.wrapper.style.transform = "translateX(-".concat((this.slideWidth + this.opts.margins) * this.activeSlide * this.opts.items, "px)");
        return this;
      }
    }, {
      key: "setSlidesClassNames",
      value: function setSlidesClassNames(prevIndex, nextIndex) {
        var _this8 = this;

        this.slides.forEach(function (el) {
          var slide = el;
          slide.classList.remove(_this8.opts.classNames.slider.prev);
        });

        if (this.opts.loop) {
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
    }, {
      key: "moveTo",
      value: function moveTo(index) {
        var transition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var _this$opts$transition = this.opts.transition,
            type = _this$opts$transition.type,
            duration = _this$opts$transition.duration,
            delay = _this$opts$transition.delay;
        if ((index > this.slidesLength || index < 0) && !this.opts.loop) return;
        this.opts.callbacks.beforeMove(this.activeSlide, index);
        this.setSlidesClassNames(this.activeSlide, index);
        if (this.opts.loop) this.loop(index);else this.activeSlide = index;
        if (transition) this.wrapper.style.transition = "transform ".concat(duration, "ms ").concat(type, " ").concat(delay, "ms");else this.wrapper.style.transition = '';
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
    }, {
      key: "viewport",
      get: function get() {
        return this.wrapper.clientWidth;
      }
    }, {
      key: "slideWidth",
      get: function get() {
        return this.slides[0].clientWidth;
      }
    }, {
      key: "breakpoint",
      get: function get() {
        if (this.opts.responsive) {
          return Slippery.findClosestNum(Object.keys(this.opts.responsive), Slippery.windowWidth);
        }

        return false;
      }
    }, {
      key: "slidesLength",
      get: function get() {
        if (this.opts.items) return Math.ceil(this.slides.length / this.opts.items) - 1;
        return this.slides.length - 1;
      }
    }], [{
      key: "deepCloneObject",
      value: function deepCloneObject(source) {
        var clone = {};
        Object.keys(source).forEach(function (prop) {
          if (source[prop] !== null && _typeof(source[prop]) === 'object') {
            clone[prop] = Slippery.deepCloneObject(source[prop]);
          } else {
            clone[prop] = source[prop];
          }
        });
        return clone;
      }
    }, {
      key: "applyRestOptions",
      value: function applyRestOptions(source, target) {
        if (_typeof(source) !== 'object') return; // for ie11

        Object.keys(source).forEach(function (prop) {
          if (typeof target[prop] === 'undefined') target[prop] = source[prop];
          if (_typeof(source) === 'object') Slippery.applyRestOptions(source[prop], target[prop]);
        });
      }
    }, {
      key: "findClosestNum",
      value: function findClosestNum(array, num) {
        return array.reduce(function (prev, curr) {
          return prev < num && num > prev ? curr : prev;
        });
      }
    }, {
      key: "makeSelectorsFromClassnames",
      value: function makeSelectorsFromClassnames(classNames) {
        var selectors = JSON.parse(JSON.stringify(classNames));

        function findStringAndAddDotToIt(obj) {
          Object.keys(obj).forEach(function (prop) {
            if (_typeof(obj[prop]) === 'object') return findStringAndAddDotToIt(obj[prop]);
            if (typeof obj[prop] === 'string') obj[prop] = ".".concat(obj[prop]);
          });
        }

        findStringAndAddDotToIt(selectors);
        return selectors;
      }
    }, {
      key: "windowWidth",
      get: function get() {
        return window.innerWidth;
      }
    }]);

    return Slippery;
  }();

  return Slippery;

})));
