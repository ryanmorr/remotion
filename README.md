# remotion

[![Version Badge][version-image]][project-url]
[![License][license-image]][license-url]
[![Build Status][build-image]][build-url]

> Animate elements before removing them from the DOM

## Install

Download the [CJS](https://github.com/ryanmorr/remotion/raw/master/dist/cjs/remotion.js), [ESM](https://github.com/ryanmorr/remotion/raw/master/dist/esm/remotion.js), [UMD](https://github.com/ryanmorr/remotion/raw/master/dist/umd/remotion.js) versions or install via NPM:

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

If the function returns a promise, it can now be used to fully customize the removal process. You can perform a custom animation, execute side effects, and/or explicitly remove the element from the DOM yourself, then simply resolve the promise when your done:

```javascript
remotion(nodelist, (element) => {
    return new Promise((resolve) => {
        fadeOut(element).then(() => {
            executeSideEffect(element);
            element.remove();
            resolve();
        });
    });
});
```

## License

This project is dedicated to the public domain as described by the [Unlicense](http://unlicense.org/).

[project-url]: https://github.com/ryanmorr/remotion
[version-image]: https://img.shields.io/github/package-json/v/ryanmorr/remotion?color=blue&style=flat-square
[build-url]: https://github.com/ryanmorr/remotion/actions
[build-image]: https://img.shields.io/github/actions/workflow/status/ryanmorr/remotion/node.js.yml?style=flat-square
[license-image]: https://img.shields.io/github/license/ryanmorr/remotion?color=blue&style=flat-square
[license-url]: UNLICENSE
