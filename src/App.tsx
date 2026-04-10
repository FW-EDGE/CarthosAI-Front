import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Plus } from "lucide-react";
import { LearningPath, OnboardingData } from "./types";
import { authService, learningService, mapService } from "./services/api";
import { FuturisticMap } from "./components/FuturisticMap";
import { Landing } from "./components/Landing";
import { Auth } from "./components/Auth";
import { TopNav } from "./components/TopNav";
import { Onboarding } from "./components/Onboarding";
import { StellarProgress } from "./components/StellarProgress";
import { MapSelectorBar } from "./components/MapSelectorBar";
import { GenerationLoader } from "./components/GenerationLoader";

// Sections
import { MapSection } from "./sections/MapSection";
import { ProgressSection } from "./sections/ProgressSection";
import { NodesSection } from "./sections/NodesSection";
import { VaultSection } from "./sections/VaultSection";

// ─── MAIN APP ─────────────────────────────────────────────────

export default function App() {
  const SESSION_KEY = "carthos_session_ts";
  const SESSION_TTL = 30 * 60 * 1000; // 30 minutes in ms

  const isSessionValid = () => {
    const ts = localStorage.getItem(SESSION_KEY);
    if (!ts) return false;
    return Date.now() - parseInt(ts, 10) < SESSION_TTL;
  };

  const [screen, setScreen] = useState<
    "landing" | "auth" | "onboarding" | "main"
  >(() => (isSessionValid() ? "main" : "landing"));
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [activeTab, setActiveTab] = useState("progress");
  const [userName, setUserName] = useState(
    () => localStorage.getItem("carthos_user_name") || "",
  );
  const [theme, setTheme] = useState<"light" | "dark">(
    () =>
      (localStorage.getItem("carthos_theme") as "light" | "dark") || "light",
  );
  const [language, setLanguage] = useState<"en" | "es">(
    () => (localStorage.getItem("carthos_language") as "en" | "es") || "es",
  );

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem("carthos_language", language);
  }, [language]);

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem("carthos_theme", theme);
    // Also apply to document for global variables if needed
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // ── Multi-map state ──
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [activePath, setActivePath] = useState<LearningPath | null>(null);
  const [mapsLoading, setMapsLoading] = useState(false);
  const [isGeneratingMap, setIsGeneratingMap] = useState(false);

  // Load maps from DB for the logged-in user
  const loadMapsFromDB = async () => {
    setMapsLoading(true);
    try {
      const paths = await mapService.fetchAll();
      setLearningPaths(paths);
      if (paths.length > 0) setActivePath(paths[0]);
    } catch (err) {
      console.error("Could not load maps:", err);
    } finally {
      setMapsLoading(false);
    }
  };

  // Restore session on mount if still valid
  useEffect(() => {
    if (screen === "main") {
      setUserName(localStorage.getItem("carthos_user_name") || "");
      loadMapsFromDB();
    }
  }, []);

  const handleAuthSuccess = async (mode: "login" | "register") => {
    // Refresh session timestamp
    localStorage.setItem("carthos_session_ts", String(Date.now()));
    setUserName(localStorage.getItem("carthos_user_name") || "");
    await loadMapsFromDB();
    if (mode === "login") {
      setScreen("main");
      setActiveTab("progress");
    } else {
      setScreen("onboarding");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("carthos_token");
    localStorage.removeItem("carthos_user_name");
    localStorage.removeItem("carthos_session_ts");
    setLearningPaths([]);
    setActivePath(null);
    setUserName("");
    setScreen("landing");
  };

  const handleOnboardingComplete = async (data: OnboardingData) => {
    try {
      setIsGeneratingMap(true);
      // 1. Generate the map from AI
      const generatedPath = await learningService.generatePath(data, language);
      // 2. Persist it to DB
      const savedPath = await mapService.save(generatedPath);
      // 3. Update local state with the DB version (has real _id)
      setLearningPaths((prev) => [...prev, savedPath]);
      setActivePath(savedPath);
      setScreen("main");
      setActiveTab("map");
    } catch (error) {
      console.error("Error generating/saving path:", error);
      setScreen("main");
      setActiveTab("progress");
    } finally {
      setIsGeneratingMap(false);
    }
  };

  const savePathDebounced = useRef<NodeJS.Timeout | null>(null);

  const activePathRef = useRef(activePath);
  useEffect(() => {
    activePathRef.current = activePath;
  }, [activePath]);

  const handleNodeUpdate = async (nodeId: string, updates: any) => {
    const currentPath = activePathRef.current;
    if (!currentPath) return;

    const updatedNodes = currentPath.nodes.map((n) =>
      n.id === nodeId ? { ...n, ...updates } : n,
    );

    const newPath = { ...currentPath, nodes: updatedNodes };

    // 1. Optimistic local update (INSTANT)
    setActivePath(newPath);
    setLearningPaths((prev) =>
      prev.map((p) => (p.id === newPath.id ? newPath : p)),
    );

    // 2. Debounced server sync
    savePathDebounced.current = setTimeout(async () => {
      try {
        await mapService.update(newPath);
      } catch (error) {
        console.error("Error updating node:", error);
      }
    }, 500);
  };

  const handleDragEnd = async (nodes: any[]) => {
    const currentPath = activePathRef.current;
    if (!currentPath) return;
    const newPath = { ...currentPath, nodes };
    setActivePath(newPath);
    setLearningPaths((prev) =>
      prev.map((p) => (p.id === newPath.id ? newPath : p)),
    );

    if (savePathDebounced.current) clearTimeout(savePathDebounced.current);
    savePathDebounced.current = setTimeout(async () => {
      try {
        await mapService.update(newPath);
      } catch (error) {
        console.error("Error updating node positions:", error);
      }
    }, 1000);
  };

  if (screen === "landing") {
    return (
      <Landing
        onStart={() => {
          setAuthMode("register");
          setScreen("auth");
        }}
        onSignIn={() => {
          setAuthMode("login");
          setScreen("auth");
        }}
        onApiClick={() => {}}
        theme={theme}
        setTheme={setTheme}
        language={language}
        setLanguage={setLanguage}
      />
    );
  }

  if (screen === "auth") {
    return (
      <Auth
        initialMode={authMode}
        onAuthSuccess={handleAuthSuccess}
        language={language}
      />
    );
  }

  if (screen === "onboarding") {
    return (
      <>
        {isGeneratingMap && <GenerationLoader language={language} />}
        <Onboarding onComplete={handleOnboardingComplete} language={language} />
      </>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme === "dark" ? "#0f1416" : "var(--surface)",
        display: "flex",
        flexDirection: "column",
        transition: "background 0.3s ease",
      }}
    >
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        userName={userName}
        theme={theme}
        setTheme={setTheme}
        language={language}
        setLanguage={setLanguage}
      />

      <main style={{ flex: 1, overflow: "hidden auto" }}>
        <AnimatePresence mode="wait">
          {activeTab === "map" && (
            <MapSection
              learningPaths={learningPaths}
              activePath={activePath}
              setActivePath={setActivePath}
              loading={mapsLoading}
              theme={theme}
              language={language}
              onNewMap={() => setScreen("onboarding")}
              onNodeUpdate={handleNodeUpdate}
              onDragEnd={handleDragEnd}
            />
          )}

          {activeTab === "progress" && (
            <ProgressSection
              learningPaths={learningPaths}
              onNavigateToMap={() => setActiveTab("map")}
              language={language}
            />
          )}

          {activeTab === "nodes" && (
            <NodesSection learningPaths={learningPaths} language={language} />
          )}

          {activeTab === "vault" && (
            <VaultSection learningPaths={learningPaths} language={language} />
          )}

          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "calc(100vh - 80px)",
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "3rem",
                letterSpacing: "-0.03em",
                color: "var(--surface-container-high)",
              }}
            >
              Coming Soon
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
