import { motion } from "motion/react";
import { CheckCircle2, Zap, Crown, Sparkles } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import "./Pricing.css";
import React from "react";

interface PricingProps {
  onStart: () => void;
  translations: any;
  language: "en" | "es";
}

const COPY = {
  en: {
    badge: "Pricing",
    title: "Start free.",
    title_2: "Scale when ready.",
    subtitle:
      "One free map to explore. Upgrade when you're ready to go deeper.",
    free_title: "Free",
    free_price: "$0",
    free_desc: "Get started with no commitment.",
    free_features: [
      "1 complete map",
      "Surface depth only",
      "Unlimited nodes per map",
      "AI-generated study plans",
    ],
    free_cta: "Start for free",
    pro_desc: "For serious learners.",
    pro_features: [
      "5 active maps",
      "Surface & Professional depth",
      "Unlimited nodes per map",
      "Archive section access",
      "AI-generated study plans",
    ],
    pro_cta: "Get Pro",
    premium_desc: "For the relentless.",
    premium_features: [
      "Unlimited maps",
      "All depths (incl. Academic)",
      "Unlimited nodes",
      "Export maps (PDF / image)",
      "Share maps via link",
      "AI-generated study plans",
    ],
    premium_cta: "Get Premium",
    popular: "Most popular",
    per_month: "/ month",
  },
  es: {
    badge: "Precios",
    title: "Empezá gratis.",
    title_2: "Escalá cuando estés listo.",
    subtitle:
      "Un mapa gratis para explorar. Actualizá cuando quieras ir más profundo.",
    free_title: "Free",
    free_price: "$0",
    free_desc: "Empezá sin compromisos.",
    free_features: [
      "1 mapa completo",
      "Solo nivel Surface",
      "Nodos ilimitados por mapa",
      "Planes de estudio con IA",
    ],
    free_cta: "Empezar gratis",
    pro_desc: "Para aprendices serios.",
    pro_features: [
      "5 mapas activos",
      "Niveles Surface y Professional",
      "Nodos ilimitados por mapa",
      "Acceso a sección Archivo",
      "Planes de estudio con IA",
    ],
    pro_cta: "Obtener Pro",
    premium_desc: "Para los imparables.",
    premium_features: [
      "Mapas ilimitados",
      "Todos los niveles (incl. Academic)",
      "Nodos ilimitados",
      "Exportar mapas (PDF / imagen)",
      "Compartir mapas con link",
      "Planes de estudio con IA",
    ],
    premium_cta: "Obtener Premium",
    popular: "Más popular",
    per_month: "/ mes",
  },
};

export const Pricing = ({
  onStart,
  translations: t,
  language,
}: PricingProps) => {
  const c = COPY[language];

  const plans = [
    {
      id: "free",
      title: c.free_title,
      price: c.free_price,
      period: "",
      desc: c.free_desc,
      features: c.free_features,
      cta: c.free_cta,
      icon: Sparkles,
      accent: "var(--primary)",
      accentBg: "var(--primary-container)",
      accentShadow: "rgba(0,100,123,0.13)",
      highlight: false,
      onCta: onStart,
    },
    {
      id: "pro",
      title: "Pro",
      price: "$9.99",
      period: c.per_month,
      desc: c.pro_desc,
      features: c.pro_features,
      cta: c.pro_cta,
      icon: Zap,
      accent: "#7c3aed",
      accentBg: "rgba(124,58,237,0.12)",
      accentShadow: "rgba(124,58,237,0.13)",
      highlight: true,
      onCta: onStart,
    },
    {
      id: "premium",
      title: "Premium",
      price: "$19.99",
      period: c.per_month,
      desc: c.premium_desc,
      features: c.premium_features,
      cta: c.premium_cta,
      icon: Crown,
      accent: "#d97706",
      accentBg: "rgba(217,119,6,0.1)",
      accentShadow: "rgba(217,119,6,0.13)",
      highlight: false,
      onCta: onStart,
    },
  ];

  return (
    <section id="pricing" className="relative z-10 py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="section-badge">
            <div className="section-badge-text">{c.badge}</div>
          </div>
          <h2 className="section-title text-[clamp(2rem,5vw,3.5rem)] mb-4">
            {c.title} <span className="pricing-title-accent">{c.title_2}</span>
          </h2>
          <p className="pricing-subtitle">{c.subtitle}</p>
        </motion.div>

        {/* Plans grid */}
        <div className="pricing-grid">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`pricing-card${plan.highlight ? " pricing-card--highlight" : ""}`}
                style={
                  {
                    "--plan-accent": plan.accent,
                    "--plan-accent-bg": plan.accentBg,
                    "--plan-accent-shadow": plan.accentShadow,
                  } as React.CSSProperties
                }
              >
                {plan.highlight && (
                  <div className="pricing-popular-badge">{c.popular}</div>
                )}

                <div className="pricing-card-header">
                  <div className="pricing-plan-top">
                    <div className="pricing-icon-box">
                      <Icon size={18} />
                    </div>
                    <span className="pricing-plan-name">{plan.title}</span>
                  </div>
                  <div className="pricing-price-row">
                    <span className="pricing-price">{plan.price}</span>
                    {plan.period && (
                      <span className="pricing-period">{plan.period}</span>
                    )}
                  </div>
                  <p className="pricing-desc">{plan.desc}</p>
                </div>

                <ul className="pricing-features">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="pricing-feature">
                      <CheckCircle2 size={15} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={plan.onCta}
                  className={`pricing-cta${plan.highlight ? " pricing-cta--highlight" : ""}`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
