import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Search,
  ChevronRight,
  CheckCircle2,
  Clock,
  Lock,
  Circle,
  BookOpen,
  FileText,
  Video,
  Headphones,
  GraduationCap,
  BookMarked,
} from "lucide-react";
import { LearningPath, LearningNode, ResourceType } from "../../types/types";
import { translations, Language } from "../../constants/translations";

interface NodesSectionProps {
  learningPaths: LearningPath[];
  language: Language;
  onNavigateToNode: (pathId: string) => void;
}

type StatusFilter = "all" | LearningNode["status"];

const TYPE_ICONS: Record<ResourceType, React.ReactNode> = {
  book: <BookOpen size={20} />,
  chapter: <BookMarked size={20} />,
  article: <FileText size={20} />,
  video: <Video size={20} />,
  podcast: <Headphones size={20} />,
  course: <GraduationCap size={20} />,
};

const STATUS_COLORS: Record<LearningNode["status"], string> = {
  completed: "#059669",
  "in-progress": "var(--primary)",
  unexplored: "var(--outline)",
  locked: "var(--outline-variant)",
};

export const NodesSection = ({
  learningPaths,
  language,
  onNavigateToNode,
}: NodesSectionProps) => {
  const t = translations[language];
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const allNodes = learningPaths.flatMap((path) =>
    path.nodes.map((node) => ({
      ...node,
      pathId: path.id,
      mapName: path.name,
    })),
  );

  const filteredNodes = allNodes.filter((node) => {
    const matchesSearch =
      node.title.toLowerCase().includes(search.toLowerCase()) ||
      node.mapName.toLowerCase().includes(search.toLowerCase()) ||
      node.type.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || node.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusFilters: { key: StatusFilter; label: string }[] = [
    { key: "all", label: t.nodes_filter_all },
    { key: "in-progress", label: t.node_in_progress },
    { key: "completed", label: t.node_complete },
    { key: "unexplored", label: t.node_not_started },
    { key: "locked", label: t.node_locked },
  ];

  const statusCounts = allNodes.reduce<Record<string, number>>((acc, node) => {
    acc[node.status] = (acc[node.status] || 0) + 1;
    return acc;
  }, {});

  const getStatusIcon = (status: LearningNode["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 size={12} />;
      case "in-progress":
        return <Clock size={12} />;
      case "locked":
        return <Lock size={12} />;
      default:
        return <Circle size={12} />;
    }
  };

  const getStatusLabel = (status: LearningNode["status"]) => {
    switch (status) {
      case "completed":
        return t.node_complete;
      case "in-progress":
        return t.node_in_progress;
      case "locked":
        return t.node_locked;
      default:
        return t.node_not_started;
    }
  };

  return (
    <motion.div
      key="nodes"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-7xl mx-auto px-6 py-8"
    >
      <div className="flex flex-col gap-6">
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
            {t.nav_nodes}{" "}
            <span
              style={{
                color: "var(--primary)",
                fontSize: "0.9rem",
                verticalAlign: "middle",
                marginLeft: 8,
              }}
            >
              {allNodes.length} Total
            </span>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              color: "var(--on-surface-var)",
              marginTop: 4,
            }}
          >
            {t.nodes_subtitle}
          </p>
        </div>

        {/* Search */}
        <div
          className="glass-panel"
          style={{
            padding: "0.5rem 1rem",
            display: "flex",
            alignItems: "center",
            gap: 12,
            borderRadius: "var(--radius-lg)",
          }}
        >
          <Search size={18} style={{ color: "var(--outline)" }} />
          <input
            type="text"
            placeholder={t.nodes_search_placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              padding: "0.75rem 0",
              fontFamily: "var(--font-sans)",
              fontSize: "0.95rem",
              color: "var(--on-surface)",
            }}
          />
        </div>

        {/* Status filter pills */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {statusFilters.map(({ key, label }) => {
            const count =
              key === "all" ? allNodes.length : statusCounts[key] || 0;
            const isActive = statusFilter === key;
            return (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "0.35rem 0.85rem",
                  borderRadius: 999,
                  border: isActive
                    ? "1px solid var(--primary)"
                    : "1px solid var(--outline-variant)",
                  background: isActive ? "rgba(0,195,237,0.1)" : "transparent",
                  color: isActive ? "var(--primary)" : "var(--on-surface-var)",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {label}
                <span
                  style={{
                    background: isActive
                      ? "rgba(0,195,237,0.15)"
                      : "var(--surface-container-high)",
                    color: isActive ? "var(--primary)" : "var(--outline)",
                    borderRadius: 999,
                    padding: "1px 7px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Node list */}
        <div className="grid gap-3">
          {filteredNodes.length > 0 ? (
            filteredNodes.map((node, i) => (
              <motion.div
                key={`${node.pathId}-${node.id}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="glass-panel hover-card"
                onClick={() => onNavigateToNode(node.pathId)}
                style={{
                  padding: "1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1.25rem",
                  cursor: "pointer",
                }}
              >
                {/* Type icon */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "12px",
                    background: "var(--primary-container)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--primary)",
                    flexShrink: 0,
                  }}
                >
                  {TYPE_ICONS[node.type]}
                </div>

                {/* Main content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                      flexWrap: "wrap",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        color: "var(--on-surface)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {node.title}
                    </h3>
                    <span
                      style={{
                        fontSize: "0.6rem",
                        padding: "2px 8px",
                        borderRadius: 99,
                        background: "var(--surface-container-high)",
                        color: "var(--outline)",
                        textTransform: "uppercase",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {node.type}
                    </span>
                  </div>

                  {/* Map name + status */}
                  <div
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.78rem",
                      color: "var(--on-surface-var)",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 8,
                    }}
                  >
                    <span>
                      {t.nodes_map_label}: {node.mapName}
                    </span>
                    <span
                      style={{
                        color: STATUS_COLORS[node.status],
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      {getStatusIcon(node.status)}
                      {getStatusLabel(node.status)}
                    </span>
                  </div>

                  {/* Progress bar */}
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
                        width: `${node.progress}%`,
                        borderRadius: 999,
                        background:
                          node.status === "completed"
                            ? "#059669"
                            : "var(--primary)",
                        transition: "width 0.4s ease",
                      }}
                    />
                  </div>
                </div>

                {/* Progress % + chevron */}
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
                      color:
                        node.status === "completed"
                          ? "#059669"
                          : "var(--primary)",
                    }}
                  >
                    {node.progress}%
                  </span>
                  <ChevronRight
                    size={16}
                    style={{ color: "var(--outline-variant)" }}
                  />
                </div>
              </motion.div>
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "4rem 0",
                color: "var(--on-surface-var)",
                fontFamily: "var(--font-sans)",
              }}
            >
              {t.nodes_empty}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
