[![Build Status](https://travis-ci.org/IvanGrimes/slippery.svg?branch=master)](https://travis-ci.org/IvanGrimes/slippery/)
[![Dependencies](https://david-dm.org/IvanGrimes/slippery.svg)](https://david-dm.org/IvanGrimes/slippery)
# Slippery 1.1.2
### Pure Javascript (ES6) and BEM friendly slider

## Getting started
Slippery has a few methods to connect to your project: CDN, npm or downloading latest release.
### CDN
For using slippery with CDN you need to include CSS in your <head> tag.
##### Instead x.x.x in slippery@x.x.x put version from the top readme.
```html
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/slippery@x.x.x/dist/css/slippery.min.css">
```

Also needed inclusion Javascript before closing <body> tag.
``` HTML
<script src="//cdn.jsdelivr.net/npm/slippery@x.x.x/dist/js/slippery.min.js"></script>
```

### npm
Firstly install slippery package from npm.
```
npm i -D slippery
```

#### Include Javascript
##### If you're using Webpack
In your Javascript file import slippery.
```html
import Slippery from 'slippery';
```

##### If you're not using Javascript bundler.
Then move slippery.min.js from directory /node_modules/slippery/dist/js/ in your project folder.
Include this one before closing <body> tag
```html
<script src="/path/to/dir/slippery.min.js"></script>
```

#### Include CSS
##### If you're Sass/SCSS or another CSS preprocessor.
Import slippery.min.css in your Sass/SCSS file using '@import'.
```scss
@import "/node_modules/slippery/dist/css/slippery.min.css"
```
If you're using another preprocessor, use equivalent of it.

##### If you're not using CSS preprocessor.
Then just include slippery.min.css inside of <head> tag.
```html
<link rel="stylesheet" href="/path/to/dir/slippery.min.css">
```

### Release
If you don't want to use CDN and you don't use npm, then you need to download latest release
from https://github.com/IvanGrimes/slippery/releases
After that unpack archive and move CSS/JS files from slippery-x.x.x/dist/ to where you want to.
Finally include slippery.min.css inside <head> tag.
```html
<link rel="stylesheet" href="/path/to/dir/slippery.min.css">
```
Also include slippery.min.js before closing <body> tag.
```html
<script src="/path/to/dir/slippery.min.js"></script>
```

### HTML Markup
```html
<div class="slippery">
  <div class="slippery__item">Slide 1</div>
  <div class="slippery__item">Slide 2</div>
  <div class="slippery__item">Slide 3</div>
</div>
```

## Using
After including slippery with one of methods and adding HTML markup.
Initialize slippery instance in your Javascript file or inside <script> tag.

### Initialization
```javascript
const slippery = new Slippery('.slippery');
```
After that slippery instance will be initialized with default settings.

### Initialization with custom settings
If you want to pass your own settings into slippery,
you also need to pass an object besides passing string with CSS selector.
```javascript
const slippery = new Slippery('.slippery', {
  nav: true,
  dots: true,
  swipes: false,
  margins: 15,
  adaptiveHeight: true,
  items: 2,
  transition: {
    type: 'ease-in-out',
  },
  breakpoints: {
    420: {
      swipes: true,
      nav: false,
    },
  },
});
```


## API
### Settings
| Option | Type | Default/Arguments | Description
|--------|------|-------------------|------------|  
| selector | string | none (Example: '.slider') | Selector for element (block) in which the slippery initializes
| { | object |  |
| init | boolean | true | Initialization instance as soon as it created
| destroy | boolean | false | Destroying slippery instance (For example, you can set it in 'true' in breakpoint object and when breakpoint will be reached slider will be destroyed)
| nav | boolean | true | Enable/disable prev/next buttons
| dots | boolean | true | Enable/disable dots navigation
| loop | boolean | true | Enable/disable infinite looping
| items | number | 1 | The number of items on the screen
| centered | boolean | false | Autoselect middle slide as active
| swipes | boolean | true | Enable/disable swipes on desktop and touch devices
| margins | number | 0 | Set margin-left of the slide to this value
| activeSlide | number | 0 | Set active slide after initialize
| adaptiveHeight | boolean | false | If set to 'true' then slider block will adapt to the height of slide
| appendNav | node | false | If pass the node then 'nav' block will be attached to the passed element
| appendDots | node | false | If pass the node then dots block will be attached to the passed element
| classNames: { | object |  |  
| slider: { | object |  |  
| wrapper | string | 'slider__wrapper' | className(element) for slippery wrapper
| item | string | 'slider__item' | className(element) for slippery item
| active | string | 'slider__item--active' | className(modificator) for the active slide
| prev | string | 'slider__item--prev' | className(modificator) for the previous active slide
| }, |  |  |  
| nav: { | object |  |  
| block | string | 'slider__nav' | className(element) for nav block
| item | string | 'slider__nav-item' | className(element) for item of nav
| prev | string | 'slider__nav-item--prev' | className(modificator) for the 'prev' button of nav item
| next | string | 'slider__nav-item--next' | className(modificator) for the 'next' button of nav item
| disabled | string | 'slider__nav-item--disabled' | className(modificator) for the disabled button of nav item
| }, |  |  |  
| dots: { |  |  |  
| block | string | 'slider__dots' | className(element) for dots block
| item | string | 'slider__dots-item' | className(element) for item of dots block
| active | string | 'slider__dots-item--active' | className(modificator) for active item of dots item
| }, |  |  |  
| }, |  |  |  
| transition: { | object |  |  
| type | string | 'linear' | type of css transition
| delay | number | 0 | delay(in ms) before css transition
| duration | number | 300 | duration(in ms) of css transition
| }, |  |  |  
| } |  |  |  

### Default object with settings
```javascript
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
```

### Callbacks
Just pass the callbacks object with necessary functions inside into the configuration object of slippery.
Example:
```javascript
const slippery = new Slippery('.slippery', {
  nav: true,
  dots: true,
  callbacks: {
    afterInit: function() {
      console.log(`It's works!`);
    },
    dotContent: function(el, index) {
      el.innerText = `${index}`;
    },
  },
});
```

| Option | Type | Arguments | Description
|--|--|--|--|
| callbacks: { | object |  |
| dotContent | function | el, index | Function takes two arguments: el(node of the dot) and index (index of the dot). For example, you can change rendering content of each dot
| navContent | function | prev, next | Function takes two arguments: prev(node of the previous button) and next(node of the next button). For example, you can change rendering content of buttons
| beforeMove | function | currentIndex, nextIndex | Function takes two arguments: currentIndex(index of the current slide) and nextIndex(index of the next slide). Fires before movement is finished
| afterMove | function | currentIndex | Function takes only one argument: currentIndex(index of the current slide, that was in beforeMove() nextIndex). Fires when the movement(NOT transition) is finished
| onResize | function | width, viewport, breakpoint | Function takes three arguments: width(width of the window), viewport(width of the slider), breakpoint(value of the breakpoint for which conditions works, if there's no suitable breakpoint then function returns false)
| onSwipe | function | currentIndex, nextIndex, direction, result  | Function takes four arguments: currentIndex(index of the current slide), nextIndex(index of the next slide), direction(direction of the slide can be 'ltr' (left-to-right) if swipe was from left to right or 'rtl' (right-to-left)
| beforeInit | function | none | Fires before initializing of the instance
| afterInit | function | none | Fires after initializing of the instance
| }, |  |  |

### Methods
| Method | Argument | Description
|--------|----------|------------|  
| moveTo | index: number, transition: boolean | Goes to slide by index skipping animation if second argument is set to false
| autoplay | delay: number in ms | Initialize autoplay with delay passed as argument
| destroyAutoplay | none | Stop autoplay
| length | none | Returns a number of the grouped slides (if the 'items' option is set to greater than 1)
| realLength | none | Returns the real number of the slides (may be needed when you set items option to the value greater than 1 and want to know amount of the elements with className 'slippery__item')
| elements | none | Returns an object with all elements associated with the instance (slides, dots, etc)
| current | none |  Returns an index of the current active slide
| appendSlide | el: node, index: number* | Adds node after slide, if index doesn't passed then add node after last slide. Returns an added element
| prependSlide | el: node, index: number* | Adds node before slide, if index doesn't passed then add node before last slide. Returns an added element
| removeSlide | el: node, index: number* | Removes slide, if index doesn't passed then deletes last slide. Returns a deleted element

### Browser compatibility
Internet Explorer 11
Edge
Google Chrome (at least last 15 versions)
Mozilla Firefox (at least last 15 versions)
Opera (at least last 15 versions)
