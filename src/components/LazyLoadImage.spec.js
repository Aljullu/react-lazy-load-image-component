import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import assert from 'assert';

import LazyLoadImage from './LazyLoadImage.jsx';

const {
  scryRenderedDOMComponentsWithClass,
  scryRenderedDOMComponentsWithTag
} = ReactTestUtils;

describe('LazyLoadImage', function() {
  function renderLazyLoadImage(scrollPosition = 0, placeholder = null) {
    return ReactTestUtils.renderIntoDocument(
      <LazyLoadImage
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
    const lazyLoadImage = renderLazyLoadImage(-1000);

    expectImages(lazyLoadImage, 0);
    expectPlaceholders(lazyLoadImage, 1);
  });

  it('renders the prop placeholder when it\'s not in the viewport', function() {
    const placeholder = <span className="test-placeholder"></span>;
    const lazyLoadImage = renderLazyLoadImage(-1000, placeholder);

    expectImages(lazyLoadImage, 0);
    expectPlaceholders(lazyLoadImage, 1, 'test-placeholder');
  });

  it('renders the image when it\'s in the viewport', function() {
    const lazyLoadImage = renderLazyLoadImage();

    expectImages(lazyLoadImage, 1);
    expectPlaceholders(lazyLoadImage, 0);
  });

  it('renders the image when it appears in the viewport', function() {
    const lazyLoadImage = renderLazyLoadImage(-1000);

    lazyLoadImage.componentWillReceiveProps({scrollPosition: 0});

    expectImages(lazyLoadImage, 1);
    expectPlaceholders(lazyLoadImage, 0);
  });
});
