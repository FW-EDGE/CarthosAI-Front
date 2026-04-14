import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Layers,
  Sparkles,
  BookOpenCheck,
  Zap,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { translations } from "../../constants/translations";
import "./TopNav.css";

type Tier = "free" | "pro" | "premium";

const TIER_STYLES: Record<Tier, { label: string; color: string; bg: string }> =
  {
    free: {
      label: "Free",
      color: "var(--outline)",
      bg: "var(--surface-container-high)",
    },
    pro: { label: "Pro", color: "#7c3aed", bg: "rgba(124,58,237,0.12)" },
    premium: { label: "Premium", color: "#d97706", bg: "rgba(217,119,6,0.12)" },
  };

interface TopNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  userName: string;
  tier: Tier;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  language: "en" | "es";
  setLanguage: (lang: "en" | "es") => void;
  onUpgrade: () => void;
}

export const TopNav = ({
  activeTab,
  setActiveTab,
  onLogout,
  userName,
  tier,
  theme,
  setTheme,
  language,
  setLanguage,
  onUpgrade,
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
    <header className="site-header">
      <nav className="site-nav">
        {/* Col 1 — Logo */}
        <div className="nav-logo">
          <h1 className="logo-text" onClick={() => setActiveTab("progress")}>
            Carthos<span className="logo-ai">AI</span>
          </h1>
        </div>

        {/* Col 2 — Nav links pill */}
        <div className="nav-links-pill hidden lg:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn("nav-link-btn", activeTab === item.id && "active")}
            >
              <item.icon size={14} strokeWidth={2.5} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Col 3 — Controls */}
        <div className="nav-controls">
          {/* Theme toggle */}
          <div className="theme-lang-switch hidden lg:flex">
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

          {/* Language toggle */}
          <div className="theme-lang-switch hidden lg:flex">
            <button
              onClick={() => setLanguage("es")}
              className="switch-btn font-bold text-[0.65rem]"
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
              className="switch-btn font-bold text-[0.65rem]"
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
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="avatar-btn"
              style={{
                boxShadow: menuOpen ? "0 0 0 3px rgba(0,195,237,0.25)" : "none",
              }}
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
                  className="glass-panel topnav-dropdown"
                >
                  {/* User info + tier */}
                  <div className="topnav-user-section">
                    <div className="topnav-username">
                      {userName || t.nav_explorer}
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span
                        className="topnav-tier-badge"
                        style={{
                          background: TIER_STYLES[tier].bg,
                          color: TIER_STYLES[tier].color,
                        }}
                      >
                        {TIER_STYLES[tier].label}
                      </span>
                      {tier === "free" && (
                        <button
                          className="topnav-upgrade-link"
                          onClick={() => {
                            setMenuOpen(false);
                            onUpgrade();
                          }}
                        >
                          {language === "es"
                            ? "Actualizar plan"
                            : "Upgrade plan"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Mobile nav items */}
                  <div className="topnav-mobile-items lg:hidden">
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMenuOpen(false);
                        }}
                        className={cn(
                          "topnav-dropdown-item",
                          activeTab === item.id && "active",
                        )}
                      >
                        <item.icon size={16} /> {item.label}
                      </button>
                    ))}
                  </div>

                  {/* Logout */}
                  <button
                    className="topnav-logout"
                    onClick={() => {
                      setMenuOpen(false);
                      onLogout();
                    }}
                  >
                    <Zap size={15} /> {t.nav_signout}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>
    </header>
  );
};
