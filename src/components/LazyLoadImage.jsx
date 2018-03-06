import React from 'react';
import { PropTypes } from 'prop-types';

import LazyLoadComponent from './LazyLoadComponent.jsx';

class LazyLoadImage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { afterLoad, beforeLoad, delayMethod, delayTime, placeholder,
      placeholderSrc, scrollPosition, threshold, visibleByDefault,
      ...imgProps } = this.props;

    const lazyLoadComponent = (
      <LazyLoadComponent
        beforeLoad={beforeLoad}
        className={this.props.className}
        delayMethod={delayMethod}
        delayTime={delayTime}
        height={this.props.height}
        placeholder={placeholder}
        scrollPosition={scrollPosition}
        style={this.props.style}
        threshold={threshold}
        visibleByDefault={visibleByDefault}
        width={this.props.width}>
        <img onLoad={afterLoad} {...imgProps} />
      </LazyLoadComponent>
    );

    if (!placeholderSrc || visibleByDefault) {
      return lazyLoadComponent;
    }

    return (
      <span style={{
        backgroundImage: 'url( ' + placeholderSrc + ')',
        backgroundSize: '100% 100%',
        color: 'transparent',
        display: 'inline-block',
        height: this.props.height,
        width: this.props.width
      }}>
        {lazyLoadComponent}
      </span>
    );
  }
}

LazyLoadImage.propTypes = {
  placeholderSrc: PropTypes.string
};

export default LazyLoadImage;
