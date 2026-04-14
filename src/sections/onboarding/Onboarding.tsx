import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Terminal,
  Atom,
  Globe2,
  Palette,
  BarChart2,
  Dna,
  GraduationCap,
  Music,
  MapPin,
  ChevronLeft,
  Pencil,
  Sparkles,
  Lock,
  BookOpen,
  Landmark,
} from "lucide-react";
import { OnboardingData } from "../../types/types";
import { translations, Language } from "../../constants/translations";
import { Button } from "../../components/ui/Button";
import "./Onboarding.css";

type Tier = "free" | "pro" | "premium";

const TIER_ALLOWED_DEPTHS: Record<Tier, string[]> = {
  free: ["surface"],
  pro: ["surface", "professional"],
  premium: ["surface", "professional", "academic"],
};

interface OnboardingProps {
  onComplete: (data: OnboardingData) => void;
  language?: Language;
  tier?: Tier;
}

export const Onboarding = ({
  onComplete,
  language = "es",
  tier = "free",
}: OnboardingProps) => {
  const allowedDepths = TIER_ALLOWED_DEPTHS[tier];
  const t = translations[language];

  const CATEGORIES = [
    {
      id: "technology",
      label: t.onboarding_cat_tech,
      icon: Terminal,
      desc:
        language === "es"
          ? "Software, IA, ingeniería e innovación digital."
          : "Software, AI, engineering and digital innovation.",
    },
    {
      id: "science",
      label: t.onboarding_cat_science,
      icon: Atom,
      desc:
        language === "es"
          ? "Física, biología, química y las leyes de la naturaleza."
          : "Physics, biology, chemistry and the laws of nature.",
    },
    {
      id: "humanities",
      label: t.onboarding_cat_humanities,
      icon: Globe2,
      desc:
        language === "es"
          ? "Historia, filosofía, idiomas y literatura."
          : "History, philosophy, languages and literature.",
    },
    {
      id: "arts",
      label: t.onboarding_cat_arts,
      icon: Palette,
      desc:
        language === "es"
          ? "Música, diseño, cine y expresión creativa."
          : "Music, design, film and creative expression.",
    },
    {
      id: "business",
      label: t.onboarding_cat_business,
      icon: BarChart2,
      desc:
        language === "es"
          ? "Estrategia, economía, marketing y liderazgo."
          : "Strategy, economics, marketing and leadership.",
    },
    {
      id: "health",
      label: t.onboarding_cat_health,
      icon: Dna,
      desc:
        language === "es"
          ? "Medicina, nutrición, psicología y bienestar."
          : "Medicine, nutrition, psychology and wellness.",
    },
    {
      id: "education",
      label: t.onboarding_cat_education,
      icon: GraduationCap,
      desc:
        language === "es"
          ? "Pedagogía, métodos de aprendizaje y maestría académica."
          : "Pedagogy, learning methods and academic mastery.",
    },
    {
      id: "culture",
      label: t.onboarding_cat_culture,
      icon: Music,
      desc:
        language === "es"
          ? "Deportes, viajes, gastronomía y tendencias sociales."
          : "Sports, travel, gastronomy and social trends.",
    },
    {
      id: "Literature",
      label: t.onboarding_cat_literature,
      icon: BookOpen,
      desc:
        language === "es"
          ? "Obras clásicas y contemporáneas, análisis literario y corrientes narrativas."
          : "Classical and contemporary works, literary analysis, and narrative movements.",
    },
    {
      id: "History",
      label: t.onboarding_cat_history,
      icon: Landmark,
      desc:
        language === "es"
          ? "Eventos históricos, civilizaciones y procesos que moldearon el mundo."
          : "Historical events, civilizations, and processes that shaped the world.",
    },
  ];

  const DEPTHS = [
    {
      id: "surface" as const,
      label: t.onboarding_depth_surface,
      badge: language === "es" ? "General" : "Overview",
      desc:
        language === "es"
          ? "Comprensión amplia de los conceptos clave. Perfecto para descubrimiento."
          : "Broad grasp of the key concepts. Perfect for discovery.",
    },
    {
      id: "professional" as const,
      label: t.onboarding_depth_professional,
      badge: language === "es" ? "Aplicado" : "Applied",
      desc:
        language === "es"
          ? "Comprensión práctica de nivel industrial. Suficiente para trabajar."
          : "Practical, industry-grade understanding. Enough to work.",
    },
    {
      id: "academic" as const,
      label: t.onboarding_depth_academic,
      badge: language === "es" ? "Profundo" : "Deep",
      desc:
        language === "es"
          ? "Maestría teórica rigurosa. Para investigación y nivel experto."
          : "Rigorous theoretical mastery. For research and experts.",
    },
  ];

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [category, setCategory] = useState("");
  const defaultDepth = allowedDepths.includes("professional")
    ? "professional"
    : "surface";

  const [depth, setDepth] = useState<"surface" | "professional" | "academic">(
    defaultDepth as "surface" | "professional" | "academic",
  );
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedCategory = CATEGORIES.find((c) => c.id === category);

  const handleGenerate = async () => {
    if (!category || !topic.trim()) return;
    setIsGenerating(true);
    await onComplete({ category, depth, topic: topic.trim() });
  };

  const stepList = [
    { num: 1, label: language === "es" ? "Dominio" : "Domain" },
    { num: 2, label: language === "es" ? "Profundidad" : "Depth" },
    { num: 3, label: language === "es" ? "Enfoque" : "Focus" },
  ];

  return (
    <div className="onboarding">
      <div className="onboarding__bg" />

      <div className="onboarding__content">
        <div className="onboarding__header">
          <div className="onboarding__eyebrow">
            <MapPin size={15} className="onboarding__eyebrow-icon" />
            <span className="onboarding__eyebrow-text">
              {language === "es" ? "Nuevo Mapa" : "New Map"}
            </span>
          </div>

          <h1 className="onboarding__title">
            {t.onboarding_title.split(" ")[0]}{" "}
            <span className="onboarding__title-accent">
              {t.onboarding_title.split(" ").slice(1).join(" ")}
            </span>
          </h1>

          <p className="onboarding__subtitle">{t.onboarding_step_2}</p>
        </div>

        <div className="onboarding__progress">
          {stepList.map((s, i) => {
            const stateClass =
              step === s.num
                ? "onboarding__progress-pill--active"
                : step > s.num
                  ? "onboarding__progress-pill--done"
                  : "onboarding__progress-pill--pending";

            return (
              <div key={s.num} className="onboarding__progress-item">
                <div className={`onboarding__progress-pill ${stateClass}`}>
                  <span className="onboarding__progress-pill-text">
                    {step > s.num ? `✓ ${s.label}` : `0${s.num} · ${s.label}`}
                  </span>
                </div>

                {i < stepList.length - 1 && (
                  <div className="onboarding__progress-line" />
                )}
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-category"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="onboarding__panel onboarding__panel--category"
            >
              <p className="onboarding__intro">
                {language === "es"
                  ? "Elige el dominio que enmarcará tu mapa."
                  : "Choose the domain that will frame your map."}
              </p>

              <div className="onboarding__categories">
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <motion.button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      whileTap={{ scale: 0.96 }}
                      className={`onboarding__category-card ${isSelected ? "is-selected" : ""}`}
                    >
                      <div className="onboarding__category-icon">
                        <cat.icon size={35} />
                      </div>

                      <span className="onboarding__category-label">
                        {cat.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {selectedCategory && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel onboarding__selected-category"
                >
                  <div className="onboarding__selected-category-icon">
                    <selectedCategory.icon size={16} />
                  </div>

                  <div className="onboarding__selected-category-body">
                    <div className="onboarding__selected-category-title">
                      {selectedCategory.label}
                    </div>
                    <div className="onboarding__selected-category-desc">
                      {selectedCategory.desc}
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="onboarding__actions onboarding__actions--center">
                <Button
                  variant="primary"
                  onClick={() => setStep(2)}
                  disabled={!category}
                  className="onboarding__button onboarding__button--next"
                >
                  {t.onboarding_btn_next} →
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-depth"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="onboarding__panel onboarding__panel--depth"
            >
              <p className="onboarding__intro">
                {language === "es"
                  ? "¿Qué tan profundo quieres ir en"
                  : "How deep do you want to go into"}{" "}
                <span className="onboarding__intro-accent">
                  {selectedCategory?.label}
                </span>
                ?
              </p>

              <div className="onboarding__depth-list">
                {DEPTHS.map((d) => {
                  const isSelected = depth === d.id;
                  const isLocked = !allowedDepths.includes(d.id);

                  return (
                    <motion.button
                      key={d.id}
                      type="button"
                      onClick={() => !isLocked && setDepth(d.id)}
                      whileTap={isLocked ? {} : { scale: 0.985 }}
                      className={`onboarding__depth-card ${isSelected ? "is-selected" : ""} ${isLocked ? "is-locked" : ""}`}
                    >
                      {isLocked ? (
                        <Lock size={20} className="onboarding__depth-lock" />
                      ) : (
                        <div
                          className={`onboarding__depth-radio ${isSelected ? "is-selected" : ""}`}
                        >
                          <div className="onboarding__depth-radio-dot" />
                        </div>
                      )}

                      <div className="onboarding__depth-body">
                        <div className="onboarding__depth-head">
                          <span className="onboarding__depth-title">
                            {d.label}
                          </span>

                          <span className="onboarding__depth-badge">
                            {isLocked
                              ? language === "es"
                                ? "Pro+"
                                : "Pro+"
                              : d.badge}
                          </span>
                        </div>

                        <p className="onboarding__depth-desc">{d.desc}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="onboarding__actions">
                <Button
                  variant="secondary"
                  leftIcon={<ChevronLeft size={15} />}
                  onClick={() => setStep(1)}
                  className="onboarding__button onboarding__button--back"
                >
                  {t.onboarding_btn_prev}
                </Button>

                <Button
                  variant="primary"
                  onClick={() => setStep(3)}
                  className="onboarding__button onboarding__button--continue"
                >
                  {t.onboarding_btn_next} →
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-topic"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="onboarding__panel onboarding__panel--topic"
            >
              <div className="onboarding__summary-wrap">
                <div className="onboarding__summary-pill">
                  {selectedCategory && (
                    <selectedCategory.icon
                      size={13}
                      className="onboarding__summary-icon"
                    />
                  )}

                  <span className="onboarding__summary-text onboarding__summary-text--primary">
                    {selectedCategory?.label}
                  </span>

                  <span className="onboarding__summary-divider" />

                  <span className="onboarding__summary-text">
                    {DEPTHS.find((d) => d.id === depth)?.badge}
                  </span>
                </div>
              </div>

              <p className="onboarding__intro">
                {language === "es"
                  ? "¿Qué quieres aprender específicamente?"
                  : "What specifically do you want to learn?"}
              </p>

              <div className="glass-panel onboarding__topic-box">
                <div className="onboarding__topic-input-wrap">
                  <div className="onboarding__topic-icon-box">
                    <Pencil size={14} className="onboarding__topic-icon" />
                  </div>

                  <textarea
                    autoFocus
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={
                      language === "es"
                        ? "ej. 'fútbol', 'pintura renacentista', 'opciones financieras'..."
                        : "e.g. 'football', 'Italian Renaissance painting'..."
                    }
                    rows={4}
                    className="onboarding__textarea"
                  />
                </div>
              </div>

              <div className="onboarding__actions">
                <Button
                  variant="secondary"
                  leftIcon={<ChevronLeft size={15} />}
                  onClick={() => setStep(2)}
                  className="onboarding__button onboarding__button--back"
                >
                  {t.onboarding_btn_prev}
                </Button>

                <Button
                  variant="primary"
                  leftIcon={<Sparkles size={15} />}
                  isLoading={isGenerating}
                  onClick={handleGenerate}
                  disabled={!topic.trim() || isGenerating}
                  className="onboarding__button onboarding__button--finish"
                >
                  {isGenerating ? t.loading_generating_map : t.onboarding_btn_finish}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
