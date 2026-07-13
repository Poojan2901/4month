import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";
import "./LoveMap.css";

export default function LoveMap() {
  const [pins, setPins] = useState([]);
  const [activePin, setActivePin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newEvent, setNewEvent] = useState("");
  const [newCoords, setNewCoords] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newIcon, setNewIcon] = useState("📍");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPins();
  }, []);

  async function fetchPins() {
    const { data, error } = await supabase
      .from("map_pins")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("fetch map_pins error:", error);
      setLoading(false);
      return;
    }

    setPins(data);
    setLoading(false);
  }

  async function handleAddPin(e) {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    setSubmitting(true);

    const { data, error } = await supabase
      .from("map_pins")
      .insert([{
        title: newTitle.trim(),
        event: newEvent.trim(),
        coords: newCoords.trim(),
        description: newDesc.trim(),
        icon: newIcon || "📍"
      }])
      .select()
      .single();

    setSubmitting(false);

    if (error) {
      console.error("insert map_pins error:", error);
      return;
    }

    setPins((prev) => [...prev, data]);
    setNewTitle("");
    setNewEvent("");
    setNewCoords("");
    setNewDesc("");
    setNewIcon("📍");
    setShowForm(false);
  }

  return (
    <section className="map-section">
      <div className="map-container">
        <motion.p
          className="map-subtitle"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          our coordinates
        </motion.p>
        <motion.h2
          className="map-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          special places
        </motion.h2>
        <motion.p
          className="map-desc"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          specific coordinates in the world that hold our favorite memories. click on any pin to explore.
        </motion.p>

        {!loading && (
          <div className="map-grid">
            {pins.map((pin, idx) => (
              <motion.div
                key={pin.id}
                className={`map-card ${activePin === pin.id ? "active" : ""}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: Math.min(idx * 0.15, 0.6) }}
                onClick={() => setActivePin(activePin === pin.id ? null : pin.id)}
                whileHover={{ y: -5 }}
              >
                <div className="map-card-header">
                  <span className="map-icon">{pin.icon}</span>
                  <span className="map-pin-badge">📍 click to view</span>
                </div>
                <h3 className="map-card-title">{pin.title}</h3>
                <p className="map-card-event">{pin.event}</p>
                <span className="map-card-coords">{pin.coords}</span>

                <AnimatePresence>
                  {activePin === pin.id && (
                    <motion.div
                      className="map-card-body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="map-card-desc">{pin.description}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}

        <div className="map-add-box">
          {!showForm ? (
            <button className="map-add-toggle" onClick={() => setShowForm(true)}>
              + pin your own special place
            </button>
          ) : (
            <form onSubmit={handleAddPin} className="map-add-form">
              <input
                type="text"
                placeholder="place title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                maxLength={60}
                disabled={submitting}
              />
              <input
                type="text"
                placeholder="what happened here"
                value={newEvent}
                onChange={(e) => setNewEvent(e.target.value)}
                maxLength={80}
                disabled={submitting}
              />
              <input
                type="text"
                placeholder="coordinates (optional)"
                value={newCoords}
                onChange={(e) => setNewCoords(e.target.value)}
                maxLength={40}
                disabled={submitting}
              />
              <textarea
                placeholder="tell the story..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                maxLength={300}
                disabled={submitting}
              />
              <div className="map-add-row">
                <input
                  type="text"
                  className="map-emoji-input"
                  placeholder="📍"
                  value={newIcon}
                  onChange={(e) => setNewIcon(e.target.value)}
                  maxLength={2}
                  disabled={submitting}
                />
                <button type="submit" disabled={submitting}>
                  {submitting ? "pinning..." : "add pin"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}