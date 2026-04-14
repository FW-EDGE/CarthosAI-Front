import { motion } from "motion/react";
import { BarChart3, Search, Activity } from "lucide-react";
import { NodeDetailPanel } from "../../../components/NodeDetailPanel/NodeDetailPanel";
import { getDemoPath } from "../../../utils/landingData";
import "./Tracking.css";

interface TrackingProps {
  isDark: boolean;
  translations: any;
}

export const Tracking = ({ isDark, translations: t }: TrackingProps) => {
  const demoPath = getDemoPath(t);

  return (
    <section
      id="granular-tracking"
      className="relative z-10 max-w-7xl mx-auto px-6 py-32"
    >
      <div className="tracking-grid">
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full"
          >
            <NodeDetailPanel
              selectedNode={demoPath.nodes[1]}
              allNodes={demoPath.nodes}
              onClose={() => {}}
              mapId={demoPath.id}
              theme={isDark ? "dark" : "light"}
              standalone={true}
              language={t.nav_map === "Mapa" ? "es" : "en"}
            />
          </motion.div>
        </div>

        <div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="section-badge">
              <div className="tracking-tagline">{t.nav_tracking}</div>
            </div>
            <h2 className="section-title">{t.tracking_title}</h2>
            <p className="section-description">{t.tracking_subtitle}</p>

            <div className="tracking-features-list">
              {[
                {
                  icon: BarChart3,
                  title: t.tracking_feature_1_title,
                  desc: t.tracking_feature_1_desc,
                },
                {
                  icon: Search,
                  title: t.tracking_feature_2_title,
                  desc: t.tracking_feature_2_desc,
                },
                {
                  icon: Activity,
                  title: t.tracking_feature_3_title,
                  desc: t.tracking_feature_3_desc,
                },
              ].map((f, i) => (
                <div key={i} className="tracking-feature-item">
                  <div className="tracking-feature-icon glass-panel">
                    <f.icon size={22} />
                  </div>
                  <div>
                    <h4 className="tracking-feature-title">{f.title}</h4>
                    <p className="tracking-feature-desc">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
