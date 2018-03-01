import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import LazyLoadComponent from './LazyLoadComponent.jsx';
import LazyLoadComponentWithTracking
  from './LazyLoadComponentWithTracking.jsx';
import LazyLoadComponentWithoutTracking
  from './LazyLoadComponentWithoutTracking.jsx';

configure({ adapter: new Adapter() });

const {
  scryRenderedComponentsWithType
} = ReactTestUtils;

describe('LazyLoadComponent', function() {
  it('renders a LazyLoadComponentWithTracking when scrollPosition is undefined', function() {
    const lazyLoadComponent = mount(
      <LazyLoadComponent>
        <p>Lorem Ipsum</p>
      </LazyLoadComponent>
    );

    const lazyLoadComponentWithTracking = scryRenderedComponentsWithType(
      lazyLoadComponent.instance(), LazyLoadComponentWithTracking);

    expect(lazyLoadComponentWithTracking.length).toEqual(1);
  });

  it('renders a LazyLoadComponentWithoutTracking when scrollPosition is defined', function() {
    const lazyLoadComponent = mount(
      <LazyLoadComponent
        scrollPosition={{ x: 0, y: 0}}>
        <p>Lorem Ipsum</p>
      </LazyLoadComponent>
    );

    const lazyLoadComponentWithoutTracking = scryRenderedComponentsWithType(
      lazyLoadComponent.instance(), LazyLoadComponentWithoutTracking);

    expect(lazyLoadComponentWithoutTracking.length).toEqual(1);
  });
});
