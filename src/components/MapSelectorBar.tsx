import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, ChevronDown, Plus } from "lucide-react";
import { LearningPath } from "../types";
import { translations, Language } from "../translations";
import { Button } from "./ui/Button";

interface MapSelectorBarProps {
  paths: LearningPath[];
  activePath: LearningPath | null;
  onSelect: (p: LearningPath) => void;
  onNewMap: () => void;
  language?: Language;
}

export const MapSelectorBar = ({
  paths,
  activePath,
  onSelect,
  onNewMap,
  language = "es",
}: MapSelectorBarProps) => {
  const t = translations[language];
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "24px",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        zIndex: 40,
        pointerEvents: "auto",
      }}
    >
      <div
        className="glass-pill-nav"
        ref={ref}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.375rem 0.625rem",
          borderRadius: "var(--radius-full)",
        }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpen((o) => !o)}
          style={{
            background: open ? "var(--primary-container)" : "transparent",
            color: "var(--on-surface)",
            maxWidth: 400,
          }}
          leftIcon={
            <MapPin
              size={14}
              style={{ color: "var(--primary)", flexShrink: 0 }}
            />
          }
          rightIcon={
            <ChevronDown
              size={12}
              style={{
                color: "var(--outline)",
                transition: "transform 0.2s",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          }
        >
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {activePath ? activePath.name : t.map_select_map}
          </span>
        </Button>

        {activePath && (
          <div
            style={{
              height: 16,
              width: 1,
              background: "var(--surface-container-high)",
              margin: "0 2px",
            }}
          />
        )}

        {activePath && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              paddingRight: "0.75rem",
              fontFamily: "var(--font-sans)",
              fontSize: "0.7rem",
              color: "var(--outline)",
              fontWeight: 600,
            }}
            title="Synchronization Progress"
          >
            <span style={{ color: "var(--on-surface)", fontWeight: 700 }}>
              {activePath.nodes.filter((n) => n.status === "completed").length}/
              {activePath.nodes.length}
            </span>
            <span style={{ opacity: 0.6 }}>{t.map_nodes_count}</span>
          </div>
        )}

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="glass-panel"
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                left: 0,
                minWidth: 415,
                borderRadius: "16px",
                padding: "0.5rem",
                zIndex: 50,
                boxShadow: "0 16px 40px rgba(0,100,123,0.12)",
              }}
            >
              {paths.length === 0 ? (
                <div
                  style={{
                    padding: "1rem",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.85rem",
                    color: "var(--outline)",
                    textAlign: "center",
                  }}
                >
                  {t.map_no_maps}
                </div>
              ) : (
                paths.map((p) => {
                  const completed = p.nodes.filter(
                    (n) => n.status === "completed",
                  ).length;
                  const total = p.nodes.length;
                  const pct = Math.round(
                    p.nodes.reduce((a, c) => a + (c.progress || 0), 0) /
                      Math.max(1, total),
                  );
                  const isActive = activePath?.id === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSelect(p);
                        setOpen(false);
                      }}
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.4rem",
                        padding: "0.75rem 1rem",
                        borderRadius: "12px",
                        border: "none",
                        textAlign: "left",
                        cursor: "pointer",
                        background: isActive
                          ? "var(--primary-container)"
                          : "transparent",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive)
                          (e.currentTarget as HTMLElement).style.background =
                            "var(--surface-container)";
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive)
                          (e.currentTarget as HTMLElement).style.background =
                            "transparent";
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "0.82rem",
                            fontWeight: 700,
                            color: isActive
                              ? "var(--primary)"
                              : "var(--on-surface)",
                          }}
                        >
                          {p.name}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            color: "var(--primary)",
                          }}
                        >
                          {pct}%
                        </span>
                      </div>
                      <div
                        style={{
                          height: 3,
                          background: "var(--surface-container-high)",
                          borderRadius: 99,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${pct}%`,
                            background:
                              "linear-gradient(90deg, var(--primary) 0%, var(--primary-fixed) 100%)",
                            borderRadius: 99,
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.68rem",
                          color: "var(--outline)",
                        }}
                      >
                        {completed} / {total} {t.map_nodes_completed}
                      </span>
                    </button>
                  );
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Button
        onClick={onNewMap}
        variant="ghost"
        size="sm"
        className="glass-pill-nav"
        style={{ color: "var(--primary)", padding: "0.5rem 1rem" }}
        leftIcon={<Plus size={14} />}
      >
        {t.map_new_map}
      </Button>
    </div>
  );
};
