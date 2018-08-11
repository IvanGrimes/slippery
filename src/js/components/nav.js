/* eslint-env browser */
export default {
  initNav() {
    this.nav = {
      block: document.createElement('div'),
      prev: document.createElement('button'),
      next: document.createElement('button'),
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
  updateNav() {
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
  navHandler(ev) {
    const target = ev.currentTarget;

    if (target === this.nav.prev) this.moveTo(this.activeSlide - 1);

    if (target === this.nav.next) this.moveTo(this.activeSlide + 1);
  },
  destroyNav() {
    if (this.isComponentInit('nav')) {
      this.nav.block.remove();
      this.componentPop('nav');
    }

    return this;
  },
};
