import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Brain, Sparkles, Sliders, ChevronRight, CheckCircle2, 
  Bookmark, Play, ArrowRight, RotateCcw, Award, Target, Trophy, 
  Layers, BatteryCharging, Clock, Video, Dumbbell, ThumbsUp, HeartPulse
} from 'lucide-react';
import { cn } from '../lib/utils';

interface RecommendationsViewProps {
  metrics?: any;
  insights?: any;
}

interface CognitiveMetric {
  key: string;
  name: string;
  score: number;
  emoji: string;
  color: string;
  category: string;
}

interface PathItem {
  id: string;
  type: 'resource' | 'exercise' | 'activity';
  title: string;
  description: string;
  duration: string;
  medium: 'Reading' | 'Video/Visual' | 'Hands-on Practice' | 'Listening/Audio';
  targetMetricName: string;
  targetMetricKey: string;
  completed: boolean;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({ metrics, insights }) => {
  // Predefined Simulation presets to allow users/testers to experience dynamic adaptation instantly!
  const presets = {
    real: null,
    balanced: {
      name: 'Simulated: Balanced Mind',
      focusScore: 78,
      memoryScore: 74,
      logicScore: 82,
      speedScore: 76,
      creativityScore: 79,
      eqScore: 81,
      learningStyle: 'Hands-on practice',
      role: 'Working Professional'
    },
    creative: {
      name: 'Simulated: Burned-out Creative',
      focusScore: 45,
      memoryScore: 52,
      logicScore: 68,
      speedScore: 58,
      creativityScore: 94,
      eqScore: 78,
      learningStyle: 'Visual learning',
      role: 'Arts/Media Specialist'
    },
    analyst: {
      name: 'Simulated: Analytical Strategist',
      focusScore: 88,
      memoryScore: 62,
      logicScore: 95,
      speedScore: 84,
      creativityScore: 54,
      eqScore: 50,
      learningStyle: 'Reading/Writing',
      role: 'Engineering Director'
    },
    academic: {
      name: 'Simulated: Mindful Scholar',
      focusScore: 92,
      memoryScore: 86,
      logicScore: 74,
      speedScore: 68,
      creativityScore: 62,
      eqScore: 60,
      learningStyle: 'Listening/Discussion',
      role: 'Science/Research Fellow'
    }
  };

  // State
  const [activePreset, setActivePreset] = useState<keyof typeof presets>('real');
  const [customMetrics, setCustomMetrics] = useState<any>(null);
  
  // Adaptive control parameters
  const [focusStrategy, setFocusStrategy] = useState<'strengthen' | 'hybrid' | 'superpower'>('hybrid');
  const [timeCommitment, setTimeCommitment] = useState<'micro' | 'standard' | 'immersive'>('standard');
  const [deliveryFormat, setDeliveryFormat] = useState<'all' | 'video' | 'practice' | 'reading' | 'audio'>('all');
  
  // Game states for inline sandbox test
  const [gameActive, setGameActive] = useState(false);
  const [gameSequence, setGameSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [gameLevel, setGameLevel] = useState(1);
  const [gameStatus, setGameStatus] = useState<'idle' | 'showing' | 'playing' | 'success' | 'fail'>('idle');
  const [flashingIndex, setFlashingIndex] = useState<number | null>(null);
  const [earnedXP, setEarnedXP] = useState(0);

  // Active path list
  const [learningPath, setLearningPath] = useState<PathItem[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('COGNITIVE_LEARNING_PATH_COMPLETIONS');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Track if real metrics exist (comprehensiveScore > 0 or at least one assessment completed)
  const isRealMetricsValid = metrics && Object.keys(metrics).some(k => k.endsWith('Score') && metrics[k] > 0);

  // Auto-switch to balanced preset if real data is missing
  useEffect(() => {
    if (!isRealMetricsValid && activePreset === 'real') {
      setActivePreset('balanced');
    }
  }, [isRealMetricsValid]);

  // Determine current active metrics reference
  const currentMetrics = activePreset === 'real' && isRealMetricsValid
    ? metrics 
    : (presets[activePreset] || presets.balanced);

  // Calculate sorted scores to identify superpowers vs development areas
  const scoredMetrics: CognitiveMetric[] = [
    { key: 'focusScore', name: 'Focus & Attention', score: currentMetrics.focusScore || 70, emoji: '⚡', color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20', category: 'Attention' },
    { key: 'memoryScore', name: 'Memory & Retention', score: currentMetrics.memoryScore || 70, emoji: '🧠', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20', category: 'Retention' },
    { key: 'logicScore', name: 'Logical Reasoning', score: currentMetrics.logicScore || 70, emoji: '⚖️', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', category: 'Logic' },
    { key: 'speedScore', name: 'Processing Speed', score: currentMetrics.speedScore || 70, emoji: '⚡', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', category: 'Velocity' },
    { key: 'creativityScore', name: 'Lateral Creativity', score: currentMetrics.creativityScore || 70, emoji: '🎨', color: 'text-fuchsia-500 bg-fuchsia-500/10 border-fuchsia-500/20', category: 'Creation' },
    { key: 'eqScore', name: 'Emotional Intellect', score: currentMetrics.eqScore || 70, emoji: '🌱', color: 'text-teal-500 bg-teal-500/10 border-teal-500/20', category: 'Harmony' }
  ].sort((a, b) => b.score - a.score);

  const superpowers = scoredMetrics.slice(0, 2);
  const developmentAreas = [...scoredMetrics].reverse().slice(0, 2);

  // Save completion history to local storage
  useEffect(() => {
    try {
      localStorage.setItem('COGNITIVE_LEARNING_PATH_COMPLETIONS', JSON.stringify(completedIds));
    } catch (e) {}
  }, [completedIds]);

  // Comprehensive Adaptive Dataset
  const adaptivePool: Record<string, Partial<PathItem>[]> = {
    focusScore: [
      {
        type: 'resource',
        title: 'Neuroscience of Deep Focus Blocked Cycles',
        description: 'Master how the neural nodes coordinate metabolic energy during 90-minute ultradian rhythm cycles for intense analytical deep-work sprints.',
        duration: '12 min article',
        medium: 'Reading'
      },
      {
        type: 'resource',
        title: 'Visual Distraction Filtering & Flow-state Ingress',
        description: 'Scientific techniques to dampen raw visual input signals using situational task layouts and specialized digital boundary setups.',
        duration: '15 min video tutorial',
        medium: 'Video/Visual'
      },
      {
        type: 'exercise',
        title: 'Sustained Auditory Distraction Anchoring',
        description: 'Conduct a highly repetitive focus cycle while filtering complex environmental white noise or synthetic coffee shop sounds actively.',
        duration: '10 min audio run',
        medium: 'Listening/Audio'
      },
      {
        type: 'exercise',
        title: 'Dual N-Back Attentional Training',
        description: 'Complete 3 rounds of the standard working-memory and spatial-attention game, maintaining a target level of 3 matching states.',
        duration: '8 min training',
        medium: 'Hands-on Practice'
      },
      {
        type: 'activity',
        title: 'Imposed Greyscale Device Sandbox',
        description: 'Turn your primary workspace monitor fully into high-contrast black-and-white mode for 3 continuous hours of deep execution.',
        duration: '3 hour habit',
        medium: 'Hands-on Practice'
      }
    ],
    memoryScore: [
      {
        type: 'resource',
        title: 'The Method of Loci & Three-Dimensional Memory Palaces',
        description: 'Understand how spatial navigation maps onto latent memory representations allowing massive lists to be retained with spatial context.',
        duration: '18 min video course',
        medium: 'Video/Visual'
      },
      {
        type: 'resource',
        title: 'Active Recall Retrieval Schedules for Complex Concepts',
        description: 'Examine cognitive models proving that retrieval efforts outperform repetitive review cycles by creating reliable synaptic linkages.',
        duration: '10 min summary',
        medium: 'Reading'
      },
      {
        type: 'exercise',
        title: 'Ascending Backward Digit-Span Recall',
        description: 'Listen to 7 numbers spaced 1 second apart, then immediately recall them backward mentally. Record your accuracy score.',
        duration: '5 min drill',
        medium: 'Listening/Audio'
      },
      {
        type: 'exercise',
        title: 'Interactive Spatial Memory Matrix Checkplay',
        description: 'Engage actively in our embedded Memory Matrix challenge below. Solve 5 successive flash sequences perfectly to earn cognitive credits.',
        duration: '5 min active session',
        medium: 'Hands-on Practice'
      },
      {
        type: 'activity',
        title: 'Post-Hoc Narrative Meeting Reconstruct',
        description: 'Wait 1 hour after a critical call, then write down 5 complex bullet outcomes from absolute memory before looking up notes.',
        duration: '15 min daily activity',
        medium: 'Reading'
      }
    ],
    logicScore: [
      {
        type: 'resource',
        title: 'First-Principles Decision Architectures',
        description: 'How to bypass analogical shortcuts and dissect complex domains into raw axiomatic constraints for flawless deductive solutions.',
        duration: '14 min review',
        medium: 'Reading'
      },
      {
        type: 'resource',
        title: 'Constraint Satisfaction & Tree Exploration',
        description: 'A visual walkthrough of graph searching structures, pruning irrelevant decision paths early with optimal logic structures.',
        duration: '20 min media lecture',
        medium: 'Video/Visual'
      },
      {
        type: 'exercise',
        title: 'Interactive Euler Diagram Venn-Pruning',
        description: 'Determine the absolute deductive validity of 10 complex syllogistic statements using spatial Venn mapping techniques rapidly.',
        duration: '10 min mental challenge',
        medium: 'Hands-on Practice'
      },
      {
        type: 'exercise',
        title: 'Acoustic Logical Fallacy Parsing',
        description: 'Listen to arguments with cleverly embedded strawmen, slippery slope logic, or ad-homined assumptions. Spot all 5 targets.',
        duration: '12 min audio course',
        medium: 'Listening/Audio'
      },
      {
        type: 'activity',
        title: 'Structural Dependency Map Synthesis',
        description: 'Select your most complex current project block. Create a nested recursive graph illustrating its prerequisite nodes fully.',
        duration: '30 min engineering block',
        medium: 'Hands-on Practice'
      }
    ],
    speedScore: [
      {
        type: 'resource',
        title: 'Fine-Motor Isolation and Neural Conduction Loops',
        description: 'Analyzing the metabolic latency of motor cortex responses, optimizing visual scanning to speed up hand-eye reactions.',
        duration: '8 min analysis',
        medium: 'Reading'
      },
      {
        type: 'resource',
        title: 'Rapid Saccadic Scanning Schemes',
        description: 'Visual techniques designed to expand useful field of view (UFOV) to read data tables and graphs with half the eye sweeps.',
        duration: '15 min video guide',
        medium: 'Video/Visual'
      },
      {
        type: 'exercise',
        title: 'Visual Saliency Target Sprint',
        description: 'Quickly scan complex, chaotic dashboards to spot and select target alphanumeric keys inside specific 250ms visual frames.',
        duration: '5 min active sprint',
        medium: 'Hands-on Practice'
      },
      {
        type: 'exercise',
        title: 'Speed-Typing Auditory Feedback Sprints',
        description: 'Transcribe a high-tempo rapid speech clip with spellcheck disabled, forcing focus to match acoustic beats directly.',
        duration: '8 min training',
        medium: 'Listening/Audio'
      },
      {
        type: 'activity',
        title: '10-Minute Offline High-Velocity Sprint',
        description: 'Batch process standard admin emails in an accelerated speed sprint. Force immediate 1-sentence draft responses without overthinking.',
        duration: '10 min speed habit',
        medium: 'Hands-on Practice'
      }
    ],
    creativityScore: [
      {
        type: 'resource',
        title: 'SCAMPER lateral Framework for Productive Disruption',
        description: 'Deep study of substitution, combination, adaptation, modification, and elimination structures to flip boring concepts into elite solutions.',
        duration: '11 min read',
        medium: 'Reading'
      },
      {
        type: 'resource',
        title: 'Visual Synesthesia and Generative Constraints',
        description: 'Explore how arbitrary geometric or thematic barriers force neural nodes to map across distinct brain hubs for novel solutions.',
        duration: '22 min masterclass',
        medium: 'Video/Visual'
      },
      {
        type: 'exercise',
        title: 'The Alternative Uses Test Sandbox',
        description: 'Select a highly mundane item (e.g., a paperclip) and write down 12 distinct functional applications that bypass its intended scope.',
        duration: '6 min active session',
        medium: 'Hands-on Practice'
      },
      {
        type: 'exercise',
        title: 'Acoustic Storytelling Cycle Drills',
        description: 'Play a sequence of 3 ambient, unrelated acoustic tones and speak an improvised narrative that synthesizes them organically.',
        duration: '8 min speech drill',
        medium: 'Listening/Audio'
      },
      {
        type: 'activity',
        title: 'Rapid Paper Low-Fidelity Redesign',
        description: 'Sketch a revolutionary physical UI layout for a common coffee machine under a self-imposed 3-minute stopwatch deadline.',
        duration: '5 min daily habit',
        medium: 'Hands-on Practice'
      }
    ],
    eqScore: [
      {
        type: 'resource',
        title: 'The Somatosensory Interpersonal Compass',
        description: 'Understand the biological signaling pathways of affective empathy, tracking pulse and neck micro-clenches under stress.',
        duration: '16 min article',
        medium: 'Reading'
      },
      {
        type: 'resource',
        title: 'Video Guide to Active Empathetic De-escalation',
        description: 'Visualizing body language shifts, active facial tracking, and vocal-frequency adaptation to soothe active client disputes.',
        duration: '18 min media block',
        medium: 'Video/Visual'
      },
      {
        type: 'exercise',
        title: 'Reflective Empathy Listening Scenarios',
        description: 'Listen to raw audio recordings of stressed colleagues. Formulate verbal summaries validating their exact core emotion.',
        duration: '10 min active loop',
        medium: 'Listening/Audio'
      },
      {
        type: 'exercise',
        title: 'Scenario-Based Interactive EQ Sandbox',
        description: 'Read and resolve 3 complex leadership crises under conflicting pressure, choosing options that optimize multi-user morale.',
        duration: '8 min training',
        medium: 'Hands-on Practice'
      },
      {
        type: 'activity',
        title: 'The 1.5-Second Communication Pause',
        description: 'In all physical or virtual conversations today, pause for exactly 1.5 seconds before replying to absorb and read facial cues.',
        duration: 'Daily interpersonal habit',
        medium: 'Hands-on Practice'
      }
    ]
  };

  // Helper mapping
  const formatMediumText = (format: string) => {
    if (format === 'video') return 'Video/Visual';
    if (format === 'practice') return 'Hands-on Practice';
    if (format === 'reading') return 'Reading';
    if (format === 'audio') return 'Listening/Audio';
    return '';
  };

  // Generate learning path based on Adaptive metrics + user-selected parameters
  useEffect(() => {
    const rawPath: PathItem[] = [];
    
    // Determine target areas depending on Strategy
    let targets: { metric: CognitiveMetric; type: 'strengthen' | 'superpower' }[] = [];
    
    if (focusStrategy === 'strengthen') {
      targets = [
        { metric: developmentAreas[0], type: 'strengthen' },
        { metric: developmentAreas[1], type: 'strengthen' },
        { metric: superpowers[0], type: 'superpower' } // 2 Dev, 1 Power
      ];
    } else if (focusStrategy === 'superpower') {
      targets = [
        { metric: superpowers[0], type: 'superpower' },
        { metric: superpowers[1], type: 'superpower' },
        { metric: developmentAreas[0], type: 'strengthen' } // 2 Power, 1 Dev
      ];
    } else {
      // Hybrid Balance
      targets = [
        { metric: developmentAreas[0], type: 'strengthen' },
        { metric: superpowers[0], type: 'superpower' },
        { metric: developmentAreas[1], type: 'strengthen' },
        { metric: superpowers[1], type: 'superpower' } // Equal 2 & 2
      ];
    }

    // Determine target item counts depending on Time commitment budget
    // micro = 1 item per target area. standard = 2 items. immersive = 3 items.
    const itemsPerTarget = timeCommitment === 'micro' ? 1 : (timeCommitment === 'standard' ? 2 : 3);

    targets.forEach(({ metric, type }, index) => {
      const pool = adaptivePool[metric.key] || [];
      
      // Filter by Medium format preference if selected
      let filteredPool = pool;
      if (deliveryFormat !== 'all') {
        const targetMediumType = formatMediumText(deliveryFormat);
        filteredPool = pool.filter(item => item.medium === targetMediumType);
        // Fallback to full pool if filter left it empty to keep system robust
        if (filteredPool.length === 0) filteredPool = pool;
      }

      // Add unique items limit
      const selectCount = Math.min(filteredPool.length, itemsPerTarget);
      for (let i = 0; i < selectCount; i++) {
        const rawItem = filteredPool[i];
        const uniqueId = `item-${metric.key}-${rawItem.type}-${i}-${focusStrategy}-${timeCommitment}-${deliveryFormat}`;
        rawPath.push({
          id: uniqueId,
          type: rawItem.type || 'resource',
          title: rawItem.title || 'Dynamic Module',
          description: rawItem.description || '',
          duration: rawItem.duration || '5 mins',
          medium: rawItem.medium || 'Reading',
          targetMetricName: metric.name,
          targetMetricKey: metric.key,
          completed: completedIds.includes(uniqueId)
        });
      }
    });

    setLearningPath(rawPath);
  }, [currentMetrics, focusStrategy, timeCommitment, deliveryFormat, completedIds]);

  // Handle checking off an item
  const handleToggleItem = (itemId: string) => {
    setCompletedIds(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  // Inline Game Logic: Spatial Grid Memory Matrix Drill
  const startMemoryGame = () => {
    setGameActive(true);
    setUserSequence([]);
    setGameStatus('showing');
    
    // Generate simple sequence based on game level
    const seqLength = 3 + gameLevel; // level 1: 4 tiles, level 2: 5 tiles, etc.
    const newSeq: number[] = [];
    for (let i = 0; i < seqLength; i++) {
      newSeq.push(Math.floor(Math.random() * 9)); // 3x3 grid (0 to 8)
    }
    setGameSequence(newSeq);
    playSequence(newSeq);
  };

  // Sequentially flash tiles
  const playSequence = (seq: number[]) => {
    let index = 0;
    const interval = setInterval(() => {
      setFlashingIndex(seq[index]);
      setTimeout(() => setFlashingIndex(null), 600);
      
      index++;
      if (index >= seq.length) {
        clearInterval(interval);
        setTimeout(() => {
          setGameStatus('playing');
        }, 800);
      }
    }, 1000);
  };

  const handleTileClick = (tileIndex: number) => {
    if (gameStatus !== 'playing') return;
    
    const nextUserSeq = [...userSequence, tileIndex];
    setUserSequence(nextUserSeq);
    
    // Check correctness instantly
    const currentStep = nextUserSeq.length - 1;
    if (tileIndex !== gameSequence[currentStep]) {
      // Failed!
      setGameStatus('fail');
      return;
    }

    if (nextUserSeq.length === gameSequence.length) {
      // Level Success!
      setGameStatus('success');
      const bonusXP = (3 + gameLevel) * 10;
      setEarnedXP(prev => prev + bonusXP);
      
      // Update global cognitive credits in local storage if present
      try {
        const savedXP = localStorage.getItem('COGNITIVE_TWIN_XP');
        const currentXP = savedXP ? parseInt(savedXP, 10) : 1550;
        localStorage.setItem('COGNITIVE_TWIN_XP', (currentXP + bonusXP).toString());
      } catch (e) {}
    }
  };

  const advanceLevel = () => {
    setGameLevel(prev => prev + 1);
    setUserSequence([]);
    setGameStatus('showing');
    
    const seqLength = 3 + (gameLevel + 1);
    const newSeq: number[] = [];
    for (let i = 0; i < seqLength; i++) {
      newSeq.push(Math.floor(Math.random() * 9));
    }
    setGameSequence(newSeq);
    playSequence(newSeq);
  };

  const resetGame = () => {
    setGameLevel(1);
    setUserSequence([]);
    setGameSequence([]);
    setGameStatus('idle');
    setGameActive(false);
  };

  // Completion calculation
  const completedCount = learningPath.filter(item => completedIds.includes(item.id)).length;
  const progressRatio = learningPath.length > 0 ? Math.round((completedCount / learningPath.length) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in text-[#251e44]">
      
      {/* SECTION 1: HEADER & ADAPTIVE SINK STATUS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#eae4f5] dark:bg-[#251e44]/40 border border-[#bfaad4]/30 px-6 py-5 rounded-3xl gap-6">
        <div className="space-y-1 md:max-w-xl">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-serif italic text-[#1e1a42] tracking-tight">
              Adaptive Learning Path Generator
            </h2>
            <Sparkles className="w-4 h-4 text-[#8A2BE2] animate-pulse" />
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            Unifying psychometric analysis and continuous behavioral adjustments into an organic, self-optimizing learning syllabus.
          </p>
        </div>

        {/* Real Dynamic Connection Status Card */}
        <div className="p-4 bg-white/60 dark:bg-[#1e1a42]/30 border border-[#bfaad4]/30 rounded-2xl flex items-center gap-3 w-full md:w-auto shrink-0 shadow-sm">
          {activePreset === 'real' && isRealMetricsValid ? (
            <>
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 font-mono flex items-center gap-1">
                  <HeartPulse className="w-3 h-3 text-emerald-500" /> Active Mind Sync
                </span>
                <p className="text-[11px] text-slate-600">Adaptive calibration synced to your results.</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-3 h-3 bg-amber-400 rounded-full shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-600 font-mono">
                  Simulation Active
                </span>
                <p className="text-[11px] text-slate-600">Testing adaptivity using artificial metrics.</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* SECTION 2: ADAPTIVE PROFILES PRESETS INTERACTION */}
      <div className="bg-white/40 border border-[#bfaad4]/20 p-5 rounded-3xl space-y-4">
        <div className="flex items-center gap-2 border-b border-black/5 pb-2">
          <Layers className="w-4 h-4 text-[#8A2BE2]" />
          <h4 className="text-xs uppercase font-bold tracking-widest text-[#7c779e] font-mono">
            Step 1: Calibrate Mind Profile Signal Source
          </h4>
        </div>
        
        <div className="flex flex-wrap gap-2.5">
          {isRealMetricsValid && (
            <button 
              onClick={() => setActivePreset('real')}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-mono font-bold border transition-all flex items-center gap-1.5 shadow-sm",
                activePreset === 'real' 
                  ? "bg-[#1e1a42] text-white border-transparent scale-105" 
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              <span>👤 My Real Assessed Soul</span>
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            </button>
          )}
          <button 
            onClick={() => setActivePreset('balanced')}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-mono font-bold border transition-all",
              activePreset === 'balanced' 
                ? "bg-[#1e1a42] text-white border-transparent scale-105 shadow-sm" 
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            )}
          >
            ⚖️ Balanced Mind (Preset)
          </button>
          <button 
            onClick={() => setActivePreset('creative')}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-mono font-bold border transition-all",
              activePreset === 'creative' 
                ? "bg-[#1e1a42] text-white border-transparent scale-105 shadow-sm" 
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            )}
          >
            🎨 Burned-out Creative (Preset)
          </button>
          <button 
            onClick={() => setActivePreset('analyst')}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-mono font-bold border transition-all",
              activePreset === 'analyst' 
                ? "bg-[#1e1a42] text-white border-transparent scale-105 shadow-sm" 
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            )}
          >
            ⚙️ Analytical Strategist (Preset)
          </button>
          <button 
            onClick={() => setActivePreset('academic')}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-mono font-bold border transition-all",
              activePreset === 'academic' 
                ? "bg-[#1e1a42] text-white border-transparent scale-105 shadow-sm" 
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            )}
          >
            🎓 Mindful Scholar (Preset)
          </button>
        </div>

        {/* Dynamic score summary for visual transparency */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3.5 pt-2">
          {scoredMetrics.map((item) => (
            <div 
              key={item.key} 
              className={cn(
                "p-3 rounded-2xl border text-center relative overflow-hidden transition-all duration-300",
                "bg-white/80 border-[#bfaad4]/20 shadow-xs"
              )}
            >
              <span className="text-xl inline-block mb-1">{item.emoji}</span>
              <div className="text-[10px] text-slate-400 uppercase font-mono font-bold tracking-tight truncate">
                {item.category}
              </div>
              <div className="text-base font-serif font-black text-primary">
                {item.score}%
              </div>
              <div className="w-full h-1 bg-slate-100 absolute bottom-0 left-0">
                <div 
                  className={cn(
                    "h-full transition-all duration-500",
                    item.score < 60 ? "bg-red-400" : (item.score < 80 ? "bg-amber-400" : "bg-emerald-400")
                  )}
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: CORE PARAMETERS FORM (ADAPTATION CONTROLLERS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white/40 border border-[#bfaad4]/20 p-6 rounded-3xl">
        
        {/* Param 1: Strategy Focus Mode */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1e1a42] uppercase font-mono tracking-widest border-b border-black/5 pb-1">
            <Sliders className="w-3.5 h-3.5 text-[#8A2BE2]" />
            <span>1. Adaptive Strategy Focus</span>
          </div>
          <p className="text-[10px] text-[#7c779e] leading-relaxed">
            Target development deficits or aggressively optimize your cognitive superpowers.
          </p>
          <div className="flex flex-col gap-2 pt-1">
            <button
              onClick={() => setFocusStrategy('strengthen')}
              className={cn(
                "w-full px-4 py-2 rounded-xl text-left text-xs font-bold transition-all border flex justify-between items-center",
                focusStrategy === 'strengthen'
                  ? "bg-[#8A2BE2] text-white border-transparent translate-x-1"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              <span>Strengthen Weaknesses</span>
              <span className="text-[10px] opacity-75">75% Deficit Target</span>
            </button>
            <button
              onClick={() => setFocusStrategy('hybrid')}
              className={cn(
                "w-full px-4 py-2 rounded-xl text-left text-xs font-bold transition-all border flex justify-between items-center",
                focusStrategy === 'hybrid'
                  ? "bg-[#8A2BE2] text-white border-transparent translate-x-1"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              <span>Balanced Hybrid Path</span>
              <span className="text-[10px] opacity-75">50% / 50%</span>
            </button>
            <button
              onClick={() => setFocusStrategy('superpower')}
              className={cn(
                "w-full px-4 py-2 rounded-xl text-left text-xs font-bold transition-all border flex justify-between items-center",
                focusStrategy === 'superpower'
                  ? "bg-[#8A2BE2] text-white border-transparent translate-x-1"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              <span>Double-Down on Powers</span>
              <span className="text-[10px] opacity-75">75% Elite Target</span>
            </button>
          </div>
        </div>

        {/* Param 2: Time Commitment */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1e1a42] uppercase font-mono tracking-widest border-b border-black/5 pb-1">
            <Clock className="w-3.5 h-3.5 text-[#8A2BE2]" />
            <span>2. Time Budget Allocation</span>
          </div>
          <p className="text-[10px] text-[#7c779e] leading-relaxed">
            Adjust the thickness of syllabus recommendations to respect your calendar.
          </p>
          <div className="flex flex-col gap-2 pt-1">
            <button
              onClick={() => setTimeCommitment('micro')}
              className={cn(
                "w-full px-4 py-2 rounded-xl text-left text-xs font-bold transition-all border flex justify-between items-center",
                timeCommitment === 'micro'
                  ? "bg-[#8A2BE2] text-white border-transparent translate-x-1"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              <span>Micro-learning Speed</span>
              <span className="text-[10px] opacity-75">15 min/day</span>
            </button>
            <button
              onClick={() => setTimeCommitment('standard')}
              className={cn(
                "w-full px-4 py-2 rounded-xl text-left text-xs font-bold transition-all border flex justify-between items-center",
                timeCommitment === 'standard'
                  ? "bg-[#8A2BE2] text-white border-transparent translate-x-1"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              <span>Focused Block Drill</span>
              <span className="text-[10px] opacity-75">30-45 min/day</span>
            </button>
            <button
              onClick={() => setTimeCommitment('immersive')}
              className={cn(
                "w-full px-4 py-2 rounded-xl text-left text-xs font-bold transition-all border flex justify-between items-center",
                timeCommitment === 'immersive'
                  ? "bg-[#8A2BE2] text-white border-transparent translate-x-1"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              <span>Immersive Brain Bootcamp</span>
              <span className="text-[10px] opacity-75">1+ hr/day</span>
            </button>
          </div>
        </div>

        {/* Param 3: Delivery Format */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1e1a42] uppercase font-mono tracking-widest border-b border-black/5 pb-1">
            <Video className="w-3.5 h-3.5 text-[#8A2BE2]" />
            <span>3. Delivery Style Medium</span>
          </div>
          <p className="text-[10px] text-[#7c779e] leading-relaxed">
            Format priority matches your primary learning style: {currentMetrics.learningStyle || 'Hands-on practice'}.
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setDeliveryFormat('all')}
              className={cn(
                "px-3 py-2 rounded-xl text-xs font-bold text-center border transition-all truncate",
                deliveryFormat === 'all' ? "bg-[#8A2BE2] text-white border-transparent" : "bg-white border-slate-200 hover:bg-slate-50"
              )}
            >
              🚀 All Formats
            </button>
            <button
              onClick={() => setDeliveryFormat('practice')}
              className={cn(
                "px-3 py-2 rounded-xl text-xs font-bold text-center border transition-all truncate",
                deliveryFormat === 'practice' ? "bg-[#8A2BE2] text-white border-transparent" : "bg-white border-slate-200 hover:bg-slate-50"
              )}
            >
              🎯 Active Drills
            </button>
            <button
              onClick={() => setDeliveryFormat('reading')}
              className={cn(
                "px-3 py-2 rounded-xl text-xs font-bold text-center border transition-all truncate",
                deliveryFormat === 'reading' ? "bg-[#8A2BE2] text-white border-transparent" : "bg-white border-slate-200 hover:bg-slate-50"
              )}
            >
              📖 Concepts
            </button>
            <button
              onClick={() => setDeliveryFormat('audio')}
              className={cn(
                "px-3 py-2 rounded-xl text-xs font-bold text-center border transition-all truncate",
                deliveryFormat === 'audio' ? "bg-[#8A2BE2] text-white border-transparent" : "bg-white border-slate-200 hover:bg-slate-50"
              )}
            >
              🎧 Acoustic Loops
            </button>
          </div>
          <p className="text-[9px] text-[#8A2BE2] italic text-center uppercase tracking-wider font-semibold animate-pulse">
            * Fully auto-generates on selection changes *
          </p>
        </div>

      </div>

      {/* SECTION 4: ACTIVELY GENERATED LEARN RIG ROADMAP */}
      <div className="bg-white/40 border border-[#bfaad4]/25 p-6 rounded-3xl space-y-6">
        
        {/* Sub-header with current adapt progress */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-black/5 pb-3 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 px-2.2 text-[9px] font-mono font-black uppercase tracking-widest bg-[#8A2BE2]/10 text-[#8A2BE2] rounded-full border border-[#8A2BE2]/30">
                Live Syllabus
              </span>
              <h3 className="text-[#1e1a42] font-serif font-bold text-lg">Adaptive Personal Growth Path</h3>
            </div>
            <p className="text-[11px] text-slate-500">
              Calibrated targeting for: <strong className="text-secondary">{developmentAreas.map(d=>d.category).join(' & ')}</strong> (Deficits) and <strong className="text-[#8A2BE2]">{superpowers.map(s=>s.category).join(' & ')}</strong> (Powers)
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="text-right shrink-0">
              <span className="text-[9px] uppercase font-bold text-slate-400 font-mono tracking-widest block">Syllabus Progress</span>
              <span className="text-base font-serif italic text-primary font-bold">{completedCount} of {learningPath.length} Modules</span>
            </div>
            <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden shrink-0">
              <div 
                className="h-full bg-gradient-to-r from-[#8A2BE2] to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progressRatio}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-[#1e1a42] shrink-0 bg-[#eae4f5] dark:bg-[#1e1a42]/20 px-2 py-1 rounded">
              {progressRatio}%
            </span>
          </div>
        </div>

        {/* The Card Path Container */}
        {learningPath.length === 0 ? (
          <div className="p-8 text-center bg-[#fdfcff] rounded-3xl border border-dashed border-slate-200">
            <BatteryCharging className="w-8 h-8 text-slate-300 mx-auto animate-bounce mb-3" />
            <p className="text-slate-500 font-mono text-xs">Generating optimal node configurations... Select alternative filters above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <AnimatePresence mode="popLayout">
              {learningPath.map((item, index) => {
                const isItemCompleted = completedIds.includes(item.id);
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                    className={cn(
                      "group p-5 rounded-3.5xl border flex flex-col justify-between h-54 transition-all relative overflow-hidden",
                      isItemCompleted 
                        ? "bg-slate-50 border-slate-200 shadow-inner" 
                        : "bg-[#fdfcff] hover:bg-white border-[#b3a5e2]/25 w-full hover:shadow-xs"
                    )}
                  >
                    {/* Visual side bar line indicating dynamic category color */}
                    <div className={cn(
                      "absolute top-0 bottom-0 left-0 w-1",
                      item.targetMetricKey === 'focusScore' ? "bg-indigo-400" :
                      item.targetMetricKey === 'memoryScore' ? "bg-rose-400" :
                      item.targetMetricKey === 'logicScore' ? "bg-amber-400" :
                      item.targetMetricKey === 'speedScore' ? "bg-emerald-400" :
                      item.targetMetricKey === 'creativityScore' ? "bg-fuchsia-400" : "bg-teal-400"
                    )} />

                    <div className="space-y-3 relative">
                      {/* Top status bar */}
                      <div className="flex items-center justify-between pb-2 border-b border-black/[0.03]">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-xs uppercase font-bold tracking-wider font-mono text-[#8A2BE2] truncate">
                            {item.targetMetricName}
                          </span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full" />
                          <span className="text-[10px] text-slate-400 truncate capitalize font-semibold font-mono">
                            {item.type}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-200 px-2 py-0.5 rounded shrink-0">
                          {item.medium}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-1">
                        <h4 className={cn(
                          "text-sm font-bold tracking-tight text-primary transition-all line-clamp-1",
                          isItemCompleted && "line-through text-slate-400"
                        )}>
                          {item.title}
                        </h4>
                        <p className={cn(
                          "text-[11px] text-secondary leading-relaxed line-clamp-3",
                          isItemCompleted && "text-slate-400"
                        )}>
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom actions */}
                    <div className="flex justify-between items-center pt-3 border-t border-black/[0.03] mt-2 relative z-10">
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-300" />
                        {item.duration}
                      </span>

                      <div className="flex items-center gap-2">
                        {item.type === 'exercise' && item.targetMetricKey === 'memoryScore' && !isItemCompleted && (
                          <a 
                            href="#sandbox-panel"
                            className="text-[10px] bg-[#8A2BE2]/10 text-[#8A2BE2] px-3 py-1.5 rounded-full font-bold uppercase tracking-wider hover:bg-[#8A2BE2]/20 transition-all mr-1.5"
                          >
                            Jump Inline ⚡
                          </a>
                        )}
                        <button
                          onClick={() => handleToggleItem(item.id)}
                          className={cn(
                            "px-4 py-2 text-[10px] uppercase font-bold tracking-widest rounded-full transition-all flex items-center gap-1",
                            isItemCompleted
                              ? "bg-slate-200 hover:bg-slate-300 text-slate-600"
                              : "bg-[#8A2BE2] hover:bg-[#8A2BE2]/95 text-white active:scale-97"
                          )}
                        >
                          {isItemCompleted ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Completed</span>
                            </>
                          ) : (
                            <>
                              <span>Launch & Complete</span>
                              <ChevronRight className="w-3.5 h-3.5 text-white/80" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Reset progress button if items exist */}
        {completedIds.length > 0 && (
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setCompletedIds([])}
              className="text-[10px] font-mono uppercase font-black text-slate-400 hover:text-red-500 transition-all flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Growth Progress History</span>
            </button>
          </div>
        )}
      </div>

      {/* SECTION 5: INTERACTIVE TRAINING DRILLS PLAYGROUND (THE SANDBOX) */}
      <div id="sandbox-panel" className="bg-[#eae4f5]/60 border border-[#bfaad4]/30 p-6 rounded-3xl space-y-6 relative overflow-hidden">
        
        {/* Animated background rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-[#8A2BE2]/5 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-[#8A2BE2]/5 rounded-full pointer-events-none" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#bfaad4]/30 pb-3 gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[9px] font-mono bg-indigo-500/10 text-indigo-500 border border-indigo-400/25 rounded font-black uppercase">
                Active Playground
              </span>
              <h3 className="text-[#100d30] font-serif font-black tracking-tight text-lg">
                Mental Cohesion & Attention Sandbox
              </h3>
            </div>
            <p className="text-[11px] text-slate-500">
              Interactive training matrix. Sync focus nodes, solve sequences, and earn actual Cognitive Twin Credit XP!
            </p>
          </div>

          {earnedXP > 0 && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="px-4 py-1.5 bg-amber-400 text-[#1e1a42] text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1 shadow-xs border border-amber-500/20"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>+{earnedXP} Neural XP Accrued</span>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Main Matrix Board (7 columns) */}
          <div className="md:col-span-7 flex flex-col items-center justify-center bg-[#fdfcff] border border-[#b3a5e2]/25 p-6 rounded-3xl shadow-sm min-h-76">
            {!gameActive ? (
              <div className="text-center space-y-4 max-w-sm">
                <div className="w-14 h-14 bg-[#8A2BE2]/10 rounded-full flex items-center justify-center text-[#8A2BE2] mx-auto border border-[#8A2BE2]/20">
                  <Play className="w-6 h-6 transform translate-x-0.5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-800">Spatial Rhythm Memorizer</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Test your temporary recall capacity. We will flash a pattern of blue coordinates. Click them back perfectly in sequence.
                  </p>
                </div>
                <button
                  onClick={startMemoryGame}
                  className="px-6 py-2.5 bg-[#8A2BE2] hover:brightness-105 active:scale-97 text-white text-[10px] uppercase font-bold tracking-widest rounded-full transition-all flex items-center gap-1.5 mx-auto"
                >
                  <span>Initialize Drill Level {gameLevel}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/80" />
                </button>
              </div>
            ) : (
              <div className="space-y-5 w-full max-w-xs text-center">
                
                {/* Status indicators */}
                <div className="flex justify-between items-center text-xs font-mono px-1">
                  <span className="text-[#8A2BE2] font-bold">Level {gameLevel} ({gameSequence.length} Steps)</span>
                  <span className={cn(
                    "capitalize font-semibold",
                    gameStatus === 'showing' ? "text-amber-500 animate-pulse" :
                    gameStatus === 'playing' ? "text-indigo-500 font-extrabold" :
                    gameStatus === 'success' ? "text-emerald-500 font-black" : "text-red-500 font-extrabold"
                  )}>
                    Status: {gameStatus}
                  </span>
                </div>

                {/* 3x3 Grid Board */}
                <div className="grid grid-cols-3 gap-3">
                  {Array.from({ length: 9 }).map((_, idx) => {
                    const isFlashing = flashingIndex === idx;
                    const isUserGuessed = userSequence.includes(idx);
                    
                    return (
                      <button
                        key={idx}
                        disabled={gameStatus !== 'playing'}
                        onClick={() => handleTileClick(idx)}
                        className={cn(
                          "aspect-square rounded-2xl border transition-all duration-150 transform relative flex items-center justify-center cursor-pointer",
                          gameStatus === 'playing' ? "active:scale-90" : "",
                          isFlashing 
                            ? "bg-indigo-500 border-transparent shadow-[0_0_20px_rgba(99,102,241,0.6)]" 
                            : isUserGuessed 
                              ? "bg-indigo-500/20 border-[#8A2BE2]/45 text-primary" 
                              : "bg-slate-50 border-slate-200/80 text-slate-300 hover:border-slate-300"
                        )}
                      >
                        {/* Tiny numbers for spatial mapping reference */}
                        <span className="absolute bottom-1 right-2 text-[8px] font-mono text-slate-300 select-none">
                          {idx + 1}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Postplay controls */}
                <div className="pt-2">
                  {gameStatus === 'success' ? (
                    <div className="space-y-2">
                      <p className="text-xs text-emerald-600 font-semibold flex items-center justify-center gap-1">
                        <Award className="w-4 h-4" /> Level Complete! Neural Synapses Aligned.
                      </p>
                      <button
                        onClick={advanceLevel}
                        className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all"
                      >
                        Advance to Level {gameLevel + 1}
                      </button>
                    </div>
                  ) : gameStatus === 'fail' ? (
                    <div className="space-y-2">
                      <p className="text-xs text-red-500 font-semibold">
                        Slight attention drift. Re-indexing alignment.
                      </p>
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={startMemoryGame}
                          className="px-4 py-1.5 bg-[#8A2BE2] text-white text-[10px] font-bold uppercase tracking-wider rounded-xl hover:brightness-105"
                        >
                          Retry Level
                        </button>
                        <button
                          onClick={resetGame}
                          className="px-4 py-1.5 bg-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-xl hover:bg-slate-300"
                        >
                          Exit sandbox
                        </button>
                      </div>
                    </div>
                  ) : gameStatus === 'playing' ? (
                    <div className="text-[10px] text-slate-400 font-mono">
                      Step: {userSequence.length} / {gameSequence.length}
                    </div>
                  ) : (
                    <div className="text-[10px] text-amber-500 font-mono animate-pulse font-bold">
                      Observe closely... Do not click!
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

          {/* Theoretical Link Column (5 columns) */}
          <div className="md:col-span-5 bg-[#fdfcff] border border-[#b3a5e2]/25 p-5 rounded-3xl space-y-4 flex flex-col justify-between min-h-76 text-left">
            <div className="space-y-3">
              <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-[#8A2BE2] bg-[#8A2BE2]/5 px-2.5 py-1 rounded border border-[#8A2BE2]/10 inline-block">
                Theoretical Scaffold
              </span>
              <p className="text-xs font-bold text-[#1e1a42] font-mono flex items-center gap-1.5">
                <Target className="w-4 h-4 text-pink-500" />
                Method: Spatial Sequencer
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                By prompting structured spatial sequence challenges under stress, we provoke deliberate working-memory encoding. This forces the dorsolateral prefrontal cortex to activate memory structures, establishing rapid temporary buffers.
              </p>
              <div className="bg-slate-50 border border-black/[0.04] p-3 rounded-xl space-y-1 text-[10px] font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Segment</span>
                  <span className="text-[#8A2BE2] font-bold">Spatial / Recaller</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cognitive Stressor</span>
                  <span className="text-secondary font-bold">Temporal Decay</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Recommended Duration</span>
                  <span className="text-[#8A2BE2] font-bold">5 mins daily</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-black/[0.03]">
              <div className="flex items-center gap-1.5 text-[9px] text-[#8A2BE2] uppercase tracking-wider font-extrabold pb-2">
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Adaptation Synergy</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Completing matrix drill levels automatically logs credits in your local state profile, strengthening metrics in real-time.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
