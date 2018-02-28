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
  function renderLazyLoadImage({
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

  it('renders a LazyLoadComponent with the correct props', function() {
    const props = {
      afterLoad: () => null,
      beforeLoad: () => null,
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
    expect(lazyLoadComponent.props.placeholder).toEqual(props.placeholder);
    expect(lazyLoadComponent.props.scrollPosition).toEqual(props.scrollPosition);
    expect(lazyLoadComponent.props.style).toEqual(props.style);
    expect(lazyLoadComponent.props.visibleByDefault).toEqual(props.visibleByDefault);
    expect(img.src).toEqual(props.src);
  });
});
