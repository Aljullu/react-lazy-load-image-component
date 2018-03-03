import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import LazyLoadComponent from './LazyLoadComponent.jsx';
import PlaceholderWithTracking from './PlaceholderWithTracking.jsx';
import PlaceholderWithoutTracking from './PlaceholderWithoutTracking.jsx';

configure({ adapter: new Adapter() });

const {
  scryRenderedComponentsWithType,
  scryRenderedDOMComponentsWithTag
} = ReactTestUtils;

describe('LazyLoadComponent', function() {
  it('renders a PlaceholderWithTracking when scrollPosition is undefined', function() {
    const lazyLoadComponent = mount(
      <LazyLoadComponent
        style={{marginTop: 100000}}>>
        <p>Lorem Ipsum</p>
      </LazyLoadComponent>
    );

    const placeholderWithTracking = scryRenderedComponentsWithType(
      lazyLoadComponent.instance(), PlaceholderWithTracking);

    expect(placeholderWithTracking.length).toEqual(1);
  });

  it('renders a PlaceholderWithoutTracking when scrollPosition is defined', function() {
    const lazyLoadComponent = mount(
      <LazyLoadComponent
        scrollPosition={{ x: 0, y: 0}}
        style={{marginTop: 100000}}>>
        <p>Lorem Ipsum</p>
      </LazyLoadComponent>
    );

    const placeholderWithoutTracking = scryRenderedComponentsWithType(
      lazyLoadComponent.instance(), PlaceholderWithoutTracking);

    expect(placeholderWithoutTracking.length).toEqual(1);
  });

  it('renders children when visible', function() {
    const lazyLoadComponent = mount(
      <LazyLoadComponent>
        <p>Lorem Ipsum</p>
      </LazyLoadComponent>
    );

    lazyLoadComponent.instance().onVisible();

    const paragraphs = scryRenderedDOMComponentsWithTag(
      lazyLoadComponent.instance(), 'p');

    expect(paragraphs.length).toEqual(1);
  });

  it('triggers beforeLoad when onVisible is triggered', function() {
    const beforeLoad = jest.fn();
    const lazyLoadComponent = mount(
      <LazyLoadComponent
        beforeLoad={beforeLoad}
        style={{marginTop: 100000}}>
        <p>Lorem Ipsum</p>
      </LazyLoadComponent>
    );

    lazyLoadComponent.instance().onVisible();

    expect(beforeLoad).toHaveBeenCalledTimes(1);
  });

  it('triggers afterLoad when onVisible is triggered', function() {
    const afterLoad = jest.fn();
    const lazyLoadComponent = mount(
      <LazyLoadComponent
        afterLoad={afterLoad}
        style={{marginTop: 100000}}>
        <p>Lorem Ipsum</p>
      </LazyLoadComponent>
    );

    lazyLoadComponent.instance().onVisible();

    expect(afterLoad).toHaveBeenCalledTimes(1);
  });

  it('triggers beforeLoad and afterLoad when visibleByDefault is true', function() {
    const afterLoad = jest.fn();
    const beforeLoad = jest.fn();
    const lazyLoadComponent = mount(
      <LazyLoadComponent
        afterLoad={afterLoad}
        beforeLoad={beforeLoad}
        style={{marginTop: 100000}}>
        <p>Lorem Ipsum</p>
      </LazyLoadComponent>
    );

    lazyLoadComponent.instance().onVisible();

    expect(afterLoad).toHaveBeenCalledTimes(1);
    expect(beforeLoad).toHaveBeenCalledTimes(1);
  });
});
