import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Brain, 
  Network, 
  Database, 
  Sparkles, 
  Dna, 
  Globe, 
  Zap,
  Layers,
  Search,
  Cpu
} from "lucide-react";
import { translations, Language } from "../translations";

const getStages = (t: any) => [
  { icon: Brain,     text: t.gen_stage_1 },
  { icon: Network,   text: t.gen_stage_2 },
  { icon: Database,  text: t.gen_stage_3 },
  { icon: Search,    text: t.gen_stage_4 },
  { icon: Cpu,       text: t.gen_stage_5 },
  { icon: Layers,    text: t.gen_stage_6 },
  { icon: Dna,       text: t.gen_stage_7 },
  { icon: Zap,       text: t.gen_stage_8 },
  { icon: Globe,     text: t.gen_stage_9 },
  { icon: Sparkles,  text: t.gen_stage_10 },
];

export const GenerationLoader = ({ language = "es" }: { language?: Language }) => {
  const t = translations[language];
  const STAGES = getStages(t);
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev + 1) % STAGES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const StageIcon = STAGES[currentStage].icon;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden" style={{ background: "var(--surface)" }}>
      {/* Background Ambience */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(circle at 50% 50%, rgba(0,195,237,0.06) 0%, transparent 60%)",
      }} />
      
      <div className="relative z-10 flex flex-col items-center gap-12 max-w-sm w-full px-8">
        {/* Main Spinner Core */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Rotating Rings */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-full"
            style={{ borderColor: "rgba(0,195,237,0.15)" }}
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-12px] border border-primary/10 rounded-full"
            style={{ borderColor: "rgba(0,195,237,0.1)" }}
          />

          {/* Pulse Core */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-20 h-20 bg-primary/10 rounded-full blur-xl"
            style={{ backgroundColor: "rgba(0,195,237,0.08)" }}
          />

          {/* Icon Stage */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage}
              initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 1.5, opacity: 0, rotate: 20 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
              className="relative z-20 text-primary"
              style={{ color: "var(--primary)" }}
            >
              <StageIcon size={44} strokeWidth={1.5} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Text Area */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-1.5 h-6">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentStage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ 
                  fontFamily: "var(--font-sans)", 
                  fontSize: "0.85rem", 
                  fontWeight: 600, 
                  color: "var(--on-surface)",
                  letterSpacing: "0.01em"
                }}
              >
                {STAGES[currentStage].text}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="w-48 h-1 background-surface-container-high rounded-full overflow-hidden" 
               style={{ backgroundColor: "var(--surface-container-high)", height: 3, width: 180 }}>
            <motion.div 
               animate={{ x: [-180, 180] }}
               transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
               className="h-full w-24 bg-primary rounded-full"
               style={{ 
                 width: "35%", 
                 background: "linear-gradient(90deg, transparent, var(--primary), transparent)" 
               }}
            />
          </div>

          <span style={{ 
            fontFamily: "var(--font-sans)", 
            fontSize: "0.65rem", 
            textTransform: "uppercase", 
            letterSpacing: "0.2em", 
            color: "var(--outline)",
            marginTop: "0.5rem",
            fontWeight: 700
          }}>
            CarthosAI Engine
          </span>
        </div>
      </div>

      {/* Ambient Micro-dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              opacity: Math.random() * 0.5 
            }}
            animate={{ 
              y: ["-10%", "110%"],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 5 + Math.random() * 10, 
              repeat: Infinity, 
              ease: "linear",
              delay: Math.random() * 10
            }}
            className="absolute w-1 h-1 bg-primary rounded-full"
            style={{ backgroundColor: "var(--primary)", opacity: 0.2 }}
          />
        ))}
      </div>
    </div>
  );
};
