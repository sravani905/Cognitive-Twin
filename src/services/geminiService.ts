import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { findKNearestCareers } from "./knnService";
import { UNIVERSAL_ROADMAPS } from "../constants/universalRoadmaps";
import { PRELOADED_COGNITIVE_SETS, PreloadedSet } from "../constants/preloadedCognitiveSets";

export function getNearestPreloadedSet(metrics: any): PreloadedSet {
  if (!metrics || Object.keys(metrics).length === 0) {
    const randomIndex = Math.floor(Math.random() * PRELOADED_COGNITIVE_SETS.length);
    return PRELOADED_COGNITIVE_SETS[randomIndex];
  }

  let bestSet = PRELOADED_COGNITIVE_SETS[0];
  let minDistance = Infinity;

  for (const set of PRELOADED_COGNITIVE_SETS) {
    let sumSquaredDiff = 0;
    let count = 0;

    for (const key of Object.keys(set.idealScores)) {
      const userVal = metrics[key] !== undefined 
          ? Number(metrics[key]) 
          : (metrics[key.replace('Score', '')] !== undefined ? Number(metrics[key.replace('Score', '')]) : 70);
      const idealVal = (set.idealScores as any)[key];
      sumSquaredDiff += Math.pow(userVal - idealVal, 2);
      count++;
    }

    const distance = Math.sqrt(sumSquaredDiff) / (count || 1);
    if (distance < minDistance) {
      minDistance = distance;
      bestSet = set;
    }
  }

  return bestSet;
}

const getApiKey = () => {
  try {
    const userKey = localStorage.getItem('COGNITIVE_TWIN_USER_KEY');
    if (userKey && userKey.trim() !== "" && userKey !== "MY_GEMINI_API_KEY") return userKey;
  } catch (e) {}
  const systemKey = (typeof process !== 'undefined' && process.env.GEMINI_API_KEY) || (import.meta as any).env?.VITE_GEMINI_API_KEY || "";
  if (systemKey === "MY_GEMINI_API_KEY" || systemKey.trim() === "") return "";
  return systemKey;
};

export const hasValidKey = () => {
  const key = getApiKey();
  return !!key && key !== "MY_GEMINI_API_KEY";
};

const getAI = () => {
  return new GoogleGenAI({ apiKey: getApiKey() });
};

class LocalStream {
  private words: string[];
  constructor(text: string) {
    this.words = text.split(/\s+/);
  }
  async *[Symbol.asyncIterator]() {
    for (const word of this.words) {
      yield { text: word + " " };
      await new Promise(resolve => setTimeout(resolve, Math.random() * 15 + 10));
    }
  }
}

// Tool to check current source
export const getApiKeyInfo = () => {
  let userKey = null;
  try {
    userKey = localStorage.getItem('COGNITIVE_TWIN_USER_KEY');
  } catch (e) {}
  return {
    isUserKey: !!userKey,
    hasSystemKey: !!((typeof process !== 'undefined' && process.env.GEMINI_API_KEY) || (import.meta as any).env?.VITE_GEMINI_API_KEY)
  };
};

// Safe access to ThinkingLevel enum for varying SDK versions
const ThinkingLevelEnum = (ThinkingLevel as any) || { HIGH: 'high', LOW: 'low' };

// --- DEFAULT FALLBACK DATA ---
export const DEFAULT_INSIGHTS = {
  isStandard: true,
  archetype: {
    title: "The Balanced Architect",
    description: "A versatile cognitive profile with strong synthesis and structural thinking capabilities.",
    color: "#4F46E5"
  },
  studyMethod: "Active Recall & Interleaved Practice",
  careerGuide: [
    {
      title: "Solutions Architect",
      why: "Your balance of logic and spatial reasoning allows you to visualize complex systems effectively.",
      detailedRoadmap: [
        { stage: "System Foundations", tasks: ["Cloud Fundamentals", "Network Architecture"] },
        { stage: "Scalability Mastery", tasks: ["Distributed Systems", "Database Optimization"] }
      ]
    },
    {
      title: "Product Strategist",
      why: "High EQ and memory scores suggest an ability to synthesize user needs with technical constraints.",
      detailedRoadmap: [
        { stage: "Market Analysis", tasks: ["User Research", "Competitive Mapping"] },
        { stage: "Launch Execution", tasks: ["Feature Prioritization", "Metric Tracking"] }
      ]
    }
  ],
  productivityStyle: "Time Blocking with Narrative Context",
  workEnvironment: "Hybrid / Collaborative Research Hub",
  summary: "Your profile exhibits a unique blend of structural logic and intuitive synthesis, suitable for complex problem-solving environments.",
  growthAreas: [
    {
      skill: "Cognitive Endurance",
      explanation: "Current metrics suggest a high peak performance but potential for early fatigue.",
      strategy: "Implement 90-minute ultradian rhythm cycles with complete sensory resets.",
      resourceLink: "https://www.youtube.com/results?search_query=ultradian+rhythms+for+focus"
    }
  ]
};

export const DEFAULT_ROADMAP = {
  isStandard: true,
  careerTitle: "Global Systems Specialist",
  description: "A comprehensive path toward mastering complex system architectures and organizational logic.",
  phases: [
    {
      phase: "Phase 1",
      title: "Foundational Flux",
      description: "Establishing the core technical stack and cognitive baseline.",
      skills: ["Analytical Synthesis", "Data Structures"],
      tools: ["Git", "IDE Precision"],
      milestones: ["Stack Certification", "First Deployment"],
      freeResources: ["freeCodeCamp Computer Science", "MIT OpenCourseWare"]
    },
    {
      phase: "Phase 2",
      title: "Neural Integration",
      description: "Advanced application of concepts to real-world architectural problems.",
      skills: ["System Design", "Risk Assessment"],
      tools: ["Docker", "Kubernetes"],
      milestones: ["Architectural Review", "Performance Audit"],
      freeResources: ["System Design Primer (GitHub)", "DevOps Roadmap"]
    }
  ]
};

export const DEFAULT_MARKET = {
  isStandard: true,
  emergingSkills: ["Edge AI Management", "Cognitive Interface Design", "Ethical Logic Guardianship"],
  topCertification: "Strategic Implementation Professional (SIP)",
  marketDemand: "High (Rapidly Expanding)",
  resourceLink: "https://www.linkedin.com/learning/"
};

export const DEFAULT_STUDY_PLAN = {
  isStandard: true,
  title: "Neural Synergy Protocol",
  overview: "A balanced 5-day protocol designed to optimize cognitive load and retention.",
  schedule: [
    {
      day: "Day 1",
      theme: "Foundations & Mapping",
      tasks: [
        { 
          task: "Core Conceptual Mapping", 
          goal: "Establish conceptual anchors and mental hierarchy", 
          timeRequired: "1.5 hrs",
          whyMatters: "Building a strong foundation prevents cognitive overload in later stages.",
          resources: ["Standard Logic Frameworks", "Research Methodology Guide"]
        }
      ]
    },
    {
      day: "Day 2",
      theme: "Logic & Analysis",
      tasks: [
        { 
          task: "Deductive Reasoning Sprint", 
          goal: "Sharpen pattern matching and deductive logic", 
          timeRequired: "1.2 hrs",
          whyMatters: "Logic is the engine of skill acquisition and problem-solving speed.",
          resources: ["Logic Puzzles", "Mathematical Thinking PDF"]
        }
      ]
    }
  ]
};

export const DEFAULT_PROPOSALS = {
  proposals: [
    {
      target: "Cognitive Reserve",
      science: "Neuroplasticity thrives on varied sensory input and deliberate rest cycles.",
      protocol: ["20-minute Non-Sleep Deep Rest (NSDR)", "Cold Water Immersion (Face)", "Binaural Beats (40Hz)"],
      metricImpact: "Memory & Resilience"
    },
    {
      target: "Executive Speed",
      science: "Fast decision-making is a byproduct of efficient pattern matching and reduced noise.",
      protocol: ["Daily 5-minute Dual N-Back", "Decision Tree Mapping", "Timed Logic Sprints"],
      metricImpact: "Speed & Logic"
    }
  ]
};

// --- LOGIC ---

const getHeuristicInsights = (profile: any) => {
  const bestSet = getNearestPreloadedSet(profile);
  return {
    isStandard: false,
    isHeuristic: true,
    archetype: {
      title: bestSet.archetype.title,
      description: bestSet.archetype.description,
      color: bestSet.archetype.color
    },
    studyMethod: bestSet.studyMethod,
    productivityStyle: bestSet.productivityStyle,
    workEnvironment: bestSet.workEnvironment,
    careerGuide: bestSet.careerGuide,
    summary: `Local Decision-Tree analysis successfully matched your cognitive parameters to the "${bestSet.archetype.title}" profile. ${bestSet.summary}`,
    growthAreas: bestSet.growthAreas
  };
};

const getHeuristicComparison = (base: any, current: any) => {
  const metrics = ['focus', 'memory', 'logic', 'speed', 'creativity'];
  const deltas = metrics.map(m => {
    const prev = base.metrics[`${m}Score`] || 50;
    const curr = current.metrics[`${m}Score`] || 50;
    const diff = curr - prev;
    return {
      metric: m.charAt(0).toUpperCase() + m.slice(1),
      prevValue: prev,
      currValue: curr,
      change: diff > 0 ? `+${diff}%` : `${diff}%`,
      symbol: diff > 0 ? "up" : diff < 0 ? "down" : "stable",
      interpretation: diff > 5 ? "Significant neural optimization detected." : diff < -5 ? "Temporary cognitive fatigue or noise." : "Stable baseline maintained."
    };
  });

  return {
    isHeuristic: true,
    overallTrend: "Analyzing local delta patterns between snapshots.",
    metricDeltas: deltas,
    archetypeEvolution: `Transitioning from ${base.insights?.archetype?.title || 'Initial Path'} toward ${current.insights?.archetype?.title || 'Current Convergence'}.`,
    criticalInsight: "Local analysis suggests your focus stability is the primary driver of this evolution."
  };
};

const getHeuristicForecast = (profile: any) => {
  const m = profile;
  return {
    isHeuristic: true,
    projectedMetrics: {
      focus: Math.min(100, (m.focusScore || 50) + 8),
      memory: Math.min(100, (m.memoryScore || 50) + 5),
      logic: Math.min(100, (m.logicScore || 50) + 10),
      speed: Math.min(100, (m.speedScore || 50) + 6),
      creativity: Math.min(100, (m.creativityScore || 50) + 4)
    },
    evolutionaryNarrative: "Projecting 30-day neural optimization. Expected breakthrough in deductive synthesis and executive latency.",
    volatilityFactor: 65,
    breakthroughPotential: "A sudden 'flow' state discovery during deep work cycles."
  };
};

const getHeuristicCircadian = (profile: any) => {
  const isNightOwl = (profile.speedScore || 50) > 70;
  return {
    isHeuristic: true,
    chronotype: {
      title: isNightOwl ? "Night Raptor" : "Dawn Sentinel",
      description: isNightOwl ? "Peak neural activity occurs during late-day cycles." : "Maximum cognitive clarity during early morning synchronization.",
      energyPeakTime: isNightOwl ? "21:00 - 01:00" : "07:00 - 11:00"
    },
    schedule: [
      { time: "08:00", activity: "Neural Prep", neuralPhase: "Reset", recommendation: "Hydration and light exposure" },
      { time: "10:00", activity: "Deep Work", neuralPhase: "Focus", recommendation: "High-logic tasks" },
      { time: "14:00", activity: "Narrative Sync", neuralPhase: "Creative", recommendation: "Collaborative cycles" },
      { time: "17:00", activity: "Physical Integration", neuralPhase: "Reset", recommendation: "Kinetic reset" },
      { time: "22:00", activity: "Memory Consolidation", neuralPhase: "Sleep", recommendation: "Blue light elimination" }
    ],
    biologyHack: "Use 40Hz binaural beats during your peak focus window to stabilize neural resonance."
  };
};

export const getHeuristicChatReply = (message: string, profile: any) => {
  const m = profile?.metrics || {};
  const bestSet = getNearestPreloadedSet(m);
  const archetype = bestSet.archetype.title;
  
  const responses = [
    `Analyzing your neural patterns... Your matched profile is "${archetype}". I highly recommend focusing on "${bestSet.studyMethod}" today.`,
    `Reflecting on your parameters: For maximum throughput, using a "${bestSet.productivityStyle}" productivity model is highly recommended.`,
    `Cognitive alignment suggests your ideal work environment is a "${bestSet.workEnvironment}". Let's structure our tasks around that.`,
    `SYSTEM NOTICE: Local decision-tree matches your scores within nominal parameters for the "${archetype}" model.`,
    `Regarding your inquiry "${message}": For your profile, I recommend prioritizing: ${bestSet.growthAreas[0]?.strategy || 'continuous learning and resilience'}.`
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

export const getHeuristicResilience = (profile: any) => {
  const r = profile.metrics?.resilienceScore || 50;
  return {
    isHeuristic: true,
    stressProfile: r < 40 ? "High Vulnerability" : r > 70 ? "High Stability" : "Adaptive Balance",
    strategies: [
      "Implement 40Hz binaural audio during cognitive peaks.",
      "Neural decompression through 5-mute box breathing after logic sprints.",
      "Perspective shifting: treat data failures as learning vectors."
    ],
    reframingPrompts: [
      "How would a technical system handle this unexpected input?",
      "Is this a threat to my core identity or just transient system noise?",
      "What is the single most logical next operation?"
    ]
  };
};

export const getBehavioralInsight = (metrics: any, profile: any) => {
  const { typingSpeed, mouseJitter, interactionFrequency } = metrics;
  const isHighLoad = mouseJitter > 60 || interactionFrequency > 100;
  
  return {
    isHeuristic: true,
    state: isHighLoad ? "High Cognitive Load" : "Steady Flow",
    observation: isHighLoad 
      ? "Increasing interaction jitter suggests potential executive fatigue."
      : "Steady input cadence indicates high neural synchronization.",
    recommendation: isHighLoad ? "Immediate 5-minute cognitive reset recommended." : "Maintain current focus window."
  };
};

export async function generateCognitiveInsights(profile: any) {
  if (!hasValidKey()) {
    console.log("No API Key detected. Returning heuristic insights instantly.");
    return getHeuristicInsights(profile);
  }

  const model = "gemini-3.5-flash";
  
  const prompt = `
    Analyze the following cognitive profile and provide personalized insights.
    
    User Context Profile:
    - Name: ${profile.name || 'Subject'}
    - Gender: ${profile.gender || 'Not Specified'}
    - Age Range: ${profile.ageRange}
    - Current Role: ${profile.role}
    - Field of Study/Work: ${profile.field}
    - Available Learning Time: ${profile.learningTime}
    - Preferred Learning Style: ${profile.learningStyle}
    
    Profile Metrics:
    - Focus Index: ${profile.focusScore}/100
    - Memory Strength: ${profile.memoryScore}/100
    - Analytical Thinking: ${profile.logicScore}/100
    - Risk Appetite: ${profile.riskScore}/100
    - Decision Speed: ${profile.speedScore}/100
    - Creativity Level: ${profile.creativityScore}/100
    - Spatial Awareness: ${profile.spatialScore || 50}/100
    - Verbal Reasoning: ${profile.verbalScore || 50}/100
    - EQ: ${profile.eqScore || 50}/100
    - Numerical: ${profile.numericalScore || 50}/100
    - Abstract: ${profile.abstractScore || 50}/100
    - Executive: ${profile.executiveScore || 50}/100
    - Resilience: ${profile.resilienceScore || 50}/100
    - Aesthetic: ${profile.aestheticScore || 50}/100
    - Performative: ${profile.performativeScore || 50}/100
    - Auditory: ${profile.auditoryScore || 50}/100
    - Narrative: ${profile.narrativeScore || 50}/100
    
    Format the response in JSON. Apply the provided schema.
  `;

  const parseOrFallback = (text: string | undefined): any => {
    try {
      const data = JSON.parse(text || "{}");
      if (!data.archetype || !data.careerGuide) {
        throw new Error("Invalid structure");
      }
      return data;
    } catch (e) {
      console.warn("Parsing failed or invalid structure, using heuristic fallback.");
      return getHeuristicInsights(profile);
    }
  };

  try {
    const response = await getAI().models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            archetype: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                color: { type: Type.STRING }
              },
              required: ["title", "description", "color"]
            },
            studyMethod: { type: Type.STRING },
            careerGuide: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  why: { type: Type.STRING },
                  detailedRoadmap: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        stage: { type: Type.STRING },
                        tasks: { type: Type.ARRAY, items: { type: Type.STRING } }
                      },
                      required: ["stage", "tasks"]
                    }
                  }
                },
                required: ["title", "why", "detailedRoadmap"]
              }
            },
            productivityStyle: { type: Type.STRING },
            workEnvironment: { type: Type.STRING },
            summary: { type: Type.STRING },
            growthAreas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skill: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  strategy: { type: Type.STRING },
                  resourceLink: { type: Type.STRING }
                },
                required: ["skill", "explanation", "strategy", "resourceLink"]
              }
            }
          },
          required: ["archetype", "studyMethod", "careerGuide", "productivityStyle", "workEnvironment", "summary", "growthAreas"]
        }
      }
    });

    return parseOrFallback(response.text);
  } catch (error) {
    console.error("Pro failed, trying Flash:", error);
    try {
      const fallback = await getAI().models.generateContent({
        model: "gemini-3.5-flash",
        contents: [{ parts: [{ text: prompt }] }],
        config: { responseMimeType: "application/json" }
      });
      return parseOrFallback(fallback.text);
    } catch (fErr) {
      console.warn("API Failure. Using Heuristic Mapping.");
      return getHeuristicInsights(profile);
    }
  }
}

export async function generateDetailedRoadmap(careerTitle: string, profile: any) {
  // Check for Universal Preloaded Roadmaps first - case-insensitive and flexible key matching
  const normalizedTitle = (careerTitle || "").toLowerCase().trim();
  const matchedKey = Object.keys(UNIVERSAL_ROADMAPS).find(k => {
    const kNorm = k.toLowerCase().trim();
    return kNorm === normalizedTitle || kNorm.includes(normalizedTitle) || normalizedTitle.includes(kNorm);
  });

  if (matchedKey) {
    console.log(`Using universal preloaded roadmap for: ${matchedKey}`);
    const roadmap = JSON.parse(JSON.stringify(UNIVERSAL_ROADMAPS[matchedKey]));
    
    // Auto-enrich phases with descriptions and resources to prevent any layout deficiencies
    roadmap.phases = (roadmap.phases || []).map((phase: any, idx: number) => {
      const milestones = phase.milestones && phase.milestones.length > 0 
        ? phase.milestones 
        : (phase.tasks || [`Mastery phase completion of ${phase.title || "Foundations"}`]);
      return {
        phase: phase.phase || `Phase ${idx + 1}`,
        title: phase.title || "Strategic Execution",
        description: phase.description || `Build high-quality mastery of essential skills, tools, and practices required to excel in ${matchedKey} targets during this stage.`,
        skills: phase.skills || [],
        tools: phase.tools || [],
        milestones: milestones,
        resources: phase.resources || phase.freeResources || [
          `${matchedKey} ${phase.title || "Domain"} Mastery Guide`,
          `Interactive ${matchedKey} Practice Sandbox`,
          "Open Learning Core Collaborative Syllabus"
        ],
        freeResources: phase.freeResources || phase.resources || [
          `${matchedKey} ${phase.title || "Domain"} Mastery Guide`
        ]
      };
    });

    return { ...roadmap, careerTitle: matchedKey, id: `universal_${Date.now()}` };
  }

  if (!hasValidKey()) {
    console.log("No API Key detected. Simulating roadmap generation through nearest preloaded career guides.");
    const bestSet = getNearestPreloadedSet(profile);
    const matchedGuide = bestSet.careerGuide.find(c => c.title.toLowerCase() === careerTitle.toLowerCase());
    if (matchedGuide) {
      return {
        careerTitle,
        phases: matchedGuide.detailedRoadmap.map((p, idx) => ({
          phase: `Phase ${idx + 1}`,
          title: p.stage,
          description: `Custom roadmap designed for the "${bestSet.archetype.title}" archetype using client-side decision-tree classification.`,
          skills: p.tasks.slice(0, 2),
          tools: p.tasks.slice(1, 4),
          milestones: p.tasks || [`Mastery of ${p.stage}`],
          resources: ["K-NN Interactive Reference Study Guide", "Cogme Twin Open Learning Repository"],
          freeResources: ["K-NN Interactive Reference Study Guide", "Cogme Twin Open Learning Repository"]
        }))
      };
    }

    for (const set of PRELOADED_COGNITIVE_SETS) {
      const g = set.careerGuide.find(c => c.title.toLowerCase() === careerTitle.toLowerCase());
      if (g) {
        return {
          careerTitle,
          phases: g.detailedRoadmap.map((p, idx) => ({
            phase: `Phase ${idx + 1}`,
            title: p.stage,
            description: `Custom roadmap designed for the "${set.archetype.title}" archetype using client-side decision-tree classification.`,
            skills: p.tasks.slice(0, 2),
            tools: p.tasks.slice(1, 4),
            milestones: p.tasks || [`Mastery of ${p.stage}`],
            resources: ["K-NN Interactive Reference Study Guide", "Cogme Twin Open Learning Repository"],
            freeResources: ["K-NN Interactive Reference Study Guide", "Cogme Twin Open Learning Repository"]
          }))
        };
      }
    }

    const match = findKNearestCareers(profile, 10).find(m => m.title === careerTitle);
    return { 
      ...DEFAULT_ROADMAP, 
      careerTitle, 
      description: match?.description || DEFAULT_ROADMAP.description,
      isStandard: true 
    };
  }

  const model = "gemini-3.5-flash";
  
  const prompt = `
    Generate a personalized 5-phase career roadmap for "${careerTitle}".
    
    Cognitive Context:
    - Strengths/Metrics: ${JSON.stringify(profile)}
    - Background: ${profile.role} in ${profile.field}
    
    The roadmap must be highly specific to how THIS cognitive profile would excel in THIS career. 
    If they have high logic scores, focus on technical architecture and systems. If they have high EQ/Narrative scores, focus on leadership, influence, and mentorship aspects of the role.
    
    Format as JSON.
  `;

  try {
    const response = await getAI().models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            careerTitle: { type: Type.STRING },
            phases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phase: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  tools: { type: Type.ARRAY, items: { type: Type.STRING } },
                  milestones: { type: Type.ARRAY, items: { type: Type.STRING } },
                  freeResources: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["phase", "title", "description", "skills", "tools", "milestones", "freeResources"]
              }
            }
          },
          required: ["careerTitle", "phases"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.warn("Roadmap generation failed. Matching with preloaded career guide paths.");
    const bestSet = getNearestPreloadedSet(profile);
    const matchedGuide = bestSet.careerGuide.find(c => c.title.toLowerCase() === careerTitle.toLowerCase());
    if (matchedGuide) {
      return {
        careerTitle,
        phases: matchedGuide.detailedRoadmap.map((p, idx) => ({
          phase: `Phase ${idx + 1}`,
          title: p.stage,
          description: `Custom roadmap designed for the "${bestSet.archetype.title}" archetype using client-side decision-tree classification.`,
          skills: p.tasks.slice(0, 2),
          tools: p.tasks.slice(1, 4),
          milestones: [`Mastery of ${p.stage}`],
          freeResources: ["K-NN Interactive Reference Study Guide", "Cogme Twin Open Learning Repository"]
        }))
      };
    }

    for (const set of PRELOADED_COGNITIVE_SETS) {
      const g = set.careerGuide.find(c => c.title.toLowerCase() === careerTitle.toLowerCase());
      if (g) {
        return {
          careerTitle,
          phases: g.detailedRoadmap.map((p, idx) => ({
            phase: `Phase ${idx + 1}`,
            title: p.stage,
            description: `Custom roadmap designed for the "${set.archetype.title}" archetype using client-side decision-tree classification.`,
            skills: p.tasks.slice(0, 2),
            tools: p.tasks.slice(1, 4),
            milestones: [`Mastery of ${p.stage}`],
            freeResources: ["K-NN Interactive Reference Study Guide", "Cogme Twin Open Learning Repository"]
          }))
        };
      }
    }

    const match = findKNearestCareers(profile, 10).find(m => m.title === careerTitle);
    return { 
      ...DEFAULT_ROADMAP, 
      careerTitle, 
      description: match?.description || DEFAULT_ROADMAP.description,
      isStandard: true 
    };
  }
}

export async function getMarketInsights(careerTitle: string, profile: any) {
  if (!hasValidKey()) {
    console.log("No API Key detected. Returning static market insights immediately.");
    return { ...DEFAULT_MARKET, isStandard: true };
  }

  const model = "gemini-3.5-flash";
  const prompt = `Research market trends for "${careerTitle}". Context: ${profile.role}. Format as JSON.`;

  try {
    const response = await getAI().models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            emergingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            topCertification: { type: Type.STRING },
            marketDemand: { type: Type.STRING },
            resourceLink: { type: Type.STRING }
          },
          required: ["emergingSkills", "topCertification", "marketDemand", "resourceLink"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.warn("Market insights failed. Using standard data.");
    return { ...DEFAULT_MARKET, isStandard: true };
  }
}

export async function chatWithTwinStream(history: { role: 'user' | 'model', content: string }[], profile: any, customContext?: string) {
  if (!hasValidKey()) {
    console.log("No API Key detected. Directing chatbot to stream heuristic reply locally.");
    const replyText = getHeuristicChatReply(history[history.length - 1]?.content || "", profile);
    return new LocalStream(replyText);
  }

  const model = "gemini-3.5-flash";
  const { metrics, insights } = profile;
  
  const systemInstruction = `
    You are the user's "Cognitive Twin".
    Profile: ${JSON.stringify(metrics)}
    Archetype: ${insights?.archetype?.title || 'Unknown'}
    
    Structure: STRENGTHS, VULNERABILITIES, ASSESSMENT, RECOMMENDATIONS.
    Precision mode active. Avoid over-determination.
  `;

  try {
    return await getAI().models.generateContentStream({
      model,
      contents: history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.content }] })),
      config: {
        systemInstruction,
      }
    });
  } catch (error) {
    console.error("Chat Stream failed:", error);
    throw error; // Let the component handle it with a retry UI
  }
}

export async function generateDynamicTestQuestions(testType: string, difficulty: string, profile?: any) {
  if (!hasValidKey()) {
    console.log("No API Key detected. Using local preloaded diagnostic testing pool.");
    return [];
  }

  const model = "gemini-3.5-flash";
  const randomSeed = Math.random().toString(36).substring(7);
  const userProfileInfo = profile ? `User Profile Info - Field: ${profile.field || 'General'}, Focus Area: ${profile.interests || 'Cognitive Exploration'}` : '';
  const prompt = `
    Generate 5 unique, diverse, and highly personalized "${testType}" cognitive test questions tailored to learn and understand the user better.
    Difficulty Level: ${difficulty}.
    ${userProfileInfo}
    
    CRITICAL: 
    - Do NOT repeat common or cliché questions. 
    - Ensure a mix of abstract, concrete, and scenario-based problems.
    - Each question should have 3-4 distinct options and one clear correct answer index.
    - Randomization Seed: ${randomSeed} (Use this to ensure high entropy in your choices).
    - Leverage the user's field and focus level to seamlessly personalize these questions to challenge their domain of expertise and explore adjacent cognitive areas.
    
    Format the output as a JSON array of objects with the structure: { q: string, a: string[], correct: number, scores: number[] }.
    If the question is subjective (like Risk or Creativity), use 'scores' array to assign value to each option (0-100).
  `;

  try {
    const response = await getAI().models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" }
    });

    const parsed = JSON.parse(response.text || "[]");
    // Ensure we actually got an array
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn(`Dynamic questions failed for ${testType}. Using static pool.`);
    return []; // Tests.tsx handles this by slicing the static pool
  }
}

export async function generateStudyPlan(profile: any, goals: string) {
  if (!hasValidKey()) {
    console.log("No API Key detected. Using local preloaded training plan synthesizer.");
    return { ...DEFAULT_STUDY_PLAN, subject: goals };
  }

  const model = "gemini-3.5-flash";
  const { metrics, insights } = profile;
  
  const prompt = `
    Generate a highly personalized, 5-day cognitive-optimized study plan.
    
    SYSTEM CONTEXT:
    The user is participating in a high-performance cognitive training program. 
    Design the plan to maximize neuroplasticity and retention.
    
    INPUT:
    - Goal: ${goals}
    - Cognitive Profile: ${metrics.learningStyle}, Logic Score: ${metrics.logicScore}%, Focus: ${metrics.focusScore}%, Memory: ${metrics.memoryScore}%
    - Strengths: ${JSON.stringify(insights?.archetype?.strengths || [])}
    
    CRITICAL REQUIREMENTS:
    1. Day 1 MUST be a "Digital Fasting" protocol: focus on high-level conceptual mapping, physical note-taking, and mental rehearsal without digital distractions (except for brief sessions). Explain WHY this is used for baseline dopamine reset.
    2. Integrate Visual Learning: Use mapping, spatial visualization, and "Mental Canvasing" if the profile is visual.
    3. Integrate Logic-Based Techniques: Use first-principles thinking, structural decomposition, and logical proof-based learning for the goal.
    4. Provide a day-by-day breakdown for 5 days.
    
    Format output as JSON:
    {
      "title": "Course Title",
      "subject": "${goals}",
      "overview": "Overall plan description",
      "schedule": [
        {
          "day": "Day 1: Digital Fasting",
          "theme": "...",
          "tasks": [
            { "task": "...", "duration": "...", "technique": "...", "focus": "..." }
          ]
        }
      ],
      "recommendations": ["Recommendation 1", "Recommendation 2"]
    }
  `;

  try {
    const response = await getAI().models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json"
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result;
  } catch (error) {
    console.warn("Study plan generation failed:", error);
    return { ...DEFAULT_STUDY_PLAN, subject: goals };
  }
}

export async function generateOptimizationProposals(profile: any) {
  if (!hasValidKey()) {
    console.log("No API Key detected. Using local optimization proposals.");
    return { ...DEFAULT_PROPOSALS, isStandard: true };
  }

  const model = "gemini-3.5-flash";
  const prompt = `Science-backed Optimization Proposals for profile: ${JSON.stringify(profile)}. Format as JSON.`;

  try {
    const response = await getAI().models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            proposals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  target: { type: Type.STRING },
                  science: { type: Type.STRING },
                  protocol: { type: Type.ARRAY, items: { type: Type.STRING } },
                  metricImpact: { type: Type.STRING }
                },
                required: ["target", "science", "protocol", "metricImpact"]
              }
            }
          },
          required: ["proposals"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.warn("Optimization failed. Using science baseline.");
    return { ...DEFAULT_PROPOSALS, isStandard: true };
  }
}

export async function generateComparison(base: any, current: any) {
  if (!hasValidKey()) {
    console.log("No API Key detected. Performing local heuristic delta-mapping.");
    return getHeuristicComparison(base, current);
  }

  const model = "gemini-3.5-flash";
  const prompt = `
    Compare two cognitive profiles and highlight improvements, regressions, and qualitative changes.
    
    BASE PROFILE (Older):
    Metrics: ${JSON.stringify(base.metrics)}
    Archetype: ${base.insights?.archetype?.title}
    
    CURRENT PROFILE (Newer):
    Metrics: ${JSON.stringify(current.metrics)}
    Archetype: ${current.insights?.archetype?.title}
    
    Provide a detailed comparison in JSON format. Explain NOT JUST THAT scores changed, but what that shift means for the user's cognitive performance.
  `;

  try {
    const response = await getAI().models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallTrend: { type: Type.STRING },
            metricDeltas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  metric: { type: Type.STRING },
                  prevValue: { type: Type.NUMBER },
                  currValue: { type: Type.NUMBER },
                  change: { type: Type.STRING },
                  interpretation: { type: Type.STRING },
                  symbol: { type: Type.STRING, description: "up, down, or stable" }
                },
                required: ["metric", "prevValue", "currValue", "change", "interpretation", "symbol"]
              }
            },
            archetypeEvolution: { type: Type.STRING },
            criticalInsight: { type: Type.STRING }
          },
          required: ["overallTrend", "metricDeltas", "archetypeEvolution", "criticalInsight"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Comparison failed:", error);
    return getHeuristicComparison(base, current);
  }
}

export async function generateForecast(profile: any) {
  if (!hasValidKey()) {
    console.log("No API Key detected. Performing local heuristic trend projection.");
    return getHeuristicForecast(profile);
  }

  const model = "gemini-3.5-flash";
  const prompt = `
    Based on the following cognitive profile, perform a "Neural Forecast" 30 days into the future if the user follows optimization protocols perfectly vs if they don't change anything.
    
    Profile: ${JSON.stringify(profile)}
    
    Output JSON with:
    1. projectedMetrics: { focus, memory, logic, speed, creativity } (percentage values)
    2. evolutionaryNarrative: A speculative story of their cognitive self 30 days from now.
    3. volatilityFactor: 1-100 (how likely this is to change)
    4. breakthroughPotential: String describing a likely "click" moment.
  `;

  try {
    const response = await getAI().models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            projectedMetrics: {
              type: Type.OBJECT,
              properties: {
                focus: { type: Type.NUMBER },
                memory: { type: Type.NUMBER },
                logic: { type: Type.NUMBER },
                speed: { type: Type.NUMBER },
                creativity: { type: Type.NUMBER }
              },
              required: ["focus", "memory", "logic", "speed", "creativity"]
            },
            evolutionaryNarrative: { type: Type.STRING },
            volatilityFactor: { type: Type.NUMBER },
            breakthroughPotential: { type: Type.STRING }
          },
          required: ["projectedMetrics", "evolutionaryNarrative", "volatilityFactor", "breakthroughPotential"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Forecast failed:", error);
    return getHeuristicForecast(profile);
  }
}

export async function generateCircadianSchedule(profile: any) {
  if (!hasValidKey()) {
    console.log("No API Key detected. Calibrating local circadian focus scheduling.");
    return getHeuristicCircadian(profile);
  }

  const model = "gemini-3.5-flash";
  const prompt = `
    Based on the following cognitive profile, identify the user's "Neural Chronotype" and architect a 24-hour Circadian focus schedule.
    
    Profile: ${JSON.stringify(profile)}
    
    Output JSON with:
    1. chronotype: { title, description, energyPeakTime }
    2. schedule: Array of { time, activity, neuralPhase (Focus/Reset/Creative/Sleep), recommendation }
    3. biologyHack: A tip for optimizing their specific neural rhythms.
  `;

  try {
    const response = await getAI().models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            chronotype: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                energyPeakTime: { type: Type.STRING }
              },
              required: ["title", "description", "energyPeakTime"]
            },
            schedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING },
                  activity: { type: Type.STRING },
                  neuralPhase: { type: Type.STRING },
                  recommendation: { type: Type.STRING }
                },
                required: ["time", "activity", "neuralPhase", "recommendation"]
              }
            },
            biologyHack: { type: Type.STRING }
          },
          required: ["chronotype", "schedule", "biologyHack"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Circadian calibration failed:", error);
    return getHeuristicCircadian(profile);
  }
}
