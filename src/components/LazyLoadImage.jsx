import React from 'react';
import { PropTypes } from 'prop-types';

class LazyLoadImage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };

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

  getRelevantProps(nextProps) {
    const keys = Object.keys(nextProps);

    if (!this.state.visible) {
      return keys;
    }

    const propsToIgnoreAfterVisible = {
      afterLoad: true,
      beforeLoad: true,
      placeholder: true,
      threshold: true,
      scrollPosition: true
    };

    return keys.filter(key => !propsToIgnoreAfterVisible[key]);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.visible !== nextState.visible) {
      return true;
    }

    const keys = this.getRelevantProps(nextProps);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (this.props[key] !== nextProps[key]) {
        return true;
      }
    }

    return false;
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
      left: this.refs.placeholder.offsetLeft,
      right: this.refs.placeholder.offsetLeft +
        this.refs.placeholder.offsetWidth,
      top: this.refs.placeholder.offsetTop
    };
    const viewport = {
      bottom: scrollPosition.y + window.innerHeight,
      left: scrollPosition.x,
      right: scrollPosition.x + window.innerWidth,
      top: scrollPosition.y
    };

    this.previousBoundingBox = boundingBox;

    return Boolean(viewport.top - threshold <= boundingBox.bottom &&
      viewport.bottom + threshold >= boundingBox.top &&
      viewport.left - threshold <= boundingBox.right &&
      viewport.right + threshold >= boundingBox.left);
  }

  getPlaceholder() {
    const { className, height, placeholder, width } = this.props;

    if (placeholder) {
      return placeholder;
    }

    return (
      <span className={'lazy-load-image-placeholder ' + className}
        ref="placeholder"
        style={{ height, width }}>
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
