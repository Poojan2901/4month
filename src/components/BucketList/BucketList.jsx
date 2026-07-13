import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";
import "./BucketList.css";

const defaultBucketList = [
  { id: "default-1", task: "watch the northern lights", status: "dreaming", icon: "🌌" },
  { id: "default-3", task: "road trip with no destination", status: "planning", icon: "🚗" },
  { id: "default-4", task: "learn to cook a signature dish", status: "in progress", icon: "🍳" },
];

const statusOptions = ["dreaming", "planning", "in progress", "completed"];

export default function BucketList() {
  const [items, setItems] = useState(defaultBucketList);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState("");
  const [newIcon, setNewIcon] = useState("💫");
  const [newStatus, setNewStatus] = useState("dreaming");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    const { data, error } = await supabase
      .from("bucket_items")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("fetch bucket_items error:", error);
      setLoading(false);
      return;
    }

    setItems([...defaultBucketList, ...data]);
    setLoading(false);
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!newTask.trim()) return;

    setSubmitting(true);

    const { data, error } = await supabase
      .from("bucket_items")
      .insert([{ task: newTask.trim(), icon: newIcon || "💫", status: newStatus }])
      .select()
      .single();

    setSubmitting(false);

    if (error) {
      console.error("insert bucket_items error:", error);
      return;
    }

    setItems((prev) => [...prev, data]);
    setNewTask("");
    setNewIcon("💫");
    setNewStatus("dreaming");
    setShowForm(false);
  }

  return (
    <section className="bucket-section">
      <div className="bucket-container">
        <motion.p
          className="bucket-subtitle"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          our next chapters
        </motion.p>
        <motion.h2
          className="bucket-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          our bucket list
        </motion.h2>

        {!loading && (
          <div className="bucket-grid">
            {items.map((item, idx) => (
              <motion.div
                key={item.id}
                className={`bucket-card ${item.status}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="bucket-card-top">
                  <span className="bucket-icon">{item.icon}</span>
                  <span className={`status-badge ${item.status}`}>{item.status}</span>
                </div>
                <p className="bucket-task">{item.task}</p>
              </motion.div>
            ))}
          </div>
        )}

        <div className="bucket-add-box">
          {!showForm ? (
            <button className="bucket-add-toggle" onClick={() => setShowForm(true)}>
              + add something to our list
            </button>
          ) : (
            <form onSubmit={handleAdd} className="bucket-add-form">
              <input
                type="text"
                placeholder="what should we do together?"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                maxLength={80}
                disabled={submitting}
              />
              <div className="bucket-add-row">
                <input
                  type="text"
                  className="bucket-emoji-input"
                  placeholder="🌟"
                  value={newIcon}
                  onChange={(e) => setNewIcon(e.target.value)}
                  maxLength={2}
                  disabled={submitting}
                />
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  disabled={submitting}
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button type="submit" disabled={submitting}>
                  {submitting ? "adding..." : "add"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}