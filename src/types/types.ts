export type ResourceType = 'book' | 'chapter' | 'article' | 'video' | 'podcast' | 'course';

export interface LearningNode {
  id: string;
  title: string;
  type: ResourceType;
  description: string;
  source: string;       // e.g., "The Pragmatic Programmer"
  location?: string;    // e.g., "Pág 12-45" or "Chapter 3"
  status: 'completed' | 'in-progress' | 'unexplored' | 'locked';
  progress: number;     // 0 to 100
  connections: string[];// IDs of other nodes
  x?: number;           // for visualization
  y?: number;           // for visualization
  link?: string;        // External URL to the resource (e.g., Coursera, Amazon, etc.)
  image?: string;       // Image URL for the resource representation
  studyPlan?: {
    steps: Array<{
      stage: string;
      focus: string;
      action: string;
      estimatedTime: string;
      isCompleted: boolean;
    }>;
  };
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  nodes: LearningNode[];
}

/**
 * Data collected during the "Create New Map" onboarding flow.
 *
 * - category  → the broad domain lens (e.g. "Technology")
 * - depth     → desired level of understanding
 * - topic     → the specific subject the user wants to explore
 *               (e.g. "football" → map will be about Technology in Football)
 */
export interface OnboardingData {
  category: string;
  depth: 'surface' | 'professional' | 'academic';
  topic: string;
}

export interface UserProfile {
  interests: string[];
  goals: string;
  progress: {
    totalMastery: number;
    conceptsLinked: number;
    spheresCompleted: number;
  };
}
