const nav = document.querySelector('.navblock');
const dot = document.querySelector('.dotblock');

const slider = new Slippery('.slippery', {
  centered: false,
  loop: true,
  swipes: true,
  adaptiveHeight: true,
  items: 1,
  // appendDots: dot,
  // appendNav: nav,
  margins: 30,
  // autoplay: {
  //     delay: 500,
  //     stopOnHover: true,
  // },
  responsive: {
    1200: {
      margins: 0,
      swipes: true,
    },
    800: {
      items: 2,
      swipes: true,
      nav: false,
    },
    600: {
      nav: false,
      swipes: true,
      items: 3,
    },
  },
  callbacks: {
    onResize: function (width, viewport, breakpoint) {
      console.log('onResize', width, viewport, breakpoint);
    },
    onSwipe: function (index, nextIndex, direction, type) {
      console.log('onSwipe', index, nextIndex, direction, type);
    },
    beforeMove: function(prev, next) {
      console.log('beforeMove', prev, next);
    },
    afterMove: function(current) {
      console.log('aftermove', current);
    },
    beforeInit: function () {
      console.log('beforeinit');
    },
    afterInit: function () {
      console.log('afterinit');
    },
  },
});

const newslide = document.createElement('p');
newslide.innerHTML = '123123123';
