import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";
import "./MessageJar.css";

const loveMessages = [
  "i love the way your eyes light up when you talk about things you love.",
  "i love how safe and at home i feel the moment we talk.",
  "i love your kindness, not just to me, but to everyone around you.",
  "i love the sound of your laugh it is my absolute favorite sound in the world.",
  "i love how you support me and believe in my dreams, even when i doubt myself.",
  "i love your gentle strength and how you handle everything with grace.",
  "i love the quiet, silly moments we share that nobody else understands.",
  "i love the way you love me unconditionally, patiently, and completely.",
  "i love that you are my best friend and my partner in everything.",
  "i love that no matter how much time passes, you still make my heart skip a beat."
];

export default function MessageJar() {
  const [allMessages, setAllMessages] = useState(loveMessages);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newReason, setNewReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchJarMessages();
  }, []);

  async function fetchJarMessages() {
    const { data, error } = await supabase
      .from("jar_messages")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("fetch jar_messages error:", error);
      return;
    }

    const herMessages = data.map((row) => row.message);
    setAllMessages([...loveMessages, ...herMessages]);
  }

  function drawMessage() {
    setIsDrawing(true);
    setCurrentMessage("");

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * allMessages.length);
      setCurrentMessage(allMessages[randomIndex]);
      setIsDrawing(false);
    }, 800);
  }

  async function handleAddReason(e) {
    e.preventDefault();
    if (!newReason.trim()) return;

    setSubmitting(true);

    const { data, error } = await supabase
      .from("jar_messages")
      .insert([{ message: newReason.trim() }])
      .select()
      .single();

    setSubmitting(false);

    if (error) {
      console.error("insert jar_messages error:", error);
      return;
    }

    setAllMessages((prev) => [...prev, data.message]);
    setNewReason("");
    setShowForm(false);
  }

  return (
    <section className="jar-section">
      <div className="jar-container">
        <motion.p className="jar-subtitle" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          a little reminder
        </motion.p>
        <motion.h2 className="jar-title" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          the love jar
        </motion.h2>

        <div className="jar-wrapper">
          <motion.div
            className={`jar-body ${isDrawing ? "shaking" : ""}`}
            onClick={drawMessage}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="jar-lid" />
            <div className="jar-ribbon" />
            <div className="jar-label">reasons i love you</div>
            <div className="jar-stars">
              <span className="star s1">❤️</span>
              <span className="star s2">💖</span>
              <span className="star s3">💝</span>
              <span className="star s4">💕</span>
              <span className="star s5">💓</span>
            </div>
          </motion.div>

          <div className="jar-display-area">
            <button className="jar-draw-btn" onClick={drawMessage} disabled={isDrawing}>
              {isDrawing ? "reaching inside..." : "pull out a note"}
            </button>

            <div className="note-card-placeholder">
              <AnimatePresence mode="wait">
                {currentMessage && (
                  <motion.div
                    className="pulled-note-card"
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <p className="note-content">"{currentMessage}"</p>
                    <span className="note-heart">❤️</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="bucket-add-box">
          {!showForm ? (
            <button className="bucket-add-toggle" onClick={() => setShowForm(true)}>
              + add your own reason to the jar
            </button>
          ) : (
            <form onSubmit={handleAddReason} className="bucket-add-form">
              <input
                type="text"
                placeholder="i love that..."
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                maxLength={140}
                disabled={submitting}
              />
              <button type="submit" disabled={submitting}>
                {submitting ? "adding..." : "add to jar"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}