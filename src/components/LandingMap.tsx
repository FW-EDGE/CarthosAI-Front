import { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpenCheck,
  Info,
  ExternalLink,
  ChevronRight,
  X,
  Layers,
  Zap,
  LayoutGrid,
  Network,
  EyeOff,
  Sparkles,
  ScrollText,
  Dna,
  Play,
  Headphones,
  BookOpen,
  Clock,
  Target,
  CheckCircle2,
  Lock,
  ArrowRight,
} from "lucide-react";
import { LearningNode, LearningPath } from "../types";
import { cn } from "../lib/utils";
import { translations, Language } from "../translations";
import { NodeDetailPanel } from "./NodeDetailPanel";

type MapMode = "pathfinder" | "animus" | "neural" | "grid";

interface Node extends d3.SimulationNodeDatum, LearningNode {
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  targetX?: number;
  targetY?: number;
}

interface Particle {
  source: Node;
  target: Node;
  t: number;
  speed: number;
  life: number;
  /** Maximum t value this particle is allowed to reach (for progress-limited paths) */
  maxT: number;
  /** Visual type drives color & thickness */
  type: "completed" | "in-progress" | "normal";
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: Node;
  target: Node;
}

interface LandingMapProps {
  path: LearningPath;
  theme?: "light" | "dark";
  readOnly?: boolean;
  onNodeUpdate?: (nodeId: string, updates: any) => void;
  onDragEnd?: (nodes: LearningNode[]) => void;
  language?: Language;
  disableZoom?: boolean;
}

export const LandingMap = ({
  path,
  theme = "light",
  readOnly = false,
  onNodeUpdate,
  onDragEnd,
  language = "es",
  disableZoom = false,
}: LandingMapProps) => {
  const t = translations[language];
  const completedNodes = path.nodes.filter(
    (n) => n.status === "completed",
  ).length;
  const totalNodes = path.nodes.length;
  const overallProgress = Math.round(
    path.nodes.reduce((acc, curr) => acc + (curr.progress || 0), 0) /
      Math.max(1, totalNodes),
  );

  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const selectedNode = path.nodes.find((n) => n.id === selectedNodeId) || null;
  const [hoveredNode, setHoveredNode] = useState<LearningNode | null>(null);
  const [mapMode, setMapMode] = useState<MapMode>("pathfinder");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  const transformRef = useRef(d3.zoomIdentity);

  const isDark = theme === "dark";

  const [isEditingMode, setIsEditingMode] = useState(false);
  const isEditingRef = useRef(isEditingMode);
  const nodePositionsRef = useRef<Record<string, { x: number; y: number }>>({});
  const lastPathIdRef = useRef<string | null>(null);

  useEffect(() => {
    isEditingRef.current = isEditingMode;
  }, [isEditingMode]);

  const handleSaveLayout = () => {
    localStorage.setItem(
      `carthos_map_${path.id}_${mapMode}`,
      JSON.stringify(nodePositionsRef.current),
    );

    // Push final coordinates up to App for DB persistence
    if (onDragEnd) {
      const updatedNodes = path.nodes.map((n) => {
        const customPos = nodePositionsRef.current[n.id];
        if (customPos) {
          return { ...n, x: customPos.x, y: customPos.y };
        }
        return n;
      });
      onDragEnd(updatedNodes);
    }

    setIsEditingMode(false);
  };

  // ── Carthos Design Tokens ──────────────────────────────────
  const pfBg = isDark ? "#0f1416" : "#f3f7fb";
  const pfFg = isDark ? "#e2e8f0" : "#2a2f32";
  const pfMuted = isDark ? "#64748b" : "#8a9199";
  const pfAccent = isDark ? "#00c3ed" : "#00647b";
  const pfAccentDim = isDark ? "#00e5ff" : "#00c3ed";
  const pfPanelBg = isDark ? "rgba(15, 20, 22, 0.9)" : "rgba(255,255,255,0.92)";

  const modes = [
    {
      id: "pathfinder",
      label: t.map_mode_pathfinder,
      icon: Sparkles,
      desc: t.map_mode_pathfinder_desc,
    },
    {
      id: "animus",
      label: t.map_mode_animus,
      icon: Dna,
      desc: t.map_mode_animus_desc,
    },
    {
      id: "neural",
      label: t.map_mode_neural,
      icon: Network,
      desc: t.map_mode_neural_desc,
    },
    {
      id: "grid",
      label: t.map_mode_grid,
      icon: LayoutGrid,
      desc: t.map_mode_grid_desc,
    },
  ];

  useEffect(() => {
    if (!svgRef.current || !canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    canvas.width = width;
    canvas.height = height;

    svg.selectAll("*").remove();
    const g = svg.append("g");

    // Prepare data
    const nodes: Node[] = path.nodes.map((n) => ({ ...n }));
    const links: Link[] = [];
    path.nodes.forEach((node) => {
      node.connections.forEach((connId) => {
        const target = nodes.find((n) => n.id === connId);
        const source = nodes.find((n) => n.id === node.id);
        if (source && target) {
          links.push({ source, target });
        }
      });
    });

    // BFS to find longitudinal levels
    const levelsMap = new Map<string, number>();
    if (nodes.length > 0) {
      levelsMap.set(nodes[0].id, 0);
      const queue = [nodes[0]];
      while (queue.length > 0) {
        const curr = queue.shift()!;
        const currLevel = levelsMap.get(curr.id)!;
        const outLinks = links.filter((l) => l.source.id === curr.id);
        outLinks.forEach((l) => {
          if (!levelsMap.has(l.target.id)) {
            levelsMap.set(l.target.id, currLevel + 1);
            queue.push(l.target);
          }
        });
      }

      let maxLevel = Math.max(0, ...Array.from(levelsMap.values()));
      nodes.forEach((n) => {
        if (!levelsMap.has(n.id)) {
          maxLevel++;
          levelsMap.set(n.id, maxLevel);
        }
      });
    }
    const maxLevel = Math.max(1, ...Array.from(levelsMap.values()));

    // Read saved positions for this path and mode
    const savedStr = localStorage.getItem(`aetheris_map_${path.id}_${mapMode}`);
    if (savedStr) {
      try {
        nodePositionsRef.current = JSON.parse(savedStr);
      } catch (e) {}
    } else {
      nodePositionsRef.current = {};
    }

    // Set up target coordinates for every node
    nodes.forEach((d, i) => {
      if (nodePositionsRef.current[d.id]) {
        d.targetX = nodePositionsRef.current[d.id].x;
        d.targetY = nodePositionsRef.current[d.id].y;
      } else if (mapMode === "animus") {
        d.targetX = width * 0.2 + i * 350;
        d.targetY = height / 2 - 50;
      } else if (mapMode === "grid") {
        const cols = Math.ceil(Math.sqrt(nodes.length));
        d.targetX = width / 2 + ((i % cols) - cols / 2) * 200;
        d.targetY = height / 2 + (Math.floor(i / cols) - cols / 2) * 200;
      } else {
        const lvl = levelsMap.get(d.id) || 0;
        const usableWidth = Math.max(300, width - 200);
        d.targetX = (width - usableWidth) / 2 + (lvl * usableWidth) / maxLevel;
        d.targetY = height / 2;
      }

      // Initialize starting coordinates smoothly
      // If we are editing or have real coords from parent, use them as prioritized targets
      const hasRealCoords =
        (d as any).x !== undefined && (d as any).y !== undefined;

      if (hasRealCoords && !nodePositionsRef.current[d.id]) {
        d.targetX = (d as any).x;
        d.targetY = (d as any).y;
      }

      d.x = d.targetX;
      d.y = d.targetY;

      // We NEVER pin them completely via d.fx/d.fy initially,
      // except while dragging, ensuring D3 physics spring them back.
      d.fx = null;
      d.fy = null;
    });

    // Simulation
    const simulation = d3
      .forceSimulation<Node>(nodes)
      .force(
        "link",
        d3
          .forceLink<Node, Link>(links)
          .id((d) => d.id)
          .distance(150),
      )
      .force("charge", d3.forceManyBody().strength(-200)) // Reduced repulsion for more stability
      .force(
        "x",
        d3
          .forceX<Node>()
          .x((d) => d.targetX!)
          .strength(1.2), // Stronger pull to targets
      )
      .force(
        "y",
        d3
          .forceY<Node>()
          .y((d) => d.targetY!)
          .strength(1.2),
      )
      .force("collision", d3.forceCollide().radius(70)); // Tighter collision

    // Draw Nodes
    const nodeGroups = g
      .append("g")
      .selectAll<SVGGElement, Node>("g")
      .data(nodes)
      .join("g")
      .attr("cursor", isEditingMode ? "grab" : "pointer")
      .on(
        "click",
        (event, d) => !isEditingRef.current && setSelectedNodeId(d.id),
      )
      .on(
        "mouseenter",
        (event, d) => !isEditingRef.current && setHoveredNode(d),
      )
      .on("mouseleave", () => setHoveredNode(null))
      .call(
        d3
          .drag<SVGGElement, Node>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
            d3.select(event.sourceEvent.target).attr("cursor", "grabbing");
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            if (isEditingRef.current) {
              d.targetX = event.x;
              d.targetY = event.y;
              if (d.id) {
                nodePositionsRef.current[d.id] = { x: event.x, y: event.y };
              }

              // We do NOT call onDragEnd here anymore, to avoid re-rendering and resetting the SVG.
              // It is now called locally inside handleSaveLayout.

              simulation.force(
                "x",
                d3
                  .forceX<Node>()
                  .x((n) => n.targetX!)
                  .strength(1),
              );
              simulation.force(
                "y",
                d3
                  .forceY<Node>()
                  .y((n) => n.targetY!)
                  .strength(1),
              );
            }
            d.fx = null;
            d.fy = null;
            d3.select(event.sourceEvent.target).attr(
              "cursor",
              isEditingRef.current ? "grab" : "pointer",
            );
          }) as any,
      );

    // Inner group for reveal animations
    const nodeContents = nodeGroups
      .append("g")
      .attr("class", "node-reveal-wrapper");

    // Draw Links in SVG for better reliability
    const linkElements = g
      .append("g")
      .lower()
      .selectAll<SVGPathElement, Link>("path")
      .data(links)
      .join("path")
      .attr("fill", "none")
      .attr("stroke", isDark ? "rgba(0,195,237,0.25)" : "rgba(0,100,123,0.7)")
      .attr("stroke-width", 2.2);

    // Node Orbs
    nodeContents.each(function (d, i) {
      const el = d3.select(this);
      const isPathfinder = mapMode === "pathfinder";
      const isFirst = i === 0;

      if (isPathfinder) {
        const r = 22;

        if (isFirst) {
          // Outer pulse ring
          el.append("circle")
            .attr("r", r + 4)
            .attr("fill", "none")
            .attr("stroke", pfAccentDim)
            .attr("stroke-width", 1.5)
            .attr("opacity", 0)
            .append("animate")
            .attr("attributeName", "r")
            .attr("from", r + 4)
            .attr("to", r + 20)
            .attr("dur", "2.2s")
            .attr("repeatCount", "indefinite");

          el.append("circle")
            .attr("r", r + 4)
            .attr("fill", "none")
            .attr("stroke", pfAccentDim)
            .attr("stroke-width", 1.5)
            .append("animate")
            .attr("attributeName", "opacity")
            .attr("from", 0.7)
            .attr("to", 0)
            .attr("dur", "2.2s")
            .attr("repeatCount", "indefinite");

          el.append("text")
            .attr("y", -r - 12)
            .attr("text-anchor", "middle")
            .attr("fill", pfAccent)
            .style("paint-order", "stroke fill")
            .style("stroke", pfBg)
            .style("stroke-width", "4px")
            .attr("font-family", "Manrope, sans-serif")
            .attr("font-size", "8px")
            .attr("font-weight", "700")
            .attr("letter-spacing", "0.2em")
            .text(language === "es" ? "INICIO" : "START");
        }

        // Node card orb
        const statusColor =
          (d as any).status === "completed"
            ? "#10b981"
            : (d as any).status === "in-progress"
              ? "#f59e0b"
              : pfAccentDim;
        const statusStroke =
          (d as any).status === "completed"
            ? "#10b981"
            : (d as any).status === "in-progress"
              ? "#f59e0b"
              : isFirst
                ? pfAccentDim
                : isDark
                  ? "rgba(0,195,237,0.3)"
                  : "rgba(0,100,123,0.18)";

        el.append("circle")
          .attr("r", r)
          .attr("fill", isDark ? "#1a2124" : "white")
          .attr("stroke", statusStroke)
          .attr(
            "stroke-width",
            isFirst ||
              (d as any).status === "in-progress" ||
              (d as any).status === "completed"
              ? 2
              : 1.5,
          )
          .style(
            "filter",
            isDark
              ? `drop-shadow(0 4px 16px ${(d as any).status === "completed" ? "rgba(16,185,129,0.3)" : "rgba(0,0,0,0.4)"})`
              : `drop-shadow(0 6px 18px ${(d as any).status === "completed" ? "rgba(16,185,129,0.25)" : "rgba(0,100,123,0.3)"})`,
          );

        // Inner accent dot
        el.append("circle")
          .attr("r", r * 0.35)
          .attr("fill", statusColor)
          .attr("opacity", 0.85);

        // Progress ring for in-progress nodes
        if ((d as any).status === "in-progress") {
          el.append("circle")
            .attr("r", r + 4)
            .attr("fill", "none")
            .attr("stroke", "#f59e0b")
            .attr("stroke-width", 1.5)
            .attr("stroke-dasharray", "4,2")
            .append("animateTransform")
            .attr("attributeName", "transform")
            .attr("type", "rotate")
            .attr("from", "0 0 0")
            .attr("to", "360 0 0")
            .attr("dur", "4s")
            .attr("repeatCount", "indefinite");
        }

        // Label below node
        el.append("text")
          .attr("y", r + 20)
          .attr("text-anchor", "middle")
          .attr("fill", pfFg)
          .style("paint-order", "stroke fill")
          .style("stroke", pfBg)
          .style("stroke-width", "4px")
          .style("font-weight", "600")
          .attr("font-family", "Manrope, sans-serif")
          .attr("font-size", "10px")
          .attr("letter-spacing", "0.05em")
          .selectAll("tspan")
          .data(d.title.split(" "))
          .join("tspan")
          .attr("x", 0)
          .attr("dy", (d, i) => (i === 0 ? 0 : "1.2em"))
          .text((d) => d);
      } else {
        el.append("circle")
          .attr("r", 28)
          .attr("fill", isDark ? "#1a2124" : "white")
          .attr("stroke", pfAccent)
          .attr("stroke-width", 1.5)
          .style(
            "filter",
            isDark
              ? "drop-shadow(0 4px 16px rgba(0,0,0,0.4))"
              : "drop-shadow(0 4px 16px rgba(0,100,123,0.12))",
          );
      }
    });

    // Particle state
    let localParticles: Particle[] = [];
    let currentTransform = d3.zoomIdentity;

    const tick = () => {
      // Update Physics
      nodeGroups.attr("transform", (d) => `translate(${d.x},${d.y})`);

      // Update Links
      linkElements.attr("d", (d) => {
        const s = d.source;
        const t = d.target;
        const mx = (s.x! + t.x!) / 2;
        const my = (s.y! + t.y!) / 2 - 15;
        return `M${s.x},${s.y} Q${mx},${my} ${t.x},${t.y}`;
      });
    };

    let animationFrameId: number;

    const renderParticles = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.translate(currentTransform.x, currentTransform.y);
      ctx.scale(currentTransform.k, currentTransform.k);

      // ── Spawn ──────────────────────────────────────────────────
      links.forEach((link) => {
        // Color is determined by the SOURCE node — particles flow OUT from a node
        // carrying the "energy" of its current learning state.
        const sourceNode = link.source as Node;
        const sourceStatus = sourceNode.status as string | undefined;
        const sourceProgress = (sourceNode.progress as number | undefined) ?? 0;
        const progressRatio = Math.min(1, Math.max(0, sourceProgress / 100));

        if (sourceStatus === "completed") {
          // Green fat particles – the path ahead of a completed node is fully lit
          if (Math.random() > 0.92) {
            localParticles.push({
              source: link.source,
              target: link.target,
              t: Math.random() * 0.1,
              speed: 0.004 + Math.random() * 0.003,
              life: 1,
              maxT: 1,
              type: "completed",
            });
          }
        } else if (sourceStatus === "in-progress") {
          if (progressRatio > 0) {
            // Orange particles up to the progress boundary
            if (Math.random() > 0.92) {
              localParticles.push({
                source: link.source,
                target: link.target,
                t: 0,
                speed: 0.005 + Math.random() * 0.004,
                life: 1,
                maxT: progressRatio,
                type: "in-progress",
              });
            }
          }
          // Dim cyan for the un-reached stretch of the path
          if (Math.random() > 0.94) {
            localParticles.push({
              source: link.source,
              target: link.target,
              t: progressRatio + Math.random() * (1 - progressRatio) * 0.05,
              speed: 0.005 + Math.random() * 0.004,
              life: 1,
              maxT: 1,
              type: "normal",
            });
          }
        } else {
          // Normal cyan for locked / unexplored paths
          if (Math.random() > 0.96) {
            localParticles.push({
              source: link.source,
              target: link.target,
              t: 0,
              speed: 0.004 + Math.random() * 0.004,
              life: 1,
              maxT: 1,
              type: "normal",
            });
          }
        }
      });

      // ── Update & Cull ─────────────────────────────────────────
      localParticles = localParticles.filter((p) => p.t < p.maxT);

      localParticles.forEach((p) => {
        p.t += p.speed;
        if (p.t > p.maxT) p.t = p.maxT;

        // Bell-curve opacity: peaks at midpoint, fades at both ends
        const rel = p.t / p.maxT; // 0→1 within its segment
        p.life = Math.sin(rel * Math.PI); // 0 → 1 → 0 smooth arc

        const s = p.source;
        const t = p.target;
        const mx = (s.x! + t.x!) / 2;
        const my = (s.y! + t.y!) / 2 - 15;

        const getBezier = (u: number) => ({
          x: (1 - u) * (1 - u) * s.x! + 2 * (1 - u) * u * mx + u * u * t.x!,
          y: (1 - u) * (1 - u) * s.y! + 2 * (1 - u) * u * my + u * u * t.y!,
        });

        const pos = getBezier(p.t);
        const prev = getBezier(Math.max(0, p.t - 0.06));

        // ── Per-type visual config ──────────────────────────────
        let r: string, g_: string, b: string;
        let lineW: number, headR: number, glowR: number, glowStr: number;

        if (p.type === "completed") {
          r = "16";
          g_ = "185";
          b = "129"; // #10b981 emerald
          lineW = 3;
          headR = 3.5;
          glowR = 8;
          glowStr = 14;
        } else if (p.type === "in-progress") {
          r = "245";
          g_ = "158";
          b = "11"; // #f59e0b amber
          lineW = 2.5;
          headR = 3;
          glowR = 8;
          glowStr = 14;
        } else {
          r = "0";
          g_ = "100";
          b = "123"; // primary teal
          lineW = 2.2;
          headR = 2.8;
          glowR = 8;
          glowStr = 12;
        }

        const alpha = p.life;

        // Glow on the glow layer
        ctx.save();
        ctx.shadowColor = `rgba(${r},${g_},${b},${alpha * 0.9})`;
        ctx.shadowBlur = glowStr;

        // ── Long glowing tail ────────────────────────────────────
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = `rgba(${r},${g_},${b},${alpha * 0.85})`;
        ctx.lineWidth = lineW;
        ctx.lineCap = "round";
        ctx.stroke();

        // ── Bright head circle ───────────────────────────────────
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, headR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g_},${b},${alpha})`;
        ctx.fill();

        // ── Outer soft halo (completed & in-progress only) ───────
        if (p.type !== "normal") {
          ctx.beginPath();
          const grad = ctx.createRadialGradient(
            pos.x,
            pos.y,
            0,
            pos.x,
            pos.y,
            glowR,
          );
          grad.addColorStop(0, `rgba(${r},${g_},${b},${alpha * 0.6})`);
          grad.addColorStop(1, `rgba(${r},${g_},${b},0)`);
          ctx.arc(pos.x, pos.y, glowR, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        ctx.restore();
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(renderParticles);
    };

    // Reveal logic
    const animateEntrance = () => {
      nodeContents.style("opacity", 0);
      linkElements.style("opacity", 0);

      // 1. Reveal nodes one by one by scaling the INNER group
      nodeContents
        .transition()
        .delay((d, i) => i * 140)
        .duration(750)
        .ease(d3.easeBackOut)
        .style("opacity", 1)
        .on("start", function () {
          d3.select(this).style("transform", "scale(0.3)");
        })
        .style("transform", "scale(1)");

      // 2. Reveal links drawing in
      linkElements
        .style("stroke-dasharray", function () {
          const l = (this as any).getTotalLength?.() || 500;
          return `${l} ${l}`;
        })
        .style("stroke-dashoffset", function () {
          return (this as any).getTotalLength?.() || 500;
        })
        .transition()
        .delay((d, i) => nodes.length * 80 + i * 120)
        .duration(1500)
        .ease(d3.easeCubicInOut)
        .style("opacity", 1)
        .style("stroke-dashoffset", 0);
    };

    simulation.on("tick", tick);
    renderParticles();

    // Only animate entrance if it's a NEW map
    if (path.id !== lastPathIdRef.current) {
      animateEntrance();
      lastPathIdRef.current = path.id;
    } else {
      // If it's the same map, ensure elements are visible but don't re-run entrance
      nodeContents.style("opacity", 1);
      linkElements.style("opacity", 1);
    }

    // Calculate bounding box and auto-fit map
    if (nodes.length > 0) {
      const xMin = d3.min(nodes, d => d.targetX!) || 0;
      const xMax = d3.max(nodes, d => d.targetX!) || 0;
      const yMin = d3.min(nodes, d => d.targetY!) || 0;
      const yMax = d3.max(nodes, d => d.targetY!) || 0;

      const dx = Math.max(xMax - xMin, 1);
      const dy = Math.max(yMax - yMin, 1);
      const cx = (xMin + xMax) / 2;
      const cy = (yMin + yMax) / 2;

      // Scale to fit 85% of container
      const scale = Math.max(0.1, Math.min(1.5, 0.85 / Math.max(dx / width, dy / height)));
      const tx = width / 2 - scale * cx;
      const ty = height / 2 - scale * cy;

      const initialTransform = d3.zoomIdentity.translate(tx, ty).scale(scale);
      currentTransform = initialTransform;
      transformRef.current = initialTransform;
      g.attr("transform", initialTransform as any);
    }

    // Zoom behavior
    if (!disableZoom) {
      const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 3])
        .on("zoom", (event) => {
          currentTransform = event.transform;
          transformRef.current = event.transform;
          g.attr("transform", event.transform);
        });
      svg.call(zoom);
      svg.call(zoom.transform, currentTransform);
    }

    return () => {
      simulation.stop();
      cancelAnimationFrame(animationFrameId);
    };
  }, [path, mapMode, theme]);

  // Positioning logic removed - now using static sidebar

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      style={{
        backgroundColor: isDark ? "#0f1416" : pfBg,
        backgroundImage: isDark
          ? "radial-gradient(ellipse 70% 50% at 20% 15%, rgba(0,195,237,0.15) 0%, transparent 55%), radial-gradient(ellipse 55% 45% at 80% 85%, rgba(0,229,255,0.1) 0%, transparent 50%)"
          : "radial-gradient(ellipse 70% 50% at 20% 15%, rgba(0,195,237,0.08) 0%, transparent 55%), radial-gradient(ellipse 55% 45% at 80% 85%, rgba(0,100,123,0.06) 0%, transparent 50%)",
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />
      <svg ref={svgRef} className="absolute inset-0 w-full h-full" />

      {/* Progress Bar */}
      <div className="absolute bottom-6 right-6 z-20" style={{ width: 140 }}>
        <div
          style={{
            fontFamily: "Manrope, sans-serif",
            fontSize: "0.6rem",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--outline)",
            marginBottom: 8,
            textAlign: "right",
          }}
        >
          {t.map_progress}
        </div>
        <div className="progress-track">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="progress-fill"
          />
        </div>
        <div
          style={{
            fontFamily: "Manrope, sans-serif",
            fontSize: "0.7rem",
            fontWeight: 700,
            color: "var(--primary)",
            marginTop: 6,
            textAlign: "right",
          }}
        >
          {overallProgress}%
        </div>
      </div>

      {/* Map Controls (Top Right) */}
      <div className="absolute top-5 right-6 z-30 flex items-center gap-2">
        {!readOnly && (
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="glass-panel"
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary)",
                border: "none",
                cursor: "pointer",
              }}
              title="Map Mode"
            >
              <Layers size={16} />
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  className="glass-panel"
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    padding: "0.625rem",
                    borderRadius: "var(--radius-lg)",
                    width: 180,
                    zIndex: 100,
                  }}
                >
                  {modes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => {
                        setMapMode(mode.id as MapMode);
                        setIsMenuOpen(false);
                        setIsEditingMode(false);
                      }}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "0.5rem 0.65rem",
                        borderRadius: "var(--radius-md)",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        background:
                          mapMode === mode.id
                            ? "var(--primary-container)"
                            : "transparent",
                        transition: "background 0.2s ease",
                      }}
                    >
                      <mode.icon
                        size={13}
                        style={{
                          color:
                            mapMode === mode.id
                              ? "var(--primary)"
                              : "var(--outline)",
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "Manrope, sans-serif",
                          fontSize: "0.72rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          fontWeight: 600,
                          color:
                            mapMode === mode.id
                              ? "var(--primary)"
                              : "var(--on-surface-var)",
                        }}
                      >
                        {mode.label}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {!readOnly &&
          (isEditingMode ? (
            <button
              onClick={handleSaveLayout}
              className="glass-panel"
              style={{
                padding: "0.5rem 1.125rem",
                borderRadius: "var(--radius-full)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#fff",
                background: "var(--primary)",
                border: "none",
                cursor: "pointer",
                fontFamily: "Manrope, sans-serif",
                fontSize: "0.75rem",
                fontWeight: 700,
                boxShadow: "0 8px 24px rgba(0, 195, 237, 0.3)",
              }}
            >
              <CheckCircle2 size={16} /> {t.map_save_layout}
            </button>
          ) : (
            <button
              onClick={() => {
                setIsEditingMode(true);
                setSelectedNodeId(null);
              }}
              className="glass-panel"
              style={{
                padding: "0.5rem 1.125rem",
                borderRadius: "var(--radius-full)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "var(--primary)",
                border: "none",
                cursor: "pointer",
                fontFamily: "Manrope, sans-serif",
                fontSize: "0.75rem",
                fontWeight: 700,
              }}
            >
              <LayoutGrid size={16} /> {t.map_edit_position}
            </button>
          ))}
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedNode && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNodeId(null)}
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 40,
                background: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.05)",
                backdropFilter: "blur(2px)",
                cursor: "pointer",
              }}
            />
            <NodeDetailPanel
              key={selectedNode.id}
              selectedNode={selectedNode}
              allNodes={path.nodes}
              onClose={() => setSelectedNodeId(null)}
              theme={theme}
              onUpdate={onNodeUpdate}
              mapId={path.id}
              language={language}
            />
          </>
        )}
      </AnimatePresence>

      {/* Hover Tooltip */}
      <AnimatePresence>
        {hoveredNode && !selectedNode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 4 }}
            className="glass-pill-nav"
            style={{
              position: "absolute",
              bottom: 48,
              left: "50%",
              transform: "translateX(-50%)",
              padding: "0.375rem 1rem",
              borderRadius: "var(--radius-full)",
              zIndex: 30,
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: "0.7rem",
                fontWeight: 600,
                color: "var(--on-surface)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {hoveredNode.title}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
