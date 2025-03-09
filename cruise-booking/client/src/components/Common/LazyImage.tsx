interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function LazyImage({ src, alt, className = '' }: LazyImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
    />
  );
}
