import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import assert from 'assert';

import LazyLoadImage from './LazyLoadImage.jsx';

const {
  scryRenderedDOMComponentsWithClass,
  scryRenderedDOMComponentsWithTag
} = ReactTestUtils;

describe('LazyLoadImage', function() {
  function renderLazyLoadImage({
      afterLoad = () => null,
      beforeLoad = () => null,
      placeholder = null,
      scrollPosition = {x: 0, y: 0}
    } = {}) {
    return ReactTestUtils.renderIntoDocument(
      <LazyLoadImage
        afterLoad={afterLoad}
        beforeLoad={beforeLoad}
        placeholder={placeholder}
        scrollPosition={scrollPosition}
        src="" />
    );
  }

  function expectImages(wrapper, numberOfImages) {
    const img = scryRenderedDOMComponentsWithTag(wrapper, 'img');

    expect(img.length).toEqual(numberOfImages);
  }

  function expectPlaceholders(wrapper, numberOfPlaceholders, placeholderClassName = 'lazy-load-image-placeholder') {
    const placeholder = scryRenderedDOMComponentsWithClass(wrapper, placeholderClassName);

    expect(placeholder.length).toEqual(numberOfPlaceholders);
  }

  it('renders the default placeholder when it\'s not in the viewport', function() {
    const lazyLoadImage = renderLazyLoadImage({
      scrollPosition: {x: 0, y: -1000}
    });

    expectImages(lazyLoadImage, 0);
    expectPlaceholders(lazyLoadImage, 1);
  });

  it('renders the prop placeholder when it\'s not in the viewport', function() {
    const placeholder = <span className="test-placeholder"></span>;
    const lazyLoadImage = renderLazyLoadImage({
      scrollPosition: {x: 0, y: -1000},
      placeholder
    });

    expectImages(lazyLoadImage, 0);
    expectPlaceholders(lazyLoadImage, 1, 'test-placeholder');
  });

  it('renders the image when it\'s in the viewport', function() {
    const lazyLoadImage = renderLazyLoadImage();

    expectImages(lazyLoadImage, 1);
    expectPlaceholders(lazyLoadImage, 0);
  });

  it('renders the image when it appears in the viewport', function() {
    const lazyLoadImage = renderLazyLoadImage({
      scrollPosition: {x: 0, y: -1000}
    });

    lazyLoadImage.componentWillReceiveProps({scrollPosition:  {x: 0, y: 0}});

    expectImages(lazyLoadImage, 1);
    expectPlaceholders(lazyLoadImage, 0);
  });

  it('renders the image when it appears in the viewport horizontally', function() {
    const lazyLoadImage = renderLazyLoadImage({
      scrollPosition: {x: -1000, y: 0}
    });

    lazyLoadImage.componentWillReceiveProps({scrollPosition:  {x: 0, y: 0}});

    expectImages(lazyLoadImage, 1);
    expectPlaceholders(lazyLoadImage, 0);
  });

  it('doesn\'t trigger beforeLoad when the image is not the viewport', function() {
    const beforeLoad = jest.fn();
    const lazyLoadImage = renderLazyLoadImage({
      beforeLoad,
      scrollPosition: {x: 0, y: -1000}
    });

        expect(beforeLoad).toHaveBeenCalledTimes(0);
  });

  it('triggers beforeLoad when the image is in the viewport', function() {
    const beforeLoad = jest.fn();
    const lazyLoadImage = renderLazyLoadImage({
      beforeLoad
    });

    expect(beforeLoad).toHaveBeenCalledTimes(1);
  });

  it('triggers beforeLoad when the image appears in the viewport', function() {
    const beforeLoad = jest.fn();
    const lazyLoadImage = renderLazyLoadImage({
      beforeLoad,
      scrollPosition: {x: 0, y: -1000}
    });

    lazyLoadImage.componentWillReceiveProps({scrollPosition:  {x: 0, y: 0}});

    expect(beforeLoad).toHaveBeenCalledTimes(1);
  });

  it('doesn\'t trigger afterLoad when the image is not the viewport', function() {
    const afterLoad = jest.fn();
    const lazyLoadImage = renderLazyLoadImage({
      afterLoad,
      scrollPosition: {x: 0, y: -1000}
    });

    expect(afterLoad).toHaveBeenCalledTimes(0);
  });

  it('triggers afterLoad when the image is in the viewport', function() {
    const afterLoad = jest.fn();
    const lazyLoadImage = renderLazyLoadImage({
      afterLoad
    });

    expect(afterLoad).toHaveBeenCalledTimes(1);
  });

  it('triggers afterLoad when the image appears in the viewport', function() {
    const afterLoad = jest.fn();
    const lazyLoadImage = renderLazyLoadImage({
      afterLoad,
      scrollPosition:  {x: 0, y: -1000}
    });

    lazyLoadImage.componentWillReceiveProps({scrollPosition: {x: 0, y: 0}});

    expect(afterLoad).toHaveBeenCalledTimes(1);
  });
});
