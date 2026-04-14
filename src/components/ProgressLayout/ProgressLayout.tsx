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
import { LearningPath, LearningNode } from "../../types/types";
import { translations, Language } from "../../constants/translations";
import "./ProgressLayout.css";
import { div } from "motion/react-client";

interface ProgressLayoutProps {
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

  const overallProgress =
    totalNodes > 0
      ? Math.round(
          allNodes.reduce((acc, n) => acc + (n.progress || 0), 0) / totalNodes,
        )
      : 0;

  const activeNode = inProgressNodes[0] ?? null;
  const activeNodeMapName = activeNode
    ? (paths.find((p) => p.nodes.some((n) => n.id === activeNode.id))?.name ??
      "")
    : "";

  let nextQuest: (LearningNode & { mapName: string }) | null = null;
  for (const path of paths) {
    if (nextQuest) break;
    for (const node of path.nodes) {
      if (node.status !== "unexplored" && node.status !== "locked") continue;
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

  const recentSyncs = completedNodes.slice(0, 5);

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

export const ProgressLayout = ({
  learningPaths,
  onNavigateToMap,
  language = "es",
}: ProgressLayoutProps) => {
  const stats = deriveStats(learningPaths);
  const t = translations[language];

  const hasData = learningPaths.length > 0;

  // Empty state
  if (!hasData) {
    return (
      <div className="progress-empty">
        <div className="progress-empty-icon">
          <Compass size={36} />
        </div>
        <h2 className="progress-empty-title">{t.dash_no_path}</h2>
        <p className="progress-empty-desc">{t.dash_overall_empty}</p>
        {onNavigateToMap && (
          <button
            onClick={onNavigateToMap}
            className="btn-primary progress-empty-btn"
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
      <div className="dash-header flex-between mobile-stack mt-10">
        <div>
          <div>
            <span className="progress-section-badge mb-0 text-[0.5rem]">
              <span className="progress-live-dot mr-2" />
              {t.dash_sync_status}
            </span>
          </div>
          <h2 className="progress-dash-title">{t.dash_welcome}</h2>
          <p className="section-description mb-0">
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
        <div
          className="card flex-start"
          style={{ gap: "1rem", padding: "1rem 1.5rem", flexShrink: 0 }}
        >
          <div className="progress-header-badge-icon">
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
        <div className="progress-col">
          {/* Map Progress Chart */}
          <div className="card">
            <div className="progress-chart-header">
              <div>
                <h3 className="dash-card-title">{t.dash_map_completion}</h3>
                <p className="dash-card-desc">{t.dash_chart_desc}</p>
              </div>
            </div>

            <div className="progress-chart-body">
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
                <div className="progress-chart-empty">{t.map_no_maps}</div>
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
                  <div className="stat-value" style={{ color: s.color }}>
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Two-col row: Next Quest + Recent Syncs */}
          <div className="progress-two-col">
            {/* Next Quest */}
            <div className="card progress-quest-card">
              <div className="progress-quest-header">
                <div className="progress-quest-header-row">
                  <Sparkles
                    size={14}
                    style={{ color: "var(--primary-fixed)" }}
                  />
                  <span className="progress-quest-header-title">
                    {t.dash_next_quest}
                  </span>
                </div>
              </div>
              <div className="progress-quest-scene">
                <div className="progress-quest-scene-glow" />
                <div className="progress-quest-scene-content">
                  {stats.nextQuest ? (
                    <>
                      <div className="quest-label">
                        {stats.nextQuest.mapName}
                      </div>
                      <div className="quest-title">{stats.nextQuest.title}</div>
                      <div className="progress-quest-type">
                        {translateNodeType(stats.nextQuest.type, t)} ·{" "}
                        {stats.nextQuest.location || t.location_general}
                      </div>
                    </>
                  ) : (
                    <div className="progress-quest-empty-text">
                      {t.dash_all_explored}
                    </div>
                  )}
                </div>
              </div>
              <div className="progress-quest-cta">
                <button
                  className="btn-primary progress-quest-btn"
                  style={{
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

            {/* Recent Synchronizations */}
            <div className="card">
              <h3 className="progress-syncs-title">{t.dash_recent_syncs}</h3>
              {stats.recentSyncs.length > 0 ? (
                <div className="progress-syncs-list">
                  {stats.recentSyncs.map((node) => (
                    <div key={node.id} className="progress-sync-row">
                      <div className="progress-sync-icon">
                        <CheckCircle2 size={16} />
                      </div>
                      <div className="progress-sync-info">
                        <div className="progress-sync-title">{node.title}</div>
                        <div className="progress-sync-subtitle">
                          {node.mapName}
                        </div>
                      </div>
                      <div className="progress-sync-right">
                        <div className="progress-sync-status">
                          ✓ {t.node_done}
                        </div>
                        <div className="progress-sync-type">
                          {translateNodeType(node.type, t)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="progress-syncs-empty">
                  <Star size={24} style={{ opacity: 0.3 }} />
                  {t.dash_empty_syncs}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right col */}
        <div className="progress-col">
          {/* Active Node */}
          <div className="card">
            <div className="progress-active-header">
              <span className="progress-active-label">
                {t.dash_active_node}
              </span>
            </div>
            {stats.activeNode ? (
              <>
                <div className="progress-active-icon">
                  <NodeIcon type={stats.activeNode.type} size={20} />
                </div>
                <div className="progress-active-map">
                  {stats.activeNodeMapName}
                </div>
                <h3 className="progress-active-title">
                  {stats.activeNode.title}
                </h3>
                <div className="progress-track progress-active-progress-track">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.activeNode.progress}%` }}
                    transition={{ duration: 1.2, ease: "circOut" }}
                    className="progress-fill"
                  />
                </div>
                <div className="progress-active-progress-row">
                  <span className="progress-active-progress-label">
                    {t.map_progress}
                  </span>
                  <span className="progress-active-progress-pct">
                    {stats.activeNode.progress}%
                  </span>
                </div>
              </>
            ) : (
              <div className="progress-active-empty">
                <Sparkles size={24} style={{ opacity: 0.3 }} />
                {t.dash_no_active_node}
              </div>
            )}
          </div>

          {/* Deep State */}
          <div className="card progress-deep-card">
            <div>
              <div className="progress-deep-label">
                {t.dash_sync_state_label}
              </div>
              <div className="progress-deep-value">
                {stats.completedNodes > 0
                  ? t.dash_state_calibrated
                  : t.dash_state_initializing}
              </div>
              <div className="progress-deep-subtitle">
                {stats.completedNodes} / {stats.totalNodes}{" "}
                {t.dash_nodes_synced}
              </div>
            </div>
            <div className="progress-deep-icon">
              <MapPin size={22} />
            </div>
          </div>

          {/* Distribution — per map */}
          <div className="card">
            <h3 className="progress-dist-title">{t.dash_map_completion}</h3>
            {stats.distribution.length > 0 ? (
              <div className="progress-dist-list">
                {stats.distribution.map((map) => (
                  <div key={map.name}>
                    <div className="progress-dist-row-header">
                      <span className="progress-dist-map-name">{map.name}</span>
                      <span className="progress-dist-map-pct">
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
                        className="progress-dist-bar"
                        style={{ background: map.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="progress-dist-empty">{t.map_no_maps}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
