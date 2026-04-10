import { motion } from "motion/react";
import { Fingerprint, MapPin, Zap } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { FuturisticMap } from "../../components/FuturisticMap";
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
          fontWeight: 600,
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
        <Button
          onClick={onStart}
          variant="primary"
          size="lg"
          leftIcon={<MapPin size={20} />}
        >
          {t.hero_cta}
        </Button>
        <Button
          onClick={onSignIn}
          variant="secondary"
          size="lg"
          leftIcon={<Zap size={20} color="var(--primary)" />}
        >
          {t.hero_signin}
        </Button>
      </motion.div>

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
          <div style={{ position: "absolute", inset: 0, zIndex: 10 }}>
            <FuturisticMap
              path={demoPath}
              theme={theme}
              readOnly={true}
              disableZoom
            />
          </div>

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
                {demoPath.name}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.72rem",
                  color: "var(--on-surface-var)",
                  lineHeight: 1.4,
                }}
              >
                {demoPath.description}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
};
