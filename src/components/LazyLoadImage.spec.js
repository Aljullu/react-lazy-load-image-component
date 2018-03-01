import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import LazyLoadImage from './LazyLoadImage.jsx';
import LazyLoadComponent from './LazyLoadComponent.jsx';

configure({ adapter: new Adapter() });

const {
  findRenderedComponentWithType,
  findRenderedDOMComponentWithTag
} = ReactTestUtils;

describe('LazyLoadImage', function() {
  it('renders a LazyLoadComponent with the correct props', function() {
    const props = {
      afterLoad: () => null,
      beforeLoad: () => null,
      delayMethod: 'debounce',
      delayTime: 600,
      placeholder: null,
      scrollPosition: {x: 0, y: 0},
      style: {},
      src: 'lorem-ipsum.jpg',
      visibleByDefault: false
    };
    const lazyLoadImage = mount(
      <LazyLoadImage
        afterLoad={props.afterLoad}
        beforeLoad={props.beforeLoad}
        delayMethod={props.delayMethod}
        delayTime={props.delayTime}
        placeholder={props.placeholder}
        scrollPosition={props.scrollPosition}
        src={props.src}
        style={props.style}
        visibleByDefault={props.visibleByDefault} />
    );

    const lazyLoadComponent = findRenderedComponentWithType(lazyLoadImage.instance(), LazyLoadComponent);
    const img = findRenderedDOMComponentWithTag(lazyLoadImage.instance(), 'img');

    expect(lazyLoadComponent.props.afterLoad).toEqual(props.afterLoad);
    expect(lazyLoadComponent.props.beforeLoad).toEqual(props.beforeLoad);
    expect(lazyLoadComponent.props.delayMethod).toEqual(props.delayMethod);
    expect(lazyLoadComponent.props.delayTime).toEqual(props.delayTime);
    expect(lazyLoadComponent.props.placeholder).toEqual(props.placeholder);
    expect(lazyLoadComponent.props.scrollPosition).toEqual(props.scrollPosition);
    expect(lazyLoadComponent.props.style).toEqual(props.style);
    expect(lazyLoadComponent.props.visibleByDefault).toEqual(props.visibleByDefault);
    expect(img.src).toEqual(props.src);
  });
});
