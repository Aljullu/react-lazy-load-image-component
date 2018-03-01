import React from 'react';

import LazyLoadComponent from './LazyLoadComponent.jsx';

class LazyLoadImage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { afterLoad, beforeLoad, placeholder, scrollPosition, threshold,
      visibleByDefault, ...imgProps } = this.props;

    return (
      <LazyLoadComponent
        afterLoad={afterLoad}
        beforeLoad={beforeLoad}
        className={this.props.className}
        height={this.props.height}
        placeholder={placeholder}
        scrollPosition={scrollPosition}
        threshold={threshold}
        visibleByDefault={visibleByDefault}
        style={this.props.style}
        width={this.props.width}>
        <img {...imgProps} />
      </LazyLoadComponent>
    );
  }
}

export default LazyLoadImage;
