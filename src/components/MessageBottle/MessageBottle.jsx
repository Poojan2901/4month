import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";
import "./MessageBottle.css";

const defaultMessages = [
  {
    id: "bottle-1",
    message: "i love the way we can talk for hours without ever running out of things to say. you're my best friend. you're my partner, and you're my everything.",
    sender: "me",
    date: "july 10, 2026"
  },
  {
    id: "bottle-2",
    message: "i hope you know how much joy you bring to my life. you make everything brighter just by being you.",
    sender: "me",
    date: "july 09, 2026"
  },
  {
    id: "bottle-3",
    message: "no matter where life takes us, my heart will always find its way back to you. you are my home.",
    sender: "me",
    date: "july 08, 2026"
  }
];

export default function MessageBottle() {
  const [messages, setMessages] = useState(defaultMessages);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [newMsgText, setNewMsgText] = useState("");
  const [isLaunching, setIsLaunching] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    const { data, error } = await supabase
      .from("bottle_messages")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("fetch bottle_messages error:", error);
      setLoading(false);
      return;
    }

    const dbMessages = data.map((row) => ({
      id: row.id,
      message: row.message,
      sender: row.sender,
      date: new Date(row.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      })
    }));

    setMessages([...defaultMessages, ...dbMessages]);
    setLoading(false);
  }

  const handleLaunch = async (e) => {
    e.preventDefault();
    if (!newMsgText.trim()) return;

    setIsLaunching(true);

    const { data, error } = await supabase
      .from("bottle_messages")
      .insert([{ message: newMsgText.trim(), sender: "kira" }])
      .select()
      .single();

    setIsLaunching(false);

    if (error) {
      console.error("insert bottle_messages error:", error);
      return;
    }

    const newMsg = {
      id: data.id,
      message: data.message,
      sender: data.sender,
      date: new Date(data.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      })
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMsgText("");
  };

  return (
    <section className="bottle-section">
      <div className="bottle-container">
        <motion.p
          className="bottle-subtitle"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          messages in the ocean
        </motion.p>
        <motion.h2
          className="bottle-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          message in a bottle
        </motion.h2>
        <motion.p
          className="bottle-desc"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          little thoughts sent floating into the digital sea. tap a bottle to pull it out and read the scroll.
        </motion.p>

        <div className="ocean-sea">
          <div className="wave wave-1" />
          <div className="wave wave-2" />
          <div className="wave wave-3" />

          <div className="bottles-float-area">
            {!loading &&
              messages.map((item, idx) => (
                <motion.div
                  key={item.id}
                  className="floating-bottle"
                  style={{
                    left: `${15 + (idx * 22) % 70}%`,
                    bottom: `${20 + (idx * 12) % 40}%`
                  }}
                  animate={{
                    y: [0, -15, 0],
                    rotate: [-3, 3, -3]
                  }}
                  transition={{
                    duration: 4 + (idx % 3),
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  onClick={() => setSelectedMessage(item)}
                >
                  <div className="bottle-shape">🍾</div>
                </motion.div>
              ))}
          </div>
        </div>

        <div className="throw-bottle-box">
          <h3>toss a message into the sea</h3>
          <form onSubmit={handleLaunch} className="throw-bottle-form">
            <input
              type="text"
              className="bottle-input"
              placeholder="write your secret message here..."
              value={newMsgText}
              onChange={(e) => setNewMsgText(e.target.value)}
              disabled={isLaunching}
              maxLength={120}
            />
            <button type="submit" className="launch-btn" disabled={isLaunching}>
              {isLaunching ? "tossing bottle..." : "throw bottle"}
            </button>
          </form>
        </div>
      </div>

      <AnimatePresence>
        {selectedMessage && (
          <motion.div
            className="scroll-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMessage(null)}
          >
            <motion.div
              className="scroll-modal-content"
              initial={{ scale: 0.8, rotate: -5, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.8, rotate: 5, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-scroll-btn" onClick={() => setSelectedMessage(null)}>
                ✕
              </button>
              <div className="scroll-paper">
                <span className="scroll-date">{selectedMessage.date}</span>
                <p className="scroll-body">"{selectedMessage.message}"</p>
                <span className="scroll-sig">always, yours.</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}