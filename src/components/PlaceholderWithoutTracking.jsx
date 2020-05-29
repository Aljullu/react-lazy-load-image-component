import React from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';
import isIntersectionObserverAvailable from '../utils/intersection-observer';

class PlaceholderWithoutTracking extends React.Component {
	constructor(props) {
		super(props);

		const supportsObserver =
			!props.scrollPosition &&
			props.useIntersectionObserver &&
			isIntersectionObserverAvailable();

		this.LAZY_LOAD_OBSERVER = { supportsObserver };

		if (supportsObserver) {
			const { threshold } = props;

			this.LAZY_LOAD_OBSERVER.observer = new IntersectionObserver(
				this.checkIntersections,
				{ rootMargin: threshold + 'px' }
			);
		}
	}

	checkIntersections(entries) {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.onVisible();
			}
		});
	}

	componentDidMount() {
		if (
			this.placeholder &&
			this.LAZY_LOAD_OBSERVER &&
			this.LAZY_LOAD_OBSERVER.observer
		) {
			this.placeholder.onVisible = this.props.onVisible;
			this.LAZY_LOAD_OBSERVER.observer.observe(this.placeholder);
		}

		if (
			this.LAZY_LOAD_OBSERVER &&
			!this.LAZY_LOAD_OBSERVER.supportsObserver
		) {
			this.updateVisibility();
		}
	}

	componentWillUnmount() {
		if (this.LAZY_LOAD_OBSERVER && this.LAZY_LOAD_OBSERVER.observer) {
			this.LAZY_LOAD_OBSERVER.observer.unobserve(this.placeholder);
		}
	}

	componentDidUpdate() {
		if (
			this.LAZY_LOAD_OBSERVER &&
			!this.LAZY_LOAD_OBSERVER.supportsObserver
		) {
			this.updateVisibility();
		}
	}

	getPlaceholderBoundingBox(scrollPosition = this.props.scrollPosition) {
		const boundingRect = this.placeholder.getBoundingClientRect();
		const style = ReactDOM.findDOMNode(this.placeholder).style;
		const margin = {
			left: parseInt(style.getPropertyValue('margin-left'), 10) || 0,
			top: parseInt(style.getPropertyValue('margin-top'), 10) || 0,
		};

		return {
			bottom: scrollPosition.y + boundingRect.bottom + margin.top,
			left: scrollPosition.x + boundingRect.left + margin.left,
			right: scrollPosition.x + boundingRect.right + margin.left,
			top: scrollPosition.y + boundingRect.top + margin.top,
		};
	}

	isPlaceholderInViewport() {
		if (typeof window === 'undefined' || !this.placeholder) {
			return false;
		}

		const { scrollPosition, threshold } = this.props;
		const boundingBox = this.getPlaceholderBoundingBox(scrollPosition);
		const viewport = {
			bottom: scrollPosition.y + window.innerHeight,
			left: scrollPosition.x,
			right: scrollPosition.x + window.innerWidth,
			top: scrollPosition.y,
		};

		return Boolean(
			viewport.top - threshold <= boundingBox.bottom &&
				viewport.bottom + threshold >= boundingBox.top &&
				viewport.left - threshold <= boundingBox.right &&
				viewport.right + threshold >= boundingBox.left
		);
	}

	updateVisibility() {
		if (this.isPlaceholderInViewport()) {
			this.props.onVisible();
		}
	}

	render() {
		const { className, height, placeholder, style, width } = this.props;

		if (placeholder && typeof placeholder.type !== 'function') {
			return React.cloneElement(placeholder, {
				ref: el => (this.placeholder = el),
			});
		}

		const styleProp = {
			display: 'inline-block',
			...style,
		};

		if (typeof width !== 'undefined') {
			styleProp.width = width;
		}

		if (typeof height !== 'undefined') {
			styleProp.height = height;
		}

		return (
			<span
				className={className}
				ref={el => (this.placeholder = el)}
				style={styleProp}
			>
				{placeholder}
			</span>
		);
	}
}

PlaceholderWithoutTracking.propTypes = {
	onVisible: PropTypes.func.isRequired,
	className: PropTypes.string,
	height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	placeholder: PropTypes.element,
	threshold: PropTypes.number,
	useIntersectionObserver: PropTypes.bool,
	scrollPosition: PropTypes.shape({
		x: PropTypes.number.isRequired,
		y: PropTypes.number.isRequired,
	}),
	width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

PlaceholderWithoutTracking.defaultProps = {
	className: '',
	placeholder: null,
	threshold: 100,
	useIntersectionObserver: true,
};

export default PlaceholderWithoutTracking;
