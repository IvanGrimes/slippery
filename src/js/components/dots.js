/* eslint-env browser */
export default {
  initDots() {
    this.dots = {
      block: document.createElement('ul'),
      items: null,
    };

    this.dots.block.classList.add(this.opts.classNames.dots.block);

    for (let i = 0; i < this.slidesLength + 1; i += 1) {
      const dot = document.createElement('li');
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

    this.dots.items.forEach((el, index) => {
      this.opts.callbacks.dotContent(el, index);
    });

    this.componentPush('dots');

    return this;
  },
  destroyDots() {
    if (this.isComponentInit('dots')) {
      this.dots.block.remove();
      this.componentPop('dots');
    }

    return this;
  },
  dotsHandler(ev) {
    if (ev.currentTarget.classList.contains(this.opts.classNames.dots.active)) return;

    const findDotIndex = [].findIndex.call(this.dots.items, el => el === ev.currentTarget);

    this.dots.items[this.activeSlide].classList.remove(this.opts.classNames.dots.active);
    ev.currentTarget.classList.add(this.opts.classNames.dots.active);
    this.moveTo(findDotIndex);
  },
  updateDots() {
    this.dots.items.forEach((el) => {
      if (el.classList.contains(this.opts.classNames.dots.active)) {
        el.classList.remove(this.opts.classNames.dots.active);
      }
    });

    this.dots.items[this.activeSlide].classList.add(this.opts.classNames.dots.active);

    return this;
  },
};
