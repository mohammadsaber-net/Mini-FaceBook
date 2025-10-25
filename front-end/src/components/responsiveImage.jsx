export default function ResponsiveImage({ src, alt, className }) {
  if (!src) return null;

  const base = src.split("?")[0];

  return (
    <img
        {...rest}
      src={`${base}?tr=w-400,q-80,f-webp`}
      srcSet={`
        ${base}?tr=w-200,q-80,f-webp 200w,
        ${base}?tr=w-400,q-80,f-webp 400w,
        ${base}?tr=w-800,q-80,f-webp 800w
      `}
      sizes="(max-width: 600px) 200px,
             (max-width: 1024px) 400px,
             800px"
      alt={alt || "image"}
      className={className}
      loading="lazy"
      style={{ width: "100%", height: "auto", objectFit: "cover" }}
    />
  );
}
