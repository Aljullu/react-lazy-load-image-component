import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import PlaceholderWithoutTracking from './PlaceholderWithoutTracking.jsx';

configure({ adapter: new Adapter() });

const {
  scryRenderedDOMComponentsWithTag
} = ReactTestUtils;

describe('PlaceholderWithoutTracking', function() {
  function renderPlaceholderWithoutTracking({
      onVisible = () => null,
      placeholder = null,
      scrollPosition = {x: 0, y: 0},
      style = {}
    } = {}) {
    return mount(
      <PlaceholderWithoutTracking
        onVisible={onVisible}
        placeholder={placeholder}
        scrollPosition={scrollPosition}
        style={style}>
        <p>Lorem ipsum</p>
      </PlaceholderWithoutTracking>
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
    const component = renderPlaceholderWithoutTracking({
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
    const component = renderPlaceholderWithoutTracking({
      placeholder,
      style
    });

    expectParagraphs(component, 0);
    expectPlaceholders(component, 1, 'strong');
  });

  it('doesn\'t trigger onVisible when the image is not the viewport', function() {
    const onVisible = jest.fn();
    const component = renderPlaceholderWithoutTracking({
      onVisible,
      style: {marginTop: 100000}
    });

    expect(onVisible).toHaveBeenCalledTimes(0);
  });

  it('triggers onVisible when the image is in the viewport', function() {
    const onVisible = jest.fn();
    const component = renderPlaceholderWithoutTracking({
      onVisible
    });

    expect(onVisible).toHaveBeenCalledTimes(1);
  });

  it('triggers onVisible when the image appears in the viewport', function() {
    const onVisible = jest.fn();
    const offset = 100000;
    const component = renderPlaceholderWithoutTracking({
      onVisible,
      style: {marginTop: offset}
    });

    simulateScroll(component, 0, offset);

    expect(onVisible).toHaveBeenCalledTimes(1);
  });

  it('triggers onVisible when the image appears in the viewport', function() {
    const onVisible = jest.fn();
    const offset = 100000;
    const component = renderPlaceholderWithoutTracking({
      onVisible,
      style: {marginLeft: offset}
    });

        simulateScroll(component, offset, 0);

    expect(onVisible).toHaveBeenCalledTimes(1);
  });
});
