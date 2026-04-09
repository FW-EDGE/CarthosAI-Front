import { OnboardingData } from "../types";

export async function generateLearningPath(data: OnboardingData, language: string = "es") {
  try {
    const response = await fetch("http://localhost:4040/api/learning/generate-path", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, language }),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const json = await response.json();
    if (!json.ok) {
      throw new Error(json.error || "Error al generar learning path");
    }

    return json.data;
  } catch (error) {
    console.error("Error en generateLearningPath:", error);
    throw error;
  }
}

export async function generateNodePlan(node: any, mapId: string, language: string = "es") {
  try {
    const response = await fetch("http://localhost:4040/api/learning/generate-node-plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ node, mapId, language }),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const json = await response.json();
    if (!json.ok) {
      throw new Error(json.error || "Error al generar el plan del nodo");
    }

    return json.data;
  } catch (error) {
    console.error("Error en generateNodePlan:", error);
    throw error;
  }
}
