import { useEffect, useState } from "react";
import "./Cursor.css";

export default function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    function handleMove(e) {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    }

    function handleOver(e) {
      const target = e.target;
      const interactive = target.closest(
        "button, a, input, textarea, select, [role='button'], .photo-card, .video-card, .map-card, .bucket-card, .coupon-card, .quiz-option-btn, .floating-bottle, .lock-interactive"
      );
      setIsHovering(!!interactive);
    }

    function handleDown() {
      setIsClicking(true);
    }

    function handleUp() {
      setIsClicking(false);
    }

    function handleLeaveWindow() {
      setIsVisible(false);
    }

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseover", handleOver);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);
    document.addEventListener("mouseleave", handleLeaveWindow);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      document.removeEventListener("mouseleave", handleLeaveWindow);
    };
  }, [isVisible]);

  return (
    <div
      className="mac-cursor"
      style={{
        left: pos.x,
        top: pos.y,
        opacity: isVisible ? 1 : 0,
        transform: `translate(-4px, -2px) scale(${isClicking ? 0.9 : 1})`,
      }}
    >
      {isHovering ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 2C8.5 2 8 2.4 8 3v10.5l-1.8-1.8c-.5-.5-1.4-.5-1.9 0-.5.5-.5 1.3 0 1.8l4 4c.3.3.6.4 1 .4h5.5c1.4 0 2.7-.8 3.3-2.1l1.4-3.1c.2-.5.3-1 .3-1.6V9c0-1.1-.9-2-2-2s-2 .9-2 2V7c0-1.1-.9-2-2-2s-2 .9-2 2V5c0-1.1-.9-2-2-2z"
            fill="#1a1a1a"
            stroke="#fff"
            strokeWidth="1"
          />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M2 1.5L2 16.5L6 12.8L8.4 18L11 16.8L8.6 11.5L14 11.5L2 1.5Z"
            fill="#1a1a1a"
            stroke="#fff"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}