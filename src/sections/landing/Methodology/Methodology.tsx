import { motion } from "motion/react";
import { Globe2, Dna, Pencil, Activity } from "lucide-react";
import "./Methodology.css";
import React from "react";

interface MethodologyProps {
  translations: any;
}

export const Methodology = ({ translations: t }: MethodologyProps) => {
  const steps = [
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
  ];

  return (
    <section id="methodology" className="methodology-main">
      <div className="text-center mb-10">
        <div className="section-badge">
          <div className="methodology-tagline">{t.nav_methodology}</div>
        </div>
        <h2 className="section-title">{t.methodology_title}</h2>
        <p className="methodology-subtitle">{t.methodology_subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {steps.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="glass-panel flex flex-col items-center text-center p-10 rounded-[24px] h-full"
          >
            <div
              className="methodology-icon-box"
              style={{ "--icon-color": f.color } as React.CSSProperties}
            >
              <f.icon size={35} />
            </div>
            <div>
              <h4 className="methodology-card-title">{f.title}</h4>
              <p className="methodology-card-desc">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
