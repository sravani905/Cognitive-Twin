export interface PreloadedSet {
  id: string;
  archetype: {
    title: string;
    description: string;
    color: string;
  };
  studyMethod: string;
  productivityStyle: string;
  workEnvironment: string;
  summary: string;
  idealScores: {
    logicScore: number;
    creativityScore: number;
    focusScore: number;
    memoryScore: number;
    speedScore: number;
    spatialScore: number;
    verbalScore: number;
    eqScore: number;
    numericalScore: number;
    abstractScore: number;
  };
  careerGuide: {
    title: string;
    why: string;
    detailedRoadmap: {
      stage: string;
      tasks: string[];
    }[];
  }[];
  growthAreas: {
    skill: string;
    explanation: string;
    strategy: string;
    resourceLink: string;
  }[];
}

export const PRELOADED_COGNITIVE_SETS: PreloadedSet[] = [
  {
    id: "quantum_logic_strategist",
    archetype: {
      title: "The Quantum Logic Strategist",
      description: "An exceptional analytical powerhouse specialized in high-dimensional logical reasoning, structured puzzle solving, and system synthesis.",
      color: "#8A2BE2"
    },
    studyMethod: "First-Principles Decomposition & Truth Table Synthesis",
    productivityStyle: "Modular Time Sprints with Zero-Distraction Segments",
    workEnvironment: "Advanced Systems Laboratory / Decoupled Autonomous Workspace",
    summary: "Your profile exhibits exceptional capacity for deductive reasoning and deep execution logical paths, paired with extreme focus stability during analytical challenges.",
    idealScores: {
      logicScore: 95,
      creativityScore: 60,
      focusScore: 92,
      memoryScore: 85,
      speedScore: 88,
      spatialScore: 90,
      verbalScore: 78,
      eqScore: 70,
      numericalScore: 96,
      abstractScore: 94
    },
    careerGuide: [
      {
        title: "Quantum Algorithm Researcher",
        why: "Your superior deductive reasoning and abstract mathematical modeling scores match the exact high-fidelity demands of non-classical logic gates.",
        detailedRoadmap: [
          { stage: "Quantum Foundations", tasks: ["Linear Algebra & Matrix Operators", "Quantum Mechanics Core", "Hilbert Space Mappings"] },
          { stage: "Qubit Manipulation", tasks: ["Superposition Gate Prototyping", "Entanglement Algorithms", "Quantum Error Correction (QECC)"] },
          { stage: "High Execution Testing", tasks: ["Qiskit Simulation Sprints", "Noise Mitigation Experiments", "Real Hardware Compilation"] }
        ]
      },
      {
        title: "Systems Architect & Formal Verification Engineer",
        why: "High logical consistency and focus stability make you perfectly suited for proofs of correctness for mission-critical software systems.",
        detailedRoadmap: [
          { stage: "Logical Rigor", tasks: ["Propositional & First-Order Logic", "Coq / Isabelle Theorem Proving", "State-Machine Behavior Analysis"] },
          { stage: "System Integration", tasks: ["Compilers & Type-Theory Synthesis", "Automated Constraint Solvers", "Static Analysis Toolchain Design"] }
        ]
      }
    ],
    growthAreas: [
      {
        skill: "Cognitive Resonance Shifting",
        explanation: "High analytical load can occasionally lock you into a rigid thinking loop, reducing creative lateral breakthroughs.",
        strategy: "Introduce intentional 5-minute visual spatial blocks using abstract canvases between deep deductive sprints.",
        resourceLink: "https://www.youtube.com/results?search_query=lateral+thinking+techniques+for+engineers"
      }
    ]
  },
  {
    id: "immersive_narrative_architect",
    archetype: {
      title: "The Immersive Narrative Architect",
      description: "A highly creative, verbally articulate visionary who thrives on semantic landscapes, thematic coherence, and rich narrative geometry.",
      color: "#ec4899"
    },
    studyMethod: "Thematic Storyboarding & Active Experiential Recall",
    productivityStyle: "Organic Flow States Grounded in Narrative Milestones",
    workEnvironment: "Immersive Creative Studio / Digital Collaborative Collective",
    summary: "Your mind operates beautifully across creative, verbal, and narrative vectors, creating structured worlds out of raw metaphorical elements.",
    idealScores: {
      logicScore: 68,
      creativityScore: 96,
      focusScore: 80,
      memoryScore: 92,
      speedScore: 75,
      spatialScore: 72,
      verbalScore: 95,
      eqScore: 88,
      numericalScore: 60,
      abstractScore: 85
    },
    careerGuide: [
      {
        title: "Worldbuilder & Narrative Designer",
        why: "High narrative capability and verbal memory indicators empower you to craft branched storytelling nodes with deep systemic empathy.",
        detailedRoadmap: [
          { stage: "Semantic Core", tasks: ["Interactive Scriptwriting Foundations", "State-Based Dialogue Engineering", "Character Archetype Matrices"] },
          { stage: "Branching Architecture", tasks: ["Nonlinear Story Trees", "Logical Flag Triggers", "Systemic Quest Plotting"] }
        ]
      },
      {
        title: "Creative Director",
        why: "A stellar blend of empathy, creative memory, and abstract worldview enables you to guide multidisciplinary aesthetic teams.",
        detailedRoadmap: [
          { stage: "Creative Synthesis", tasks: ["Thematic Vision Alignment", "Audience Psychological Mapping", "Cross-Media Storyboards"] },
          { stage: "Aesthetic Execution", tasks: ["Mood Board Formulation", "Inspirational Blueprinting", "Feedback Loop Standardization"] }
        ]
      }
    ],
    growthAreas: [
      {
        skill: "Quantitative Logic Anchoring",
        explanation: "Strong narrative focus can sometimes lead to overlooking rigid mathematical constraints in gameplay systems.",
        strategy: "Integrate basic algorithmic wireframing exercises to couple logic triggers directly with narrative arcs.",
        resourceLink: "https://www.youtube.com/results?search_query=game+theory+narrative+design"
      }
    ]
  },
  {
    id: "high_velocity_algorist",
    archetype: {
      title: "The High-Velocity Algorist",
      description: "A rapid-throughput specialist characterized by extreme cognitive speed, rapid pattern recognition, and instantaneous decision matrices.",
      color: "#10b981"
    },
    studyMethod: "Rapid Active Testing & Accelerated Iteration Cycles",
    productivityStyle: "High-Bandwidth Multi-Tasking Chunks with Dedicated Cool-downs",
    workEnvironment: "High-Frequency Operations Deck / Rapid Response Node",
    summary: "Your processing speeds are phenomenally high, allowing you to parse complex, chaotic data in real-time and act with extreme precision.",
    idealScores: {
      logicScore: 88,
      creativityScore: 75,
      focusScore: 85,
      memoryScore: 80,
      speedScore: 98,
      spatialScore: 82,
      verbalScore: 75,
      eqScore: 72,
      numericalScore: 90,
      abstractScore: 92
    },
    careerGuide: [
      {
        title: "High-Frequency Algorithmic Trader",
        why: "Your exceptional processing speed and numerical logic score enable safe real-time interpretation of complex, high-volatility tick data files.",
        detailedRoadmap: [
          { stage: "Microsecond Logic", tasks: ["Limit Order Book Modeling", "Low-Latency Code Optimization", "Statistical Arbitrage Strategies"] },
          { stage: "Live Execution", tasks: ["Backtesting Paradigm Sprints", "Risk-Limit Parameter Checks", "Real-Time Slip Analysis"] }
        ]
      },
      {
        title: "Site Reliability Engineer",
        why: "Instantaneous pattern-matching capacities help you quickly trace root causes under high stress during critical systems incidents.",
        detailedRoadmap: [
          { stage: "Incident Response", tasks: ["Chaos Engineering Simulations", "Distributed Telemetry Setup", "Kernel Event Tracing"] },
          { stage: "System Optimization", tasks: ["Automated Mitigations", "Network Routing Calibration", "Latency Micro-Audits"] }
        ]
      }
    ],
    growthAreas: [
      {
        skill: "Poli-Temporal Deep Focus",
        explanation: "Extremely high decision speeds can lead to a slight bias for momentary optimizations over long-term strategic contemplation.",
        strategy: "Incorporate a 15-minute daily non-active strategy window with writing utensils and zero electronic feeds.",
        resourceLink: "https://www.youtube.com/results?search_query=strategic+patience+and+decision+making"
      }
    ]
  },
  {
    id: "cognitive_synthesizer",
    archetype: {
      title: "The Cognitive Synthesizer",
      description: "An empathetic systems thinker who blends high abstract reasoning with emotional intelligence to unify humans and machine agents.",
      color: "#06b6d4"
    },
    studyMethod: "Cross-Disciplinary Syntopic Reading & Peer Mentorship Protocols",
    productivityStyle: "Interleaved Focus Loops Interspersed with Collaborative Syncs",
    workEnvironment: "Hybrid Innovation Garage / Decentralized Advisory Collective",
    summary: "You possess a powerful and rare cognitive structure that processes high complexity while maintaining high emotional resonance and communication fluidity.",
    idealScores: {
      logicScore: 82,
      creativityScore: 90,
      focusScore: 84,
      memoryScore: 86,
      speedScore: 78,
      spatialScore: 75,
      verbalScore: 89,
      eqScore: 96,
      numericalScore: 74,
      abstractScore: 92
    },
    careerGuide: [
      {
        title: "AI Product Orchestrator",
        why: "Combining high abstract thinking and extreme EQ allows you to interface with both deep engineering teams and non-technical human users elegantly.",
        detailedRoadmap: [
          { stage: "Model Alignment", tasks: ["Reinforcement Learning with Human Feedback (RLHF)", "Constraint-Based Ethics Mapping", "User Mental Model Sprints"] },
          { stage: "Production Synergy", tasks: ["Interactive Interface Design", "API Latency Evaluation", "Persona Customization Protocols"] }
        ]
      },
      {
        title: "Organizational Network Scientist",
        why: "Your empathetic pattern-analysis abilities are perfect for organizing highly creative, cross-functional engineering guilds.",
        detailedRoadmap: [
          { stage: "Network Mapping", tasks: ["Information Flow Auditing", "Social Graph Visualization", "Trust Metric Analysis"] },
          { stage: "Trust Architecture", tasks: ["Asynchronous Goal Synchronization", "Cross-Guild Synergy Projects", "Friction Mitigation Loops"] }
        ]
      }
    ],
    growthAreas: [
      {
        skill: "Discrete Logical Boundaries",
        explanation: "High empathy can cause you to absorb organizational noise, leading to cognitive fatigue during tight technical constraints.",
        strategy: "Use structured logic templates to segregate empathetic feedback points from execution timelines.",
        resourceLink: "https://www.youtube.com/results?search_query=setting+boundaries+in+high+growth+roles"
      }
    ]
  },
  {
    id: "spatial_systems_engineer",
    archetype: {
      title: "The Spatial Systems Engineer",
      description: "A structural mastermind with exceptional spatial reasoning and high tolerance for complex systemic risks and volumetric designs.",
      color: "#f59e0b"
    },
    studyMethod: "Volumetric CAD Modeling & Physical Spatial Reversal Labs",
    productivityStyle: "Deep Immersive Physical/Virtual Block Builds",
    workEnvironment: "Robotics Sandbox / High-Volume Cleanroom / Spatial Display Hub",
    summary: "Your brain excels within physical geometries and mechanical feedback, processing high-risk calculations cleanly through volumetric visualization.",
    idealScores: {
      logicScore: 86,
      creativityScore: 82,
      focusScore: 88,
      memoryScore: 75,
      speedScore: 80,
      spatialScore: 98,
      verbalScore: 70,
      eqScore: 72,
      numericalScore: 84,
      abstractScore: 90
    },
    careerGuide: [
      {
        title: "Robotics Motion Architect",
        why: "Superior spatial awareness and abstract physics modeling make you a natural fit for multi-joint inverse kinematics engines.",
        detailedRoadmap: [
          { stage: "Physics Geometry", tasks: ["Inverse Kinematics Mathematical Models", "ROS2 Spatial Mapping Platforms", "Obstacle Avoidance Vector Fields"] },
          { stage: "Hardware Loop", tasks: ["Real-time Sensor Fusion", "Motor Torque Calibration Sprints", "Sim2Real Adaptation Tests"] }
        ]
      },
      {
        title: "Autonomous Logistics Fleet Designer",
        why: "Volumetric reasoning enables you to map efficient, safe autonomous drone/rover paths across multi-level structural campuses.",
        detailedRoadmap: [
          { stage: "Fleet Protocols", tasks: ["Dynamic Route Graphing", "Energy Congestion Simulation", "Precision Loading Node Analysis"] },
          { stage: "Safe Deployment", tasks: ["Edge Compute Integration", "Volumetric Security Audits", "Physical Hardware Field Tests"] }
        ]
      }
    ],
    growthAreas: [
      {
        skill: "Verbal Precision Tuning",
        explanation: "When thinking primarily in 3D structures, translating visual designs into text documentation can feel slow or redundant.",
        strategy: "Create clear, bite-sized markdown narrative outlines of visual ideas daily to bridge spatial concepts to structural teams.",
        resourceLink: "https://www.youtube.com/results?search_query=technical+writing+for+visual+thinkers"
      }
    ]
  },
  {
    id: "human_agent_conductor",
    archetype: {
      title: "The Human-Agent Conductor",
      description: "An expert in managing hybrid workflows, orchestrating generative model outputs, and maximizing operational throughput.",
      color: "#4f46e5"
    },
    studyMethod: "Prompt-Tuning Feedbacks & Asynchronous Protocol Analysis",
    productivityStyle: "Multi-Agent Dashboard Execution with Strategic Pause Flags",
    workEnvironment: "Synthetic Operations Deck / Fully Automated Command Center",
    summary: "You possess a powerful executive mind that quickly sorts inputs, allocates resources, and sequences tasks with high cognitive precision.",
    idealScores: {
      logicScore: 88,
      creativityScore: 85,
      focusScore: 90,
      memoryScore: 80,
      speedScore: 84,
      spatialScore: 75,
      verbalScore: 82,
      eqScore: 85,
      numericalScore: 80,
      abstractScore: 88
    },
    careerGuide: [
      {
        title: "AI Automation Director",
        why: "High logic and executive orchestration metrics make you perfect for automating enterprise business logic using multi-agent networks.",
        detailedRoadmap: [
          { stage: "Agent Frameworks", tasks: ["LangGraph & AutoGen Setup", "State Preservation Architectures", "Prompt Ingestion Audits"] },
          { stage: "Automation Sprints", tasks: ["Dynamic Router Implementation", "Failover Heuristic Testing", "Telemetry Integration Layout"] }
        ]
      },
      {
        title: "Human-Computer Interaction (HCI) Researcher",
        why: "Your balance of creative prompt formulation and cognitive empathy provides a unique lens for studying how humans trust automated recommendations.",
        detailedRoadmap: [
          { stage: "User Studies", tasks: ["Trust Decay Curves", "Frictionless Prompt Paradigms", "Cognitive Bandwidth Measurement"] },
          { stage: "Interface Mapping", tasks: ["Adaptive Layout Prototypes", "Dynamic Response Tuning", "Context Retention Analysis"] }
        ]
      }
    ],
    growthAreas: [
      {
        skill: "Unplugged Deep Synthesis",
        explanation: "Managing dozens of automated agents can lead to high context-switching frequency, potentially reducing long-horizon memory indexing.",
        strategy: "Schedule 'isolated creation blocks' of 60 minutes twice a week with completely offline desktop software.",
        resourceLink: "https://www.youtube.com/results?search_query=cal+newport+deep+work+principles"
      }
    ]
  },
  {
    id: "bio_signal_optimizer",
    archetype: {
      title: "The Bio-Signal Optimizer",
      description: "A chronobiology-minded expert focused on sleep-cycle optimization, physiological indicators, and cellular restoration strategies.",
      color: "#a78bfa"
    },
    studyMethod: "Circadian-Aligned Focus Sprints & Kinetic Recall Walks",
    productivityStyle: "Chronotype Energy Matching with Low-Contrast Lighting Support",
    workEnvironment: "Biophilic Design Studio / Multi-Spectral Health Tech Complex",
    summary: "Your profile shows extreme sensitivity to biological cues, sleep-wake architecture, and circadian focus states, which can be leveraged for sustained genius.",
    idealScores: {
      logicScore: 78,
      creativityScore: 80,
      focusScore: 82,
      memoryScore: 88,
      speedScore: 72,
      spatialScore: 70,
      verbalScore: 84,
      eqScore: 90,
      numericalScore: 70,
      abstractScore: 86
    },
    careerGuide: [
      {
        title: "Adaptive Workspace Ergonomist",
        why: "Your empathetic insight into sensory responses and biophilic feedback allows you to create workplaces that minimize cognitive load scientifically.",
        detailedRoadmap: [
          { stage: "Workspace Physiology", tasks: ["Circadian Lighting Systems", "Active Postural Transitions", "Acoustic Noise Dampening Math"] },
          { stage: "Sensory Audits", tasks: ["Galvanic Skin Response Testing", "Thermal Comfort Simulations", "Focus-Enhancement Calibrations"] }
        ]
      },
      {
        title: "Health Technology Solutions Architect",
        why: "Your memory accuracy and biophilic empathy map seamlessly to tracking user sleep cycles and implementing digital health platforms.",
        detailedRoadmap: [
          { stage: "Telemetry Core", tasks: ["Wearable API Data Modeling", "Heart Rate Variability Analysis", "Sleep Efficiency Mathematics"] },
          { stage: "Intervention Design", tasks: ["Smart Awake Alarms", "Automated Biofeedback Cycles", "Dynamic Reset Recommendations"] }
        ]
      }
    ],
    growthAreas: [
      {
        skill: "Raw Coding Throughput",
        explanation: "A deep appreciation for biological paces can sometimes conflict with intense sprint tempos in standard agile software companies.",
        strategy: "Build modular coding templates to complete routine scripting tasks rapidly, preserving neural energy for complex architectural decisions.",
        resourceLink: "https://www.youtube.com/results?search_query=efficiency+for+developers"
      }
    ]
  },
  {
    id: "cryptographic_guardian",
    archetype: {
      title: "The Cryptographic Guardian",
      description: "A defensive logician focused on cryptographic correctness, threat topology vector analysis, and security verification protocols.",
      color: "#de3163"
    },
    studyMethod: "Threat Tree Modeling & Static Binary Deconstruction Sprints",
    productivityStyle: "High-Vigilance Target Resolution Blocks followed by Total Rest",
    workEnvironment: "Hardened Operations Hub / Isolated Network Crypt",
    summary: "You process risk variables cleanly, detecting system logic failures and structural weaknesses before other developers even notice them.",
    idealScores: {
      logicScore: 94,
      creativityScore: 70,
      focusScore: 91,
      memoryScore: 86,
      speedScore: 80,
      spatialScore: 84,
      verbalScore: 76,
      eqScore: 65,
      numericalScore: 91,
      abstractScore: 90
    },
    careerGuide: [
      {
        title: "Cryptographic Protocol Auditor",
        why: "Outstanding deductive mathematical skill and zero risk tolerance make you prime for checking zero-knowledge proof contracts.",
        detailedRoadmap: [
          { stage: "Crypto Foundations", tasks: ["Elliptic Curve Cryptography", "Zero-Knowledge Circuit Assembly", "Bilinear Pairings Logic"] },
          { stage: "Protocol Verification", tasks: ["EVM Execution Trace Audits", "Constraint-Satisfaction Models", "Fuzzing & Formal Proving Sprints"] }
        ]
      },
      {
        title: "Security Operations Center Analyst",
        why: "An analytical eye for system noise allows you to parse vast streams of network telemetry to pinpoint subtle advanced threat patterns.",
        detailedRoadmap: [
          { stage: "Threat Ingestion", tasks: ["SIEM Pipeline Refinements", "Behavioral Anomaly Regulators", "Kernel-Level Event Hooks"] },
          { stage: "Mitigation Steps", tasks: ["Incident Trapping Routines", "Decoupling Impact Zones", "Security Architecture Redesigns"] }
        ]
      }
    ],
    growthAreas: [
      {
        skill: "Collaborative Trust Balancing",
        explanation: "A professional focus on threat modeling can build a hyper-defensive mindset, occasionally slowing down creative collaborative team ideas.",
        strategy: "Dedicate the first 10 minutes of brainstorming sessions solely to unconstrained ideas without applying threat checks.",
        resourceLink: "https://www.youtube.com/results?search_query=psychological+safety+in+high+trust+teams"
      }
    ]
  },
  {
    id: "neuro_aesthetic_curator",
    archetype: {
      title: "The Neuro-Aesthetic Curator",
      description: "An expert in blending visual design principles, cognitive science foundations, and spatial graphics to craft high-harmony environments.",
      color: "#6366f1"
    },
    studyMethod: "Visual-Logical Layout Deconstruction & Mood Synthesis",
    productivityStyle: "Color-Coded Visual Dashboards with Gentle Instrumental Background Beats",
    workEnvironment: "Minimalist High-Contrast Creative Studio / Virtual Reality Spatial Sandbox",
    summary: "Your mind naturally visualizes clean spatial proportions, elegant colors, and balanced typographic layouts, aligning technical data with aesthetic grace.",
    idealScores: {
      logicScore: 75,
      creativityScore: 94,
      focusScore: 85,
      memoryScore: 80,
      speedScore: 76,
      spatialScore: 92,
      verbalScore: 82,
      eqScore: 85,
      numericalScore: 68,
      abstractScore: 88
    },
    careerGuide: [
      {
        title: "Neuro-Aesthetic UX Architect",
        why: "Your mastery of visual-spatial proportions and deep understanding of emotional response enable you to design interfaces that reduce eye strain and fatigue.",
        detailedRoadmap: [
          { stage: "Visual Psychology", tasks: ["Gestalt Grouping Math", "Dynamic Eye-Tracking Heatmaps", "Chromatic Cognitive Load Audits"] },
          { stage: "Layout Protyping", tasks: ["Vite + React Micro-interactions", "CSS Fluid Variable Architecture", "Motion Friction Adjustments"] }
        ]
      },
      {
        title: "Interactive Installation Designer",
        why: "High spatial awareness and abstract creative thinking make you highly capable of designing physical museum exhibits that adapt to user movements.",
        detailedRoadmap: [
          { stage: "Motion Sensing", tasks: ["Computer Vision Spatial Fields", "Dynamic Projection Mapping", "Interactive Soundscapes"] },
          { stage: "Physical Deployment", tasks: ["Sensory Safety Protocols", "Interactive Microcontrollers", "Aesthetic Testing Sequences"] }
        ]
      }
    ],
    growthAreas: [
      {
        skill: "Backend Logic Structuring",
        explanation: "A focus on visual geometry can sometimes lead to a neglect of server-side state hydration or API security details.",
        strategy: "Spend 20 minutes wireframing backend JSON structures before touching any styling CSS.",
        resourceLink: "https://www.youtube.com/results?search_query=server+side+fundamentals+for+frontend+devs"
      }
    ]
  },
  {
    id: "autonomous_operations_director",
    archetype: {
      title: "The Autonomous Operations Director",
      description: "A highly resilient organizer specialized in strategic operational layouts, asynchronous system syncing, and high stress management.",
      color: "#1fbbf0"
    },
    studyMethod: "System Flowchart Mapping & Simulated Crisis Drills",
    productivityStyle: "Rigid Priority Calendars with Dynamic Automation Backup Systems",
    workEnvironment: "Global Operations Command Room / Decentralized Control Node",
    summary: "You possess a powerful mind built for structural scaling, operational fail-safes, and clean organizational alignment.",
    idealScores: {
      logicScore: 86,
      creativityScore: 74,
      focusScore: 92,
      memoryScore: 82,
      speedScore: 80,
      spatialScore: 78,
      verbalScore: 80,
      eqScore: 88,
      numericalScore: 82,
      abstractScore: 86
    },
    careerGuide: [
      {
        title: "Autonomous Fleet Director",
        why: "Your strong focus score and operational resilience make you perfect for managing logistics networks backed by robotic rovers and autonomous trucks.",
        detailedRoadmap: [
          { stage: "Logistics Algorithms", tasks: ["Routing Simulators", "Supply-Chain Bottleneck Models", "Buffer Window Ingestion"] },
          { stage: "Network Operations", tasks: ["Dynamic Failover Sequences", "Hardware Telemetry Dashboards", "Regulatory Compliance Audits"] }
        ]
      },
      {
        title: "Strategic Incident Commander",
        why: "Outstanding emotional composure under stress and structured logic processes prepare you to guide cross-functional teams during cloud infrastructure failures.",
        detailedRoadmap: [
          { stage: "Incident Modeling", tasks: ["Crisis Tree Structuring", "Communication Templates", "Root-Cause Analysis Engines"] },
          { stage: "Response Command", tasks: ["Asynchronous Sync Paradigms", "Post-Mortem Documentation Standards", "Incident Minimization Audits"] }
        ]
      }
    ],
    growthAreas: [
      {
        skill: "Creative Playtime Playgrounds",
        explanation: "An operations-heavy focus can occasionally cause rigid expectations that stifle team design playfulness.",
        strategy: "Introduce 'no-consequence sandboxes' where engineers can project unvetted solutions freely.",
        resourceLink: "https://www.youtube.com/results?search_query=creative+freedom+in+software+engineering"
      }
    ]
  },
  {
    id: "kinetic_learning_technologist",
    archetype: {
      title: "The Kinetic Learning Technologist",
      description: "A tactile cognitive master who leverages spatial hardware, physical interactions, and kinesthetic triggers for brain mapping.",
      color: "#fb7185"
    },
    studyMethod: "Tactile Assembly & Spatial Memory Palaces",
    productivityStyle: "Active Posture Working Station with Mechanical Interface Feedback",
    workEnvironment: "Experimental Prototyping Workshop / Augmented Reality Engineering Lab",
    summary: "Your brain learns most efficiently when concepts are linked to spatial objects, physical coordinates, and tactile interfaces.",
    idealScores: {
      logicScore: 80,
      creativityScore: 88,
      focusScore: 84,
      memoryScore: 82,
      speedScore: 78,
      spatialScore: 95,
      verbalScore: 72,
      eqScore: 78,
      numericalScore: 75,
      abstractScore: 88
    },
    careerGuide: [
      {
        title: "Haptic Device Engineer",
        why: "Matching high spatial reasoning and creative abstract mechanics makes you highly skilled at crafting high-fidelity controller feedback interfaces.",
        detailedRoadmap: [
          { stage: "Haptic Physics", tasks: ["Vibration Frequency Geometry", "Force Feedback Control Loops", "Actuator Response Timing models"] },
          { stage: "Tactile Testing", tasks: ["Wearable VR Glove Integration", "Nerve Stimulation Heatmaps", "Mechanical Hardware Assembly"] }
        ]
      },
      {
        title: "Interactive Theme Park Developer",
        why: "A brilliant feeling for volumetric design with sensory feedback allows you to build physical rides integrated with augmented reality displays.",
        detailedRoadmap: [
          { stage: "Spatial Tracking", tasks: ["LiDAR Target Triangulation", "Dynamic Spatial Audio Alignment", "AR Helmet Sync Systems"] },
          { stage: "Ride Control", tasks: ["Hydraulic Speed Controllers", "Emergency Disconnect Protocols", "Real-world Experience Testing"] }
        ]
      }
    ],
    growthAreas: [
      {
        skill: "Static Document Summarization",
        explanation: "Thriving in spatial and physical labs means that reading long, dry policy files can feel tedious.",
        strategy: "Use mind-mapping software to convert flat text guidelines into spatial structures you can easily navigate visually.",
        resourceLink: "https://www.youtube.com/results?search_query=mind+mapping+tutorial"
      }
    ]
  },
  {
    id: "mathematical_modeling_futurist",
    archetype: {
      title: "The Mathematical Modeling Futurist",
      description: "An analytical strategist who uses predictive mathematics, abstract pattern synthesis, and stochastic calculation to forecast technological convergence.",
      color: "#9333ea"
    },
    studyMethod: "Stochastic Proof Modeling & Equation-to-Code Translation Exercises",
    productivityStyle: "Immersive Quiet Sprints using Command Line Tools and Minimal Visuals",
    workEnvironment: "Academic Research Center / High-Growth Strategy Lab",
    summary: "Your exceptional mathematical abstract thinking and system logic metrics allow you to find order in erratic multi-variable forecasting models.",
    idealScores: {
      logicScore: 96,
      creativityScore: 80,
      focusScore: 88,
      memoryScore: 84,
      speedScore: 82,
      spatialScore: 85,
      verbalScore: 78,
      eqScore: 72,
      numericalScore: 98,
      abstractScore: 96
    },
    careerGuide: [
      {
        title: "Complexity Scientist",
        why: "Superior abstract scoring and advanced numerical reasoning match the rigorous requirements of scaling and chaos modeling.",
        detailedRoadmap: [
          { stage: "Inference Modeling", tasks: ["Stochastic Differential Equations", "Agent-Based Adaptation Physics", "Information Theory Entropy Metrics"] },
          { stage: "Complexity Coding", tasks: ["Python NetworkX Simulation", "Distributed Cluster Computing", "Stochastic Chaos Visualizers"] }
        ]
      },
      {
        title: "Cryptoeconomic Systems Designer",
        why: "Ideal for architecting microeconomic loops, tokenomics algorithms, and mathematical simulation parameters.",
        detailedRoadmap: [
          { stage: "Economic Topology", tasks: ["Game Theory Payoff Matrices", "Token Inflation Rate Optimization", "Automated Market Maker Simulators"] },
          { stage: "Protocol Launch", tasks: ["Dynamic Fee Pricing Engines", "Mathematical Smart Auditing", "Backtesting Stability Limits"] }
        ]
      }
    ],
    growthAreas: [
      {
        skill: "Empathetic Human Integration",
        explanation: "When evaluating complex systems mathematically, human erratic behavior can be overlooked or classified as simple logic noise.",
        strategy: "Incorporate behavioral psychology and historical user-friction case studies into your system designs.",
        resourceLink: "https://www.youtube.com/results?search_query=behavioral+economics+and+decision+making"
      }
    ]
  },
  {
    id: "behavioral_science_ethicist",
    archetype: {
      title: "The Behavioral Science Ethicist",
      description: "An expert in technology-society interactions, ethical alignment systems, and behavioral incentive loop design.",
      color: "#059669"
    },
    studyMethod: "Socratic Discussion Analysis & Narrative Ethics Mapping",
    productivityStyle: "Spacious Collaboration Windows Paired with Quiet Composition blocks",
    workEnvironment: "Ethics Consultation Hub / Social Policy Design Office",
    summary: "Your brain balances systemic logic with deep human empathy, mapping out technological impacts with exceptional ethical clarity and narrative scope.",
    idealScores: {
      logicScore: 80,
      creativityScore: 85,
      focusScore: 82,
      memoryScore: 86,
      speedScore: 74,
      spatialScore: 70,
      verbalScore: 90,
      eqScore: 95,
      numericalScore: 70,
      abstractScore: 92
    },
    careerGuide: [
      {
        title: "AI Ethics Officer",
        why: "Outstanding balance of system analysis, verbal precision, and absolute empathy qualifies you to write policy models that prevent programmatic bias.",
        detailedRoadmap: [
          { stage: "Bias Assessment", tasks: ["Dataset Representation Audits", "Fairness Constraint Math", "Algorithmic Inequity Triggers"] },
          { stage: "Ethics Deployment", tasks: ["Enterprise Ethics Alignment Protocols", "Explainability (XAI) Standards", "Stakeholder Communication Channels"] }
        ]
      },
      {
        title: "Behavioral Designer",
        why: "Your empathetic pattern-reading allows you to craft mobile app interaction mechanisms that elevate user well-being and limit addictive feedback loops.",
        detailedRoadmap: [
          { stage: "Nudge Frameworks", tasks: ["Intrinsic Motivation Loop Analysis", "Digital Health Metric Design", "Choice Architecture Balancing"] },
          { stage: "A/B Safety Sprints", tasks: ["Ethical User Cohort Tests", "Retention Decay Measurement", "Mindful App Interface Launches"] }
        ]
      }
    ],
    growthAreas: [
      {
        skill: "Performance Optimization Speed",
        explanation: "A deeply thoughtful evaluation of ethics and social impact can sometimes cause hesitation during fast product releases.",
        strategy: "Establish standardized 'Ethical Cleared Templates' to evaluate standard releases rapidly without delaying iteration pipelines.",
        resourceLink: "https://www.youtube.com/results?search_query=agile+ethical+product+testing"
      }
    ]
  },
  {
    id: "acoustic_resonance_consultant",
    archetype: {
      title: "The Acoustic Resonance Consultant",
      description: "A highly auditory-tuned expert focused on soundscape geometry, soundproofing engineering, and neural auditory triggers.",
      color: "#a855f7"
    },
    studyMethod: "Interactive Auditory Memory Anchoring & Soundwave Synthesis Loops",
    productivityStyle: "Acoustically Controlled Settings with Custom Active White Noise Signals",
    workEnvironment: "Acoustic Engineering Laboratory / Active Spatial Audio Design Studio",
    summary: "Your brain processes audio, rhythm, and acoustic frequencies with rare detail, leveraging acoustic triggers to maintain deep focus states.",
    idealScores: {
      logicScore: 78,
      creativityScore: 86,
      focusScore: 88,
      memoryScore: 84,
      speedScore: 75,
      spatialScore: 86,
      verbalScore: 78,
      eqScore: 80,
      numericalScore: 74,
      abstractScore: 85
    },
    careerGuide: [
      {
        title: "Spatial Audio Interaction Designer",
        why: "Excellent spatial awareness paired with native auditory focus allows you to build fully immersive soundscapes for metaverse applications.",
        detailedRoadmap: [
          { stage: "Acoustic Physics", tasks: ["Binaural HRTF Algorithm Mapping", "Reflective Environment DSP", "Dynamic Sound Dispersion Models"] },
          { stage: "Audio Implementation", tasks: ["WebAudio API Spatial Code", "AR Core Integration Tests", "Immersive Testing Sequences"] }
        ]
      },
      {
        title: "Cognitive Soundscape Engineer",
        why: "Your understanding of focusing audio cues prepares you to design synthetic music soundtracks that scientifically enhance programmer focus.",
        detailedRoadmap: [
          { stage: "Soundwave Synthesis", tasks: ["Isolating Monaural beat patterns", "Low-Frequency Pink Noise formulation", "Dopamine-aligned tempo loops"] },
          { stage: "Active Validation", tasks: ["EEG Focus Correlation Audits", "Subjective Stress Level Logging", "Adaptive Soundtrack Releases"] }
        ]
      }
    ],
    growthAreas: [
      {
        skill: "Visual Diagram Prototyping",
        explanation: "Thinking primarily in acoustic loops and voice directives might make complex visual layout diagrams feel counter-intuitive.",
        strategy: "Force yourself to map out soundscape flows as visual system block diagrams before coding.",
        resourceLink: "https://www.youtube.com/results?search_query=uml+system+diagrams+for+beginners"
      }
    ]
  },
  {
    id: "cross_modal_experience_designer",
    archetype: {
      title: "The Cross-Modal Experience Designer",
      description: "A multi-sensory orchestrator who bridges auditory, tactile, and visual dimensions to create seamless environments.",
      color: "#db2777"
    },
    studyMethod: "Multi-Sensory Mapping & Active Interactive Rehearsal",
    productivityStyle: "Dynamic Multi-Screen Setups with Ambient Biophilic Decor",
    workEnvironment: "Advanced VR Lab / Museum Experience Sandbox / Interactive Showroom",
    summary: "Your brain maps information across sensory modalities, creating strong mental connections between spatial coordinates, sounds, and visual structures.",
    idealScores: {
      logicScore: 80,
      creativityScore: 92,
      focusScore: 85,
      memoryScore: 86,
      speedScore: 78,
      spatialScore: 90,
      verbalScore: 80,
      eqScore: 88,
      numericalScore: 70,
      abstractScore: 89
    },
    careerGuide: [
      {
        title: "Cross-Modal VR Engineer",
        why: "Combining high spatial skills, creative memory, and empathy allows you to craft virtual training simulations where physics, audio, and visual cues are in harmony.",
        detailedRoadmap: [
          { stage: "Sensor Integration", tasks: ["Haptic Response Timing Map", "3D Spatial Audio Hydration", "Retinal Refresh Sync Protocols"] },
          { stage: "VR Implementation", tasks: ["Unity / Unreal System Design", "Dynamic Event Listeners", "Experience Optimization Tests"] }
        ]
      },
      {
        title: "Interactive Installation Producer",
        why: "High project orchestration and multi-sensory skills prepare you to coordinate complex collaborative public installations.",
        detailedRoadmap: [
          { stage: "Sensory Mapping", tasks: ["Interactive Projection Loops", "Ambient Fluid Dynamics Software", "User Coordinate Trackers"] },
          { stage: "Project Execution", tasks: ["Hardware Procurement Cycles", "On-site Calibration Sprints", "Safety & Compliance Checks"] }
        ]
      }
    ],
    growthAreas: [
      {
        skill: "Asynchronous Database Writing",
        explanation: "Engaging with immersive visuals and physical sensory loops can make plain relational SQL writing feel flat or disconnected.",
        strategy: "Use ORM tools and visual database design tools to treat data structures as relatable physical models.",
        resourceLink: "https://www.youtube.com/results?search_query=database+design+visual+tutorial"
      }
    ]
  },
  {
    id: "algorithmic_game_theorist",
    archetype: {
      title: "The Algorithmic Game Theorist",
      description: "A calculated strategist who predicts system behaviors using mathematical payoff matrices with zero-noise logical structures.",
      color: "#d97706"
    },
    studyMethod: "Strategic Scenario Tree Analysis & Interactive Game Re-writes",
    productivityStyle: "Ultra-Sparse Desktop Theme with Zero Browser Tabs Active During Work Sprints",
    workEnvironment: "Risk Assessment Sandbox / Decentralized Governance Office",
    summary: "Your cognitive profile is tuned for tactical risk evaluation, structural decision-making, and high-stakes logical calculation.",
    idealScores: {
      logicScore: 95,
      creativityScore: 78,
      focusScore: 90,
      memoryScore: 82,
      speedScore: 85,
      spatialScore: 80,
      verbalScore: 75,
      eqScore: 68,
      numericalScore: 95,
      abstractScore: 94
    },
    careerGuide: [
      {
        title: "Decentralized Governance Architect",
        why: "Outstanding logical precision and numerical clarity enable you to formulate anti-collusion voting systems for global DAOs.",
        detailedRoadmap: [
          { stage: "Economic Mechanism", tasks: ["Quadratic Voting Mathematics", "Sybil Attack Resistance Models", "Collusion Detection Triggers"] },
          { stage: "Mechanism Design", tasks: ["Solidity Smart Contract Logic", "Governance Backtesting Simulators", "Security Auditing Protocols"] }
        ]
      },
      {
        title: "Strategic Risk Modeler",
        why: "An expert analytical mind suited for simulating catastrophic failure vectors across complex cloud computing platforms.",
        detailedRoadmap: [
          { stage: "Failure Frameworks", tasks: ["Monte Carlo Cascade Trees", "Risk Boundary Optimization", "Asymmetric Loss Estimations"] },
          { stage: "System Integration", tasks: ["Automated Stress-Injector Design", "Dynamic Defense Deployments", "Systemic Hardening Audits"] }
        ]
      }
    ],
    growthAreas: [
      {
        skill: "Collaborative Ideation Play",
        explanation: "Skepticism and high game-theory analysis can occasionally filter out unconventional or fragile ideas during early prototyping phases.",
        strategy: "Schedule 'zero-judgment design phases' where ideas are cataloged with absolutely no risk analysis for the first day.",
        resourceLink: "https://www.youtube.com/results?search_query=design+thinking+brainstorming+techniques"
      }
    ]
  },
  {
    id: "cybernetic_organizer",
    archetype: {
      title: "The Cybernetic Organizer",
      description: "A systematic master of organizational taxonomies, structural flowcharts, and perfect technical documentation.",
      color: "#2563eb"
    },
    studyMethod: "Taxonomic Categorization Notes & Systemic Logic Mapping",
    productivityStyle: "Rigid Nested Folder Directories with Automated Auto-Save Backups",
    workEnvironment: "Strategic Information Center / Digital Records Hub",
    summary: "Your brain processes messy datasets into perfectly cataloged hierarchies with logical elegance, ensuring zero information loss.",
    idealScores: {
      logicScore: 88,
      creativityScore: 70,
      focusScore: 94,
      memoryScore: 90,
      speedScore: 78,
      spatialScore: 82,
      verbalScore: 84,
      eqScore: 78,
      numericalScore: 80,
      abstractScore: 86
    },
    careerGuide: [
      {
        title: "Knowledge Graph Engineer",
        why: "Superior organization logic and strong abstract mapping capacities make you prime for designing enterprise-wide semantic knowledge webs.",
        detailedRoadmap: [
          { stage: "Semantic Framework", tasks: ["RDF & OWL Ontology Assembly", "Knowledge Storage Query Design", "Entity Linkage Regulators"] },
          { stage: "System Population", tasks: ["LLM Extraction Pipelines", "Constraint-Based Schema Checks", "Graph DB Deployment"] }
        ]
      },
      {
        title: "Technical Documentation Architect",
        why: "A brilliant combination of verbal structure, memory accuracy, and focus allows you to synthesize intricate developer setup files clearly.",
        detailedRoadmap: [
          { stage: "Information Architecture", tasks: ["Typographic Hierarchy Design", "Interactive Code Sandboxes", "Nested Directory Schemas"] },
          { stage: "Doc Automation", tasks: ["Markdown CI/CD Deployments", "Automatic API Ingestion Sprints", "Usability Feedback Loops"] }
        ]
      }
    ],
    growthAreas: [
      {
        skill: "Unstructured Sketching Flow",
        explanation: "A professional dedication to crisp order can create minor anxiety during loose, unmapped exploratory brainstorm phases.",
        strategy: "Carry a plain blank notepad to sketch chaotic doodles or raw ideas without trying to catalog them immediately.",
        resourceLink: "https://www.youtube.com/results?search_query=unconstrained+sketching+and+creativity"
      }
    ]
  },
  {
    id: "chrono_productivity_coach",
    archetype: {
      title: "The Chrono-Productivity Coach",
      description: "An optimization specialist focused on mental rhythm calibration, circadian-spaced work cycles, and sustainable peak performance architectures.",
      color: "#7c3aed"
    },
    studyMethod: "Chronological Energy Interval Mapping & Adaptive Rhythm Sprints",
    productivityStyle: "Dynamic Workspace Lighting Setups Grounded in Circadian Tracking Indicators",
    workEnvironment: "Biophilic Coaching Studio / Virtual Health Optimization Hub",
    summary: "You possess a powerful and rare systemic mind that schedules life around biological maximums, proving that sustained focus is a function of deliberate rest cycles.",
    idealScores: {
      logicScore: 82,
      creativityScore: 84,
      focusScore: 90,
      memoryScore: 85,
      speedScore: 75,
      spatialScore: 72,
      verbalScore: 88,
      eqScore: 92,
      numericalScore: 72,
      abstractScore: 88
    },
    careerGuide: [
      {
        title: "Cognitive Performance Designer",
        why: "Outstanding balance of empathy, systems analysis, and circadian knowledge lets you advice tech teams on maximizing focus while ending burnout.",
        detailedRoadmap: [
          { stage: "Burnout Modeling", tasks: ["Chronotype Distribution Maps", "Asynchronous Working Standards", "Digital Fatigue Auditing"] },
          { stage: "Rhythm Coaching", tasks: ["Ultradian Cycling Sprints", "NSDR Integration Exercises", "Performance Optimization Plans"] }
        ]
      },
      {
        title: "Chronobiology App Strategist",
        why: "Combining strong logical design and chronotype empathy makes you exceptionally suited for formulating mobile app timing models.",
        detailedRoadmap: [
          { stage: "App Wireframing", tasks: ["Sensor Api Integrations", "Circadian Timing Calculus", "Aesthetic Interface Designs"] },
          { stage: "Adaptive Ingestion", tasks: ["Beta User Focus Auditing", "Automatic Adjustments Logic", "App Optimization Launches"] }
        ]
      }
    ],
    growthAreas: [
      {
        skill: "Systemic Deadline Squeezes",
        explanation: "Prioritizing healthy biorhythms means that chaotic, unexpected late-night technical crashes can be emotionally demanding.",
        strategy: "Formulate automated failover systems and preloaded scripts to handle on-call issues safely with minimal stress.",
        resourceLink: "https://www.youtube.com/results?search_query=incident+automation+for+developers"
      }
    ]
  },
  {
    id: "deep_space_mission_planner",
    archetype: {
      title: "The Deep-Space Mission Planner",
      description: "A highly resilient explorer who maps out spatial journeys while maintaining maximum psychological composure and survival logic.",
      color: "#4338ca"
    },
    studyMethod: "Mission Simulation Playbooks & Multi-Variable Contingency Trees",
    productivityStyle: "Fully Decoupled Offline Hardware Hubs with Multi-Week Sprints",
    workEnvironment: "Isolation Pod Simulation Lab / Orbital Design Observatory",
    summary: "Your brain displays absolute resilience, crisp logical modeling, and outstanding spatial reasoning, making you fit for environments of extreme constraint.",
    idealScores: {
      logicScore: 92,
      creativityScore: 75,
      focusScore: 93,
      memoryScore: 88,
      speedScore: 78,
      spatialScore: 96,
      verbalScore: 75,
      eqScore: 80,
      numericalScore: 88,
      abstractScore: 91
    },
    careerGuide: [
      {
        title: "Astro-Logistics Trajectory Architect",
        why: "Superior spatial skills and calculation logic allow you to calculate fuel-efficient paths across complex orbital fields under absolute risk limits.",
        detailedRoadmap: [
          { stage: "Orbital Mechanics", tasks: ["N-Body Physics Computations", "Gravity Assist Trajectory Maps", "Stochastic Collision Solvers"] },
          { stage: "Trajectory Coding", tasks: ["C++ Physics Optimization Engines", "GPU Particle Simulations", "Path Recovery Deployments"] }
        ]
      },
      {
        title: "Isolation Life-Support Engineer",
        why: "Outstanding emotional composure balanced with structural logic makes you ideal for designing long-duration subterranean colony water cycles.",
        detailedRoadmap: [
          { stage: "Support Architectures", tasks: ["Recycling System Calculators", "Fail-Safe Redundancy Matrices", "Pneumatic Sensor Telemetry"] },
          { stage: "Colony Sprints", tasks: ["Hardware Stress Examinations", "Asynchronous Event Simulations", "On-site Isolation Audits"] }
        ]
      }
    ],
    growthAreas: [
      {
        skill: "Loose Verbal Expression",
        explanation: "An extreme professional focus on safety, logic constraints, and physical vectors can make casual discussions feel unstructured.",
        strategy: "Practice telling non-structured lighthearted stories to team members to keep team links fluid and open.",
        resourceLink: "https://www.youtube.com/results?search_query=personal+storytelling+techniques"
      }
    ]
  },
  {
    id: "generative_art_technologist",
    archetype: {
      title: "The Generative Art Technologist",
      description: "A creative system innovator code-drawing mathematical art, procedural layout node graphs, and interactive aesthetic algorithms.",
      color: "#ec4899"
    },
    studyMethod: "Visual Output Auditing & Direct Mathematical Prototyping in Canvas",
    productivityStyle: "Highly Dynamic Multi-Window Coding Stations with Dark Theming Accents",
    workEnvironment: "Creative Computing Lab / Digital Art Loft / Virtual Gallery Hub",
    summary: "You live at the intersection of creative abstract thought and systematic coding logic, drawing beauty straight out of equations.",
    idealScores: {
      logicScore: 85,
      creativityScore: 95,
      focusScore: 86,
      memoryScore: 80,
      speedScore: 82,
      spatialScore: 92,
      verbalScore: 75,
      eqScore: 78,
      numericalScore: 85,
      abstractScore: 92
    },
    careerGuide: [
      {
        title: "Procedural Shading Specialist",
        why: "Your exceptional creative visualization paired with deep vector calculus matches the exact requirements of procedural WebGL material logic.",
        detailedRoadmap: [
          { stage: "GLSL Mathematics", tasks: ["SDF Vector Calculus", "Procedural Simplex Noise", "Raymarching Matrix Renderers"] },
          { stage: "Shader Development", tasks: ["Three.js Material Coding", "GPU Lighting Optimization Sprints", "Aesthetic Particle Refinements"] }
        ]
      },
      {
        title: "Generative AI Art Director",
        why: "A brilliant combination of creative abstract memory and system logic allows you to instruct and optimize latent space model outputs.",
        detailedRoadmap: [
          { stage: "Latent Spacing", tasks: ["Fine-tuning Diffusion Weights", "Context Embedding Control Nets", "Aesthetic Evaluation Schemas"] },
          { stage: "Art Delivery", tasks: ["Automated Asset Pipelines", "Creative Ingestion Regulators", "Aesthetic Quality Launches"] }
        ]
      }
    ],
    growthAreas: [
      {
        skill: "Rigid Unit Testing Habits",
        explanation: "When code success is judged primarily by visual beauty, standard software engineering tests can feel unexciting.",
        strategy: "Integrate automatic screenshot diff testing to verify visual correctness without losing creative momentum.",
        resourceLink: "https://www.youtube.com/results?search_query=visual+regression+testing+tutorial"
      }
    ]
  }
];
