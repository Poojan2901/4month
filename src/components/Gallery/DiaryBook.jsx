import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import galleryData from "../../data/galleryData";
import "./DiaryBook.css";

const PRELOAD_RADIUS = 3; // preload this many pages ahead/behind current

export default function DiaryBook() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const loadedSet = useRef(new Set());

  const total = galleryData.length;
  const photo = galleryData[current];
  const isFirst = current === 0;
  const isLast = current >= total - 1;

  // preload only nearby pages, not everything at once
  useEffect(() => {
    for (let i = current - PRELOAD_RADIUS; i <= current + PRELOAD_RADIUS; i++) {
      if (i < 0 || i >= total) continue;
      const item = galleryData[i];
      if (loadedSet.current.has(item.id)) continue;
      loadedSet.current.add(item.id);

      const img = new Image();
      img.src = item.src;
      const chibi = new Image();
      chibi.src = item.chibi;
    }
  }, [current, total]);

  function goNext() {
    if (isLast) return;
    setDirection(1);
    setCurrent((c) => c + 1);
  }

  function goPrev() {
    if (isFirst) return;
    setDirection(-1);
    setCurrent((c) => c - 1);
  }

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  };

  return (
    <section className="diary-section">
      <div className="book-spread">
        <div className="page page-caption">
          <span className="page-number">
            {String(current + 1).padStart(3, "0")}
          </span>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={photo.id + "-chibi"}
              className="chibi-frame"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <img
                src={photo.chibi}
                alt=""
                className="chibi-art"
                loading="eager"
                decoding="async"
              />
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.p
              key={photo.id + "-caption"}
              className="caption-text"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            >
              {photo.caption || "her caption goes here."}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="page-flip-wrap">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={photo.id + "-photo"}
              className="page page-photo page-active"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <img
                src={photo.src}
                alt={photo.caption || "photo"}
                loading="eager"
                decoding="async"
                fetchpriority="high"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="page-controls">
        <button className="page-nav-btn" onClick={goPrev} disabled={isFirst}>
          ← prev
        </button>
        <span className="page-hint">
          {String(current + 1).padStart(3, "0")} / {String(total).padStart(3, "0")}
        </span>
        <button className="page-nav-btn" onClick={goNext} disabled={isLast}>
          next →
        </button>
      </div>
    </section>
  );
}