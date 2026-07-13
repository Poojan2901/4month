import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Letters.css";

const lettersData = [
  {
    id: 1,
    title: "to you, on the quiet days",
    preview: "i want you to know how much peace you bring me...",
    content: "sometimes, in the middle of a busy day, i catch myself thinking about the way you smile. it’s this quiet, gentle reminder that no matter how chaotic the world gets, you are my safe space my world. thank you for being the calm in my storm.",
    date: "july 10, 2026",
  },
  {
    id: 2,
    title: "when the distance feels heavy",
    preview: "every mile between us is just a reminder of...",
    content: "distance is hard, but it has taught me one thing: my love for you is not bound by geography. every phone call, every late-night laugh, and every countdown until we see each other makes it all worth it. i am yours, always.",
    date: "july 09, 2026",
  },
  {
    id: 3,
    title: "a promise for our future",
    preview: "i promise to choose you, every single day...",
    content: "i promise to stand by you, to laugh with you, and to hold your hand through the highs and the lows. i promise to keep building a world with you, one memory at a time. you are my today and all of my tomorrows.",
    date: "july 08, 2026",
  },
];

export default function Letters() {
  const [selectedLetter, setSelectedLetter] = useState(null);

  return (
    <section className="letters-section">
      <div className="letters-container">
        <motion.p
          className="letters-subtitle"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          words left for you
        </motion.p>
        <motion.h2
          className="letters-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          letters to kira
        </motion.h2>

        <div className="letters-grid">
          {lettersData.map((letter, idx) => (
            <motion.div
              key={letter.id}
              className="letter-envelope"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              onClick={() => setSelectedLetter(letter)}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="envelope-stamp">❤️</div>
              <span className="envelope-date">{letter.date}</span>
              <h3 className="envelope-title">{letter.title}</h3>
              <p className="envelope-preview">"{letter.preview}"</p>
              <span className="envelope-read-btn">open letter</span>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedLetter && (
          <motion.div
            className="letter-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedLetter(null)}
          >
            <motion.div
              className="letter-modal-content"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-modal-btn"
                onClick={() => setSelectedLetter(null)}
              >
                ✕
              </button>
              <span className="modal-letter-date">{selectedLetter.date}</span>
              <h3 className="modal-letter-title">{selectedLetter.title}</h3>
              <div className="modal-letter-divider" />
              <p className="modal-letter-body">{selectedLetter.content}</p>
              <div className="modal-letter-signature">always, yours.</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
