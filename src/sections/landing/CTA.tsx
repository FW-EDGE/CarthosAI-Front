import { motion } from "motion/react";
import { Button } from "../../components/ui/Button";

interface CTAProps {
  onStart: () => void;
  translations: any;
}

export const CTA = ({ onStart, translations: t }: CTAProps) => {
  return (
    <section className="relative z-10 py-32">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center"
        >
          <h2 className="section-title text-[clamp(2.5rem,6vw,4.5rem)] mb-8">
            {t.landing_cta_ready}
          </h2>
          <Button
            variant="primary"
            size="lg"
            className="cta-button"
            onClick={() => onStart()}
          >
            {t.hero_cta}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
