export default function() {
  return (
    'IntersectionObserver' in window &&
    'isIntersecting' in window.IntersectionObserverEntry.prototype
  );
}
