import { motion } from "motion/react";
import { Fingerprint, MapPin, Zap } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { LandingMap } from "../../components/LandingMap";
import { LearningPath } from "../../types";

interface HeroProps {
  onStart: () => void;
  onSignIn: () => void;
  isDark: boolean;
  theme: "light" | "dark";
  translations: any;
  demoPath: LearningPath;
}

export const Hero = ({
  onStart,
  onSignIn,
  isDark,
  theme,
  translations: t,
  demoPath,
}: HeroProps) => {
  return (
    <main className="hero-main">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="hero-tagline-badge"
      >
        <Fingerprint size={14} className="text-primary-fixed" />
        <span className="hero-tagline">
          {t.landing_tagline}
        </span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="hero-title"
      >
        {t.hero_title_1} {t.hero_title_2}
        <br />
        <span className="text-gradient">
          {t.hero_title_3}
        </span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="hero-subtitle"
      >
        {t.hero_subtitle}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mobile-stack mobile-w-full flex justify-center items-center gap-4"
      >
        <Button
          onClick={onStart}
          variant="primary"
          size="lg"
          leftIcon={<MapPin size={20} />}
          className="mobile-w-full"
        >
          {t.hero_cta}
        </Button>
        <Button
          onClick={onSignIn}
          variant="secondary"
          size="lg"
          leftIcon={<Zap size={20} className="text-primary" />}
          className="mobile-w-full"
        >
          {t.hero_signin}
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="hero-map-wrapper"
      >
        <div className="glass-panel hero-map-container">
          <div className="absolute inset-0 z-10">
            <LandingMap
              path={demoPath}
              theme={theme}
              readOnly={true}
              disableZoom
              language={t.nav_map === "Mapa" ? "es" : "en"}
            />
          </div>

          <div className="flex flex-col absolute top-5 left-5 z-20 pointer-events-none gap-3">
            <div className="hero-map-badge bg-[var(--surface-container-low)] border-[var(--outline-variant)]">
              <span className="live-dot" />
              <span className="hero-map-badge-text">
                {t.demo_label}
              </span>
            </div>

            <div className="mobile-hide hero-map-card glass-panel shadow-lg border-[var(--outline-variant)]">
              <div className="hero-map-card-title mb-1">
                {demoPath.name}
              </div>
              <div className="hero-map-card-desc">
                {demoPath.description}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
};
