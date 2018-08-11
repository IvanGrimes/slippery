const config = {
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
            prev: 'slippery__item--prev',
        },
        nav: {
            block: 'slippery__nav',
            item: 'slippery__nav-button',
            prev: 'slippery__nav-button--prev',
            next: 'slippery__nav-button--next',
            disabled: 'slippery__nav-button--disabled',
        },
        dots: {
            block: 'slippery__dots',
            item: 'slippery__dots-item',
            active: 'slippery__dots-item--active',
        },
    },
    transition: {
        type: 'linear',
        delay: 0,
        duration: 750,
    },
    callbacks: {
        dotContent: function() {},
        navContent: function(prev, next) {
            prev.innerText = '‹';
            next.innerText = '›';
        },
        beforeMove: function() {},
        afterMove: function() {},
        onResize: function() {},
        onSwipe: function() {},
        beforeInit: function() {},
        afterInit: function() {},
    },
};

export default config;
