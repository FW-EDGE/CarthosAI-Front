import { motion } from "motion/react";
import { Button } from "../../components/ui/Button";

interface CTAProps {
  onStart: () => void;
  translations: any;
}

export const CTA = ({ onStart, translations: t }: CTAProps) => {
  return (
    <section
      className="relative z-10 py-32 border-t"
      style={{ borderColor: "var(--surface-container-high)" }}
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              color: "var(--on-surface)",
              marginBottom: "2rem",
              letterSpacing: "-0.05em",
            }}
          >
            {t.landing_cta_ready}
          </h2>
          <Button
            variant="primary"
            size="lg"
            style={{
              borderRadius: "100px",
              padding: "1.5rem 4.5rem",
              fontSize: "1.2rem",
            }}
            onClick={() => onStart()}
          >
            {t.hero_cta}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
