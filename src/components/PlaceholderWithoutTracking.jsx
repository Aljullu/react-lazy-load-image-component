import React from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';

class PlaceholderWithoutTracking extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.updateVisibility();
  }

  componentDidUpdate() {
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
    if (this.isPlaceholderInViewport()) {
      this.props.onVisible();
    }
  }

  render() {
    const { className, height, placeholder, style, width } = this.props;

    if (placeholder) {
      return React.cloneElement(placeholder,
        { ref: el => this.placeholder = el });
    }

    return (
      <span className={className}
        ref={el => this.placeholder = el}
        style={{ display: 'inline-block', height, width, ...style }}>
      </span>
    );
  }
}

PlaceholderWithoutTracking.propTypes = {
  onVisible: PropTypes.func.isRequired,
  scrollPosition: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired,
  className: PropTypes.string,
  height: PropTypes.number,
  placeholder: PropTypes.element,
  threshold: PropTypes.number,
  width: PropTypes.number
};

PlaceholderWithoutTracking.defaultProps = {
  className: '',
  height: 0,
  placeholder: null,
  threshold: 100,
  width: 0
};

export default PlaceholderWithoutTracking;
