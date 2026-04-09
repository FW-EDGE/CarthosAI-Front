import React from "react";
import { motion } from "motion/react";
import { BookOpenCheck, Lock, Sparkles } from "lucide-react";
import { LearningPath } from "../types";
import { translations, Language } from "../translations";

interface VaultSectionProps {
  learningPaths: LearningPath[];
  language: Language;
}

export const VaultSection = ({ learningPaths, language }: VaultSectionProps) => {
  const t = translations[language];

  return (
    <motion.div
      key="vault"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-7xl mx-auto px-6 py-8"
    >
      <div className="flex flex-col gap-8">
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "var(--on-surface)", letterSpacing: "-0.02em" }}>
             {t.nav_archive}
          </h2>
          <p style={{ fontFamily: "var(--font-sans)", color: "var(--on-surface-var)", marginTop: 4 }}>
            Mapas de conocimiento archivados y completados.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: "4rem 2rem", textAlign: "center", borderRadius: "var(--radius-xl)" }}>
          <div style={{ 
            width: 80, height: 80, borderRadius: "24px", 
            background: "var(--surface-container-high)", 
            display: "flex", alignItems: "center", justifyContent: "center", 
            color: "var(--outline)", margin: "0 auto 1.5rem" 
          }}>
            <Lock size={32} />
          </div>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", color: "var(--on-surface)", marginBottom: "0.5rem" }}>
            Archivo Bloqueado
          </h3>
          <p style={{ fontFamily: "var(--font-sans)", color: "var(--on-surface-var)", maxWidth: 400, margin: "0 auto" }}>
            Completa al menos un mapa al 100% para empezar a archivar tus progresos en el Vault Neural.
          </p>
          <div style={{ marginTop: "2.5rem", display: "flex", justifyContent: "center", gap: 12 }}>
            <div style={{ padding: "0.5rem 1rem", borderRadius: "100px", background: "rgba(0,195,237,0.06)", border: "1px solid rgba(0,195,237,0.1)", display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={14} style={{ color: "var(--primary)" }} />
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase" }}>Explora nuevos mapas</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
