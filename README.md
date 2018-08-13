[![Build Status](https://travis-ci.org/IvanGrimes/slippery.svg?branch=master)](https://travis-ci.org/IvanGrimes/slippery/)
[![Dependencies](https://david-dm.org/IvanGrimes/slippery.svg)](https://david-dm.org/IvanGrimes/slippery)
# Slippery 1.1.4
### [Read full documentation](https://ivangrimes.github.io/slippery/)

## Getting started
Slippery has a few methods to connect to your project: CDN, npm or downloading latest release.
### CDN
For using slippery with CDN you need to include CSS in your ``<head>`` tag.
##### Instead **x.x.x** in slippery@**x.x.x** put version from the top readme.
```html
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/slippery@x.x.x/dist/css/slippery.min.css">
```

Also needed inclusion Javascript before closing ``<body>`` tag.
```html
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
```javascript
import Slippery from 'slippery';
```

##### If you're not using Javascript bundler.
Then move slippery.min.js from directory /node_modules/slippery/dist/js/ in your project folder.   
Include this one before closing ``<body>`` tag
```html
<script src="/path/to/dir/slippery.min.js"></script>
```

#### Include CSS
##### If you're Sass/SCSS or another CSS preprocessor.
Import slippery.min.css in your Sass/SCSS file using ``@import``.
```scss
@import "/node_modules/slippery/dist/css/slippery.min.css"
```
If you're using another preprocessor, use equivalent of it.

##### If you're not using CSS preprocessor.
Then just include slippery.min.css inside of ``<head>`` tag.
```html
<link rel="stylesheet" href="/path/to/dir/slippery.min.css">
```

### Release
If you don't want to use CDN and you don't use npm, then you need to download latest release
from [Releases](https://github.com/IvanGrimes/slippery/releases).   
After that unpack archive and move CSS/JS files from slippery-x.x.x/dist/ to where you want to.   
Finally include slippery.min.css inside ``<head>`` tag.
```html
<link rel="stylesheet" href="/path/to/dir/slippery.min.css">
```
Also include slippery.min.js before closing **<body>** tag.
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
Initialize slippery instance in your Javascript file or inside ``<script>`` tag.

### Initialization
```javascript
const slippery = new Slippery('.slippery');
```
After that slippery instance will be initialized with default settings.

### Initialization with custom settings
If you want to pass your own settings into slippery, you also need to pass an object besides passing string with CSS selector.
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
