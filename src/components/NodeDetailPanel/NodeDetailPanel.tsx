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
import { LearningNode } from "../../types/types";
import { learningService } from "../../services/api";
import { translations, Language } from "../../constants/translations";
import { cn } from "../../lib/utils";
import "./NodeDetailPanel.css";

interface NodeDetailPanelProps {
  selectedNode: LearningNode;
  allNodes: LearningNode[];
  onClose: () => void;
  theme?: "light" | "dark";
  onUpdate?: (nodeId: string, updates: any) => void;
  mapId: string;
  language?: Language;
  key?: string;
  standalone?: boolean;
}

export const NodeDetailPanel = ({
  selectedNode,
  allNodes,
  onClose,
  theme = "light",
  onUpdate,
  mapId,
  language = "es",
  standalone = false,
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
      const plan = await learningService.generateNodePlan(
        selectedNode,
        mapId,
        language,
      );
      setStudyPlan(plan);
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
    if (onUpdate && !showLocked) fetchPlan();
  };

  useEffect(() => {
    setLocalProgress(selectedNode.progress || 0);
    setStudyPlan(selectedNode.studyPlan || null);
    const hasSteps =
      selectedNode.studyPlan?.steps && selectedNode.studyPlan.steps.length > 0;
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
    const newProgress = Math.round((completedCount / newSteps.length) * 100);
    setLocalProgress(newProgress);
    const newPlan = { ...studyPlan, steps: newSteps };
    setStudyPlan(newPlan);
    onUpdate(selectedNode.id, {
      studyPlan: newPlan,
      progress: newProgress,
      status: newProgress === 100 ? "completed" : "in-progress",
    });
  };

  const predecessors = allNodes.filter((n) =>
    (n.connections || []).some((id) => String(id) === String(selectedNode.id)),
  );
  const isLockedByDependency = predecessors.some(
    (p) => p.status !== "completed" && (p.progress ?? 0) < 100,
  );
  const showLocked = isLockedByDependency;

  // Dynamic status color for the status meta card
  const statusColor =
    localProgress >= 100 || selectedNode.status === "completed"
      ? "#059669"
      : localProgress > 0 || selectedNode.status === "in-progress"
        ? "#d97706"
        : "var(--on-surface-var)";

  return (
    <div
      className={
        standalone
          ? "relative z-50 w-full pointer-events-none"
          : "absolute top-0 right-0 z-50 h-full pointer-events-none"
      }
      style={{ width: standalone ? "100%" : 540 }}
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
        className="glass-panel pointer-events-auto h-full relative overflow-hidden flex flex-col rounded-[var(--radius-lg)] text-left ndp-panel"
        style={{
          margin: standalone ? "auto" : "auto",
          width: standalone ? "100%" : 516,
        }}
      >
        <div className="flex-1 overflow-y-auto overflow-hidden">
          {/* Glow orb */}
          <div className="absolute -top-16 -right-16 w-[200px] h-[200px] rounded-full pointer-events-none ndp-glow" />

          {/* Image */}
          {selectedNode.image && (
            <div className="ndp-image">
              <img src={selectedNode.image} alt={selectedNode.title} />
              <div className="ndp-image-fade" />
            </div>
          )}

          {/* Header */}
          <div className="p-6">
            <div className="flex justify-between items-start mb-5 relative z-10">
              <div className="ndp-header-meta">
                <div className="ndp-icon">
                  {getNodeIcon(selectedNode.type, 19)}
                </div>
                <div>
                  <div className="ndp-type-label">
                    {translateNodeType(selectedNode.type)}
                  </div>
                  <div className="ndp-source">{selectedNode.source}</div>
                </div>
              </div>
              <button onClick={onClose} className="ndp-close">
                <X size={15} />
              </button>
            </div>

            {/* Title */}
            <h3 className="ndp-title">{selectedNode.title}</h3>

            {/* Description */}
            <div className="ndp-desc">
              {selectedNode.description ||
                t.node_desc_placeholder.replace("{title}", selectedNode.title)}
            </div>

            {/* Link */}
            {selectedNode.link && (
              <div className="ndp-link-wrapper">
                <a
                  href={selectedNode.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ndp-link"
                >
                  <Zap size={13} fill="currentColor" />
                  <span className="ndp-link-text">{selectedNode.link}</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            )}

            {/* Meta grid */}
            <div className="ndp-meta-grid">
              <div className="ndp-meta-card">
                <div className="ndp-meta-label">
                  <Target size={11} /> {t.node_location}
                </div>
                <div className="ndp-meta-value">
                  {selectedNode.location || t.location_general}
                </div>
              </div>
              <div className="ndp-meta-card">
                <div className="ndp-meta-label">
                  <Clock size={11} /> {t.node_status}
                </div>
                <div className="ndp-meta-value" style={{ color: statusColor }}>
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

            {/* Progress bar */}
            {(localProgress > 0 || selectedNode.status === "in-progress") && (
              <div className="ndp-progress-wrapper">
                <div className="ndp-progress-header">
                  <span>{t.node_module_progress}</span>
                  <span className="ndp-progress-pct">{localProgress}%</span>
                </div>
                <div className="ndp-progress-track">
                  <motion.div
                    className="ndp-progress-fill"
                    initial={false}
                    animate={{ width: `${localProgress}%` }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}

            {/* Study plan */}
            <AnimatePresence>
              {studyPlan && (
                <motion.div
                  className="ndp-plan-wrapper"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                >
                  <div className="ndp-plan-header">
                    <Sparkles size={16} className="text-amber-500" />
                    <span className="ndp-plan-label">{t.node_planning}</span>
                  </div>
                  <div className="ndp-steps-list">
                    {studyPlan.steps.map((step: any, idx: number) => (
                      <div key={idx} className="ndp-step">
                        <div
                          className={cn(
                            "ndp-step-checkbox",
                            step.isCompleted && "checked",
                          )}
                          onClick={() => toggleStep(idx)}
                        >
                          {step.isCompleted && (
                            <CheckCircle2 size={13} strokeWidth={3} />
                          )}
                        </div>
                        <div
                          className={cn(
                            "ndp-step-title",
                            step.isCompleted && "completed",
                          )}
                          onClick={() => toggleStep(idx)}
                        >
                          {step.stage}
                        </div>
                        <div
                          className={cn(
                            "ndp-step-action",
                            step.isCompleted && "completed",
                          )}
                        >
                          <span
                            className={cn(
                              "ndp-step-action-keyword",
                              step.isCompleted && "completed",
                            )}
                          >
                            {t.node_action}:
                          </span>{" "}
                          {step.action}
                        </div>
                        <div className="ndp-step-footer">
                          <span className="ndp-step-focus">{step.focus}</span>
                          <span
                            className={cn(
                              "ndp-step-time",
                              step.isCompleted && "completed",
                            )}
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
                  className="ndp-loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <div className="ndp-loading-text">{t.loading_map}</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Manual progress / Start button */}
            {isRegisteringProgress ? (
              <div className="ndp-manual-box">
                <div className="ndp-manual-header">
                  <span className="ndp-manual-label">
                    {t.node_manual_progress}
                  </span>
                  <span className="ndp-manual-pct">{localProgress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localProgress}
                  className="ndp-range"
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setLocalProgress(val);
                    const updates: any = { progress: val };
                    if (val >= 100) updates.status = "completed";
                    else updates.status = "in-progress";
                    onUpdate?.(selectedNode.id, updates);
                  }}
                />
                <div className="ndp-manual-actions">
                  <button
                    onClick={() => setIsRegisteringProgress(false)}
                    className="btn-primary ndp-done-btn"
                  >
                    {t.node_done}
                  </button>
                </div>
              </div>
            ) : selectedNode.status === "completed" ||
              selectedNode.status === "in-progress" ||
              isLoadingPlan ? null : (
              <button
                onClick={() => {
                  if (onUpdate && !showLocked) handleStartLearning();
                }}
                disabled={showLocked}
                className={cn(
                  "btn-base btn-md ndp-start-btn",
                  showLocked ? "btn-secondary" : "btn-primary",
                )}
                style={{
                  cursor: showLocked ? "not-allowed" : "pointer",
                  opacity: showLocked ? 0.8 : 1,
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
          </div>
        </div>
      </motion.div>
    </div>
  );
};
