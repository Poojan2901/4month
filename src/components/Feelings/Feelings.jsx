import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import "./Feelings.css";

export default function Feelings() {
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const spotX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const spotY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  function handleMouseMove(e) {
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  return (
    <section
      ref={containerRef}
      className="feelings"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="feelings-spotlight"
        style={{
          left: spotX,
          top: spotY,
        }}
      />

      <div className="feelings-text-layer feelings-text-base">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i}>you, always. </span>
        ))}
      </div>
      <motion.div
        className="feelings-text-layer feelings-text-color"
        style={{
          WebkitMaskImage: `radial-gradient(circle 180px at ${spotX}px ${spotY}px, black 0%, transparent 100%)`,
          maskImage: `radial-gradient(circle 180px at ${spotX}px ${spotY}px, black 0%, transparent 100%)`,
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i}>you, always. </span>
        ))}
      </motion.div>

      <p className="feelings-caption">move around. find how i feel.</p>
    </section>
  );
}