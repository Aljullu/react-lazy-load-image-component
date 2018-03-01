import React from 'react';

import LazyLoadComponent from './LazyLoadComponent.jsx';

class LazyLoadImage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { afterLoad, beforeLoad, delayMethod, delayTime, placeholder,
      scrollPosition, threshold, visibleByDefault, ...imgProps } = this.props;

    return (
      <LazyLoadComponent
        afterLoad={afterLoad}
        beforeLoad={beforeLoad}
        className={this.props.className}
        delayMethod={delayMethod}
        delayTime={delayTime}
        height={this.props.height}
        placeholder={placeholder}
        scrollPosition={scrollPosition}
        style={this.props.style}
        threshold={threshold}
        visibleByDefault={visibleByDefault}
        width={this.props.width}>
        <img {...imgProps} />
      </LazyLoadComponent>
    );
  }
}

export default LazyLoadImage;
