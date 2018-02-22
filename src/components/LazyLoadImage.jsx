import React from 'react';
import { PropTypes } from 'prop-types';

class LazyLoadImage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    }

    this.previousBoundingBox = {
      bottom: -1,
      top: -1
    };
  }

  componentDidMount() {
    this.updateVisibility();
  }

  componentWillReceiveProps(nextProps) {
    this.updateVisibility(nextProps.scrollPosition);
  }

  componentDidUpdate() {
    if (this.refs.placeholder) {
      const boundingBox = {
        bottom: this.refs.placeholder.offsetTop +
          this.refs.placeholder.offsetHeight,
        top: this.refs.placeholder.offsetTop
      };

      if (this.previousBoundingBox.bottom !== boundingBox.bottom ||
          this.previousBoundingBox.top !== boundingBox.top) {
        this.updateVisibility();
      }
    }
  }

  updateVisibility(scrollPosition = this.props.scrollPosition) {
    if (this.state.visible) {
      return;
    }

    if (!this.isImageInViewport(scrollPosition)) {
      return;
    }

    this.props.beforeLoad();

    this.setState({
      visible: true
    }, this.props.afterLoad);
  }

  isImageInViewport(scrollPosition) {
    if (!this.refs.placeholder) {
      return false;
    }

    const { threshold } = this.props;
    const boundingBox = {
      bottom: this.refs.placeholder.offsetTop +
        this.refs.placeholder.offsetHeight,
      top: this.refs.placeholder.offsetTop
    };
    const viewport = {
      bottom: scrollPosition + window.innerHeight,
      top: scrollPosition
    };

    this.previousBoundingBox = boundingBox;

    return Boolean(viewport.top - threshold <= boundingBox.bottom &&
      viewport.bottom + threshold >= boundingBox.top);
  }

  getPlaceholder() {
    const { className, height, placeholder, width } = this.props;
    if (placeholder) {
      return placeholder;
    }

    return (
      <span className={'lazy-load-image-placeholder ' + className}
        ref="placeholder"
        style={{height, width}}>
      </span>
    );
  }

  render() {
    const { afterLoad, beforeLoad, placeholder, scrollPosition, threshold,
      ...props } = this.props;

    if (!this.state.visible) {
      return this.getPlaceholder();
    }

    return (
      <img
        {...props}
        ref="image" />
    );
  }
}

LazyLoadImage.propTypes = {
  scrollPosition: PropTypes.number.isRequired,
  afterLoad: PropTypes.func,
  beforeLoad: PropTypes.func,
  className: PropTypes.string,
  height: PropTypes.number,
  placeholder: PropTypes.element,
  threshold: PropTypes.number,
  width: PropTypes.number
};

LazyLoadImage.defaultProps = {
  afterLoad: () => null,
  beforeLoad: () => null,
  className: '',
  height: 0,
  placeholder: null,
  threshold: 100,
  width: 0
};

export default LazyLoadImage;
