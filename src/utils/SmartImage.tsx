import React from "react";

type SmartImageProps = {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  loading?: "eager" | "lazy";
  decoding?: "async" | "sync" | "auto";
  objectFit?: "cover" | "contain";
  fill?: boolean;
};

export function SmartImage({
  src,
  alt = "",
  width,
  height,
  className = "",
  sizes,
  priority = false,
  loading,
  decoding,
  objectFit = "cover",
  fill = false,
}: SmartImageProps) {
  // ponytail: no fake ?w= srcSet until image CDN/sharp enabled — plain <img> avoids 6× duplicate fetches
  const img = (
    <img
      src={src}
      alt={alt}
      loading={loading ?? (priority ? "eager" : "lazy")}
      fetchPriority={priority ? "high" : "auto"}
      decoding={decoding ?? "async"}
      sizes={sizes}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={`
        ${fill ? "absolute inset-0 w-full h-full" : ""}
        object-${objectFit}
        ${className || "w-full h-auto"}
      `}
      style={{ display: "block" }}
    />
  );

  if (fill) {
    return <div className="absolute inset-0">{img}</div>;
  }

  return img;
}
