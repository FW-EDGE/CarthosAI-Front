import React from "react";
import { Loader2, Plus } from "lucide-react";
import { motion } from "motion/react";
import { LearningPath, LearningNode } from "../types";
import { MapSelectorBar } from "../components/MapSelectorBar";
import { FuturisticMap } from "../components/FuturisticMap";
import { Language } from "../translations";

interface MapSectionProps {
  learningPaths: LearningPath[];
  activePath: LearningPath | null;
  setActivePath: (path: LearningPath) => void;
  loading: boolean;
  theme: "light" | "dark";
  language: Language;
  onNewMap: () => void;
  onNodeUpdate: (nodeId: string, updates: Partial<LearningNode>) => void;
  onDragEnd: (nodes: LearningNode[]) => void;
}

export const MapSection = ({
  learningPaths,
  activePath,
  setActivePath,
  loading,
  theme,
  language,
  onNewMap,
  onNodeUpdate,
  onDragEnd,
}: MapSectionProps) => {
  return (
    <motion.div
      key="map"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        height: "calc(100vh - 113px)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <MapSelectorBar
        paths={learningPaths}
        activePath={activePath}
        onSelect={setActivePath}
        onNewMap={onNewMap}
        language={language}
      />

      {loading ? (
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Loader2 size={32} style={{ color: "var(--primary)", animation: "spin 1s linear infinite" }} />
        </div>
      ) : activePath ? (
        <div key={activePath.id} style={{ height: "100%" }}>
          <FuturisticMap 
            path={activePath} 
            theme={theme}
            onNodeUpdate={onNodeUpdate}
            onDragEnd={onDragEnd}
            language={language}
          />
        </div>
      ) : (
        <div style={{
          height: "100%", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: "1.5rem",
        }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "2rem", color: "var(--surface-container-high)", letterSpacing: "-0.03em" }}>
            No maps yet
          </div>
          <button
            onClick={onNewMap}
            className="btn-primary"
            style={{ borderRadius: "100px", padding: "1rem 2.5rem", fontSize: "1rem" }}
          >
            <Plus size={18} /> Create your first map
          </button>
        </div>
      )}
    </motion.div>
  );
};
