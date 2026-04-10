import { LandingNav } from "./layout/LandingNav";
import { LandingFooter } from "./layout/LandingFooter";
import { Hero } from "../sections/landing/Hero";
import { Methodology } from "../sections/landing/Methodology";
import { Tracking } from "../sections/landing/Tracking";
import { Atlas } from "../sections/landing/Atlas";
import { CTA } from "../sections/landing/CTA";
import { translations, Language } from "../translations";
import { getDemoPath } from "../utils/landingData";

export const Landing = ({
  onStart,
  onSignIn,
  onApiClick,
  theme,
  setTheme,
  language,
  setLanguage,
}: {
  onStart: () => void;
  onSignIn: () => void;
  onApiClick: () => void;
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
      {/* ── BACKGROUND AMBIENCE ── */}
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

      <LandingNav
        onStart={onStart}
        onSignIn={onSignIn}
        onApiClick={onApiClick}
        theme={theme}
        setTheme={setTheme}
        language={language}
        setLanguage={setLanguage}
        translations={t}
      />

      <Hero
        onStart={onStart}
        onSignIn={onSignIn}
        isDark={isDark}
        theme={theme}
        translations={t}
        demoPath={DEMO_PATH}
      />

      <Methodology translations={t} />

      <Tracking isDark={isDark} translations={t} />

      <Atlas
        isDark={isDark}
        theme={theme}
        translations={t}
        demoPath={DEMO_PATH}
      />

      <CTA onStart={onStart} translations={t} />

      <LandingFooter translations={t} />
    </div>
  );
};
