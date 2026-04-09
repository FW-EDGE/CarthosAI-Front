import React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Play,
  Headphones,
  ScrollText,
  BookOpen,
  BookOpenCheck,
  LayoutGrid,
  Layers,
  Target,
  Clock,
  Lock,
  CheckCircle2,
  Zap,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { LearningNode } from "../types";
import { generateNodePlan } from "../services/chatGptService";
import { translations, Language } from "../translations";

// Helper is now inside component for better HMR consistency

interface NodeDetailPanelProps {
  selectedNode: LearningNode;
  allNodes: LearningNode[];
  onClose: () => void;
  theme?: "light" | "dark";
  onUpdate?: (nodeId: string, updates: any) => void;
  mapId: string;
  language?: Language;
  key?: string;
}

export const NodeDetailPanel = ({
  selectedNode,
  allNodes,
  onClose,
  theme = "light",
  onUpdate,
  mapId,
  language = "es",
}: NodeDetailPanelProps) => {
  const isDark = theme === "dark";
  const t = translations[language];

  const getNodeIcon = (type: string, size = 18) => {
    switch (type) {
      case "video":
        return <Play size={size} />;
      case "podcast":
        return <Headphones size={size} />;
      case "article":
        return <ScrollText size={size} />;
      case "book":
        return <BookOpen size={size} />;
      case "chapter":
        return <BookOpenCheck size={size} />;
      case "course":
        return <LayoutGrid size={size} />;
      default:
        return <Layers size={size} />;
    }
  };

  const translateNodeType = (type: string) => {
    const key = `type_${type}` as keyof typeof t;
    return (t as any)[key] || type;
  };

  const [isRegisteringProgress, setIsRegisteringProgress] = useState(false);
  const [localProgress, setLocalProgress] = useState(
    selectedNode.progress || 0,
  );
  const [studyPlan, setStudyPlan] = useState<any>(
    selectedNode.studyPlan || null,
  );
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);

  const fetchPlan = async () => {
    const hasValidPlan = studyPlan?.steps && studyPlan.steps.length > 0;
    if (hasValidPlan || isLoadingPlan) return;
    setIsLoadingPlan(true);
    try {
      // POST para generar el plan de estudio
      const plan = await generateNodePlan(selectedNode, mapId, language);
      setStudyPlan(plan);

      // PUT (onUpdate) una vez completado, actualizando TODO el estado de golpe
      onUpdate?.(selectedNode.id, {
        status: "in-progress",
        progress: 0,
        studyPlan: plan,
      });
    } catch (error) {
      console.error("Failed to load study plan:", error);
    } finally {
      setIsLoadingPlan(false);
    }
  };

  const handleStartLearning = async () => {
    if (onUpdate && !showLocked) {
      fetchPlan();
    }
  };

  // Re-sync local progress and study plan
  useEffect(() => {
    setLocalProgress(selectedNode.progress || 0);
    setStudyPlan(selectedNode.studyPlan || null);

    const hasSteps =
      selectedNode.studyPlan?.steps && selectedNode.studyPlan.steps.length > 0;

    // Auto-fetch if in progress but no valid plan (survives remounts during sync)
    if (selectedNode.status === "in-progress" && !hasSteps && !isLoadingPlan) {
      console.log("Auto-firing plan fetch for node:", selectedNode.id);
      fetchPlan();
    }
  }, [
    selectedNode.id,
    selectedNode.status,
    JSON.stringify(selectedNode.studyPlan),
  ]);

  const toggleStep = (idx: number) => {
    if (!studyPlan || !onUpdate) return;

    const newSteps = [...studyPlan.steps];
    newSteps[idx].isCompleted = !newSteps[idx].isCompleted;

    const completedCount = newSteps.filter((s: any) => s.isCompleted).length;
    const totalSteps = newSteps.length;
    let newProgress = Math.round((completedCount / totalSteps) * 100);

    // IMPORTANT: Update localProgress too for real-time reactivity in the modal displays
    setLocalProgress(newProgress);

    const newPlan = { ...studyPlan, steps: newSteps };
    setStudyPlan(newPlan);

    onUpdate(selectedNode.id, {
      studyPlan: newPlan,
      progress: newProgress,
      status: newProgress === 100 ? "completed" : "in-progress",
    });
  };

  // Dependency Rule: Find all nodes that are mandatory before this one.
  // Predecessors are nodes that point TO this node in their 'connections' array.
  const predecessors = allNodes.filter((n) =>
    (n.connections || []).some((id) => String(id) === String(selectedNode.id)),
  );

  // A node is locked if any predecessor is not yet at 100% progress or status 'completed'
  const isLockedByDependency = predecessors.some(
    (p) => p.status !== "completed" && (p.progress ?? 0) < 100,
  );

  // showLocked depends strictly on predecessors' completion
  const showLocked = isLockedByDependency;

  return (
    <div
      className="absolute top-0 right-0 z-50 h-full pointer-events-none"
      style={{ width: 540 }}
    >
      <motion.div
        initial={{ opacity: 0, x: 40, scale: 1 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{
          opacity: 0,
          x: 60,
          transition: { duration: 0.25, ease: "easeIn" },
        }}
        transition={{ type: "spring", damping: 28, stiffness: 220 }}
        className="glass-panel pointer-events-auto h-full relative overflow-hidden flex flex-col"
        style={{
          margin: "12px",
          width: 516,
          padding: "2rem",
          borderRadius: "var(--radius-lg)",
          boxShadow: isDark
            ? "0 20px 80px rgba(0,0,0,0.6)"
            : "0 20px 80px rgba(0,100,123,0.15)",
          border: isDark
            ? "1px solid rgba(255,255,255,0.05)"
            : "1px solid rgba(0,100,123,0.05)",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -64,
            right: -64,
            width: 200,
            height: 200,
            background: isDark
              ? "radial-gradient(circle, rgba(0,195,237,0.08) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(0,195,237,0.12) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        {selectedNode.image && (
          <div
            style={{
              width: "calc(100% + 4rem)",
              height: "180px",
              minHeight: "180px",
              margin: "-2rem -2rem 1.5rem -2rem",
              position: "relative",
              overflow: "hidden",
              borderBottom: "1px solid var(--surface-container-high)",
            }}
          >
            <img
              src={selectedNode.image}
              alt={selectedNode.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "40%",
                background: isDark
                  ? "linear-gradient(to top, rgba(15,20,22,0.95), transparent)"
                  : "linear-gradient(to top, rgba(255,255,255,0.9), transparent)",
              }}
            />
          </div>
        )}

        <div className="flex justify-between items-start mb-5 relative z-10">
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "var(--radius-md)",
                background: "var(--primary-container)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary)",
                boxShadow: "0 4px 12px rgba(0, 100, 123, 0.08)",
              }}
            >
              {getNodeIcon(selectedNode.type, 19)}
            </div>
            <div>
              <div
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "0.6rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                  color: "var(--on-surface-var)",
                  marginBottom: 3,
                }}
              >
                {translateNodeType(selectedNode.type)}
              </div>
              <div
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "var(--on-surface)",
                }}
              >
                {selectedNode.source}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "none",
              background: "var(--surface-container)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--on-surface-var)",
              transition: "background 0.2s ease",
            }}
          >
            <X size={15} />
          </button>
        </div>

        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "1.25rem",
            color: "var(--on-surface)",
            marginBottom: "0.75rem",
            lineHeight: 1.25,
            position: "relative",
            zIndex: 1,
            letterSpacing: "-0.01em",
          }}
        >
          {selectedNode.title}
        </h3>

        <div
          style={{
            fontFamily: "Manrope, sans-serif",
            fontSize: "0.82rem",
            color: "var(--on-surface-var)",
            lineHeight: 1.6,
            marginBottom: "1.5rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          {selectedNode.description ||
            t.node_desc_placeholder.replace("{title}", selectedNode.title)}
        </div>

        {selectedNode.link && (
          <div
            style={{ marginBottom: "1.5rem", position: "relative", zIndex: 1 }}
          >
            <a
              href={selectedNode.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "0.625rem 0.875rem",
                background: "rgba(0, 100, 123, 0.04)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--outline-variant)",
                color: "var(--primary)",
                textDecoration: "none",
                fontFamily: "Manrope, sans-serif",
                fontSize: "0.75rem",
                fontWeight: 600,
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(0, 100, 123, 0.08)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(0, 100, 123, 0.04)")
              }
            >
              <Zap size={13} fill="currentColor" />
              <span
                style={{
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {selectedNode.link}
              </span>
              <ArrowRight size={13} />
            </a>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
            marginBottom: "1.25rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              padding: "0.75rem",
              borderRadius: "var(--radius-md)",
              background: "var(--surface-container-low)",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "Manrope, sans-serif",
                fontSize: "0.6rem",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--outline)",
              }}
            >
              <Target size={11} /> {t.node_location}
            </div>
            <div
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "var(--on-surface)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {selectedNode.location || t.location_general}
            </div>
          </div>
          <div
            style={{
              padding: "0.75rem",
              borderRadius: "var(--radius-md)",
              background: "var(--surface-container-low)",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "Manrope, sans-serif",
                fontSize: "0.6rem",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--outline)",
              }}
            >
              <Clock size={11} /> {t.node_status}
            </div>
            <div
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: "0.75rem",
                fontWeight: 700,
                color:
                  localProgress >= 100 || selectedNode.status === "completed"
                    ? "#059669"
                    : localProgress > 0 || selectedNode.status === "in-progress"
                      ? "#d97706"
                      : "var(--on-surface-var)",
                transition: "color 0.2s",
              }}
            >
              {localProgress >= 100 || selectedNode.status === "completed"
                ? t.node_complete
                : localProgress > 0 || selectedNode.status === "in-progress"
                  ? t.node_in_progress
                  : showLocked
                    ? t.node_locked
                    : t.node_not_started}
            </div>
          </div>
        </div>

        {/* Progress Bar (Visible if in progress) */}
        {(localProgress > 0 || selectedNode.status === "in-progress") && (
          <div
            style={{ marginBottom: "1.25rem", position: "relative", zIndex: 1 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 6,
                fontSize: "0.65rem",
                fontWeight: 700,
                color: "var(--outline)",
                textTransform: "uppercase",
              }}
            >
              <span>{t.node_module_progress}</span>
              <span style={{ color: "var(--primary)" }}>{localProgress}%</span>
            </div>
            <div
              style={{
                height: 6,
                width: "100%",
                background: "var(--surface-container-low)",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              <motion.div
                initial={false}
                animate={{ width: `${localProgress}%` }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{
                  height: "100%",
                  background: "var(--primary)",
                  boxShadow: "0 0 10px rgba(0, 195, 237, 0.4)",
                }}
              />
            </div>
          </div>
        )}

        {/* STUDY PLAN SECTION */}
        <AnimatePresence>
          {studyPlan && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              style={{
                marginBottom: "1.5rem",
                borderTop: "1px solid var(--outline-variant)",
                paddingTop: "1.25rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: "1rem",
                }}
              >
                <Sparkles size={16} className="text-amber-500" />
                <span
                  style={{
                    fontFamily: "Manrope, sans-serif",
                    fontWeight: 800,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--on-surface)",
                  }}
                >
                  {t.node_planning}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {studyPlan.steps.map((step: any, idx: number) => (
                  <div
                    key={idx}
                    style={{ position: "relative", paddingLeft: "1.75rem" }}
                  >
                    {/* CHECKBOX CUSTOM */}
                    <div
                      onClick={() => toggleStep(idx)}
                      style={{
                        position: "absolute",
                        left: -2,
                        top: 4,
                        width: 20,
                        height: 20,
                        borderRadius: "6px",
                        border: step.isCompleted
                          ? "none"
                          : "2px solid var(--outline-variant)",
                        background: step.isCompleted
                          ? "var(--primary)"
                          : "transparent",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        boxShadow: step.isCompleted
                          ? "0 4px 12px rgba(0, 195, 237, 0.3)"
                          : "none",
                      }}
                    >
                      {step.isCompleted && (
                        <CheckCircle2 size={13} strokeWidth={3} />
                      )}
                    </div>

                    <div
                      onClick={() => toggleStep(idx)}
                      style={{
                        fontFamily: "Manrope, sans-serif",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        color: step.isCompleted
                          ? "var(--outline)"
                          : "var(--on-surface)",
                        marginBottom: 2,
                        textDecoration: step.isCompleted
                          ? "line-through"
                          : "none",
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                    >
                      {step.stage}
                    </div>
                    <div
                      style={{
                        fontFamily: "Manrope, sans-serif",
                        fontSize: "0.72rem",
                        color: "var(--on-surface-var)",
                        marginBottom: 4,
                        opacity: step.isCompleted ? 0.6 : 1,
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 600,
                          color: step.isCompleted
                            ? "var(--outline)"
                            : "var(--primary)",
                        }}
                      >
                        {t.node_action}:
                      </span>{" "}
                      {step.action}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.65rem",
                          color: "var(--outline)",
                          fontStyle: "italic",
                        }}
                      >
                        {step.focus}
                      </span>
                      <span
                        style={{
                          fontSize: "0.6rem",
                          fontWeight: 800,
                          color: step.isCompleted
                            ? "var(--outline)"
                            : "var(--on-surface-var)",
                          background: isDark
                            ? "rgba(255,255,255,0.05)"
                            : "var(--surface-container-high)",
                          padding: "2px 8px",
                          borderRadius: 4,
                        }}
                      >
                        {step.estimatedTime}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          {(isLoadingPlan ||
            (selectedNode.status === "in-progress" &&
              !(studyPlan?.steps?.length > 0))) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                padding: "1.5rem 0",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: "var(--outline)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {t.loading_map}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isRegisteringProgress ? (
          <div
            style={{
              padding: "1rem",
              background: "var(--surface-container-low)",
              borderRadius: "var(--radius-md)",
              marginBottom: "1rem",
              position: "relative",
              zIndex: 1,
              border: "1px solid var(--primary-var)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.75rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: "var(--on-surface-var)",
                  textTransform: "uppercase",
                }}
              >
                {t.node_manual_progress}
              </span>
              <span
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  color: "var(--primary)",
                }}
              >
                {localProgress}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={localProgress}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setLocalProgress(val);
                // Real-time update to parent for immediate visual feedback
                const updates: any = { progress: val };
                if (val >= 100) updates.status = "completed";
                else updates.status = "in-progress";
                onUpdate?.(selectedNode.id, updates);
              }}
              style={{
                width: "100%",
                accentColor: "var(--primary)",
                marginBottom: "1rem",
                cursor: "pointer",
              }}
            />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => setIsRegisteringProgress(false)}
                className="btn-primary"
                style={{
                  flex: 1,
                  fontSize: "0.75rem",
                  height: "auto",
                  padding: "0.6rem 1.2rem",
                  borderRadius: "100px",
                }}
              >
                {t.node_done}
              </button>
            </div>
          </div>
        ) : /* Main Button logic refined - ONLY show Start Learning or Lock state */
        /* Hide button if already in-progress (user tracks via steps OR is loading plan) */
        selectedNode.status === "completed" ||
          selectedNode.status === "in-progress" ||
          isLoadingPlan ? null : (
          <button
            onClick={() => {
              if (onUpdate && !showLocked) {
                handleStartLearning();
              }
            }}
            disabled={showLocked}
            className={showLocked ? "btn-secondary" : "btn-primary"}
            style={{
              width: "100%",
              position: "relative",
              zIndex: 1,
              cursor: showLocked ? "not-allowed" : "pointer",
              opacity: showLocked ? 0.5 : 1,
              gap: 10,
              transition: "all 0.2s",
            }}
          >
            {showLocked ? (
              <Lock size={15} />
            ) : (
              <Play size={15} fill="currentColor" />
            )}

            {showLocked ? t.node_unlock_prev : t.node_start}

            {!showLocked && <ArrowRight size={15} />}
          </button>
        )}
      </motion.div>
    </div>
  );
};
