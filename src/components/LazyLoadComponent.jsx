import React from 'react';

import LazyLoadComponentWithoutTracking
  from './LazyLoadComponentWithoutTracking.jsx';
import LazyLoadComponentWithTracking
  from './LazyLoadComponentWithTracking.jsx';

class LazyLoadComponent extends React.Component {
  constructor(props) {
    super(props);

    const { scrollPosition } = props;

    this.isScrollTracked = (scrollPosition &&
      Number.isFinite(scrollPosition.x) && scrollPosition.x >= 0 &&
      Number.isFinite(scrollPosition.y) && scrollPosition.y >= 0);
  }

  render() {
    if (this.isScrollTracked) {
      return <LazyLoadComponentWithoutTracking {...this.props} />;
    }

    const { scrollPosition, ...props } = this.props;

    return <LazyLoadComponentWithTracking {...props} />;
  }
}

export default LazyLoadComponent;
