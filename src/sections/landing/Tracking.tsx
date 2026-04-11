import { motion } from "motion/react";
import { BarChart3, Search, Activity } from "lucide-react";
import { NodeDetailPanel } from "../../components/NodeDetailPanel";
import { getDemoPath } from "../../utils/landingData";

interface TrackingProps {
  isDark: boolean;
  translations: any;
}
export const Tracking = ({ isDark, translations: t }: TrackingProps) => {
  const demoPath = getDemoPath(t);

  return (
    <section
      id="granular-tracking"
      className="relative z-10 max-w-7xl mx-auto px-6 py-32 border-t"
      style={{ borderColor: "var(--surface-container-high)" }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "6rem",
          alignItems: "start",
        }}
      >
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{ width: "100%" }}
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
              {t.nav_tracking}
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
                color: "var(--on-surface)",
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
                marginBottom: "1.5rem",
              }}
            >
              {t.tracking_title}
            </h2>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "1.2rem",
                color: "var(--on-surface-var)",
                lineHeight: 1.5,
                marginBottom: "3rem",
              }}
            >
              {t.tracking_subtitle}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "2rem",
              }}
            >
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
                <div key={i} style={{ display: "flex", gap: "1.5rem" }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "12px",
                      background: "var(--surface-container-high)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--primary)",
                      flexShrink: 0,
                    }}
                  >
                    <f.icon size={22} />
                  </div>
                  <div>
                    <h4
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 800,
                        fontSize: "1rem",
                        color: "var(--on-surface)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {f.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.9rem",
                        color: "var(--on-surface-var)",
                        lineHeight: 1.5,
                      }}
                    >
                      {f.desc}
                    </p>
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
