import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Network, Sun, Moon, Globe, Menu, X } from "lucide-react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavContent = () => (
    <>
      {["Methodology", "Granular Tracking", "Neural Atlas"].map((item) => (
        <button
          key={item}
          onClick={() => {
            const id = item.toLowerCase().replace(/\s+/g, "-");
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
            setIsMobileMenuOpen(false);
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
    </>
  );

  return (
    <header className="header-container">
      <div className="mx-auto flex items-center justify-center">
        {/* Nav Pill */}
        <nav className="nav-pill flex-between lg:w-[1100px]">
          {/* Left Section: Logo */}
          <div className="flex-start" style={{ flex: 1, paddingLeft: "1.5rem" }}>
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
                marginRight: "0.5rem"
              }}
            >
              <Network size={16} />
            </div>
            <h1 className="logo-text">
              Carthos<span className="logo-ai">AI</span>
            </h1>
          </div>

          <div className="hidden lg:flex" style={{ gap: "2rem" }}>
            <NavContent />
          </div>

          {/* Right Section: Theme/Lang + Burger */}
          <div className="flex-end" style={{ flex: 1, gap: "1rem", paddingRight: "0.75rem" }}>
            <div className="hidden lg:flex items-center gap-4">
              <div className="theme-lang-switch">
                <button
                  onClick={() => setTheme("light")}
                  className="switch-btn"
                  style={{ color: theme === "light" ? "white" : "var(--outline)" }}
                >
                  {theme === "light" && (
                    <motion.div
                      layoutId="active-theme-land"
                      className="switch-active"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Sun size={14} strokeWidth={theme === "light" ? 2.5 : 2} />
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className="switch-btn"
                  style={{ color: theme === "dark" ? "white" : "var(--outline)" }}
                >
                  {theme === "dark" && (
                    <motion.div
                      layoutId="active-theme-land"
                      className="switch-active"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Moon size={14} strokeWidth={theme === "dark" ? 2.5 : 2} />
                </button>
              </div>

              <div className="theme-lang-switch">
                <button
                  onClick={() => setLanguage("es")}
                  className="switch-btn font-bold text-[0.65rem]"
                  style={{ color: language === "es" ? "white" : "var(--outline)" }}
                >
                  {language === "es" && (
                    <motion.div
                      layoutId="active-lang-land"
                      className="switch-active"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  ES
                </button>
                <button
                  onClick={() => setLanguage("en")}
                  className="switch-btn font-bold text-[0.65rem]"
                  style={{ color: language === "en" ? "white" : "var(--outline)" }}
                >
                  {language === "en" && (
                    <motion.div
                      layoutId="active-lang-land"
                      className="switch-active"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  EN
                </button>
              </div>
            </div>

            <Button
              onClick={onSignIn}
              variant="outline"
              size="sm"
              className="hidden lg:flex"
              style={{ borderRadius: "12px" }}
            >
              {t.hero_signin}
            </Button>
            <Button
              onClick={onStart}
              variant="primary"
              size="sm"
              className="hidden lg:flex"
              style={{ borderRadius: "12px" }}
            >
              {t.hero_cta}
            </Button>

            {/* Burger Button */}
            <button
              className="lg:hidden flex items-center justify-center w-10 h-10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="mobile-menu-overlay"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="glass-panel mobile-drawer"
              style={{ background: "var(--surface-container-low)" }}
            >
              <div className="flex-col" style={{ gap: "2rem" }}>
                <NavContent />
              </div>
              
              <div style={{ marginTop: "auto" }} className="flex-col gap-4">
                 <div className="flex gap-4">
                    <button onClick={() => setLanguage("es")} style={{ color: language === "es" ? "var(--primary)" : "var(--on-surface-var)", fontWeight: 800 }}>ES</button>
                    <button onClick={() => setLanguage("en")} style={{ color: language === "en" ? "var(--primary)" : "var(--on-surface-var)", fontWeight: 800 }}>EN</button>
                 </div>
                 <Button onClick={onSignIn} variant="outline" className="w-full">{t.hero_signin}</Button>
                 <Button onClick={onStart} variant="primary" className="w-full">{t.hero_cta}</Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
