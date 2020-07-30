# remotion

[![Version Badge][version-image]][project-url]
[![Build Status][build-image]][build-url]
[![License][license-image]][license-url]

> Animate elements before removing them from the DOM

## Install

Download the [CJS](https://github.com/ryanmorr/remotion/raw/master/dist/remotion.cjs.js), [ESM](https://github.com/ryanmorr/remotion/raw/master/dist/remotion.esm.js), [UMD](https://github.com/ryanmorr/remotion/raw/master/dist/remotion.umd.js) versions or install via NPM:

```sh
npm install @ryanmorr/remotion
```

## Usage

Import the library:

```javascript
import remotion from '@ryanmorr/remotion';
```

Provide an element, nodelist, or selector string as the first argument and a CSS class name as the second argument that triggers a CSS transition or keyframe animation. It returns a promise that is resolved when the transition/animation is complete and the element has been removed from the DOM:

```javascript
remotion(element, 'fade-out').then(() => console.log('element removed'));
```

Supports a function as the second argument that is provided the element reference and returns the class name:

```javascript
remotion('.item', (element) => 'fade-out');
```

If the function defines a second parameter, the function can now be used to fully customize the removal process. The second parameter is a function to call when finished to remove the element from the DOM and resolve the promise:

```javascript
remotion(nodelist, (element, done) => fadeOut(element).then(done));
```

## License

This project is dedicated to the public domain as described by the [Unlicense](http://unlicense.org/).

[project-url]: https://github.com/ryanmorr/remotion
[version-image]: https://badge.fury.io/gh/ryanmorr%2Fremotion.svg
[build-url]: https://travis-ci.org/ryanmorr/remotion
[build-image]: https://travis-ci.org/ryanmorr/remotion.svg
[license-image]: https://img.shields.io/badge/license-Unlicense-blue.svg
[license-url]: UNLICENSE