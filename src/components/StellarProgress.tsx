import { motion } from "motion/react";
import {
  Zap,
  Sparkles,
  Play,
  Star,
  MapPin,
  BookOpen,
  Video,
  Headphones,
  ScrollText,
  BookOpenCheck,
  LayoutGrid,
  Layers,
  CheckCircle2,
  Lock,
  Compass,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { LearningPath, LearningNode } from "../types";
import { translations, Language } from "../translations";

interface StellarProgressProps {
  learningPaths: LearningPath[];
  onNavigateToMap?: () => void;
  language?: Language;
}

// ── Icon helper ────────────────────────────────────────────────
const NodeIcon = ({ type, size = 16 }: { type: string; size?: number }) => {
  switch (type) {
    case "video":
      return <Video size={size} />;
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

const translateNodeType = (type: string, t: any) => {
  const key = `type_${type}` as keyof typeof t;
  return t[key] || type;
};

// ── Derive stats from all paths ────────────────────────────────
function deriveStats(paths: LearningPath[]) {
  const allNodes: (LearningNode & { mapName: string })[] = paths.flatMap((p) =>
    p.nodes.map((n) => ({ ...n, mapName: p.name })),
  );

  const totalNodes = allNodes.length;
  const completedNodes = allNodes.filter((n) => n.status === "completed");
  const inProgressNodes = allNodes.filter((n) => n.status === "in-progress");

  // Overall progress: average of all node progress values
  const overallProgress =
    totalNodes > 0
      ? Math.round(
          allNodes.reduce((acc, n) => acc + (n.progress || 0), 0) / totalNodes,
        )
      : 0;

  // Active node: first in-progress node across all maps
  const activeNode = inProgressNodes[0] ?? null;
  const activeNodeMapName = activeNode
    ? (paths.find((p) => p.nodes.some((n) => n.id === activeNode.id))?.name ??
      "")
    : "";

  // Next quest: first unexplored node unblocked by prerequisites
  let nextQuest: (LearningNode & { mapName: string }) | null = null;
  for (const path of paths) {
    if (nextQuest) break;
    for (const node of path.nodes) {
      if (node.status !== "unexplored" && node.status !== "locked") continue;
      // Check if any predecessor is blocking
      const predecessors = path.nodes.filter((n) =>
        (n.connections || []).some((id) => String(id) === String(node.id)),
      );
      const isBlocked = predecessors.some(
        (p) => p.status !== "completed" && (p.progress ?? 0) < 100,
      );
      if (!isBlocked) {
        nextQuest = { ...node, mapName: path.name };
        break;
      }
    }
  }

  // Recent syncs: completed nodes, most recently updated
  // We don't have timestamps, so we take completed nodes in order from all paths
  const recentSyncs = completedNodes.slice(0, 5);

  // Distribution: per map, average progress
  const distribution = paths.map((p, i) => {
    const avg =
      p.nodes.length > 0
        ? Math.round(
            p.nodes.reduce((a, n) => a + (n.progress || 0), 0) / p.nodes.length,
          )
        : 0;
    const colors = [
      "var(--primary)",
      "var(--primary-fixed)",
      "#635bde",
      "var(--tertiary)",
      "#f59e0b",
      "#10b981",
    ];
    return { name: p.name, value: avg, color: colors[i % colors.length] };
  });

  // Chart: per map as bar, showing map completion %
  const chartData = paths.map((p, i) => {
    const completed = p.nodes.filter((n) => n.status === "completed").length;
    const pct =
      p.nodes.length > 0 ? Math.round((completed / p.nodes.length) * 100) : 0;
    return {
      name: p.name.length > 10 ? p.name.slice(0, 10) + "…" : p.name,
      value: pct,
      active: i === 0,
    };
  });

  return {
    totalNodes,
    completedNodes: completedNodes.length,
    inProgressCount: inProgressNodes.length,
    overallProgress,
    activeNode,
    activeNodeMapName,
    nextQuest,
    recentSyncs,
    distribution,
    chartData,
  };
}

export const StellarProgress = ({
  learningPaths,
  onNavigateToMap,
  language = "es",
}: StellarProgressProps) => {
  const stats = deriveStats(learningPaths);
  const t = translations[language];

  const hasData = learningPaths.length > 0;

  // Empty state
  if (!hasData) {
    return (
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "4rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "var(--primary-container)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--primary)",
          }}
        >
          <Compass size={36} />
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "2rem",
            color: "var(--on-surface)",
            letterSpacing: "-0.03em",
          }}
        >
          {t.dash_no_path}
        </h2>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "1rem",
            color: "var(--on-surface-var)",
            maxWidth: 380,
          }}
        >
          {t.dash_overall_empty}
        </p>
        {onNavigateToMap && (
          <button
            onClick={onNavigateToMap}
            className="btn-primary"
            style={{ borderRadius: "100px", padding: "0.875rem 2.5rem" }}
          >
            <Play size={15} /> {t.dash_view_map}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="dash-container">
      {/* Header */}
      <div className="dash-header flex-between mobile-stack" style={{ gap: "1.5rem", alignItems: "flex-start" }}>
        <div>
          <div className="flex-start" style={{ gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span className="live-dot" />
            <span className="section-badge mb-0 text-[0.65rem] py-1">
              {t.dash_sync_status}
            </span>
          </div>
          <h2 className="dash-title">
            {t.dash_welcome}
          </h2>
          <p className="section-description mb-0 mt-2">
            {t.dash_tagline
              .replace("{n}", String(learningPaths.length))
              .replace(
                "{maps}",
                learningPaths.length === 1
                  ? language === "es"
                    ? "mapa"
                    : "map"
                  : language === "es"
                    ? "mapas"
                    : "maps",
              )}
          </p>
        </div>

        {/* Stats badge */}
        <div className="card flex-start" style={{ gap: "1rem", padding: "1rem 1.5rem", flexShrink: 0 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, var(--primary) 0%, var(--primary-fixed) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Zap size={20} color="white" />
          </div>
          <div>
            <div className="stat-label mb-0.5 uppercase tracking-widest text-[0.6rem]">
              {t.dash_overview}
            </div>
            <div className="stat-value text-primary">
              {stats.overallProgress}%
            </div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="dash-grid">
        {/* Left col */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          {/* Map Progress Chart */}
          <div className="card">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <h3 className="dash-card-title">
                  {t.dash_map_completion}
                </h3>
                <p className="dash-card-desc">
                  {t.dash_chart_desc}
                </p>
              </div>
            </div>

            <div style={{ height: 200 }}>
              {stats.chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.chartData} barCategoryGap="30%">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(42,47,50,0.05)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontFamily: "var(--font-sans)",
                        fontSize: 11,
                        fill: "var(--on-surface-var)",
                      }}
                    />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip
                      formatter={(v: any) => [`${v}%`, t.dash_map_completion]}
                      contentStyle={{
                        background: "white",
                        border: "none",
                        borderRadius: 12,
                        boxShadow: "var(--shadow-float)",
                        fontFamily: "var(--font-sans)",
                      }}
                      cursor={{ fill: "rgba(0,100,123,0.05)" }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 4, 4]}>
                      {stats.chartData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={
                            entry.active
                              ? "url(#activeGrad)"
                              : "var(--surface-container-high)"
                          }
                        />
                      ))}
                    </Bar>
                    <defs>
                      <linearGradient
                        id="activeGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="var(--primary-fixed)" />
                        <stop offset="100%" stopColor="var(--primary)" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--on-surface-var)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.8rem",
                  }}
                >
                  {t.map_no_maps}
                </div>
              )}
            </div>

            {/* Stats row */}
            <div className="responsive-grid-3 mt-5 pt-5 border-t border-[var(--surface-container-high)]">
              {[
                {
                  label: t.dash_total_nodes,
                  value: String(stats.totalNodes),
                  color: "var(--on-surface)",
                },
                {
                  label: t.dash_completed_nodes,
                  value: String(stats.completedNodes),
                  color: "var(--primary-fixed)",
                },
                {
                  label: t.dash_active_node,
                  value: String(stats.inProgressCount),
                  color: "#f59e0b",
                },
              ].map((s) => (
                <div key={s.label}>
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Two-col row: Next Quest + Recent Syncs */}
          <div
            className="responsive-grid-2"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.4fr",
              gap: "1.25rem",
            }}
          >
            {/* Next Quest */}
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "1.25rem 1.5rem 0" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  <Sparkles
                    size={14}
                    style={{ color: "var(--primary-fixed)" }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "var(--text-title-md)",
                      color: "var(--on-surface)",
                    }}
                  >
                    {t.dash_next_quest}
                  </span>
                </div>
              </div>
              <div
                style={{
                  position: "relative",
                  height: 160,
                  background:
                    "linear-gradient(135deg, #0a1628 0%, #0f2744 60%, #1a1a2e 100%)",
                  margin: "0 1px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(ellipse at 30% 50%, rgba(0,195,237,0.15) 0%, transparent 60%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 16,
                    left: 16,
                    right: 16,
                  }}
                >
                  {stats.nextQuest ? (
                    <>
                      <div className="quest-label">
                        {stats.nextQuest.mapName}
                      </div>
                      <div className="quest-title">
                        {stats.nextQuest.title}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.7rem",
                          color: "rgba(255,255,255,0.55)",
                          textTransform: "capitalize",
                        }}
                      >
                        {translateNodeType(stats.nextQuest.type, t)} ·{" "}
                        {stats.nextQuest.location || t.location_general}
                      </div>
                    </>
                  ) : (
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "1rem",
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
                      {t.dash_all_explored}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ padding: "1rem 1.5rem 1.5rem" }}>
                <button
                  className="btn-primary"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    fontSize: "0.875rem",
                    opacity: stats.nextQuest ? 1 : 0.4,
                    cursor: stats.nextQuest ? "pointer" : "default",
                  }}
                  onClick={() => stats.nextQuest && onNavigateToMap?.()}
                  disabled={!stats.nextQuest}
                >
                  <Play size={14} /> {t.dash_initiate}
                </button>
              </div>
            </div>

            {/* Recent Synchronizations — completed nodes */}
            <div className="card">
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "var(--text-title-md)",
                  color: "var(--on-surface)",
                  marginBottom: "1.25rem",
                }}
              >
                {t.dash_recent_syncs}
              </h3>
              {stats.recentSyncs.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  {stats.recentSyncs.map((node) => (
                    <div
                      key={node.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: "rgba(16, 185, 129, 0.12)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          color: "#10b981",
                        }}
                      >
                        <CheckCircle2 size={16} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontWeight: 600,
                            fontSize: "var(--text-body-md)",
                            color: "var(--on-surface)",
                            marginBottom: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {node.title}
                        </div>
                        <div
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "0.72rem",
                            color: "var(--on-surface-var)",
                          }}
                        >
                          {node.mapName}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div
                          style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 800,
                            fontSize: "var(--text-body-md)",
                            color: "#10b981",
                          }}
                        >
                          ✓ {t.node_done}
                        </div>
                        <div
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "0.6rem",
                            textTransform: "capitalize",
                            letterSpacing: "0.1em",
                            color: "var(--on-surface-var)",
                          }}
                        >
                          {translateNodeType(node.type, t)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "1.5rem 0",
                    color: "var(--on-surface-var)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.82rem",
                    textAlign: "center",
                  }}
                >
                  <Star size={24} style={{ opacity: 0.3 }} />
                  {t.dash_empty_syncs}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right col */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          {/* Active Node */}
          <div className="card">
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "1rem",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.6rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: "var(--on-surface-var)",
                }}
              >
                {t.dash_active_node}
              </span>
            </div>
            {stats.activeNode ? (
              <>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "var(--radius-md)",
                    background: "rgba(245, 158, 11, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem",
                    color: "#f59e0b",
                  }}
                >
                  <NodeIcon type={stats.activeNode.type} size={20} />
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.6rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--on-surface-var)",
                    marginBottom: 4,
                  }}
                >
                  {stats.activeNodeMapName}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "var(--text-title-md)",
                    color: "var(--on-surface)",
                    marginBottom: "0.875rem",
                  }}
                >
                  {stats.activeNode.title}
                </h3>
                <div
                  className="progress-track"
                  style={{ marginBottom: "0.5rem" }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.activeNode.progress}%` }}
                    transition={{ duration: 1.2, ease: "circOut" }}
                    className="progress-fill"
                  />
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.7rem",
                      color: "var(--on-surface-var)",
                    }}
                  >
                    {t.map_progress}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.7rem",
                      color: "var(--on-surface-var)",
                      fontWeight: 700,
                    }}
                  >
                    {stats.activeNode.progress}%
                  </span>
                </div>
              </>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "1rem 0",
                  color: "var(--on-surface-var)",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.82rem",
                  textAlign: "center",
                }}
              >
                <Sparkles size={24} style={{ opacity: 0.3 }} />
                {t.dash_no_active_node}
              </div>
            )}
          </div>

          {/* Deep State */}
          <div
            className="card"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.6rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "var(--on-surface-var)",
                  marginBottom: 6,
                }}
              >
                {t.dash_sync_state_label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "var(--text-title-lg)",
                  color: "var(--on-surface)",
                }}
              >
                {stats.completedNodes > 0
                  ? t.dash_state_calibrated
                  : t.dash_state_initializing}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.72rem",
                  color: "var(--on-surface-var)",
                  marginTop: 2,
                }}
              >
                {stats.completedNodes} / {stats.totalNodes}{" "}
                {t.dash_nodes_synced}
              </div>
            </div>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                border: "2px solid var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary)",
                background: "var(--primary-container)",
              }}
            >
              <MapPin size={22} />
            </div>
          </div>

          {/* Distribution — per map */}
          <div className="card">
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "var(--text-title-md)",
                color: "var(--on-surface)",
                marginBottom: "1.25rem",
              }}
            >
              {t.dash_map_completion}
            </h3>
            {stats.distribution.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {stats.distribution.map((map) => (
                  <div key={map.name}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.8rem",
                          color: "var(--on-surface-var)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "70%",
                        }}
                      >
                        {map.name}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          color: "var(--on-surface)",
                        }}
                      >
                        {map.value}%
                      </span>
                    </div>
                    <div className="progress-track">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${map.value}%` }}
                        transition={{
                          duration: 1.2,
                          ease: "circOut",
                          delay: 0.3,
                        }}
                        style={{
                          height: "100%",
                          borderRadius: 9999,
                          background: map.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  color: "var(--on-surface-var)",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.8rem",
                  textAlign: "center",
                }}
              >
                {t.map_no_maps}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
