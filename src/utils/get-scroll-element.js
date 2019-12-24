// copyright https://github.com/loktar00/react-lazy-load/blob/master/src/utils/parentScroll.js

const style = (element, prop) =>
	typeof getComputedStyle === 'undefined'
		? element.style[prop]
		: getComputedStyle(element, null).getPropertyValue(prop);

const overflow = element =>
	style(element, 'overflow') +
	style(element, 'overflow-y') +
	style(element, 'overflow-x');

const scrollParent = element => {
	if (!(element instanceof HTMLElement)) {
		return window;
	}

	let parent = element;

	while (parent) {
		if (
			parent === document.body ||
			parent === document.documentElement ||
			!parent.parentNode
		) {
			break;
		}

		if (/(scroll|auto)/.test(overflow(parent))) {
			return parent;
		}

		parent = parent.parentNode;
	}

	return window;
};

export default scrollParent;
