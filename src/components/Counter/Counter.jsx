import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Counter.css";

// Target date: March 15, 2026
const START_DATE = new Date("2026-03-15T00:00:19");

export default function Counter() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    function updateCounter() {
      const now = new Date();
      const difference = now.getTime() - START_DATE.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }

    updateCounter();
    const interval = setInterval(updateCounter, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="counter-section">
      <div className="counter-container">
        <motion.p
          className="counter-subtitle"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          every single second since we started
        </motion.p>
        <motion.h2
          className="counter-title"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          our time together
        </motion.h2>

        <div className="counter-grid">
          {Object.entries(timeLeft).map(([unit, value], idx) => (
            <motion.div
              key={unit}
              className="counter-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
            >
              <span className="counter-value">{String(value).padStart(2, "0")}</span>
              <span className="counter-unit">{unit}</span>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="counter-footer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          and i would choose you all over again, in a heartbeat.
        </motion.p>
      </div>
    </section>
  );
}
