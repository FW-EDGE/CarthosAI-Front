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
    <header className="sticky top-0 z-50 w-full px-6 py-6">
      <div className="mx-auto flex items-center justify-center">
        {/* Nav Pill */}
        <nav
          className="glass-pill-nav nav-pill"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.5rem 1.25rem",
            height: "64px",
          }}
        >
          {/* Left Section: Logo */}
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "flex-start",
              paddingLeft: "1.5rem",
            }}
          >
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "var(--primary)",
                letterSpacing: "-0.03em",
                margin: 0,
                cursor: "pointer",
              }}
              onClick={() => setActiveTab("progress")}
            >
              CarthosAI
            </h1>
          </div>

          {/* Middle Section: Nav Buttons (Horizontal) */}
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
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
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "0.875rem",
              paddingRight: "0.75rem",
            }}
          >
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
                title="Light Mode"
              >
                {theme === "light" && (
                  <motion.div
                    layoutId="active-theme"
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
                title="Dark Mode"
              >
                {theme === "dark" && (
                  <motion.div
                    layoutId="active-theme"
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
                    layoutId="active-lang"
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
                    layoutId="active-lang"
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
            {/* User avatar + dropdown */}
            <div ref={menuRef} style={{ position: "relative" }}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, var(--primary) 0%, var(--primary-fixed) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.85rem",
                  fontWeight: 800,
                  color: "white",
                  boxShadow: menuOpen
                    ? "0 0 0 3px rgba(0,195,237,0.25)"
                    : "none",
                  transition: "all 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
                onMouseEnter={(e) =>
                  !menuOpen && (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  !menuOpen && (e.currentTarget.style.transform = "scale(1)")
                }
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
                    {/* User info */}
                    <div
                      style={{
                        padding: "0.5rem 0.75rem 0.875rem",
                        borderBottom: "1px solid var(--surface-container-high)",
                        marginBottom: "0.625rem",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.875rem",
                          fontWeight: 700,
                          color: "var(--on-surface)",
                        }}
                      >
                        {userName || t.nav_explorer}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.72rem",
                          color: "var(--outline)",
                          marginTop: 3,
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <div className="live-dot" /> {t.nav_neural_link}
                      </div>
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
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.background =
                          "rgba(239,68,68,0.08)")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.background =
                          "transparent")
                      }
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
