import { motion } from "motion/react";
import { Network, LayoutGrid, Activity } from "lucide-react";
import { LandingMap } from "../../components/LandingMap";
import { LearningPath } from "../../types";

interface AtlasProps {
  isDark: boolean;
  theme: "light" | "dark";
  translations: any;
  demoPath: LearningPath;
}

export const Atlas = ({
  isDark,
  theme,
  translations: t,
  demoPath,
}: AtlasProps) => {
  return (
    <section
      id="neural-atlas"
      className="relative overflow-hidden pt-32 pb-48 border-t"
      style={{
        borderColor: "var(--surface-container-high)",
        background: isDark ? "rgba(0,0,0,0.1)" : "rgba(0,100,123,0.01)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: "6rem",
            alignItems: "center",
          }}
        >
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div
                style={{
                  display: "inline-block",
                  padding: "0.4rem 1rem",
                  borderRadius: "100px",
                  background: "rgba(0, 100, 123, 0.1)",
                  color: "var(--primary)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "1.5rem",
                }}
              >
                {t.nav_atlas}
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  color: "var(--on-surface)",
                  letterSpacing: "-0.05em",
                  lineHeight: 1,
                  marginBottom: "1.5rem",
                }}
              >
                {t.atlas_title}
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "1.25rem",
                  color: "var(--on-surface-var)",
                  lineHeight: 1.5,
                  marginBottom: "3rem",
                }}
              >
                {t.atlas_subtitle}
              </p>
            </motion.div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2.5rem",
              }}
            >
              {[
                {
                  icon: Network,
                  title: t.atlas_feature_1_title,
                  desc: t.atlas_feature_1_desc,
                },
                {
                  icon: LayoutGrid,
                  title: t.atlas_feature_2_title,
                  desc: t.atlas_feature_2_desc,
                },
                {
                  icon: Activity,
                  title: t.atlas_feature_3_title,
                  desc: t.atlas_feature_3_desc,
                },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{ display: "flex", gap: "1.5rem" }}
                >
                  <div style={{ color: "var(--primary)", flexShrink: 0 }}>
                    <f.icon size={28} />
                  </div>
                  <div>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 800,
                        fontSize: "1.2rem",
                        color: "var(--on-surface)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {f.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.95rem",
                        color: "var(--on-surface-var)",
                        lineHeight: 1.6,
                      }}
                    >
                      {f.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-panel"
            style={{
              height: 650,
              borderRadius: "40px",
              overflow: "hidden",
              position: "relative",
              border: "1px solid var(--surface-container-highest)",
              boxShadow: "0 40px 100px rgba(0,0,0,0.15)",
            }}
          >
            <LandingMap
              path={demoPath}
              theme={theme}
              readOnly
              disableZoom
              language={t.nav_map === "Mapa" ? "es" : "en"}
            />

            {/* Overlay Badge */}
            <div
              style={{
                position: "absolute",
                top: "2rem",
                left: "2rem",
                right: "2rem",
                padding: "1.25rem",
                background: "rgba(11, 15, 17, 0.8)",
                backdropFilter: "blur(12px)",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <div className="live-dot" />
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    color: "var(--primary-fixed)",
                    letterSpacing: "0.1em",
                  }}
                >
                  {t.landing_atlas_bridge}
                </span>
              </div>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "rgba(255,255,255,0.5)",
                  fontWeight: 700,
                }}
              >
                {demoPath.name}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Ambience */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "-10%",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(0,195,237,0.08) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />
    </section>
  );
};
