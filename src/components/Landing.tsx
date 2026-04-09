import { motion } from "motion/react";
import {
  Zap,
  MapPin,
  Network,
  ArrowRight,
  Sparkles,
  Gamepad2,
  Music,
  Code2,
  BookOpenCheck,
  Target,
  Fingerprint,
  Sun,
  Moon,
} from "lucide-react";
import { FuturisticMap } from "./FuturisticMap";
import { LearningPath } from "../types";

import { translations, Language } from "../translations";

const getDemoPath = (t: any): LearningPath => ({
  id: "demo-landing",
  name: t.demo_map_name,
  description: t.demo_map_desc,
  nodes: [
    {
      id: "node-1",
      title: t.demo_node_1_title,
      type: "article",
      description: t.demo_node_1_desc,
      source: "Sports Medicine Weekly",
      location: "Issue 42",
      status: "completed",
      progress: 100,
      connections: ["node-2", "node-3"],
    },
    {
      id: "node-2",
      title: t.demo_node_2_title,
      type: "chapter",
      description: t.demo_node_2_desc,
      source: "Human Anatomy — Tortora",
      location: "Chapter 10",
      status: "completed",
      progress: 100,
      connections: ["node-4"],
    },
    {
      id: "node-3",
      title: t.demo_node_3_title,
      type: "video",
      description: t.demo_node_3_desc,
      source: "Aspetar Sports Medicine Journal",
      location: "Vol. 12",
      status: "in-progress",
      progress: 45,
      connections: ["node-4", "node-5"],
    },
    {
      id: "node-4",
      title: t.demo_node_4_title,
      type: "course",
      description: t.demo_node_4_desc,
      source: "NSCA Essentials of Strength Training",
      location: "Part III",
      status: "unexplored",
      progress: 0,
      connections: ["node-6"],
    },
    {
      id: "node-5",
      title: t.demo_node_5_title,
      type: "book",
      description: t.demo_node_5_desc,
      source: "Exercise Physiology — McArdle",
      location: "Chapter 7",
      status: "unexplored",
      progress: 0,
      connections: ["node-6"],
    },
    {
      id: "node-6",
      title: t.demo_node_6_title,
      type: "article",
      description: t.demo_node_6_desc,
      source: "Journal of Sports Sciences",
      location: "2024 Edition",
      status: "locked",
      progress: 0,
      connections: [],
    },
  ],
});

export const Landing = ({
  onStart,
  onSignIn,
  theme,
  setTheme,
  language,
  setLanguage,
}: {
  onStart: () => void;
  onSignIn: () => void;
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
  language: Language;
  setLanguage: (l: Language) => void;
}) => {
  const isDark = theme === "dark";
  const t = translations[language];
  const DEMO_PATH = getDemoPath(t);

  return (
    <div
      className="min-h-screen relative overflow-hidden selection:bg-[var(--primary-container)] selection:text-[var(--primary)]"
      style={{
        background: isDark ? "#0b0f11" : "var(--surface)",
        transition: "background 0.3s ease",
      }}
    >
      {/* ── ALIEN / NEURAL BACKGROUND ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background: isDark
            ? "radial-gradient(circle at 15% 10%, rgba(0,195,237,0.15) 0%, transparent 45%), radial-gradient(circle at 85% 60%, rgba(0,100,123,0.1) 0%, transparent 50%), radial-gradient(circle at 50% 120%, rgba(0,195,237,0.06) 0%, transparent 60%)"
            : "radial-gradient(circle at 15% 10%, rgba(0,195,237,0.12) 0%, transparent 45%), radial-gradient(circle at 85% 60%, rgba(0,100,123,0.08) 0%, transparent 50%), radial-gradient(circle at 50% 120%, rgba(0,195,237,0.05) 0%, transparent 60%)",
        }}
      />

      {/* Grid Pattern overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          opacity: 0.3,
          pointerEvents: "none",
          backgroundImage: `radial-gradient(var(--surface-container-high) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── HEADER ── */}
      <header
        className="relative z-50 w-full px-6 py-6  mx-auto"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            justifySelf: "flex-start",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "8px",
              background:
                "linear-gradient(135deg, var(--primary) 0%, var(--primary-fixed) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <Network size={16} />
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "1.25rem",
              color: "var(--on-surface)",
              letterSpacing: "-0.04em",
            }}
          >
            Carthos
          </h1>
        </div>

        <nav
          className="glass-pill-nav hidden md:flex"
          style={{
            gap: "2rem",
            padding: "0.75rem 2rem",
            justifySelf: "center",
          }}
        >
          {["Methodology", "Granular Tracking", "Neural Atlas"].map((item) => (
            <button
              key={item}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--on-surface-var)",
                transition: "color 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.color = "var(--primary)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.color = "var(--on-surface-var)")
              }
            >
              {item === "Methodology" ? t.nav_methodology : item === "Granular Tracking" ? t.nav_tracking : t.nav_atlas}
            </button>
          ))}
        </nav>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            justifySelf: "flex-end",
          }}
        >
          {/* Landing Theme Toggle */}
          {/* Premium Theme Toggle */}
          <div
            style={{
              display: "flex",
              background: "var(--surface-container-low)",
              padding: "3px",
              borderRadius: "100px",
              border: "1px solid var(--outline-variant)",
              position: "relative",
              gap: "2px",
            }}
          >
            <button
              onClick={() => setTheme("light")}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                cursor: "pointer",
                background: "transparent",
                color: theme === "light" ? "white" : "var(--outline)",
                transition: "color 0.2s",
                position: "relative",
                zIndex: 2,
              }}
            >
              {theme === "light" && (
                <motion.div
                  layoutId="active-theme-landing"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "var(--primary)",
                    borderRadius: "50%",
                    boxShadow: "0 2px 8px rgba(0, 100, 123, 0.2)",
                    zIndex: -1,
                  }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Sun size={14} strokeWidth={theme === "light" ? 2.5 : 2} />
            </button>
            <button
              onClick={() => setTheme("dark")}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                cursor: "pointer",
                background: "transparent",
                color: theme === "dark" ? "white" : "var(--outline)",
                transition: "color 0.2s",
                position: "relative",
                zIndex: 2,
              }}
            >
              {theme === "dark" && (
                <motion.div
                  layoutId="active-theme-landing"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "var(--primary)",
                    borderRadius: "50%",
                    boxShadow: "0 2px 10px rgba(0, 195, 237, 0.3)",
                    zIndex: -1,
                  }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Moon size={14} strokeWidth={theme === "dark" ? 2.5 : 2} />
            </button>
          </div>

          {/* Language Toggle */}
          <div
            style={{
              display: "flex",
              background: "var(--surface-container-low)",
              padding: "3px",
              borderRadius: "100px",
              border: "1px solid var(--outline-variant)",
              position: "relative",
              gap: "2px",
            }}
          >
            <button
              onClick={() => setLanguage("es")}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                cursor: "pointer",
                background: "transparent",
                color: language === "es" ? "white" : "var(--outline)",
                transition: "color 0.2s",
                position: "relative",
                zIndex: 2,
                fontFamily: "var(--font-sans)",
                fontSize: "0.6rem",
                fontWeight: 800,
              }}
              title="Español"
            >
              {language === "es" && (
                <motion.div
                  layoutId="active-lang-landing"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "var(--primary)",
                    borderRadius: "50%",
                    boxShadow: "0 2px 8px rgba(0, 100, 123, 0.2)",
                    zIndex: -1,
                  }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              ES
            </button>
            <button
              onClick={() => setLanguage("en")}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                cursor: "pointer",
                background: "transparent",
                color: language === "en" ? "white" : "var(--outline)",
                transition: "color 0.2s",
                position: "relative",
                zIndex: 2,
                fontFamily: "var(--font-sans)",
                fontSize: "0.6rem",
                fontWeight: 800,
              }}
              title="English"
            >
              {language === "en" && (
                <motion.div
                  layoutId="active-lang-landing"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "var(--primary)",
                    borderRadius: "50%",
                    boxShadow: "0 2px 10px rgba(0, 195, 237, 0.3)",
                    zIndex: -1,
                  }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              EN
            </button>
          </div>
          <button
            onClick={onSignIn}
            className="glass-panel"
            style={{
              padding: "0.6rem 1.25rem",
              fontSize: "0.8rem",
              borderRadius: "12px",
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              color: "var(--on-surface)",
              border: "none",
              cursor: "pointer",
            }}
          >
            {t.hero_signin}
          </button>
          <button
            onClick={onStart}
            className="btn-primary"
            style={{
              padding: "0.6rem 1.5rem",
              fontSize: "0.8rem",
              borderRadius: "12px",
            }}
          >
            {t.hero_cta}
          </button>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 1.25rem",
            borderRadius: "100px",
            border: isDark
              ? "1px solid rgba(0,195,237,0.2)"
              : "1px solid rgba(0,195,237,0.3)",
            background: isDark
              ? "rgba(15, 20, 22, 0.7)"
              : "rgba(255,255,255,0.7)",
            backdropFilter: "blur(12px)",
            marginBottom: "2.5rem",
            boxShadow: isDark
              ? "0 8px 32px rgba(0,0,0,0.3)"
              : "0 8px 32px rgba(0, 100, 123, 0.05)",
          }}
        >
          <Fingerprint size={14} style={{ color: "var(--primary-fixed)" }} />
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.65rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "var(--primary)",
            }}
          >
            {t.landing_tagline}
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(3.5rem, 8vw, 6rem)",
            color: "var(--on-surface)",
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
            maxWidth: 1000,
            marginBottom: "1.5rem",
          }}
        >
          {t.hero_title_1} {t.hero_title_2}
          <br />
          <span
            style={{
              background:
                "linear-gradient(135deg, var(--primary) 0%, var(--primary-fixed) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t.hero_title_3}
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "1.25rem",
            color: "var(--on-surface-var)",
            maxWidth: 720,
            lineHeight: 1.6,
            marginBottom: "3rem",
            fontWeight: 500,
          }}
        >
          {t.hero_subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ display: "flex", alignItems: "center", gap: "1rem" }}
        >
          <button
            onClick={onStart}
            className="btn-primary"
            style={{
              padding: "1.25rem 3rem",
              fontSize: "1.1rem",
              borderRadius: "100px",
              gap: "0.75rem",
              boxShadow: "0 12px 40px rgba(0, 195, 237, 0.3)",
            }}
          >
            <MapPin size={18} /> {t.hero_cta}
          </button>
          <button
            onClick={onSignIn}
            className="glass-panel"
            style={{
              padding: "1.25rem 3rem",
              fontSize: "1.1rem",
              borderRadius: "100px",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              color: "var(--on-surface)",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Zap size={18} color="var(--primary)" /> {t.hero_signin}
          </button>
        </motion.div>

        {/* ── EPIC VISUAL INTERACTIVE MAP MOCKUP ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            marginTop: "5rem",
            width: "100%",
            maxWidth: 1100,
            position: "relative",
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: "100%",
              height: 500,
              borderRadius: "24px",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 30px 60px rgba(0,100,123,0.12)",
            }}
          >
            {/* Real Interactive Map */}
            <div style={{ position: "absolute", inset: 0, zIndex: 10 }}>
              <FuturisticMap path={DEMO_PATH} theme={theme} readOnly={true} />
            </div>

            {/* Map title badge — top left overlay */}
            <div
              style={{
                position: "absolute",
                top: 20,
                left: 20,
                zIndex: 20,
                display: "flex",
                flexDirection: "column",
                gap: 6,
                pointerEvents: "none",
              }}
            >
              {/* Label pill */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "0.3rem 0.75rem",
                  borderRadius: "100px",
                  background: isDark
                    ? "rgba(0,195,237,0.12)"
                    : "rgba(0,100,123,0.08)",
                  border: isDark
                    ? "1px solid rgba(0,195,237,0.25)"
                    : "1px solid rgba(0,100,123,0.15)",
                  backdropFilter: "blur(8px)",
                  width: "fit-content",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--primary-fixed)",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.58rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: "var(--primary)",
                  }}
                >
                  {t.demo_label}
                </span>
              </div>

              {/* Map name */}
              <div
                style={{
                  padding: "0.625rem 1rem",
                  borderRadius: "14px",
                  background: isDark
                    ? "rgba(10,16,20,0.75)"
                    : "rgba(255,255,255,0.82)",
                  backdropFilter: "blur(14px)",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.06)"
                    : "1px solid rgba(0,100,123,0.08)",
                  boxShadow: isDark
                    ? "0 8px 24px rgba(0,0,0,0.35)"
                    : "0 8px 24px rgba(0,100,123,0.08)",
                  maxWidth: 300,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: "1rem",
                    color: "var(--on-surface)",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.2,
                    marginBottom: 4,
                  }}
                >
                  {DEMO_PATH.name}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.72rem",
                    color: "var(--on-surface-var)",
                    lineHeight: 1.4,
                  }}
                >
                  {DEMO_PATH.description}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* ── CORE CONCEPT SECTION ── */}
      <section
        className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t"
        style={{ borderColor: "var(--surface-container-high)" }}
      >
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 3rem)",
              color: "var(--on-surface)",
              letterSpacing: "-0.03em",
            }}
          >
            {t.landing_architecture_title}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "1.1rem",
              color: "var(--on-surface-var)",
              maxWidth: 600,
              margin: "1rem auto 0",
            }}
          >
            {t.landing_architecture_desc}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
          }}
        >
          {[
            {
              icon: Music,
              title: t.landing_feature_1_title,
              desc: t.landing_feature_1_desc,
            },
            {
              icon: Network,
              title: t.landing_feature_2_title,
              desc: t.landing_feature_2_desc,
            },
            {
              icon: BookOpenCheck,
              title: t.landing_feature_3_title,
              desc: t.landing_feature_3_desc,
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
                background: "var(--surface-container-lowest)",
                padding: "2.5rem",
                borderRadius: "24px",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "16px",
                  background:
                    "linear-gradient(135deg, rgba(0,100,123,0.1) 0%, rgba(0,195,237,0.15) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <f.icon size={26} style={{ color: "var(--primary)" }} />
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "1.25rem",
                  color: "var(--on-surface)",
                  letterSpacing: "-0.01em",
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.95rem",
                  color: "var(--on-surface-var)",
                  lineHeight: 1.6,
                }}
              >
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          background: "var(--surface-container-low)",
          padding: "4rem 6rem",
          borderTop: "1px solid var(--surface-container-highest)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Network size={20} color="var(--primary)" />
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "1.25rem",
              color: "var(--on-surface)",
            }}
          >
            Carthos
          </span>
        </div>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.85rem",
            color: "var(--on-surface-var)",
            maxWidth: 400,
            textAlign: "center",
          }}
        >
          {t.footer_text}
        </p>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.7rem",
            color: "var(--outline)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginTop: "2rem",
          }}
        >
          © 2026 Carthos Neural Engine. Made with passion.
        </p>
      </footer>
    </div>
  );
};
