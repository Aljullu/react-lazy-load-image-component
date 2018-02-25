import React from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';

class LazyLoadImage extends React.Component {
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

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.visible && this.state.visible) {
      this.props.afterLoad();
    }

    if (this.placeholder) {
      const boundingBox = this.getPlaceholderBoundingBox();

      if (this.previousBoundingBox.bottom !== boundingBox.bottom ||
          this.previousBoundingBox.left !== boundingBox.left ||
          this.previousBoundingBox.right !== boundingBox.right ||
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
    });
  }

  isImageInViewport(scrollPosition) {
    if (!this.placeholder) {
      return false;
    }

    const { threshold } = this.props;
    const boundingBox = this.getPlaceholderBoundingBox(scrollPosition);
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

    if (!this.state.visible) {
      return this.getPlaceholder();
    }

    return (
      <img
        {...props}
        ref={img => this.image = img} />
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
