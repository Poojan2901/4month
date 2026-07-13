import { useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import videoData from "../../data/videoData";
import "./Videos.css";

function VideoCard({ video, index }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useTransform(my, [-50, 50], [8, -8]);
  const rotateY = useTransform(mx, [-50, 50], [-8, 8]);

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - rect.left - rect.width / 2);
    my.set(e.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() {
    mx.set(0);
    my.set(0);
  }

  function togglePlay() {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  }

  function handleTimeUpdate() {
    const v = videoRef.current;
    if (v && v.duration) setProgress((v.currentTime / v.duration) * 100);
  }

  return (
    <motion.div
      className="video-card"
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      initial={{ opacity: 0, y: 50, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={video.src}
        poster={video.poster}
        playsInline
        loop
        onEnded={() => setPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        className="video-el"
      />

      <motion.div
        className="video-play-overlay"
        animate={{ opacity: playing ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="video-play-btn"
          initial={{ scale: 0.8 }}
          whileHover={{ scale: 1.15 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20">
            <polygon points="5,3 17,10 5,17" fill="#faf9f5" />
          </svg>
        </motion.div>
      </motion.div>

      <motion.div
        className="video-progress-track"
        initial={{ opacity: 0 }}
        animate={{ opacity: playing ? 1 : 0 }}
      >
        <motion.div
          className="video-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </motion.div>

      {video.caption && (
        <motion.p
          className="video-caption"
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
        >
          {video.caption}
        </motion.p>
      )}
    </motion.div>
  );
}

export default function Videos() {
  return (
    <section className="videos-section">
      <motion.p
        className="videos-heading"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        moments in motion
      </motion.p>
      <div className="videos-grid">
        {videoData.map((v, i) => (
          <VideoCard key={v.id} video={v} index={i} />
        ))}
      </div>
    </section>
  );
}