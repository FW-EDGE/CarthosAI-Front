import { LearningPath, OnboardingData } from "../types";

const API_BASE = import.meta.env.VITE_BACKEND_API_URL;

// ── AUTH SERVICE ───────────────────────────────────────────────

export const authService = {
  getToken: () => localStorage.getItem("carthos_token") || "",

  getHeaders: () => ({
    "Content-Type": "application/json",
    "x-auth-token": localStorage.getItem("carthos_token") || "",
  }),

  async login(payload: any) {
    const res = await fetch(`${API_BASE}/api/userAuth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.msg || "Login failed");
    return data;
  },

  async register(payload: any) {
    const res = await fetch(`${API_BASE}/api/userAuth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.msg || "Registration failed");
    return data;
  },
};

// ── LEARNING ENGINE SERVICE ────────────────────────────────────

export const learningService = {
  async generatePath(data: OnboardingData, language: string = "es") {
    const response = await fetch(`${API_BASE}/api/learning/generate-path`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, language }),
    });
    const json = await response.json();
    if (!response.ok || !json.ok)
      throw new Error(json.error || "Generation failed");
    return json.data;
  },

  async generateNodePlan(node: any, mapId: string, language: string = "es") {
    const response = await fetch(
      `${API_BASE}/api/learning/generate-node-plan`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ node, mapId, language }),
      },
    );
    const json = await response.json();
    if (!response.ok || !json.ok)
      throw new Error(json.error || "Node plan generation failed");
    return json.data;
  },
};

// ── DATABASE / MAPS SERVICE ────────────────────────────────────

const toPath = (p: any): LearningPath => ({
  id: p._id,
  name: p.title,
  description: p.description || "",
  nodes: (p.nodes || []).map((n: any) => ({
    id: n.id,
    title: n.title,
    type: n.type || "course",
    description: n.description || "",
    source: n.source || "",
    location: n.location,
    status: n.status || "unexplored",
    progress: n.progress ?? 0,
    connections: n.connections || [],
    x: n.position?.x,
    y: n.position?.y,
    link: n.link || "",
    image: n.image || "",
    studyPlan: n.studyPlan || null,
  })),
});

const fromPath = (path: LearningPath) => ({
  title: path.name,
  description: path.description,
  nodes: path.nodes.map((n) => ({
    id: n.id,
    title: n.title,
    type: n.type,
    description: n.description,
    source: n.source,
    location: n.location,
    connections: n.connections,
    status: n.status,
    progress: n.progress,
    position: { x: n.x ?? 0, y: n.y ?? 0 },
    link: n.link,
    image: n.image,
    studyPlan: n.studyPlan,
  })),
});

export const mapService = {
  async fetchAll(): Promise<LearningPath[]> {
    const res = await fetch(`${API_BASE}/api/planificaciones`, {
      headers: authService.getHeaders(),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.msg || "Error fetching maps");
    return (data.planificaciones as any[]).map(toPath);
  },

  async save(path: LearningPath): Promise<LearningPath> {
    const res = await fetch(`${API_BASE}/api/planificaciones`, {
      method: "POST",
      headers: authService.getHeaders(),
      body: JSON.stringify(fromPath(path)),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.msg || "Error saving map");
    return toPath(data.planificacion);
  },

  async update(path: LearningPath): Promise<LearningPath> {
    const res = await fetch(`${API_BASE}/api/planificaciones/${path.id}`, {
      method: "PUT",
      headers: authService.getHeaders(),
      body: JSON.stringify(fromPath(path)),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.msg || "Error updating map");
    return toPath(data.planificacion);
  },
};
