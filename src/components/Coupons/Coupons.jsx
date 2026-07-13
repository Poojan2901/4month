import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";
import "./Coupons.css";

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newIcon, setNewIcon] = useState("🎟️");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  async function fetchCoupons() {
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("fetch coupons error:", error);
      setLoading(false);
      return;
    }

    setCoupons(data);
    setLoading(false);
  }

  async function handleRedeem(id) {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, redeemed: true } : c))
    );

    const { error } = await supabase
      .from("coupons")
      .update({ redeemed: true, redeemed_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("redeem coupon error:", error);
      fetchCoupons(); // revert on failure
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setSubmitting(true);

    const { data, error } = await supabase
      .from("coupons")
      .insert([{
        title: newTitle.trim(),
        description: newDesc.trim(),
        icon: newIcon || "🎟️"
      }])
      .select()
      .single();

    setSubmitting(false);

    if (error) {
      console.error("insert coupon error:", error);
      return;
    }

    setCoupons((prev) => [...prev, data]);
    setNewTitle("");
    setNewDesc("");
    setNewIcon("🎟️");
    setShowForm(false);
  }

  return (
    <section className="coupons-section">
      <div className="coupons-container">
        <motion.p className="coupons-subtitle" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          special privileges
        </motion.p>
        <motion.h2 className="coupons-title" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          love coupons
        </motion.h2>
        <motion.p className="coupons-desc" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          a few digital vouchers you can redeem at any time. once used, they are stamped forever!
        </motion.p>

        {!loading && (
          <div className="coupons-grid">
            {coupons.map((coupon, idx) => {
              const isRedeemed = coupon.redeemed;
              return (
                <motion.div
                  key={coupon.id}
                  className={`coupon-card ${isRedeemed ? "redeemed" : "available"}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={!isRedeemed ? { y: -6, scale: 1.02 } : {}}
                >
                  <div className="coupon-content">
                    <span className="coupon-icon">{coupon.icon}</span>
                    <h3 className="coupon-card-title">{coupon.title}</h3>
                    <p className="coupon-card-desc">{coupon.description}</p>
                  </div>
                  <div className="coupon-action">
                    <button
                      className="redeem-btn"
                      onClick={() => handleRedeem(coupon.id)}
                      disabled={isRedeemed}
                    >
                      {isRedeemed ? "redeemed" : "redeem now"}
                    </button>
                  </div>

                  <AnimatePresence>
                    {isRedeemed && (
                      <motion.div
                        className="stamp-overlay"
                        initial={{ scale: 3, opacity: 0, rotate: -45 }}
                        animate={{ scale: 1, opacity: 0.85, rotate: -15 }}
                        transition={{ type: "spring", stiffness: 120, damping: 10 }}
                      >
                        <div className="stamp-border">
                          <span className="stamp-text">REDEEMED</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="bucket-add-box">
          {!showForm ? (
            <button className="bucket-add-toggle" onClick={() => setShowForm(true)}>
              + create a coupon for me
            </button>
          ) : (
            <form onSubmit={handleAdd} className="bucket-add-form">
              <input
                type="text"
                placeholder="coupon title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                maxLength={60}
                disabled={submitting}
              />
              <input
                type="text"
                placeholder="what it's for"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                maxLength={140}
                disabled={submitting}
              />
              <div className="bucket-add-row">
                <input
                  type="text"
                  className="bucket-emoji-input"
                  placeholder="🎟️"
                  value={newIcon}
                  onChange={(e) => setNewIcon(e.target.value)}
                  maxLength={2}
                  disabled={submitting}
                />
                <button type="submit" disabled={submitting}>
                  {submitting ? "creating..." : "create"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}