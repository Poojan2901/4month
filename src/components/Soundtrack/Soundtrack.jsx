import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import "./Soundtrack.css";

const playlist = [
  {
    id: 1,
    title: "first conversation",
    artist: "quiet piano & rain",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "6:12",
  },
  {
    id: 2,
    title: "the walk in the park",
    artist: "acoustic guitar instrumental",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "7:05",
  },
  {
    id: 3,
    title: "under the stars",
    artist: "slow ambient lofi",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: "5:44",
  },
];

export default function Soundtrack() {
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const track = playlist[currentTrackIdx];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [currentTrackIdx]);

  function handlePlayPause() {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }

  function handleTimeUpdate() {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }

  function handleLoadedMetadata() {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }

  function handleTrackEnd() {
    nextTrack();
  }

  function nextTrack() {
    setCurrentTrackIdx((prev) => (prev + 1) % playlist.length);
  }

  function prevTrack() {
    setCurrentTrackIdx((prev) => (prev - 1 + playlist.length) % playlist.length);
  }

  function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <section className="soundtrack-section">
      <div className="soundtrack-container">
        <motion.p
          className="soundtrack-subtitle"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          press play
        </motion.p>
        <motion.h2
          className="soundtrack-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          our soundtrack
        </motion.h2>

        <div className="soundtrack-player-box">
          <div className="player-left">
            <div className={`vinyl-record ${isPlaying ? "playing" : ""}`}>
              <div className="vinyl-center" />
            </div>
          </div>

          <div className="player-right">
            <span className="player-status">{isPlaying ? "now playing" : "paused"}</span>
            <h3 className="player-track-title">{track.title}</h3>
            <p className="player-track-artist">{track.artist}</p>

            <div className="player-controls">
              <button className="control-btn" onClick={prevTrack}>
                ⏮
              </button>
              <button className="control-btn play-btn" onClick={handlePlayPause}>
                {isPlaying ? "⏸" : "▶"}
              </button>
              <button className="control-btn" onClick={nextTrack}>
                ⏭
              </button>
            </div>

            <div className="player-progress-area">
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="progress-time-labels">
                <span>{formatTime(currentTime)}</span>
                <span>{duration ? formatTime(duration) : track.duration}</span>
              </div>
            </div>
          </div>
        </div>

        <audio
          ref={audioRef}
          src={track.url}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleTrackEnd}
        />
      </div>
    </section>
  );
}
