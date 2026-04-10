import { motion } from "motion/react";
import { Network, Sun, Moon, Globe } from "lucide-react";
import { Button } from "../ui/Button";
import { Language } from "../../translations";

interface LandingNavProps {
  onStart: () => void;
  onSignIn: () => void;
  onApiClick: () => void;
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
  language: Language;
  setLanguage: (l: Language) => void;
  translations: any;
}

export const LandingNav = ({
  onStart,
  onSignIn,
  onApiClick,
  theme,
  setTheme,
  language,
  setLanguage,
  translations: t,
}: LandingNavProps) => {
  return (
    <header
      className="relative z-50 w-full px-6 py-6 mx-auto"
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
            fontSize: "2.25rem",
            color: "var(--on-surface)",
            letterSpacing: "-0.04em",
          }}
        >
          CarthosAI
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
            onClick={() => {
              const id = item.toLowerCase().replace(/\s+/g, "-");
              document
                .getElementById(id)
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="nav-link"
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
          >
            {item === "Methodology"
              ? t.nav_methodology
              : item === "Granular Tracking"
                ? t.nav_tracking
                : t.nav_atlas}
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
        <Button
          onClick={onSignIn}
          variant="outline"
          size="sm"
          style={{ borderRadius: "12px" }}
        >
          {t.hero_signin}
        </Button>
        <Button
          onClick={onStart}
          variant="primary"
          size="sm"
          style={{ borderRadius: "12px" }}
        >
          {t.hero_cta}
        </Button>
      </div>
    </header>
  );
};
