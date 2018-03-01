import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import LazyLoadComponentWithoutTracking from './LazyLoadComponentWithoutTracking.jsx';

configure({ adapter: new Adapter() });

const {
  scryRenderedDOMComponentsWithTag
} = ReactTestUtils;

describe('LazyLoadComponentWithoutTracking', function() {
  function renderLazyLoadComponentWithoutTracking({
      afterLoad = () => null,
      beforeLoad = () => null,
      placeholder = null,
      scrollPosition = {x: 0, y: 0},
      style = {},
      visibleByDefault = false
    } = {}) {
    return mount(
      <LazyLoadComponentWithoutTracking
        afterLoad={afterLoad}
        beforeLoad={beforeLoad}
        placeholder={placeholder}
        scrollPosition={scrollPosition}
        style={style}
        visibleByDefault={visibleByDefault}>
        <p>Lorem ipsum</p>
      </LazyLoadComponentWithoutTracking>
    );
  }

  function simulateScroll(component, offsetX = 0, offsetY = 0) {
    const myMock = jest.fn();

    myMock.mockReturnValue({
      bottom: -offsetY,
      height: 0,
      left: -offsetX,
      right: -offsetX,
      top: -offsetY,
      width: 0
    });

    component.instance().placeholder.getBoundingClientRect = myMock;

    component.setProps({
      scrollPosition: {x: offsetX, y: offsetY}
    });
  }

  function expectParagraphs(wrapper, numberOfParagraphs) {
    const p = scryRenderedDOMComponentsWithTag(wrapper.instance(), 'p');

    expect(p.length).toEqual(numberOfParagraphs);
  }

  function expectPlaceholders(wrapper, numberOfPlaceholders, placeholderTag = 'span') {
    const placeholder = scryRenderedDOMComponentsWithTag(wrapper.instance(), placeholderTag);

    expect(placeholder.length).toEqual(numberOfPlaceholders);
  }

  it('renders the default placeholder when it\'s not in the viewport', function() {
    const component = renderLazyLoadComponentWithoutTracking({
      style: {marginTop: 100000}
    });

    expectParagraphs(component, 0);
    expectPlaceholders(component, 1);
  });

  it('renders the prop placeholder when it\'s not in the viewport', function() {
    const style = {marginTop: 100000};
    const placeholder = (
      <strong style={style}></strong>
    );
    const component = renderLazyLoadComponentWithoutTracking({
      placeholder,
      style
    });

    expectParagraphs(component, 0);
    expectPlaceholders(component, 1, 'strong');
  });

  it('renders the image when it\'s in the viewport', function() {
    const component = renderLazyLoadComponentWithoutTracking();

    expectParagraphs(component, 1);
    expectPlaceholders(component, 0);
  });

  it('renders the image when it appears in the viewport', function() {
    const offset = 100000;
    const component = renderLazyLoadComponentWithoutTracking({
      style: {marginTop: offset}
    });

    simulateScroll(component, 0, offset);

    expectParagraphs(component, 1);
    expectPlaceholders(component, 0);
  });

  it('renders the image when it appears in the viewport horizontally', function() {
    const offset = 100000;
    const component = renderLazyLoadComponentWithoutTracking({
      style: {marginLeft: offset}
    });

    simulateScroll(component, offset, 0);

    expectParagraphs(component, 1);
    expectPlaceholders(component, 0);
  });

  it('renders the image when it\'s not in the viewport but visibleByDefault is true', function() {
    const component = renderLazyLoadComponentWithoutTracking({
      style: {marginTop: 100000},
      visibleByDefault: true
    });

    expectParagraphs(component, 1);
    expectPlaceholders(component, 0);
  });

  it('doesn\'t trigger beforeLoad when the image is not the viewport', function() {
    const beforeLoad = jest.fn();
    const component = renderLazyLoadComponentWithoutTracking({
      beforeLoad,
      style: {marginTop: 100000}
    });

    expect(beforeLoad).toHaveBeenCalledTimes(0);
  });

  it('triggers beforeLoad when the image is in the viewport', function() {
    const beforeLoad = jest.fn();
    const component = renderLazyLoadComponentWithoutTracking({
      beforeLoad
    });

    expect(beforeLoad).toHaveBeenCalledTimes(1);
  });

  it('triggers beforeLoad when the image appears in the viewport', function() {
    const beforeLoad = jest.fn();
    const offset = 100000;
    const component = renderLazyLoadComponentWithoutTracking({
      beforeLoad,
      style: {marginTop: offset}
    });

    simulateScroll(component, 0, offset);

    expect(beforeLoad).toHaveBeenCalledTimes(1);
  });

  it('triggers beforeLoad when visibleByDefault is true', function() {
    const beforeLoad = jest.fn();
    const offset = 100000;
    const component = renderLazyLoadComponentWithoutTracking({
      beforeLoad,
      style: {marginTop: offset},
      visibleByDefault: true
    });

    expect(beforeLoad).toHaveBeenCalledTimes(1);
  });

  it('doesn\'t trigger afterLoad when the image is not the viewport', function() {
    const afterLoad = jest.fn();
    const component = renderLazyLoadComponentWithoutTracking({
      afterLoad,
      style: {marginTop: 100000}
    });

    expect(afterLoad).toHaveBeenCalledTimes(0);
  });

  it('triggers afterLoad when the image is in the viewport', function() {
    const afterLoad = jest.fn();
    const component = renderLazyLoadComponentWithoutTracking({
      afterLoad
    });

    expect(afterLoad).toHaveBeenCalledTimes(1);
  });

  it('triggers afterLoad when the image appears in the viewport', function() {
    const afterLoad = jest.fn();
    const offset = 100000;
    const component = renderLazyLoadComponentWithoutTracking({
      afterLoad,
      style: {marginTop: offset}
    });

    simulateScroll(component, 0, offset);

    expect(afterLoad).toHaveBeenCalledTimes(1);
  });

  it('triggers afterLoad when visibleByDefault is true', function() {
    const afterLoad = jest.fn();
    const offset = 100000;
    const component = renderLazyLoadComponentWithoutTracking({
      afterLoad,
      style: {marginTop: offset},
      visibleByDefault: true
    });

    expect(afterLoad).toHaveBeenCalledTimes(1);
  });
});
