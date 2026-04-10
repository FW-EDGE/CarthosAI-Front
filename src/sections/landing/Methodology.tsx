import { motion } from "motion/react";
import { Globe2, Dna, Pencil, Activity } from "lucide-react";

interface MethodologyProps {
  translations: any;
}

export const Methodology = ({ translations: t }: MethodologyProps) => {
  return (
    <section
      id="methodology"
      className="relative z-10 max-w-7xl mx-auto px-6 py-32 border-t"
      style={{ borderColor: "var(--surface-container-high)" }}
    >
      <div style={{ textAlign: "center", marginBottom: "5rem" }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            display: "inline-block",
            padding: "0.4rem 1rem",
            borderRadius: "100px",
            background: "var(--primary-container)",
            color: "var(--primary)",
            fontSize: "0.75rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "1rem",
          }}
        >
          {t.nav_methodology}
        </motion.div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
            color: "var(--on-surface)",
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
          }}
        >
          {t.methodology_title}
        </h2>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "1.2rem",
            color: "var(--on-surface-var)",
            maxWidth: 650,
            margin: "1.5rem auto 0",
            lineHeight: 1.6,
          }}
        >
          {t.methodology_subtitle}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "2.5rem",
        }}
      >
        {[
          {
            icon: Globe2,
            title: t.methodology_step_1_title,
            desc: t.methodology_step_1_desc,
            color: "#3b82f6",
          },
          {
            icon: Dna,
            title: t.methodology_step_2_title,
            desc: t.methodology_step_2_desc,
            color: "#8b5cf6",
          },
          {
            icon: Pencil,
            title: t.methodology_step_3_title,
            desc: t.methodology_step_3_desc,
            color: "#f59e0b",
          },
          {
            icon: Activity,
            title: t.methodology_step_4_title,
            desc: t.methodology_step_4_desc,
            color: "var(--primary)",
          },
        ].map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="glass-panel"
            style={{
              padding: "2.5rem",
              borderRadius: "24px",
              border: "1px solid var(--surface-container-highest)",
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: "16px",
                background: "var(--surface-container-low)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.5rem",
                color: f.color,
                boxShadow: `0 8px 20px rgba(0,0,0,0.1)`,
              }}
            >
              <f.icon size={26} />
            </div>
            <div>
              <h4
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  color: "var(--on-surface)",
                  marginBottom: "0.4rem",
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
          </motion.div>
        ))}
      </div>
    </section>
  );
};
