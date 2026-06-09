export interface UserContext {
  ageRange: 'Under 16' | '16–18' | '18–22' | '22–30' | '30+';
  role: 'Student' | 'College Student' | 'Job Seeker' | 'Working Professional' | 'Career Switcher' | 'Entrepreneur';
  field: 'Engineering' | 'Business/Finance' | 'Arts/Media' | 'Science/Research' | 'Law/Social Sciences' | 'Other';
  learningTime: '30 minutes per day' | '1 hour per day' | '2–3 hours per day' | 'weekends only';
  learningStyle: 'Visual learning' | 'Reading/Writing' | 'Hands-on practice' | 'Listening/Discussion';
}

export interface CognitiveProfile extends UserContext {
  age: number;
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
  timestamp: number;
}

export interface DetailedRoadmapPhase {
  phase: string;
  title: string;
  description: string;
  skills: string[];
  tools: string[];
  milestones: string[];
}

export interface DetailedCareerRoadmap {
  careerTitle: string;
  phases: DetailedRoadmapPhase[];
}

export interface RoadmapStage {
  stage: string;
  tasks: string[];
}

export interface CareerPath {
  title: string;
  why: string;
  detailedRoadmap: RoadmapStage[];
}

export interface CognitiveInsights {
  isStandard?: boolean;
  isHeuristic?: boolean;
  archetype: {
    title: string;
    description: string;
    color: string;
  };
  studyMethod: string;
  careerGuide: CareerPath[];
  productivityStyle: string;
  workEnvironment: string;
  summary: string;
  growthAreas: {
    skill: string;
    explanation: string;
    strategy: string;
    resourceLink?: string;
  }[];
}

export interface TestResult {
  type: 'attention' | 'memory' | 'risk' | 'logic' | 'decision' | 'spatial' | 'verbal' | 'learning' | 'eq' | 'numerical' | 'abstract' | 'executive' | 'resilience' | 'aesthetic' | 'performative' | 'auditory' | 'narrative';
  score: number;
  data?: any;
}

export type Difficulty = 'gentle' | 'moderate' | 'challenging';
