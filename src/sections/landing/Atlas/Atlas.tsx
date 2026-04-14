import { motion } from "motion/react";
import { Network, LayoutGrid, Activity } from "lucide-react";
import { LandingMap } from "../../../components/LandingMap/LandingMap";
import { LearningPath } from "../../../types/types";
import "./Atlas.css";

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
      className="relative z-10 max-w-7xl mx-auto px-6 py-32"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="atlas-grid">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="section-badge">
                <div className="atlas-tagline">{t.nav_atlas}</div>
              </div>
              <h2 className="section-title">{t.atlas_title}</h2>
              <p className="section-description">{t.atlas_subtitle}</p>
            </motion.div>

            <div className="atlas-features-list">
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
                  className="atlas-feature-item"
                >
                  <div className="atlas-feature-icon glass-panel">
                    <f.icon size={24} />
                  </div>
                  <div>
                    <h3 className="atlas-feature-title">{f.title}</h3>
                    <p className="atlas-feature-desc">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-panel atlas-map-container"
          >
            <LandingMap
              path={demoPath}
              theme={theme}
              readOnly
              disableZoom
              language={t.nav_map === "Mapa" ? "es" : "en"}
            />
            <div className="atlas-map-overlay">
              <div className="atlas-map-overlay-left">
                <div className="live-dot" />
                <span className="atlas-map-overlay-label">
                  {t.landing_atlas_bridge}
                </span>
              </div>
              <div className="atlas-map-overlay-right">{demoPath.name}</div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="atlas-ambience" />
    </section>
  );
};
