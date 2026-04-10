import { motion } from "motion/react";
import { Zap, CheckCircle2, BarChart3, Search, Activity } from "lucide-react";

interface TrackingProps {
  isDark: boolean;
  translations: any;
}

export const Tracking = ({ isDark, translations: t }: TrackingProps) => {
  return (
    <section
      id="granular-tracking"
      className="relative z-10 max-w-7xl mx-auto px-6 py-32 border-t"
      style={{ borderColor: "var(--surface-container-high)" }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "6rem",
          alignItems: "center",
        }}
      >
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-panel"
            style={{
              padding: "1.5rem",
              borderRadius: "32px",
              boxShadow: "0 30px 60px rgba(0,0,0,0.12)",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <div className="live-dot" />
                <span
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--primary)",
                  }}
                >
                  {t.landing_badge_live}
                </span>
              </div>
              <div
                style={{
                  padding: "0.25rem 0.75rem",
                  background: "var(--surface-container)",
                  borderRadius: "100px",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                }}
              >
                Day 14
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <div
                className="card"
                style={{
                  padding: "1.25rem",
                  background: isDark
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(0,100,123,0.03)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "1rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.6rem",
                      fontWeight: 800,
                      opacity: 0.5,
                    }}
                  >
                    {t.landing_badge_active_node}
                  </span>
                  <Zap size={14} color="#f59e0b" />
                </div>
                <div
                  style={{
                    fontSize: "1rem",
                    fontWeight: 800,
                    marginBottom: "0.5rem",
                  }}
                >
                  Quantum Entanglement
                </div>
                <div
                  style={{
                    height: 4,
                    background: "var(--surface-container-high)",
                    borderRadius: "10px",
                    position: "relative",
                  }}
                >
                  <motion.div
                    initial={{ width: "0%" }}
                    whileInView={{ width: "68%" }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    style={{
                      height: "100%",
                      background: "linear-gradient(90deg, #f59e0b, #edc448)",
                      borderRadius: "10px",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "0.5rem",
                  }}
                >
                  <span style={{ fontSize: "0.65rem", fontWeight: 700 }}>
                    68% {t.landing_badge_sync}
                  </span>
                  <span style={{ fontSize: "0.65rem", opacity: 0.5 }}>
                    12m {t.landing_badge_remaining}
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div className="card" style={{ padding: "1rem" }}>
                  <div
                    style={{
                      fontSize: "0.6rem",
                      fontWeight: 800,
                      opacity: 0.5,
                      marginBottom: "0.5rem",
                    }}
                  >
                    {t.landing_badge_mastery}
                  </div>
                  <div
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 800,
                      color: "var(--primary)",
                    }}
                  >
                    84%
                  </div>
                  <div
                    style={{
                      fontSize: "0.6rem",
                      color: "#10b981",
                      marginTop: "0.25rem",
                    }}
                  >
                    +12% {t.landing_badge_this_week}
                  </div>
                </div>
                <div className="card" style={{ padding: "1rem" }}>
                  <div
                    style={{
                      fontSize: "0.6rem",
                      fontWeight: 800,
                      opacity: 0.5,
                      marginBottom: "0.5rem",
                    }}
                  >
                    {t.landing_badge_nodes}
                  </div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 800 }}>
                    42 / 50
                  </div>
                  <div
                    style={{
                      fontSize: "0.6rem",
                      opacity: 0.5,
                      marginTop: "0.25rem",
                    }}
                  >
                    8 {t.landing_badge_left}
                  </div>
                </div>
              </div>

              <div
                className="card"
                style={{
                  padding: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "10px",
                    background: "rgba(16, 185, 129, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#10b981",
                  }}
                >
                  <CheckCircle2 size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 800 }}>
                    Fundamental Wave Functions
                  </div>
                  <div style={{ fontSize: "0.65rem", opacity: 0.5 }}>
                    {t.landing_badge_synced_success}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "0.4rem 1rem",
                borderRadius: "100px",
                background: "rgba(0, 100, 123, 0.1)",
                color: "var(--primary)",
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "1.5rem",
              }}
            >
              {t.nav_tracking}
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
                color: "var(--on-surface)",
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
                marginBottom: "1.5rem",
              }}
            >
              {t.tracking_title}
            </h2>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "1.2rem",
                color: "var(--on-surface-var)",
                lineHeight: 1.5,
                marginBottom: "3rem",
              }}
            >
              {t.tracking_subtitle}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "2rem",
              }}
            >
              {[
                {
                  icon: BarChart3,
                  title: t.tracking_feature_1_title,
                  desc: t.tracking_feature_1_desc,
                },
                {
                  icon: Search,
                  title: t.tracking_feature_2_title,
                  desc: t.tracking_feature_2_desc,
                },
                {
                  icon: Activity,
                  title: t.tracking_feature_3_title,
                  desc: t.tracking_feature_3_desc,
                },
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", gap: "1.5rem" }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "12px",
                      background: "var(--surface-container-high)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--primary)",
                      flexShrink: 0,
                    }}
                  >
                    <f.icon size={22} />
                  </div>
                  <div>
                    <h4
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 800,
                        fontSize: "1rem",
                        color: "var(--on-surface)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {f.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.9rem",
                        color: "var(--on-surface-var)",
                        lineHeight: 1.5,
                      }}
                    >
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
