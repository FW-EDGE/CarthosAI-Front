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
  Loader2,
  Sparkles
} from "lucide-react";
import { OnboardingData } from "../types";
import { translations, Language } from "../translations";

interface OnboardingProps {
  onComplete: (data: OnboardingData) => void;
  language?: Language;
}

export const Onboarding = ({
  onComplete,
  language = "es",
}: OnboardingProps) => {
  const t = translations[language];

  const CATEGORIES = [
    { id: "technology",  label: t.onboarding_cat_tech,  icon: Terminal,      desc: language === "es" ? "Software, IA, ingeniería e innovación digital." : "Software, AI, engineering and digital innovation." },
    { id: "science",     label: t.onboarding_cat_science,     icon: Atom,          desc: language === "es" ? "Física, biología, química y las leyes de la naturaleza." : "Physics, biology, chemistry and the laws of nature." },
    { id: "humanities",  label: t.onboarding_cat_humanities,  icon: Globe2,        desc: language === "es" ? "Historia, filosofía, idiomas y literatura." : "History, philosophy, languages and literature." },
    { id: "arts",        label: t.onboarding_cat_arts,        icon: Palette,       desc: language === "es" ? "Música, diseño, cine y expresión creativa." : "Music, design, film and creative expression." },
    { id: "business",    label: t.onboarding_cat_business,    icon: BarChart2,     desc: language === "es" ? "Estrategia, economía, marketing y liderazgo." : "Strategy, economics, marketing and leadership." },
    { id: "health",      label: t.onboarding_cat_health,      icon: Dna,           desc: language === "es" ? "Medicina, nutrición, psicología y bienestar." : "Medicine, nutrition, psychology and wellness." },
    { id: "education",   label: t.onboarding_cat_education,   icon: GraduationCap, desc: language === "es" ? "Pedagogía, métodos de aprendizaje y maestría académica." : "Pedagogy, learning methods and academic mastery." },
    { id: "culture",     label: t.onboarding_cat_culture,     icon: Music,         desc: language === "es" ? "Deportes, viajes, gastronomía y tendencias sociales." : "Sports, travel, gastronomy and social trends." },
  ];

  const DEPTHS = [
    {
      id: "surface" as const,
      label: t.onboarding_depth_surface,
      badge: language === "es" ? "General" : "Overview",
      desc: language === "es" ? "Comprensión amplia de los conceptos clave. Perfecto para descubrimiento." : "Broad grasp of the key concepts. Perfect for discovery.",
    },
    {
      id: "professional" as const,
      label: t.onboarding_depth_professional,
      badge: language === "es" ? "Aplicado" : "Applied",
      desc: language === "es" ? "Comprensión práctica de nivel industrial. Suficiente para trabajar." : "Practical, industry-grade understanding. Enough to work.",
    },
    {
      id: "academic" as const,
      label: t.onboarding_depth_academic,
      badge: language === "es" ? "Profundo" : "Deep",
      desc: language === "es" ? "Maestría teórica rigurosa. Para investigación y nivel experto." : "Rigorous theoretical mastery. For research and experts.",
    },
  ];

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [category, setCategory] = useState("");
  const [depth, setDepth] = useState<"surface" | "professional" | "academic">("professional");
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
    <div className="min-h-screen flex flex-col overflow-hidden" style={{ background: "var(--surface)" }}>
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse 70% 50% at 15% 5%, rgba(0,195,237,0.12) 0%, transparent 55%), radial-gradient(ellipse 55% 45% at 85% 95%, rgba(0,100,123,0.09) 0%, transparent 50%)",
      }} />

      <div className="relative z-10 flex flex-col items-center justify-start flex-1 px-6 pt-16 pb-10">
        {/* Brand header */}
        <div style={{ marginBottom: "3rem", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <MapPin size={15} style={{ color: "var(--primary)" }} />
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--primary)", fontWeight: 700 }}>{language === "es" ? "Nuevo Mapa" : "New Map"}</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.75rem, 4vw, 2.5rem)", letterSpacing: "-0.03em", color: "var(--on-surface)", lineHeight: 1.1 }}>
             {t.onboarding_title.split(' ')[0]} <span style={{ color: "var(--primary-fixed)" }}>{t.onboarding_title.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-body-md)", color: "var(--on-surface-var)", marginTop: "0.6rem", lineHeight: 1.5 }}>
            {t.onboarding_step_2}
          </p>
        </div>

        {/* Step progress */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2.5rem" }}>
          {stepList.map((s, i) => (
            <div key={s.num} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ padding: "0.35rem 0.9rem", borderRadius: "var(--radius-full)", background: step === s.num ? "var(--primary)" : step > s.num ? "var(--primary-container)" : "var(--surface-container)", transition: "all 0.3s ease" }}>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: step === s.num ? "white" : step > s.num ? "var(--primary)" : "var(--on-surface-var)" }}>
                  {step > s.num ? `✓ ${s.label}` : `0${s.num} · ${s.label}`}
                </span>
              </div>
              {i < stepList.length - 1 && <div style={{ width: 20, height: 1, background: "var(--surface-container-high)" }} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── STEP 1: Category ── */}
          {step === 1 && (
            <motion.div key="step-category" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} style={{ maxWidth: 620, width: "100%" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-body-md)", color: "var(--on-surface-var)", marginBottom: "1.5rem", textAlign: "center", lineHeight: 1.6 }}>
                {language === "es" ? "Elige el dominio que enmarcará tu mapa." : "Choose the domain that will frame your map."}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.875rem", marginBottom: "1.5rem" }}>
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <motion.button key={cat.id} onClick={() => setCategory(cat.id)} whileTap={{ scale: 0.96 }} style={{ background: isSelected ? "var(--primary-container)" : "var(--surface-container-lowest)", borderRadius: "var(--radius-lg)", padding: "1.25rem 1rem", textAlign: "center", border: "none", cursor: "pointer", boxShadow: isSelected ? "var(--shadow-float), 0 0 0 2px var(--primary)" : "var(--shadow-card)", transition: "all 0.22s ease", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.625rem" }}>
                      <div style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", background: isSelected ? "rgba(0,100,123,0.15)" : "var(--surface-container)", display: "flex", alignItems: "center", justifyContent: "center", color: isSelected ? "var(--primary)" : "var(--on-surface-var)", transition: "all 0.22s ease" }}>
                        <cat.icon size={20} />
                      </div>
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.8rem", color: isSelected ? "var(--primary)" : "var(--on-surface)", transition: "color 0.22s ease" }}>{cat.label}</span>
                    </motion.button>
                  );
                })}
              </div>
              {selectedCategory && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ borderRadius: "var(--radius-lg)", padding: "0.875rem 1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.875rem" }}>
                  <div style={{ width: 34, height: 34, borderRadius: "var(--radius-md)", flexShrink: 0, background: "var(--primary-container)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                    <selectedCategory.icon size={16} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem", color: "var(--primary)", marginBottom: 2 }}>{selectedCategory.label}</div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.78rem", color: "var(--on-surface-var)" }}>{selectedCategory.desc}</div>
                  </div>
                </motion.div>
              )}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button onClick={() => setStep(2)} disabled={!category} className="btn-primary" style={{ opacity: category ? 1 : 0.4, pointerEvents: category ? "auto" : "none", minWidth: 200 }}>
                  {t.onboarding_btn_next} →
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Depth ── */}
          {step === 2 && (
            <motion.div key="step-depth" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} style={{ maxWidth: 520, width: "100%" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-body-md)", color: "var(--on-surface-var)", marginBottom: "1.5rem", textAlign: "center", lineHeight: 1.6 }}>
                {language === "es" ? "¿Qué tan profundo quieres ir en" : "How deep do you want to go into"} <span style={{ color: "var(--primary)", fontWeight: 700 }}>{selectedCategory?.label}</span>?
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", marginBottom: "2rem" }}>
                {DEPTHS.map((d) => {
                  const isSelected = depth === d.id;
                  return (
                    <motion.button key={d.id} onClick={() => setDepth(d.id)} whileTap={{ scale: 0.985 }} style={{ background: isSelected ? "var(--primary-container)" : "var(--surface-container-lowest)", borderRadius: "var(--radius-lg)", padding: "1.25rem 1.5rem", textAlign: "left", border: "none", cursor: "pointer", boxShadow: isSelected ? "var(--shadow-float), 0 0 0 2px var(--primary)" : "var(--shadow-card)", transition: "all 0.22s ease", display: "flex", alignItems: "center", gap: "1.25rem" }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, border: `2px solid ${isSelected ? "var(--primary)" : "var(--surface-container-high)"}`, background: isSelected ? "var(--primary)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.22s ease" }}>
                        {isSelected && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "white" }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: 4 }}>
                          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: isSelected ? "var(--primary)" : "var(--on-surface)" }}>{d.label}</span>
                          <span style={{ padding: "0.15rem 0.6rem", borderRadius: "var(--radius-full)", background: isSelected ? "rgba(0,100,123,0.15)" : "var(--surface-container)", fontFamily: "var(--font-sans)", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: isSelected ? "var(--primary)" : "var(--on-surface-var)" }}>{d.badge}</span>
                        </div>
                        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "var(--on-surface-var)", lineHeight: 1.5, margin: 0 }}>{d.desc}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                <button onClick={() => setStep(1)} className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                  <ChevronLeft size={15} /> {t.onboarding_btn_prev}
                </button>
                <button onClick={() => setStep(3)} className="btn-primary" style={{ minWidth: 160 }}>{t.onboarding_btn_next} →</button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: Topic ── */}
          {step === 3 && (
            <motion.div key="step-topic" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} style={{ maxWidth: 500, width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 1.1rem", borderRadius: "var(--radius-full)", background: "var(--primary-container)" }}>
                  {selectedCategory && <selectedCategory.icon size={13} style={{ color: "var(--primary)" }} />}
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>{selectedCategory?.label}</span>
                  <span style={{ width: 1, height: 12, background: "rgba(0,100,123,0.25)" }} />
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", fontWeight: 600, color: "var(--primary)" }}>{DEPTHS.find((d) => d.id === depth)?.badge}</span>
                </div>
              </div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-body-md)", color: "var(--on-surface-var)", marginBottom: "1.5rem", textAlign: "center", lineHeight: 1.6 }}>
                {language === "es" ? "¿Qué quieres aprender específicamente?" : "What specifically do you want to learn?"}
              </p>
              <div className="glass-panel" style={{ borderRadius: "var(--radius-lg)", padding: "1.5rem", marginBottom: "0.875rem" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                  <div style={{ width: 34, height: 34, borderRadius: "var(--radius-md)", flexShrink: 0, background: "var(--primary-container)", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
                    <Pencil size={14} style={{ color: "var(--primary)" }} />
                  </div>
                  <textarea
                    autoFocus
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={language === "es" ? "ej. 'fútbol', 'pintura renacentista', 'opciones financieras'..." : "e.g. 'football', 'Italian Renaissance painting'..."}
                    rows={4}
                    style={{ flex: 1, background: "transparent", border: "none", outline: "none", resize: "none", fontFamily: "var(--font-sans)", fontSize: "1rem", color: "var(--on-surface)", lineHeight: 1.65, caretColor: "var(--primary)" }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                <button onClick={() => setStep(2)} className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                  <ChevronLeft size={15} /> {t.onboarding_btn_prev}
                </button>
                <button onClick={handleGenerate} disabled={!topic.trim() || isGenerating} className="btn-primary" style={{ minWidth: 200, opacity: topic.trim() && !isGenerating ? 1 : 0.45, pointerEvents: topic.trim() && !isGenerating ? "auto" : "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {isGenerating
                    ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> {t.loading_generating_map}</>
                    : <><Sparkles size={15} /> {t.onboarding_btn_finish}</>}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
