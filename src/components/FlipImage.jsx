// src/components/FlipImage.jsx
import React from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * FlipImage
 * Props:
 *  - frontSrc: string (required)  -> image shown on front face
 *  - backSrc: string (optional)   -> image shown on back face (if not provided, frontSrc is reused)
 *  - alt: string (optional)
 *  - size: number (px) or string (e.g. "48px" or "3rem") default 48
 */
export default function FlipImage({ frontSrc, backSrc, alt = "", size = 48 }) {
  const shouldReduce = useReducedMotion();
  const back = backSrc || frontSrc;

  // If reduced motion is requested, show just the front image (no animation)
  if (shouldReduce) {
    return (
      <img
        src={frontSrc}
        alt={alt}
        width={size}
        height={size}
        className="object-cover rounded-full"
        style={{ width: typeof size === "number" ? `${size}px` : size, height: typeof size === "number" ? `${size}px` : size }}
      />
    );
  }

  // outer container provides perspective
  const outerStyle = {
    width: typeof size === "number" ? `${size}px` : size,
    height: typeof size === "number" ? `${size}px` : size,
    perspective: 800,
  };

  // inner card rotates in 3D; we animate rotateY using tween (safe for many keyframes)
  const innerVariants = {
    animate: {
      rotateY: [0, 180, 360], // smooth continuous flip
      transition: { duration: 2.2, repeat: Infinity, ease: "linear", type: "tween" },
    },
  };

  const faceStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    borderRadius: "9999px",
    overflow: "hidden",
  };

  return (
    <div style={outerStyle} className="inline-block">
      <motion.div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
        }}
        variants={innerVariants}
        animate="animate"
      >
        {/* FRONT FACE */}
        <div style={{ ...faceStyle }}>
          <img src={frontSrc} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>

        {/* BACK FACE (rotated 180deg so when the inner rotates it appears correctly) */}
        <div style={{ ...faceStyle, transform: "rotateY(180deg)" }}>
          <img src={back} alt={alt ? `${alt} (back)` : ""} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
      </motion.div>
    </div>
  );
}
