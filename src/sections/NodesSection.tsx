import React, { useState } from "react";
import { motion } from "motion/react";
import { Search, Layers, ChevronRight, CheckCircle2, Clock } from "lucide-react";
import { LearningPath, LearningNode } from "../types";
import { translations, Language } from "../translations";

interface NodesSectionProps {
  learningPaths: LearningPath[];
  language: Language;
}

export const NodesSection = ({ learningPaths, language }: NodesSectionProps) => {
  const t = translations[language];
  const [search, setSearch] = useState("");

  const allNodes = learningPaths.flatMap((path) =>
    path.nodes.map((node) => ({ ...node, mapName: path.name }))
  );

  const filteredNodes = allNodes.filter(
    (node) =>
      node.title.toLowerCase().includes(search.toLowerCase()) ||
      node.mapName.toLowerCase().includes(search.toLowerCase()) ||
      node.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      key="nodes"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-7xl mx-auto px-6 py-8"
    >
      <div className="flex flex-col gap-8">
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "var(--on-surface)", letterSpacing: "-0.02em" }}>
            {t.nav_nodes} <span style={{ color: "var(--primary)", fontSize: "0.9rem", verticalAlign: "middle", marginLeft: 8 }}>{allNodes.length} Total</span>
          </h2>
          <p style={{ fontFamily: "var(--font-sans)", color: "var(--on-surface-var)", marginTop: 4 }}>
            Explora todos los nodos de conocimiento de tu red neural personal.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: "0.5rem 1rem", display: "flex", alignItems: "center", gap: 12, borderRadius: "var(--radius-lg)" }}>
          <Search size={18} style={{ color: "var(--outline)" }} />
          <input
            type="text"
            placeholder="Buscar por título, mapa o tipo..."
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

        <div className="grid gap-4">
          {filteredNodes.length > 0 ? (
            filteredNodes.map((node, i) => (
              <motion.div
                key={`${node.mapName}-${node.id}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="glass-panel hover-card"
                style={{
                  padding: "1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1.5rem",
                  cursor: "pointer",
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: "12px",
                  background: "var(--primary-container)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--primary)"
                }}>
                  <Layers size={22} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "var(--on-surface)" }}>
                      {node.title}
                    </h3>
                    <span style={{ fontSize: "0.65rem", padding: "2px 8px", borderRadius: 99, background: "var(--surface-container-high)", color: "var(--outline)", textTransform: "uppercase", fontWeight: 700 }}>
                      {node.type}
                    </span>
                  </div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "var(--on-surface-var)", display: "flex", alignItems: "center", gap: 12 }}>
                    <span>Map: {node.mapName}</span>
                    {node.status === 'completed' ? (
                      <span style={{ color: "#059669", display: "flex", alignItems: "center", gap: 4 }}>
                        <CheckCircle2 size={12} /> {t.node_complete}
                      </span>
                    ) : (
                      <span style={{ color: "var(--primary)", display: "flex", alignItems: "center", gap: 4 }}>
                        <Clock size={12} /> {t.node_in_progress}
                      </span>
                    )}
                  </div>
                </div>

                <ChevronRight size={20} style={{ color: "var(--outline-variant)" }} />
              </motion.div>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--on-surface-var)" }}>
              No se encontraron nodos que coincidan con la búsqueda.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
