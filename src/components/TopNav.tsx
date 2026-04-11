import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Layers,
  Sparkles,
  BookOpenCheck,
  Search,
  Zap,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "../lib/utils";
import { translations } from "../translations";

interface TopNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  userName: string;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  language: "en" | "es";
  setLanguage: (lang: "en" | "es") => void;
}

export const TopNav = ({
  activeTab,
  setActiveTab,
  onLogout,
  userName,
  theme,
  setTheme,
  language,
  setLanguage,
}: TopNavProps) => {
  const t = translations[language];

  const navItems = [
    { id: "map", label: t.nav_map, icon: MapPin },
    { id: "nodes", label: t.nav_nodes, icon: Layers },
    { id: "progress", label: t.nav_quests, icon: Sparkles },
    { id: "vault", label: t.nav_archive, icon: BookOpenCheck },
  ];

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = userName
    ? userName
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "A";

  return (
    <header className="header-container">
      <div className="mx-auto flex items-center justify-center">
        {/* Nav Pill */}
        <nav className="nav-pill flex-between">
          {/* Left Section: Logo */}
          <div className="flex-start" style={{ flex: 1, paddingLeft: "1.5rem" }}>
            <h1
              className="logo-text"
              onClick={() => setActiveTab("progress")}
            >
              CarthosAI
            </h1>
          </div>

          {/* Middle Section: Nav Buttons (Horizontal) */}
          <div
            className="hidden lg:flex"
            style={{ alignItems: "center", gap: "0.25rem" }}
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "nav-pill-item",
                  activeTab === item.id && "active",
                )}
                style={{
                  fontFamily: "var(--font-sans)",
                  flexDirection: "row", // Override vertical layout
                  gap: "0.5rem",
                  padding: "0.6rem 1.5rem",
                  fontSize: "0.8rem",
                  height: "40px",
                }}
              >
                <item.icon size={16} strokeWidth={2.5} />
                <span style={{ fontWeight: 700 }}>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Right Section: Theme Toggle + User Avatar */}
          <div className="flex-end" style={{ flex: 1, gap: "0.875rem", paddingRight: "0.75rem" }}>
            {/* Premium Theme Toggle */}
            <div className="theme-lang-switch">
              <button
                onClick={() => setTheme("light")}
                className="switch-btn"
                style={{ color: theme === "light" ? "white" : "var(--outline)" }}
                title="Light Mode"
              >
                {theme === "light" && (
                  <motion.div
                    layoutId="active-theme"
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
                title="Dark Mode"
              >
                {theme === "dark" && (
                  <motion.div
                    layoutId="active-theme"
                    className="switch-active"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Moon size={14} strokeWidth={theme === "dark" ? 2.5 : 2} />
              </button>
            </div>
            {/* Language Toggle */}
            <div className="theme-lang-switch">
              <button
                onClick={() => setLanguage("es")}
                className="switch-btn font-bold text-[0.6rem]"
                style={{ color: language === "es" ? "white" : "var(--outline)" }}
                title="Español"
              >
                {language === "es" && (
                  <motion.div
                    layoutId="active-lang"
                    className="switch-active"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                ES
              </button>
              <button
                onClick={() => setLanguage("en")}
                className="switch-btn font-bold text-[0.6rem]"
                style={{ color: language === "en" ? "white" : "var(--outline)" }}
                title="English"
              >
                {language === "en" && (
                  <motion.div
                    layoutId="active-lang"
                    className="switch-active"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                EN
              </button>
            </div>
            {/* User avatar + dropdown */}
            <div ref={menuRef} className="relative flex-center" style={{ gap: "0.5rem" }}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="avatar-btn"
                style={{ boxShadow: menuOpen ? "0 0 0 3px rgba(0,195,237,0.25)" : "none" }}
              >
                {initials}
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="glass-panel"
                    style={{
                      position: "absolute",
                      top: "calc(100% + 12px)",
                      right: 0,
                      minWidth: 220,
                      borderRadius: "18px",
                      padding: "0.875rem",
                      boxShadow: "0 20px 50px rgba(0,100,123,0.15)",
                      zIndex: 100,
                    }}
                  >
                    {/* Logged in as - ONLY ON MOBILE/SMALLER to show name if not evident */}
                    <div
                      className="lg:hidden"
                      style={{
                        padding: "0.5rem 0.75rem 0.875rem",
                        borderBottom: "1px solid var(--surface-container-high)",
                        marginBottom: "0.625rem",
                      }}
                    >
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", fontWeight: 700, color: "var(--on-surface)" }}>{userName || t.nav_explorer}</div>
                    </div>

                    {/* Nav Items for mobile in dropdown */}
                    <div className="lg:hidden" style={{ marginBottom: "0.625rem", paddingBottom: "0.625rem", borderBottom: "1px solid var(--surface-container-high)" }}>
                      {navItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => { setActiveTab(item.id); setMenuOpen(false); }}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            padding: "0.75rem 0.875rem",
                            borderRadius: "12px",
                            border: "none",
                            cursor: "pointer",
                            background: activeTab === item.id ? "var(--primary-container)" : "transparent",
                            fontFamily: "var(--font-sans)",
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            color: activeTab === item.id ? "var(--primary)" : "var(--on-surface-var)",
                          }}
                        >
                          <item.icon size={16} /> {item.label}
                        </button>
                      ))}
                    </div>

                    {/* Logout */}
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onLogout();
                      }}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.75rem 0.875rem",
                        borderRadius: "12px",
                        border: "none",
                        cursor: "pointer",
                        background: "transparent",
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: "#ef4444",
                      }}
                    >
                      <Zap size={15} color="#ef4444" /> {t.nav_signout}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};
