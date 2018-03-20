import React from 'react';
import { PropTypes } from 'prop-types';

import LazyLoadComponent from './LazyLoadComponent.jsx';

class LazyLoadImage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false
    };
  }

  onImageLoad() {
    if (this.state.loaded) {
      return null;
    }

    return () => {
      this.props.afterLoad();

      this.setState({
        loaded: true
      });
    };
  }

  getImg() {
    const { afterLoad, beforeLoad, delayMethod, delayTime, effect,
      placeholder, placeholderSrc, scrollPosition, threshold,
      visibleByDefault, wrapperClassName, ...imgProps } = this.props;

    return <img onLoad={this.onImageLoad()} {...imgProps} />;
  }

  getLazyLoadImage(image) {
    const { beforeLoad, className, delayMethod, delayTime,
      height, placeholder, scrollPosition, style, threshold,
      visibleByDefault, width } = this.props;

    return (
      <LazyLoadComponent
        beforeLoad={beforeLoad}
        className={className}
        delayMethod={delayMethod}
        delayTime={delayTime}
        height={height}
        placeholder={placeholder}
        scrollPosition={scrollPosition}
        style={style}
        threshold={threshold}
        visibleByDefault={visibleByDefault}
        width={width}>
        {image}
      </LazyLoadComponent>
    );
  }

  getWrappedLazyLoadImage(lazyLoadImage) {
    const { effect, height, placeholderSrc,
      width, wrapperClassName } = this.props;
    const { loaded } = this.state;

    const loadedClassName = loaded ?
      ' lazy-load-image-loaded' :
      '';

    return (
      <span
        className={wrapperClassName + ' lazy-load-image-background ' +
          effect + loadedClassName}
        style={{
          backgroundImage: 'url( ' + placeholderSrc + ')',
          backgroundSize: '100% 100%',
          color: 'transparent',
          display: 'inline-block',
          height: height,
          width: width
        }}>
        {lazyLoadImage}
      </span>
    );
  }

  render() {
    const { effect, placeholderSrc, visibleByDefault } = this.props;
    const { loaded } = this.state;

    const image = this.getImg();
    const lazyLoadImage = loaded ?
      image : this.getLazyLoadImage(image);

    if ((!effect && !placeholderSrc) || visibleByDefault) {
      return lazyLoadImage;
    }

    return this.getWrappedLazyLoadImage(lazyLoadImage);
  }
}

LazyLoadImage.propTypes = {
  afterLoad: PropTypes.func,
  effect: PropTypes.string,
  placeholderSrc: PropTypes.string
};

LazyLoadImage.defaultProps = {
  afterLoad: () => ({}),
  effect: ''
};

export default LazyLoadImage;
