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

  componentDidUpdate(prevProps, prevState) {
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

    this.setState({
      visible: this.refs.image ? true : this.isImageInViewport(scrollPosition)
    });
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

  render() {
    const { scrollPosition, threshold, ...props } = this.props;

    if (!this.state.visible) {
      const { className, height, width } = this.props;
      return (
        <span className={'lazy-load-image-placeholder ' + className}
          ref="placeholder"
          style={{height, width}}>
        </span>
      );
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
  className: PropTypes.string,
  height: PropTypes.number,
  threshold: PropTypes.number,
  width: PropTypes.number
};

LazyLoadImage.defaultProps = {
  className: '',
  height: 0,
  threshold: 100,
  width: 0
};

export default LazyLoadImage;
