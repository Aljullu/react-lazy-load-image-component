import React from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';

import LazyLoadComponent from './LazyLoadComponent.jsx';

class LazyLoadImage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { afterLoad, beforeLoad, placeholder, scrollPosition, threshold,
      visibleByDefault, ...imgProps } = this.props;

    return (
      <LazyLoadComponent
        afterLoad={afterLoad}
        beforeLoad={beforeLoad}
        className={this.props.className}
        placeholder={placeholder}
        scrollPosition={scrollPosition}
        threshold={threshold}
        visibleByDefault={visibleByDefault}
        style={this.props.style}>
        <img {...imgProps} />
      </LazyLoadComponent>
    );
  }
}

LazyLoadImage.propTypes = {
  scrollPosition: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired,
  afterLoad: PropTypes.func,
  beforeLoad: PropTypes.func,
  className: PropTypes.string,
  height: PropTypes.number,
  placeholder: PropTypes.element,
  threshold: PropTypes.number,
  visibleByDefault: PropTypes.bool,
  width: PropTypes.number
};

LazyLoadImage.defaultProps = {
  afterLoad: () => ({}),
  beforeLoad: () => ({}),
  className: '',
  height: 0,
  placeholder: null,
  threshold: 100,
  visibleByDefault: false,
  width: 0
};

export default LazyLoadImage;
