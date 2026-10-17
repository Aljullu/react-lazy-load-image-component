import trackWindowScroll from './trackWindowScroll';
import isIntersectionObserverAvailable from '../utils/intersection-observer';

jest.mock('../utils/intersection-observer');

const ScrollAware = trackWindowScroll(() => null);

describe('trackWindowScroll cleanup', () => {
	beforeEach(() => {
		jest.useFakeTimers();
		isIntersectionObserverAvailable.mockReturnValue(false);
	});
	afterEach(() => jest.useRealTimers());

	it.each(['debounce', 'throttle'])(
		'cancels pending %s work on unmount',
		delayMethod => {
			const instance = new ScrollAware({
				delayMethod,
				delayTime: 100,
				useIntersectionObserver: false,
			});
			instance.scrollElement = window;
			instance.setState = jest.fn();
			instance.delayedScroll();
			instance.delayedScroll();
			instance.setState.mockClear();

			instance.componentWillUnmount();
			jest.runAllTimers();

			expect(instance.setState).not.toHaveBeenCalled();
		}
	);

	it('unmounts observer mode without a delayed handler', () => {
		isIntersectionObserverAvailable.mockReturnValue(true);
		const instance = new ScrollAware({ useIntersectionObserver: true });
		expect(() => instance.componentWillUnmount()).not.toThrow();
	});

	it('delivers pending work while still mounted', () => {
		const instance = new ScrollAware({
			delayMethod: 'debounce',
			delayTime: 100,
			useIntersectionObserver: false,
		});
		instance.setState = jest.fn();
		instance.delayedScroll();
		jest.runAllTimers();
		expect(instance.setState).toHaveBeenCalledTimes(1);
	});
});
