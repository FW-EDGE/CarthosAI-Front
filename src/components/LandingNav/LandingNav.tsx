import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Network, Sun, Moon, Menu, X } from "lucide-react";
import { Button } from "../ui/Button";
import { Language } from "../../constants/translations";
import "./LandingNav.css";

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
  theme,
  setTheme,
  language,
  setLanguage,
  translations: t,
}: LandingNavProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: "methodology", label: t.nav_methodology },
    { id: "granular-tracking", label: t.nav_tracking },
    { id: "neural-atlas", label: t.nav_atlas },
    { id: "pricing", label: language === "es" ? "Precios" : "Pricing" },
  ];

  const NavLinks = () => (
    <>
      {navLinks.map((item) => (
        <button
          key={item.id}
          className="nav-link-btn"
          onClick={() => {
            document
              .getElementById(item.id)
              ?.scrollIntoView({ behavior: "smooth" });
            setIsMobileMenuOpen(false);
          }}
        >
          {item.label}
        </button>
      ))}
    </>
  );

  return (
    <header className="site-header">
      <nav className="site-nav">
        {/* Col 1 — Logo */}
        <div className="nav-logo">
          <div className="nav-logo-icon">
            <Network size={28} />
          </div>
          <h1 className="logo-text">
            Carthos<span className="logo-ai">AI</span>
          </h1>
        </div>

        {/* Col 2 — Links pill (siempre centrada) */}
        <div className="nav-links-pill hidden lg:flex">
          <NavLinks />
        </div>

        {/* Col 3 — Controles + Burger */}
        <div className="nav-controls">
          <div className="hidden lg:flex items-center gap-4">
            <div className="theme-lang-switch">
              <button
                onClick={() => setTheme("light")}
                className="switch-btn"
                style={{
                  color: theme === "light" ? "white" : "var(--outline)",
                }}
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
                style={{
                  color: language === "es" ? "white" : "var(--outline)",
                }}
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
                style={{
                  color: language === "en" ? "white" : "var(--outline)",
                }}
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
            className="hidden lg:flex landing-nav-btn"
          >
            {t.hero_signin}
          </Button>
          <Button
            onClick={onStart}
            variant="primary"
            size="sm"
            className="hidden lg:flex landing-nav-btn"
          >
            {t.hero_cta}
          </Button>

          <button
            className="lg:hidden flex items-center justify-center w-10 h-10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
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
              <div className="flex-col mobile-drawer-links">
                <NavLinks />
              </div>
              <div className="flex-col gap-4 mobile-drawer-bottom">
                <div className="flex gap-4">
                  <button
                    className="mobile-lang-btn"
                    onClick={() => setLanguage("es")}
                    style={{
                      color:
                        language === "es"
                          ? "var(--primary)"
                          : "var(--on-surface-var)",
                    }}
                  >
                    ES
                  </button>
                  <button
                    className="mobile-lang-btn"
                    onClick={() => setLanguage("en")}
                    style={{
                      color:
                        language === "en"
                          ? "var(--primary)"
                          : "var(--on-surface-var)",
                    }}
                  >
                    EN
                  </button>
                </div>
                <Button onClick={onSignIn} variant="outline" className="w-full">
                  {t.hero_signin}
                </Button>
                <Button onClick={onStart} variant="primary" className="w-full">
                  {t.hero_cta}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
