import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import assert from 'assert';

import LazyLoadImage from './LazyLoadImage.jsx';

const {
  scryRenderedDOMComponentsWithClass,
  scryRenderedDOMComponentsWithTag
} = ReactTestUtils;

describe('LazyLoadImage', function() {
  function renderLazyLoadImage(scrollPosition) {
    return ReactTestUtils.renderIntoDocument(
      <LazyLoadImage
        scrollPosition={scrollPosition}
        src="" />
    );
  }

  function expectImages(wrapper, numberOfImages) {
    const img = scryRenderedDOMComponentsWithTag(wrapper, 'img');

    expect(img.length).toEqual(numberOfImages);
  }

  function expectPlaceholders(wrapper, numberOfPlaceholders) {
    const placeholder = scryRenderedDOMComponentsWithClass(wrapper,
      'lazy-load-image-placeholder');

    expect(placeholder.length).toEqual(numberOfPlaceholders);
  }

  it('renders the placeholder when it\'s not in the viewport', function() {
    const lazyLoadImage = renderLazyLoadImage(-1000);

    expectImages(lazyLoadImage, 0);
    expectPlaceholders(lazyLoadImage, 1);
  });

  it('renders the image when it\'s in the viewport', function() {
    const lazyLoadImage = renderLazyLoadImage(0);

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
