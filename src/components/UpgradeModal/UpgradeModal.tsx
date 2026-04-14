import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle2, Zap, Crown, Loader2 } from "lucide-react";
import { billingService } from "../../services/api";
import "./UpgradeModal.css";

type Tier = "free" | "pro" | "premium";
type Language = "en" | "es";

interface UpgradeModalProps {
  currentTier: Tier;
  language: Language;
  onClose: () => void;
}

const PLANS = [
  {
    id: "pro" as const,
    price: "$9.99",
    icon: Zap,
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.1)",
    border: "rgba(124,58,237,0.3)",
    features: {
      en: [
        "5 active maps",
        "Surface & Professional depth",
        "Unlimited nodes per map",
        "Archive section access",
      ],
      es: [
        "5 mapas activos",
        "Niveles Surface y Professional",
        "Nodos ilimitados por mapa",
        "Acceso a sección Archivo",
      ],
    },
  },
  {
    id: "premium" as const,
    price: "$19.99",
    icon: Crown,
    color: "#d97706",
    bg: "rgba(217,119,6,0.1)",
    border: "rgba(217,119,6,0.3)",
    features: {
      en: [
        "Unlimited maps",
        "All depth levels (incl. Academic)",
        "Unlimited nodes",
        "Export maps (PDF / image)",
        "Share maps via link",
      ],
      es: [
        "Mapas ilimitados",
        "Todos los niveles (incl. Academic)",
        "Nodos ilimitados",
        "Exportar mapas (PDF / imagen)",
        "Compartir mapas con link",
      ],
    },
  },
];

const COPY = {
  en: {
    title: "Unlock your full potential",
    subtitle:
      "You've reached the limit of your Free plan. Upgrade to keep building.",
    per_month: "/ month",
    cta: "Upgrade to",
    current: "Current plan",
    close: "Maybe later",
  },
  es: {
    title: "Desbloqueá tu potencial completo",
    subtitle:
      "Llegaste al límite de tu plan Free. Actualizá para seguir creando.",
    per_month: "/ mes",
    cta: "Actualizar a",
    current: "Plan actual",
    close: "Quizás después",
  },
};

export const UpgradeModal = ({
  currentTier,
  language,
  onClose,
}: UpgradeModalProps) => {
  const [loading, setLoading] = useState<"pro" | "premium" | null>(null);
  const [error, setError] = useState("");
  const c = COPY[language];

  const handleUpgrade = async (plan: "pro" | "premium") => {
    setLoading(plan);
    setError("");
    try {
      const url = await billingService.createCheckoutSession(plan);
      window.location.href = url;
    } catch (err: any) {
      setError(err.message || "Error al iniciar el pago. Intentá de nuevo.");
      setLoading(null);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="upgrade-overlay"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="glass-panel upgrade-panel"
        >
          <div className="upgrade-header">
            <div>
              <h2 className="upgrade-title">{c.title}</h2>
              <p className="upgrade-subtitle">{c.subtitle}</p>
            </div>
            <button onClick={onClose} className="upgrade-close-btn">
              <X size={20} />
            </button>
          </div>

          <div className="upgrade-plans-grid">
            {PLANS.map((plan) => {
              const Icon = plan.icon;
              const isCurrentPlan = currentTier === plan.id;
              const isLoading = loading === plan.id;
              return (
                <div
                  key={plan.id}
                  className="upgrade-plan-card"
                  style={
                    {
                      "--plan-color": plan.color,
                      "--plan-bg": plan.bg,
                      "--plan-border": plan.border,
                    } as React.CSSProperties
                  }
                >
                  <div>
                    <div className="upgrade-plan-top">
                      <div className="upgrade-plan-icon-box">
                        <Icon size={16} />
                      </div>
                      <span className="upgrade-plan-name">{plan.id}</span>
                    </div>
                    <div className="upgrade-price-row">
                      <span className="upgrade-plan-price">{plan.price}</span>
                      <span className="upgrade-plan-period">{c.per_month}</span>
                    </div>
                  </div>

                  <ul className="upgrade-features">
                    {plan.features[language].map((f, i) => (
                      <li key={i} className="upgrade-feature">
                        <CheckCircle2 size={13} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={!!loading || isCurrentPlan}
                    className={[
                      "upgrade-plan-cta",
                      isCurrentPlan
                        ? "upgrade-plan-cta--current"
                        : "upgrade-plan-cta--active",
                      loading && !isLoading ? "upgrade-plan-cta--dimmed" : "",
                    ].join(" ")}
                  >
                    {isLoading ? (
                      <Loader2
                        size={14}
                        style={{ animation: "spin 1s linear infinite" }}
                      />
                    ) : isCurrentPlan ? (
                      c.current
                    ) : (
                      `${c.cta} ${plan.id.charAt(0).toUpperCase() + plan.id.slice(1)}`
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {error && <p className="upgrade-error">{error}</p>}

          <div className="upgrade-dismiss">
            <button onClick={onClose} className="upgrade-dismiss-btn">
              {c.close}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
