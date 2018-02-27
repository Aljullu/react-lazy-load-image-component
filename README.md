React Lazy Load Image Component
===============================

React Component to lazy load images using a HOC to track window scroll position.


## Features

* Two components: a HOC to track the scroll position and a component to render the image.
* Handles scroll events, resize events and re-renders that might change the position of the components.
* Placeholder by default with the same size of the image.
* A custom placeholder and threshold can be specified.
* `beforeLoad` and `afterLoad` events.
* Accepts all standard `<img>` attributes.
* No dependencies other than `react` and `react-dom`.


## Installation

1. Install react-lazy-load-image-component as a dependency:
```bash
# Yarn
$ yarn add react-lazy-load-image-component

# NPM
$ npm i --save react-lazy-load-image-component
```
2. Import the LazyLoadImage component:
```javascript
import { LazyLoadImage } from 'react-lazy-load-image-component'
```

3. Import the trackWindowScroll HOC:
```javascript
import { trackWindowScroll } from 'react-lazy-load-image-component'
```


## Usage

```javascript
import React from 'react';
import { LazyLoadImage, trackWindowScroll }
  from 'react-lazy-load-image-component';

const Gallery = ({ images, scrollPosition }) => (
  <div>
    {images.map((image) =>
      <LazyLoadImage
        key={image.key}
        alt={image.alt}
        height={image.height}
        scrollPosition={scrollPosition} // pass the scrollPosition
        src={image.src} // use normal <img> attributes as props
        width={image.width} />
    )}
  </div>
);
// Wrap Gallery with trackWindowScroll HOC so it receives
// a scrollPosition prop to pass down to the images
export default trackWindowScroll(Gallery);
```

## Props

| Prop | Type | Description |
|:---|:---|:---|
| scrollPosition | `Object` | Object containing `x` and `y` with the curent window scroll position. Required. |
| afterLoad | `Function` | Function called after the image has been rendered. |
| beforeLoad | `Function` | Function called right before the image is rendered. |
| placeholder | `ReactClass` | A React element to use as a placeholder. |
| threshold | `Number` | Threshold in pixels. So the image starts loading before it appears in the viewport. _Defaults to 100._ |
| ... |  | Any other image attribute |


## Screenshot

<a href="https://raw.githubusercontent.com/Aljullu/react-lazy-load-image-component/master/screenshots/example.gif"><img src="https://raw.githubusercontent.com/Aljullu/react-lazy-load-image-component/master/screenshots/example.gif" alt="" /></a>

Get the [full code of this example](https://github.com/Aljullu/weather-app).
