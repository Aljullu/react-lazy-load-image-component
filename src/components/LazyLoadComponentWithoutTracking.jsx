import React from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';

class LazyLoadComponentWithoutTracking extends React.Component {
  constructor(props) {
    super(props);

    const { afterLoad, beforeLoad, visibleByDefault } = this.props;

    this.state = {
      visible: visibleByDefault
    };

    if (visibleByDefault) {
      beforeLoad();
      afterLoad();
    }
  }

  componentDidMount() {
    this.updateVisibility();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.visible) {
      return;
    }

    if (this.state.visible) {
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

  isPlaceholderInViewport() {
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
    if (this.state.visible || !this.isPlaceholderInViewport()) {
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
      <span className={className}
        ref={el => this.placeholder = el}
        style={{ height, width, ...style }}>
      </span>
    );
  }

  render() {
    return this.state.visible ?
      this.props.children :
      this.getPlaceholder();
  }
}

LazyLoadComponentWithoutTracking.propTypes = {
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

LazyLoadComponentWithoutTracking.defaultProps = {
  afterLoad: () => ({}),
  beforeLoad: () => ({}),
  className: '',
  height: 0,
  placeholder: null,
  threshold: 100,
  visibleByDefault: false,
  width: 0
};

export default LazyLoadComponentWithoutTracking;
