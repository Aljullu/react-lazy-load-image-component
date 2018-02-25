import React from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';

class LazyLoadImage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };
  }

  componentDidMount() {
    this.updateVisibility();
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
    if (!this.state.visible) {
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

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.visible && this.state.visible) {
      this.props.afterLoad();
    }

    this.updateVisibility();
  }

  getPlaceholderBoundingBox(scrollPosition = this.props.scrollPosition) {
    const boundingRect = this.placeholder.getBoundingClientRect();
    const style = ReactDOM.findDOMNode(this.placeholder).style;
    const margin = {
      left: parseInt(style.getPropertyValue('margin-left'), 10) || 0,
      top: parseInt(style.getPropertyValue('margin-top'), 10) || 0
    };

    return {
      bottom: scrollPosition.y + boundingRect.bottom + margin.top,
      left: scrollPosition.x + boundingRect.left + margin.left,
      right: scrollPosition.x + boundingRect.right + margin.left,
      top: scrollPosition.y + boundingRect.top + margin.top
    };
  }

  isImageInViewport() {
    if (!this.placeholder) {
      return false;
    }

    const { scrollPosition, threshold } = this.props;
    const boundingBox = this.getPlaceholderBoundingBox(scrollPosition);
    const viewport = {
      bottom: scrollPosition.y + window.innerHeight,
      left: scrollPosition.x,
      right: scrollPosition.x + window.innerWidth,
      top: scrollPosition.y
    };

    return Boolean(viewport.top - threshold <= boundingBox.bottom &&
      viewport.bottom + threshold >= boundingBox.top &&
      viewport.left - threshold <= boundingBox.right &&
      viewport.right + threshold >= boundingBox.left);
  }

  updateVisibility() {
    if (this.state.visible || !this.isImageInViewport()) {
      return;
    }

    this.props.beforeLoad();

    this.setState({
      visible: true
    });
  }

  getPlaceholder() {
    const { className, height, placeholder, style, width } = this.props;

    if (placeholder) {
      return React.cloneElement(placeholder,
        { ref: el => this.placeholder = el });
    }

    return (
      <span className={'lazy-load-image-placeholder ' + className}
        ref={el => this.placeholder = el}
        style={{ height, width, ...style }}>
      </span>
    );
  }

  render() {
    const { afterLoad, beforeLoad, placeholder, scrollPosition, threshold,
      ...props } = this.props;

    return this.state.visible ?
      <img {...props} /> :
      this.getPlaceholder();
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
