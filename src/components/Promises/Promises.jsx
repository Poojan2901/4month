import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";
import "./Promises.css";

const defaultPromises = [
  { id: "default-1", text: "to hold your hand through every season of life, both in sunshine and in storms.", category: "vow" },
  { id: "default-2", text: "to support your wildest dreams, even when they seem out of reach.", category: "support" },
  { id: "default-3", text: "to be the calm space you can always come back to at the end of a long day.", category: "home" },
  { id: "default-4", text: "to listen to you with an open heart, and to learn from you every day.", category: "growth" },
  { id: "default-5", text: "to share in every quiet laugh, silly dance, and midnight conversation.", category: "joy" },
];

export default function Promises() {
  const [promises, setPromises] = useState(defaultPromises);
  const [lockedIds, setLockedIds] = useState({});
  const [newPromiseText, setNewPromiseText] = useState("");
  const [category, setCategory] = useState("vow");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromises();
  }, []);

  async function fetchPromises() {
    const { data, error } = await supabase
      .from("promises")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("fetch promises error:", error);
      setLoading(false);
      return;
    }

    setPromises([...defaultPromises, ...data]);

    const locks = {};
    data.forEach((p) => {
      if (p.locked) locks[p.id] = true;
    });
    setLockedIds(locks);
    setLoading(false);
  }

  async function handleLock(id) {
    if (lockedIds[id]) return;
    if (id.startsWith("default-")) return; // defaults aren't in DB, skip persisting lock for those

    setLockedIds((prev) => ({ ...prev, [id]: true }));

    const { error } = await supabase
      .from("promises")
      .update({ locked: true })
      .eq("id", id);

    if (error) {
      console.error("lock promise error:", error);
      setLockedIds((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  }

  async function handleAddPromise(e) {
    e.preventDefault();
    if (!newPromiseText.trim()) return;

    const { data, error } = await supabase
      .from("promises")
      .insert([{ text: newPromiseText.trim(), category }])
      .select()
      .single();

    if (error) {
      console.error("insert promise error:", error);
      return;
    }

    setPromises((prev) => [...prev, data]);
    setNewPromiseText("");
  }

  return (
    <section className="promises-section">
      <div className="promises-container">
        <motion.p className="promises-subtitle" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          our pinky promises
        </motion.p>
        <motion.h2 className="promises-title" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          vows & love locks
        </motion.h2>
        <motion.p className="promises-description" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          a collection of promises written to you. click on any lock to turn the key and seal the promise forever.
        </motion.p>

        {!loading && (
          <div className="promises-grid">
            {promises.map((promise, idx) => {
              const isLocked = !!lockedIds[promise.id];
              return (
                <motion.div
                  key={promise.id}
                  className={`promise-card ${isLocked ? "locked" : "unlocked"}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: Math.min(idx * 0.1, 0.5) }}
                >
                  <div className="promise-card-header">
                    <span className={`promise-tag ${promise.category}`}>{promise.category}</span>
                    <div className="lock-interactive" onClick={() => handleLock(promise.id)}>
                      <LockAnimation isLocked={isLocked} />
                    </div>
                  </div>
                  <p className="promise-card-text">"{promise.text}"</p>
                  <div className="promise-card-footer">
                    <span className="promise-status">
                      {isLocked ? "sealed forever" : "tap lock to seal"}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <motion.div
          className="add-promise-box"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3>write a new promise</h3>
          <form onSubmit={handleAddPromise} className="add-promise-form">
            <textarea
              className="promise-textarea"
              placeholder="e.g., to always bring you chocolate when you are feeling down..."
              value={newPromiseText}
              onChange={(e) => setNewPromiseText(e.target.value)}
              maxLength={150}
            />
            <div className="form-controls">
              <div className="category-select">
                <span className="select-label">tag:</span>
                {["vow", "support", "joy", "home"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`cat-btn ${category === cat ? "active" : ""}`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <button type="submit" className="submit-promise-btn">
                create lock
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

function LockAnimation({ isLocked }) {
  return (
    <div className="lock-wrapper">
      <svg viewBox="0 0 100 100" className={`lock-svg ${isLocked ? "is-locked" : "is-unlocked"}`} width="44" height="44">
        <motion.path
          d="M30 45 V 30 A 20 20 0 0 1 70 30 V 45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          className="lock-shackle"
          animate={isLocked ? { y: 6 } : { y: 0, rotate: -15, originX: "30px", originY: "45px" }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        />
        <path
          d="M 50 85 C 20 70, 15 45, 30 45 C 40 45, 50 52, 50 52 C 50 52, 60 45, 70 45 C 85 45, 80 70, 50 85 Z"
          fill="currentColor"
          className="lock-body"
        />
        <circle cx="50" cy="60" r="5" fill="var(--color-bg)" className="keyhole-dot" />
        <path d="M48 60 L52 60 L54 72 L46 72 Z" fill="var(--color-bg)" className="keyhole-stem" />
        <AnimatePresence>
          {!isLocked && (
            <motion.g className="key-icon" initial={{ opacity: 0.6, scale: 0.8 }} whileHover={{ opacity: 1, scale: 1.1 }}>
              <circle cx="50" cy="20" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
              <line x1="50" y1="24" x2="50" y2="35" stroke="currentColor" strokeWidth="2" />
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}