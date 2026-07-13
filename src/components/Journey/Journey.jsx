import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import journeyData from "../../data/journeyData";
import "./Journey.css";

export default function Journey() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // total horizontal travel = (numCards - 1) * 100vw worth, in %
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);

  return (
    <section ref={containerRef} className="journey">
      <div className="journey-sticky">
        <p className="journey-heading">our journey</p>
        <motion.div className="journey-track" style={{ x }}>
          {journeyData.map((item) => (
            <JourneyCard key={item.id} item={item} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function JourneyCard({ item }) {
  return (
    <div className="journey-card">
      <div className="journey-card-img">
        <img src={item.img} alt={item.title} />
      </div>
      <span className="journey-card-year">{item.year}</span>
      <h3 className="journey-card-title">{item.title}</h3>
      <p className="journey-card-text">{item.text}</p>
    </div>
  );
}