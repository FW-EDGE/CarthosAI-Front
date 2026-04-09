import { LearningPath } from "../types";

const BASE = "http://localhost:4040/api/planificaciones";

function getToken(): string {
  return localStorage.getItem("carthos_token") || "";
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    "x-auth-token": getToken(),
  };
}

// ── Map a backend Planificacion doc to our LearningPath shape ──
function toPath(p: any): LearningPath {
  return {
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
  };
}

/** Fetch all maps for the logged-in user */
export async function fetchMaps(): Promise<LearningPath[]> {
  const res = await fetch(BASE, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.msg || "Error fetching maps");
  return (data.planificaciones as any[]).map(toPath);
}

/** Save a newly-generated LearningPath to the DB */
export async function saveMap(path: LearningPath): Promise<LearningPath> {
  const payload = {
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
  };

  const res = await fetch(BASE, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.msg || "Error saving map");
  return toPath(data.planificacion);
}

/** Update an existing planificacion (e.g. node states) */
export async function updateMap(path: LearningPath): Promise<LearningPath> {
  const payload = {
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
  };

  const res = await fetch(`${BASE}/${path.id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.msg || "Error updating map");
  return toPath(data.planificacion);
}
