import { motion } from "motion/react";
import { Globe2, Dna, Pencil, Activity } from "lucide-react";

interface MethodologyProps {
  translations: any;
}

export const Methodology = ({ translations: t }: MethodologyProps) => {
  return (
    <section
      id="methodology"
      className="relative z-10 max-w-7xl mx-auto px-6 py-32"
    >
      <div className="text-center mb-20">
        <div className="section-badge">
          {t.nav_methodology}
        </div>
        <h2 className="section-title">
          {t.methodology_title}
        </h2>
        <p className="section-description mx-auto mt-6">
          {t.methodology_subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
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
            className="glass-panel flex flex-col items-center text-center p-10 rounded-[24px] h-full"
          >
            <div
              className="w-[54px] h-[54px] rounded-2xl bg-[var(--surface-container-low)] flex items-center justify-center mb-6 shadow-sm"
              style={{ color: f.color }}
            >
              <f.icon size={35} />
            </div>
            <div>
              <h4 className="font-display font-extrabold text-[1.1rem] text-[var(--on-surface)] mb-2">
                {f.title}
              </h4>
              <p className="font-sans text-[0.9rem] text-[var(--on-surface-var)] leading-relaxed">
                {f.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
