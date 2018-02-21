import React from 'react';

const trackWindowScroll = (BaseComponent) => {
  class ScrollAwareComponent extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        scrollPosition: window.scrollY || window.pageYOffset
      };
    }

    componentDidMount() {
      window.addEventListener('scroll', this.onChangeScroll.bind(this));
      window.addEventListener('resize', this.onChangeScroll.bind(this));
    }

    componentWillUnmount() {
      window.removeEventListener('scroll', this.onChangeScroll.bind(this));
      window.removeEventListener('resize', this.onChangeScroll.bind(this));
    }

    onChangeScroll() {
      this.setState({
        scrollPosition: window.scrollY || window.pageYOffset
      });
    }

    render() {
      return (
        <BaseComponent
          scrollPosition={this.state.scrollPosition}
          {...this.props} />
      );
    }
  }

  return ScrollAwareComponent;
};

export default trackWindowScroll;

