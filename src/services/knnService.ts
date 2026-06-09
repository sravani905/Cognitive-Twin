
export interface CognitiveVector {
  focusScore: number;
  memoryScore: number;
  logicScore: number;
  riskScore: number;
  speedScore: number;
  creativityScore: number;
  spatialScore: number;
  verbalScore: number;
  learningStyleScore: number;
  eqScore: number;
  numericalScore: number;
  abstractScore: number;
  executiveScore: number;
  resilienceScore: number;
  aestheticScore: number;
  performativeScore: number;
  auditoryScore: number;
  narrativeScore: number;
}

export interface CareerBenchmark {
  title: string;
  vector: number[];
  category: string;
  description: string;
}

const DIMENSIONS: (keyof CognitiveVector)[] = [
  'focusScore', 'memoryScore', 'logicScore', 'riskScore', 'speedScore', 
  'creativityScore', 'spatialScore', 'verbalScore', 'learningStyleScore', 
  'eqScore', 'numericalScore', 'abstractScore', 'executiveScore', 
  'resilienceScore', 'aestheticScore', 'performativeScore', 
  'auditoryScore', 'narrativeScore'
];

// Benchmark dataset for professional archetypes
const BENCHMARKS: CareerBenchmark[] = [
  {
    title: "AI Research Scientist",
    category: "Science & Tech",
    description: "Deep focus on complex abstract patterns and extreme numerical logic.",
    vector: [95, 80, 98, 40, 60, 70, 50, 40, 20, 30, 95, 98, 85, 90, 20, 10, 10, 30]
  },
  {
    title: "High-Frequency Trader",
    category: "Finance",
    description: "Rapid decision making under high-stakes, risk-intensive environments.",
    vector: [85, 60, 90, 95, 98, 40, 30, 40, 50, 40, 95, 80, 90, 85, 30, 10, 30, 20]
  },
  {
    title: "Cinematic Narrative Designer",
    category: "Arts & Entertainment",
    description: "Mastery of storytelling, world-building, and aesthetic resonance.",
    vector: [60, 70, 50, 60, 40, 95, 80, 85, 0, 75, 20, 70, 70, 70, 95, 80, 70, 98]
  },
  {
    title: "Surgical Neuro-Specialist",
    category: "Healthcare",
    description: "Precise spatial coordination, extreme focus, and resilience.",
    vector: [98, 90, 85, 70, 80, 30, 98, 50, 100, 70, 70, 70, 95, 95, 40, 20, 40, 30]
  },
  {
    title: "Sustainable Urban Planner",
    category: "Design & Environment",
    description: "Balancing spatial constraints with social impact and long-term systems thinking.",
    vector: [80, 75, 85, 40, 50, 70, 95, 70, 30, 85, 60, 90, 85, 80, 75, 40, 50, 70]
  },
  {
    title: "Full-Stack Software Engineer",
    category: "Technology",
    description: "Versatile problem-solving across logical structure and visual interfaces.",
    vector: [85, 80, 90, 30, 60, 75, 60, 60, 40, 50, 80, 85, 85, 80, 60, 20, 40, 50]
  },
  {
    title: "Strategic UX Researcher",
    category: "Design",
    description: "Synthesizing human behavior patterns with logical product architectures.",
    vector: [80, 85, 80, 30, 50, 85, 40, 90, 50, 95, 40, 90, 80, 80, 85, 40, 50, 85]
  },
  {
    title: "Ethical Hacker",
    category: "Technology",
    description: "Extreme pattern recognition, deductive logic, and vigilance.",
    vector: [95, 85, 95, 60, 70, 40, 30, 50, 20, 40, 70, 95, 95, 90, 30, 10, 40, 40]
  },
  {
    title: "Corporate Legal Counsel",
    category: "Legal",
    description: "Exceptional verbal precision, risk mitigation, and executive logic.",
    vector: [90, 95, 95, 40, 60, 30, 20, 98, 20, 75, 50, 95, 98, 90, 40, 60, 50, 90]
  },
  {
    title: "Creative Director",
    category: "Creative",
    description: "High-level vision, aesthetic judgment, and performative leadership.",
    vector: [70, 75, 60, 70, 50, 98, 80, 90, 40, 95, 30, 80, 90, 85, 98, 95, 70, 90]
  },
  {
    title: "Data Architect",
    category: "Technology",
    description: "Numerical mastery, abstract modeling, and structural data frameworks.",
    vector: [85, 80, 95, 40, 60, 80, 40, 85, 30, 60, 98, 98, 85, 85, 60, 30, 40, 85]
  },
  {
    title: "Aeronautical Systems Architect",
    category: "Engineering",
    description: "Balancing complex spatial systems with rigorous executive planning.",
    vector: [90, 85, 95, 50, 70, 60, 95, 60, 10, 50, 90, 85, 98, 90, 50, 10, 50, 40]
  },
  {
    title: "Global Crisis Negotiator",
    category: "Geopolitics",
    description: "Advanced verbal reasoning, EQ, and narrative deconstruction under pressure.",
    vector: [80, 85, 75, 90, 85, 60, 30, 95, 50, 98, 40, 80, 95, 98, 40, 85, 50, 95]
  },
  {
    title: "Healthcare Administrator",
    category: "Management",
    description: "Organizational resilience, empathy, and executive precision.",
    vector: [85, 90, 80, 40, 60, 40, 30, 85, 60, 95, 70, 85, 95, 90, 50, 60, 50, 85]
  },
  {
    title: "Digital Marketing Strategist",
    category: "Business",
    description: "Analytical trend analysis mixed with creative messaging.",
    vector: [75, 80, 85, 60, 80, 90, 30, 90, 50, 85, 80, 85, 80, 80, 85, 70, 40, 90]
  }
];

export function calculateDistance(vec1: number[], vec2: number[]): number {
  return Math.sqrt(
    vec1.reduce((sum, val, i) => sum + Math.pow(val - vec2[i], 2), 0)
  );
}

export function findKNearestCareers(userVector: CognitiveVector, k: number = 3) {
  const userArr = DIMENSIONS.map(dim => userVector[dim] ?? 50);
  
  const distances = BENCHMARKS.map(benchmark => ({
    ...benchmark,
    distance: calculateDistance(userArr, benchmark.vector)
  }));
  
  // Sort by distance (smaller is closer)
  return distances
    .sort((a, b) => a.distance - b.distance)
    .slice(0, k)
    .map(match => ({
      ...match,
      affinityScore: Math.max(0, Math.min(100, Math.round((1 - (match.distance / 250)) * 100))) // Normalized affinity
    }));
}

export function projectTo2D(vector: number[]) {
  // Simple conceptual projection (similar to PCA components)
  // Component 1: Analytical vs Creative balance
  // Component 2: Execution vs Resonancel balance
  const analytical = (vector[0] + vector[2] + vector[4] + vector[10] + vector[11]) / 5;
  const creative = (vector[5] + vector[14] + vector[15] + vector[17]) / 4;
  const execution = (vector[12] + vector[13] + vector[3]) / 3;
  const resonance = (vector[7] + vector[9] + vector[16]) / 3;

  return {
    x: analytical - creative,
    y: execution - resonance
  };
}

export const getProjectedBenchmarks = () => {
  return BENCHMARKS.map(b => ({
    ...b,
    projection: projectTo2D(b.vector)
  }));
};
