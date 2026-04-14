import React from "react";
import { Loader2, Plus } from "lucide-react";
import { motion } from "motion/react";
import { LearningPath, LearningNode } from "../../../types/types";
import { MapSelectorBar } from "../../../components/MapSelectorBar/MapSelectorBar";
import { FuturisticMap } from "../../../components/FuturisticMap/FuturisticMap";
import { Language } from "../../../constants/translations";
import "./MapSection.css";

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
  tier: "free" | "pro" | "premium";
  onMapCompleted: () => void;
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
  tier,
  onMapCompleted,
}: MapSectionProps) => {
  return (
    <motion.div
      key="map"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="map-section"
    >
      <MapSelectorBar
        paths={learningPaths}
        activePath={activePath}
        onSelect={setActivePath}
        onNewMap={onNewMap}
        language={language}
      />

      {loading ? (
        <div className="map-section-loading">
          <Loader2 size={32} className="map-section-spinner" />
        </div>
      ) : activePath ? (
        <div key={activePath.id} className="map-section-active">
          <FuturisticMap
            path={activePath}
            theme={theme}
            onNodeUpdate={onNodeUpdate}
            onDragEnd={onDragEnd}
            language={language}
            tier={tier}
            onMapCompleted={onMapCompleted}
          />
        </div>
      ) : (
        <div className="map-section-empty">
          <div className="map-section-empty-title">
            No maps yet
          </div>
          <button
            onClick={onNewMap}
            className="btn-primary map-section-empty-btn"
          >
            <Plus size={18} /> Create your first map
          </button>
        </div>
      )}
    </motion.div>
  );
};
