declare module 'react-lazy-load-image-component' {
  interface LazyLoadImageProps {
    afterLoad?: any;
    beforeLoad?: any;
    delayMethod?: string;
    delayTime?: number;
    effect?: string;
    placeholder?: any;
    placeholderSrc?: any;
    threshold?: number;
    visibleByDefault?: boolean;
    wrapperClassName?: string;
    src: string | null;
    width?: number;
    height?: number;
    alt?: string | null;
  }

  export const LazyLoadImage: (props: LazyLoadImageProps) => JSX.Element;
}
