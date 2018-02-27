import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import LazyLoadImage from './LazyLoadImage.jsx';

configure({ adapter: new Adapter() });

const {
  scryRenderedDOMComponentsWithClass,
  scryRenderedDOMComponentsWithTag
} = ReactTestUtils;

describe('LazyLoadImage', function() {
  function renderLazyLoadImage({
      afterLoad = () => null,
      beforeLoad = () => null,
      placeholder = null,
      scrollPosition = {x: 0, y: 0},
      style = {},
      visibleByDefault = false
    } = {}) {
    return mount(
      <LazyLoadImage
        afterLoad={afterLoad}
        beforeLoad={beforeLoad}
        placeholder={placeholder}
        scrollPosition={scrollPosition}
        src=""
        style={style}
        visibleByDefault={visibleByDefault} />
    );
  }

  function simulateScroll(lazyLoadImage, offsetX = 0, offsetY = 0) {
    const myMock = jest.fn();

    myMock.mockReturnValue({
      bottom: -offsetY,
      height: 0,
      left: -offsetX,
      right: -offsetX,
      top: -offsetY,
      width: 0
    });

    lazyLoadImage.instance().placeholder.getBoundingClientRect = myMock;

    lazyLoadImage.setProps({
      scrollPosition: {x: offsetX, y: offsetY}
    });
  }

  function expectImages(wrapper, numberOfImages) {
    const img = scryRenderedDOMComponentsWithTag(wrapper.instance(), 'img');

    expect(img.length).toEqual(numberOfImages);
  }

  function expectPlaceholders(wrapper, numberOfPlaceholders, placeholderClassName = 'lazy-load-image-placeholder') {
    const placeholder = scryRenderedDOMComponentsWithClass(wrapper.instance(), placeholderClassName);

    expect(placeholder.length).toEqual(numberOfPlaceholders);
  }

  it('renders the default placeholder when it\'s not in the viewport', function() {
    const lazyLoadImage = renderLazyLoadImage({
      style: {marginTop: 100000}
    });

    expectImages(lazyLoadImage, 0);
    expectPlaceholders(lazyLoadImage, 1);
  });

  it('renders the prop placeholder when it\'s not in the viewport', function() {
    const style = {marginTop: 100000};
    const placeholder = (
      <span className="test-placeholder" style={style}></span>
    );
    const lazyLoadImage = renderLazyLoadImage({
      placeholder,
      style
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
    const offset = 100000;
    const lazyLoadImage = renderLazyLoadImage({
      style: {marginTop: offset}
    });

    simulateScroll(lazyLoadImage, 0, offset);

    expectImages(lazyLoadImage, 1);
    expectPlaceholders(lazyLoadImage, 0);
  });

  it('renders the image when it appears in the viewport horizontally', function() {
    const offset = 100000;
    const lazyLoadImage = renderLazyLoadImage({
      style: {marginLeft: offset}
    });

    simulateScroll(lazyLoadImage, offset, 0);

    expectImages(lazyLoadImage, 1);
    expectPlaceholders(lazyLoadImage, 0);
  });

  it('renders the image when it\'s not in the viewport but visibleByDefault is true', function() {
    const lazyLoadImage = renderLazyLoadImage({
      style: {marginTop: 100000},
      visibleByDefault: true
    });

    expectImages(lazyLoadImage, 1);
    expectPlaceholders(lazyLoadImage, 0);
  });

  it('doesn\'t trigger beforeLoad when the image is not the viewport', function() {
    const beforeLoad = jest.fn();
    const lazyLoadImage = renderLazyLoadImage({
      beforeLoad,
      style: {marginTop: 100000}
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
    const offset = 100000;
    const lazyLoadImage = renderLazyLoadImage({
      beforeLoad,
      style: {marginTop: offset}
    });

    simulateScroll(lazyLoadImage, 0, offset);

    expect(beforeLoad).toHaveBeenCalledTimes(1);
  });

  it('triggers beforeLoad when visibleByDefault is true', function() {
    const beforeLoad = jest.fn();
    const offset = 100000;
    const lazyLoadImage = renderLazyLoadImage({
      beforeLoad,
      style: {marginTop: offset},
      visibleByDefault: true
    });

    expect(beforeLoad).toHaveBeenCalledTimes(1);
  });

  it('doesn\'t trigger afterLoad when the image is not the viewport', function() {
    const afterLoad = jest.fn();
    const lazyLoadImage = renderLazyLoadImage({
      afterLoad,
      style: {marginTop: 100000}
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
    const offset = 100000;
    const lazyLoadImage = renderLazyLoadImage({
      afterLoad,
      style: {marginTop: offset}
    });

    simulateScroll(lazyLoadImage, 0, offset);

    expect(afterLoad).toHaveBeenCalledTimes(1);
  });

  it('triggers afterLoad when visibleByDefault is true', function() {
    const afterLoad = jest.fn();
    const offset = 100000;
    const lazyLoadImage = renderLazyLoadImage({
      afterLoad,
      style: {marginTop: offset},
      visibleByDefault: true
    });

    expect(afterLoad).toHaveBeenCalledTimes(1);
  });
});
