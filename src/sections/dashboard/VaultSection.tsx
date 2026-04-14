import React from "react";
import { motion } from "motion/react";
import {
  Lock,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  BookOpenCheck,
} from "lucide-react";
import { LearningPath } from "../../types/types";
import { translations, Language } from "../../constants/translations";

interface VaultSectionProps {
  learningPaths: LearningPath[];
  language: Language;
  onNavigateToMap: (pathId: string) => void;
}

export const VaultSection = ({
  learningPaths,
  language,
  onNavigateToMap,
}: VaultSectionProps) => {
  const t = translations[language];

  const completedMaps = learningPaths.filter(
    (path) =>
      path.nodes.length > 0 &&
      path.nodes.every((n) => n.status === "completed"),
  );

  return (
    <motion.div
      key="vault"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-7xl mx-auto px-6 py-8"
    >
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              color: "var(--on-surface)",
              letterSpacing: "-0.02em",
            }}
          >
            {t.nav_archive}
            {completedMaps.length > 0 && (
              <span
                style={{
                  color: "var(--primary)",
                  fontSize: "0.9rem",
                  verticalAlign: "middle",
                  marginLeft: 8,
                }}
              >
                {completedMaps.length} Total
              </span>
            )}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              color: "var(--on-surface-var)",
              marginTop: 4,
            }}
          >
            {t.vault_subtitle}
          </p>
        </div>

        {completedMaps.length > 0 ? (
          <div className="grid gap-4">
            {completedMaps.map((path, i) => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-panel hover-card"
                onClick={() => onNavigateToMap(path.id)}
                style={{
                  padding: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1.25rem",
                  cursor: "pointer",
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "14px",
                    background: "rgba(5,150,105,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#059669",
                    flexShrink: 0,
                  }}
                >
                  <BookOpenCheck size={24} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "1rem",
                        color: "var(--on-surface)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {path.name}
                    </h3>
                    <span
                      style={{
                        fontSize: "0.6rem",
                        padding: "2px 8px",
                        borderRadius: 99,
                        background: "rgba(5,150,105,0.12)",
                        color: "#059669",
                        textTransform: "uppercase",
                        fontWeight: 700,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <CheckCircle2 size={10} />
                      {t.vault_completed_label}
                    </span>
                  </div>

                  {path.description && (
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.8rem",
                        color: "var(--on-surface-var)",
                        marginBottom: 8,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {path.description}
                    </p>
                  )}

                  {/* Progress bar — always 100% */}
                  <div
                    style={{
                      height: 4,
                      borderRadius: 999,
                      background: "var(--surface-container-high)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: "100%",
                        borderRadius: 999,
                        background: "#059669",
                      }}
                    />
                  </div>
                </div>

                {/* Nodes count + chevron */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 4,
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      color: "#059669",
                    }}
                  >
                    {path.nodes.length} {t.vault_nodes}
                  </span>
                  <ArrowRight
                    size={16}
                    style={{ color: "var(--outline-variant)" }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div
            className="glass-panel"
            style={{
              padding: "4rem 2rem",
              textAlign: "center",
              borderRadius: "var(--radius-xl)",
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "24px",
                background: "var(--surface-container-high)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--outline)",
                margin: "0 auto 1.5rem",
              }}
            >
              <Lock size={32} />
            </div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1.25rem",
                color: "var(--on-surface)",
                marginBottom: "0.5rem",
              }}
            >
              {t.vault_locked_title}
            </h3>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                color: "var(--on-surface-var)",
                maxWidth: 400,
                margin: "0 auto",
              }}
            >
              {t.vault_locked_desc}
            </p>
            <div
              style={{
                marginTop: "2.5rem",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "100px",
                  background: "rgba(0,195,237,0.06)",
                  border: "1px solid rgba(0,195,237,0.1)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Sparkles size={14} style={{ color: "var(--primary)" }} />
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "var(--primary)",
                    textTransform: "uppercase",
                  }}
                >
                  {t.vault_explore_cta}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
