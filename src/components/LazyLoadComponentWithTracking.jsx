import React from 'react';

import LazyLoadComponentWithoutTracking
  from './LazyLoadComponentWithoutTracking.jsx';
import trackWindowScroll from '../hoc/trackWindowScroll.js';

class LazyLoadComponentWithTracking extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <LazyLoadComponentWithoutTracking {...this.props} />
    );
  }
}

export default trackWindowScroll(LazyLoadComponentWithTracking);
