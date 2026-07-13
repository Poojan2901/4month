import { motion } from "framer-motion";
import "./Stats.css";

const stats = [
  {
    id: 1,
    number: "50",
    label: "photos",
    sub: "but endless memories every one, a moment i didn't want to lose.",
    img: "/photos/stat-1.jpeg",
  },
  {
    id: 2,
    number: "0.33",
    label: "years",
    sub: "and better than ever. and still counting.",
    img: "/photos/stat-2.jpeg",
  },
  {
    id: 3,
    number: "1",
    label: "promise",
    sub: "I am yours and you are mine. and I will never let you go.",
    img: "/photos/stat-3.jpeg",
  },
];

const item = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Stats() {
  return (
    <section className="stats">
      <p className="stats-heading">the numbers that matter</p>
      <div className="stats-grid">
        {stats.map((s, i) => (
          <motion.div
            key={s.id}
            className="stat-card"
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: i * 0.15 }}
          >
            <div className="stat-card-img">
              <img src={s.img} alt={s.label} />
            </div>
            <h3 className="stat-number">
              {s.number} <span className="stat-label">{s.label}</span>
            </h3>
            <p className="stat-sub">{s.sub}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}