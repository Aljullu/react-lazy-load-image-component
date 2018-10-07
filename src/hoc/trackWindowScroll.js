import React from 'react';
import { PropTypes } from 'prop-types';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';

const trackWindowScroll = (BaseComponent) => {
  class ScrollAwareComponent extends React.Component {
    constructor(props) {
      super(props);

      const onChangeScroll = this.onChangeScroll.bind(this);

      if (props.delayMethod === 'debounce') {
        this.delayedScroll = debounce(onChangeScroll, props.delayTime);
      } else if (props.delayMethod === 'throttle') {
        this.delayedScroll = throttle(onChangeScroll, props.delayTime);
      }

      this.state = {
        scrollPosition: {
          x: (typeof window === 'undefined' ?
            0 :
            (window.scrollX || window.pageXOffset)
          ),
          y: (typeof window === 'undefined' ?
            0 :
            (window.scrollY || window.pageYOffset)
          ),
        },
      };
    }

    componentDidMount() {
      if (typeof window == 'undefined') {
        return;
      }
      window.addEventListener('scroll', this.delayedScroll);
      window.addEventListener('resize', this.delayedScroll);
    }

    componentWillUnmount() {
      if (typeof window === 'undefined') {
        return;
      }
      window.removeEventListener('scroll', this.delayedScroll);
      window.removeEventListener('resize', this.delayedScroll);
    }

    onChangeScroll() {
      this.setState({
        scrollPosition: {
          x: (typeof window == 'undefined' ?
            0 :
            (window.scrollX || window.pageXOffset)
          ),
          y: (typeof window === 'undefined' ?
            0 :
            (window.scrollY || window.pageYOffset)
          ),
        },
      });
    }

    render() {
      const { delayMethod, delayTime, ...props } = this.props;

      return (
        <BaseComponent
          scrollPosition={this.state.scrollPosition}
          {...props} />
      );
    }
  }

  ScrollAwareComponent.propTypes = {
    delayMethod: PropTypes.oneOf(['debounce', 'throttle']),
    delayTime: PropTypes.number,
  };

  ScrollAwareComponent.defaultProps = {
    delayMethod: 'throttle',
    delayTime: 300,
  };

  return ScrollAwareComponent;
};

export default trackWindowScroll;
