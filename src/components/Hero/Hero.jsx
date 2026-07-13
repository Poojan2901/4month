import { motion } from "framer-motion";
import "./Hero.css";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-vignette" />

      <nav className="hero-nav">
        <span className="hero-nav-logo">US</span>
        <span className="hero-nav-link">United SOULS</span>
      </nav>

      <motion.div
        className="hero-content"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.p variants={item} className="hero-eyebrow">
          a story, still being written
        </motion.p>
        <motion.h1 variants={item} className="hero-title">
          Kira
        </motion.h1>
        <motion.p variants={item} className="hero-sub">
          every moment we've made, kept here for you.
        </motion.p>
      </motion.div>

      <motion.div
        className="hero-scroll-cue"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <span className="hero-scroll-line" />
        <span>scroll</span>
      </motion.div>
    </section>
  );
}