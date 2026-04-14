import { LandingNav } from "../../components/LandingNav/LandingNav";
import { LandingFooter } from "../../components/layout/LandingFooter";
import { Hero } from "./Hero/Hero";
import { Methodology } from "./Methodology/Methodology";
import { Tracking } from "./Tracking/Tracking";
import { Atlas } from "./Atlas/Atlas";
import { CTA } from "./CTA/CTA";
import { Pricing } from "./Pricing/Pricing";
import { translations, Language } from "../../constants/translations";
import { getDemoPath } from "../../utils/landingData";

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
    <div className="landing-container selection:bg-[var(--primary-container)] selection:text-[var(--primary)]">
      {/* ── BACKGROUND AMBIENCE ── */}
      <div className="bg-ambience" />

      {/* Grid Pattern overlay */}
      <div className="grid-overlay" />

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

      <Pricing onStart={onStart} translations={t} language={language} />

      <CTA onStart={onStart} translations={t} />

      <LandingFooter translations={t} />
    </div>
  );
};
