import React, { useState, useEffect, useCallback, Fragment, forwardRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { MeshBrain } from './Branding';
import { Target, Puzzle, Zap, Shield, Sparkles, Clock, CheckCircle2, Box, MessageSquare, Smile, Hash, Shapes, Activity, Heart, RefreshCw, Globe, Loader2, AlertCircle } from 'lucide-react';
import { generateDynamicTestQuestions } from '../services/geminiService';
import { LOCAL_QUESTION_SETS } from '../constants/localQuestions';

// --- Stability & Recovery ---
class TestErrorBoundary extends React.Component<{ children: React.ReactNode, onReset: () => void }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Test Crash Detected:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-6">
          <AlertCircle className="w-12 h-12 text-rose-500 opacity-50" />
          <h3 className="text-xl font-serif italic text-primary">Neural Synchronization Interrupted</h3>
          <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
            The cognitive link encountered an unexpected state. This is often due to local browser resource constraints or temporary network jitter.
          </p>
          <button 
            onClick={() => {
              this.setState({ hasError: false });
              this.props.onReset();
            }}
            className="px-8 py-3 bg-white text-black rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors"
          >
            Attempt Re-calibration
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export const withStability = (WrappedComponent: React.ComponentType<any>) => {
  const StabilizedComponent = (props: any) => {
    const [retryKey, setRetryKey] = useState(0);
    return (
      <TestErrorBoundary key={retryKey} onReset={() => setRetryKey(prev => prev + 1)}>
        <WrappedComponent {...props} />
      </TestErrorBoundary>
    );
  };
  StabilizedComponent.displayName = `withStability(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return StabilizedComponent;
};

// --- Common UI for Tests ---
export const ProgressBar = ({ current, total }: { current: number, total: number }) => (
  <div className="w-full max-w-sm mx-auto mb-8">
    <div className="flex justify-between items-center mb-2">
      <span className="text-[10px] font-bold text-[#8c78a5] uppercase tracking-widest">Progress</span>
      <span className="text-[10px] font-bold text-[#8c78a5] uppercase tracking-widest">{current} / {total}</span>
    </div>
    <div className="h-1.5 w-full bg-[#8A2BE2]/10 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${(current / total) * 100}%` }}
        className="h-full bg-gradient-to-r from-[#8A2BE2] to-[#9979f4] rounded-full"
      />
    </div>
  </div>
);

export const DifficultySelector = ({ selected, onSelect }: { selected: string, onSelect: (d: string) => void }) => (
  <div className="flex flex-wrap gap-3 justify-center mb-8 md:mb-12">
    {['gentle', 'moderate', 'challenging'].map((d) => (
      <button
        key={d}
        onClick={() => onSelect(d)}
        className={cn(
          "px-5 py-2 text-[10px] font-bold uppercase tracking-widest border rounded-full font-sans transition-all duration-200 whitespace-nowrap active:scale-95 cursor-pointer",
          selected === d 
            ? "bg-gradient-to-r from-[#8A2BE2] to-[#9979f4] text-white border-transparent shadow-md shadow-indigo-600/10" 
            : "bg-white/60 text-[#6a427f] border-[#8A2BE2]/20 hover:bg-white"
        )}
      >
        {d}
      </button>
    ))}
  </div>
);

export const TestHeader = ({ title, description, icon: Icon }: any) => (
  <div className="text-center mb-8 md:mb-10 px-4">
    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8A2BE2]/10 to-[#9979f4]/10 border border-[#8A2BE2]/20 mb-4 text-[#8A2BE2] shadow-sm">
      <Icon className="w-5 h-5" />
    </div>
    <h3 className="text-xl md:text-2xl font-serif italic text-[#322851] font-normal mb-2 tracking-tight">{title}</h3>
    <p className="text-[#6e5380] max-w-md mx-auto leading-relaxed text-xs sm:text-sm font-light">{description}</p>
  </div>
);

export const SuccessPulse = ({ active }: { active: boolean }) => (
  <AnimatePresence>
    {active && (
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1.2 }}
        exit={{ opacity: 0, scale: 2 }}
        className="absolute inset-0 pointer-events-none flex items-center justify-center z-50"
      >
        <div className="w-64 h-64 rounded-full bg-[#8A2BE2]/10 blur-3xl" />
      </motion.div>
    )}
  </AnimatePresence>
);

export const ComprehensiveLocalTest = withStability(({ onComplete }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showPulse, setShowPulse] = useState(false);
  
  const [sessionQuestions] = useState(() => {
    const keys = Object.keys(LOCAL_QUESTION_SETS);
    const shuffledKeys = keys.sort(() => Math.random() - 0.5);
    const all: any[] = [];
    shuffledKeys.forEach(setName => {
      const set = [...(LOCAL_QUESTION_SETS as any)[setName]].sort(() => Math.random() - 0.5);
      all.push(...set);
    });
    return all.slice(0, 5); // Delightfully brief 5 questions instead of 29
  });
  
  const currentQuestion = sessionQuestions[currentIndex];
  const totalQuestions = sessionQuestions.length;

  const handleAnswer = (idx: number) => {
    if (!currentQuestion) return;
    const isCorrect = idx === currentQuestion.correct;
    if (isCorrect) {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 500);
      setScore(s => s + (100 / totalQuestions));
    }

    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex(c => c + 1);
    } else {
      onComplete(Math.min(100, Math.round(score + (isCorrect ? (100 / totalQuestions) : 0))));
    }
  };

  if (!currentQuestion) return null;

  const domain = currentQuestion.set ? (currentQuestion.set.charAt(0).toUpperCase() + currentQuestion.set.slice(1)) : 'Neural';

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-lg mx-auto relative px-2">
      <SuccessPulse active={showPulse} />
      <TestHeader 
        title="Comprehensive Evaluation" 
        description={`Domain: ${domain}. A randomized cross-set assessment of your local neural foundations.`}
        icon={Target}
      />
      
      <ProgressBar current={currentIndex + 1} total={totalQuestions} />

      <div className="w-full bg-white/80 border border-purple-100 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl shadow-[#8A2BE2]/5">
        <div className="flex justify-between items-center pb-2 border-b border-purple-50">
          <span className="text-[10px] font-bold text-[#8A2BE2] uppercase tracking-widest bg-[#8A2BE2]/8 px-3.5 py-1.5 rounded-full border border-[#8A2BE2]/10">{domain} Domain</span>
          <span className="text-[10px] font-bold text-[#8c78a5] uppercase tracking-widest font-mono">Q: {currentIndex + 1} / {totalQuestions}</span>
        </div>
        
        <p className="text-lg md:text-xl text-[#322851] font-serif font-normal italic leading-relaxed text-center py-2">{currentQuestion.q}</p>
        
        <div className="space-y-3">
          {currentQuestion.a.map((ans: string, i: number) => {
            const letter = String.fromCharCode(65 + i); // A, B, C, D
            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className="w-full p-4.5 text-left border border-purple-100 hover:border-[#8A2BE2]/40 hover:bg-[#8A2BE2]/5 bg-white/50 active:scale-[0.98] transition-all rounded-2xl group flex items-center gap-4 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#8A2BE2]/8 flex items-center justify-center text-[#8A2BE2] font-bold text-xs group-hover:bg-[#8A2BE2] group-hover:text-white transition-all shrink-0">
                  {letter}
                </div>
                <span className="text-[#513c66] text-sm font-medium leading-normal">{ans}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});

// --- Custom Hook for Dynamic Questions ---
const useDynamicQuestions = (testType: string, difficulty: string, staticPool: any[], userProfile?: any, sessionKey?: number) => {
  const [questions, setQuestions] = useState<any[]>(() => {
    // Instantly return pre-shuffled static pool of 5 questions to mimic personalization when offline
    return [...staticPool].sort(() => Math.random() - 0.5).slice(0, Math.min(5, staticPool.length));
  });
  
  const [isLoading, setIsLoading] = useState(() => {
    // Only show loading if there is a configured API key to make a real fetch
    try {
      const userKey = typeof window !== 'undefined' ? localStorage.getItem('COGNITIVE_TWIN_USER_KEY') : null;
      if (userKey && userKey.trim() !== '') return true;
      const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
      if (envKey && envKey.trim() !== '') return true;
    } catch (_) {}
    return false;
  });

  useEffect(() => {
    let active = true;
    
    const userKey = typeof window !== 'undefined' ? localStorage.getItem('COGNITIVE_TWIN_USER_KEY') : null;
    const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
    const hasKey = !!((userKey && userKey.trim() !== '') || (envKey && envKey.trim() !== ''));

    if (!hasKey) {
      setIsLoading(false);
      return;
    }

    const fetch = async () => {
      // 1.6 seconds maximum fetch timeout to keep the app ultra-responsive
      const timeoutPromise = new Promise<any[]>((_, reject) => 
        setTimeout(() => reject(new Error("Timeout")), 1600)
      );

      try {
        const fetchPromise = generateDynamicTestQuestions(testType, difficulty, userProfile);
        const dynamic = await Promise.race([fetchPromise, timeoutPromise]);
        
        if (active && dynamic && dynamic.length > 0) {
          setQuestions(dynamic);
        }
      } catch (err) {
        console.warn(`Dynamic questions timed out or failed for ${testType}. Using pre-shuffled pool.`);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetch();

    return () => {
      active = false;
    };
  }, [testType, difficulty, userProfile?.field, sessionKey]);

  return { questions, isLoading };
};

export const FuturisticButton = ({ children, onClick, className, disabled, variant = 'primary' }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "relative px-8 py-3.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 rounded-full active:scale-95 cursor-pointer",
      variant === 'primary' 
        ? "bg-gradient-to-r from-[#8A2BE2] to-[#9979f4] text-white hover:brightness-105 shadow-md shadow-indigo-600/10 border-transparent" 
        : "bg-[#f4ecf8] text-[#6a427f] border border-purple-100/55 hover:bg-[#ebdff2]",
      disabled && "opacity-30 cursor-not-allowed pointer-events-none",
      className
    )}
  >
    <span className="relative z-10 flex items-center justify-center gap-2.5 font-sans">{children}</span>
  </button>
);

const LoadingOverlay = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center p-12 space-y-6">
    <div className="w-12 h-12 bg-[#8A2BE2]/10 rounded-2xl flex items-center justify-center text-[#8A2BE2] border border-[#8A2BE2]/25 animate-pulse">
      <Loader2 className="w-6 h-6 animate-spin" />
    </div>
    <p className="text-[10px] uppercase tracking-[0.25em] text-[#8c78a5] animate-pulse font-semibold">{message}</p>
  </div>
);

// --- Test Components ---

export const AttentionTest = withStability(({ onComplete, difficulty = 'moderate' }: any) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(difficulty === 'challenging' ? 10 : difficulty === 'gentle' ? 15 : 12);
  const [target, setTarget] = useState({ x: 50, y: 50 });
  const [isActive, setIsActive] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  
  // Adaptive State
  // 1 = Easiest (Gentle), 10 = Hardest (Challenging+)
  const initialLevel = difficulty === 'challenging' ? 7 : difficulty === 'gentle' ? 2 : 4;
  const [level, setLevel] = useState(initialLevel);
  const [lastHitTime, setLastHitTime] = useState<number | null>(null);
  const [consecutiveFastHits, setConsecutiveFastHits] = useState(0);
  const [averageLevel, setAverageLevel] = useState(initialLevel);
  const [hitCount, setHitCount] = useState(0);

  const moveTarget = useCallback(() => {
    setTarget({
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
    });
  }, []);

  useEffect(() => {
    let timer: any;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      // Calculate final score based on hits and average difficulty level achieved
      const difficultyMultiplier = averageLevel / 5;
      onComplete(Math.min(100, Math.floor(score * 4 * difficultyMultiplier)));
    }
  }, [timeLeft, isActive, score, onComplete, averageLevel]);

  const handleClick = () => {
    const now = Date.now();
    
    if (!isActive) {
      setIsActive(true);
      setLastHitTime(now);
      moveTarget();
      return;
    }

    // Adaptive Logic
    if (lastHitTime) {
      const reactionTime = now - lastHitTime;
      const adaptiveThreshold = 1000 - (level * 50); // Threshold gets stricter as level rises
      
      if (reactionTime < adaptiveThreshold) {
        // Fast hit! Increase difficulty after 2 fast hits
        setConsecutiveFastHits(prev => {
          if (prev >= 1) {
            setLevel(l => Math.min(10, l + 1));
            return 0;
          }
          return prev + 1;
        });
      } else if (reactionTime > adaptiveThreshold * 2) {
        // Slow hit. Decrease difficulty
        setLevel(l => Math.max(1, l - 1));
        setConsecutiveFastHits(0);
      }
    }

    setLastHitTime(now);
    setScore(s => s + 1);
    setHitCount(h => {
      const newCount = h + 1;
      setAverageLevel(prev => (prev * h + level) / newCount);
      return newCount;
    });
    
    setShowPulse(true);
    setTimeout(() => setShowPulse(false), 300);
    moveTarget();
  };

  // Calculate target scale based on adaptive level
  // level 1 = 1.6x, level 10 = 0.5x
  const targetScale = 1.8 - (level * 0.13);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative">
      <TestHeader 
        title="Adaptive Focus Test" 
        description="Tap the circles. The system will dynamically adjust difficulty based on your speed."
        icon={Target}
      />
      
      <div className="relative w-full h-[350px] bg-purple-50/20 border border-purple-100 rounded-3xl overflow-hidden cursor-pointer shadow-inner">
        <SuccessPulse active={showPulse} />
        {!isActive ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <FuturisticButton onClick={handleClick}>Begin Session</FuturisticButton>
          </div>
        ) : (
          <>
            <div className="absolute top-6 left-8 text-[11px] font-bold uppercase tracking-widest text-[#8c78a5]">Time: {timeLeft}s</div>
            <div className="absolute top-6 right-8 text-[11px] font-bold uppercase tracking-widest text-[#8c78a5]">Intensity: Lvl {level}</div>
            <div className="absolute top-12 right-8 text-[9px] font-extrabold uppercase tracking-widest text-[#8A2BE2]">Hits: {score}</div>
            
            <motion.div
              key={score} // Trigger animation on every hit / new target
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                left: `${target.x}%`, 
                top: `${target.y}%`,
                scale: targetScale,
                opacity: 1
              }}
              className="absolute w-12 h-12 -ml-6 -mt-6 rounded-full border-2 border-[#8A2BE2] bg-gradient-to-br from-[#8A2BE2] to-[#9979f4] flex items-center justify-center shadow-lg shadow-purple-600/30"
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-white shadow-xl shadow-black/40 animate-ping" />
              <div className="absolute w-2 h-2 rounded-full bg-white shadow-xl shadow-black/40" />
              {/* Subtle indicator of current streak/level */}
              <div className="absolute -inset-2 rounded-full border border-[#8A2BE2]/30 animate-pulse" />
            </motion.div>
          </>
        )}
      </div>
      
      {isActive && (
        <div className="mt-8 flex gap-4">
          <div className="px-5 py-3 border border-purple-100 rounded-full bg-white/70 shadow-sm">
            <span className="text-[9px] uppercase tracking-widest text-[#8c78a5] block text-center font-bold">Adaptive Intensity Level: {level}/10</span>
            <div className="flex gap-1 mt-2 justify-center">
              {Array.from({ length: 10 }).map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "h-1.5 w-3 rounded-full transition-all duration-500",
                    i < level ? "bg-purple-600 scale-y-110" : "bg-purple-100"
                  )} 
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

// --- Adaptive Testing Engine Hook ---
const useAdaptiveDifficulty = (initialDifficulty: string) => {
  const [difficultyLevel, setDifficultyLevel] = useState(
    initialDifficulty === 'challenging' ? 3 : initialDifficulty === 'gentle' ? 1 : 2
  );
  const [streak, setStreak] = useState(0);

  const adjustDifficulty = (isCorrect: boolean, timing?: number) => {
    if (isCorrect) {
      setStreak(s => {
        const nextStreak = s + 1;
        if (nextStreak >= 2) {
          setDifficultyLevel(d => Math.min(3, d + 1));
          return 0;
        }
        return nextStreak;
      });
    } else {
      setDifficultyLevel(d => Math.max(1, d - 1));
      setStreak(0);
    }
  };

  const getDifficultyString = () => {
    return difficultyLevel === 1 ? 'gentle' : difficultyLevel === 3 ? 'challenging' : 'moderate';
  };

  return { difficultyLevel, getDifficultyString, adjustDifficulty };
};

// ... existing code ...

export const MemoryTest = withStability(({ onComplete, difficulty = 'moderate' }: any) => {
  const { difficultyLevel, getDifficultyString, adjustDifficulty } = useAdaptiveDifficulty(difficulty);
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isShowing, setIsShowing] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [level, setLevel] = useState(1);
  const [showPulse, setShowPulse] = useState(false);
  const [startTime, setStartTime] = useState(0);

  const maxLevel = difficultyLevel === 3 ? 5 : difficultyLevel === 1 ? 3 : 4;

  const startLevel = useCallback((l: number) => {
    // Adaptive: Sequence length could grow faster at higher difficulty levels
    const length = l + (difficultyLevel);
    const newSeq = Array.from({ length }, () => Math.floor(Math.random() * 4));
    setSequence(newSeq);
    setUserSequence([]);
    setIsShowing(true);
    
    let i = 0;
    const intervalTime = difficultyLevel === 3 ? 600 : difficultyLevel === 1 ? 1200 : 900;
    
    const interval = setInterval(() => {
      setActiveIndex(newSeq[i]);
      setTimeout(() => setActiveIndex(null), intervalTime - 300);
      i++;
      if (i >= newSeq.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsShowing(false);
          setStartTime(Date.now());
        }, intervalTime - 200);
      }
    }, intervalTime);
  }, [difficultyLevel]);

  const handlePadClick = (index: number) => {
    if (isShowing) return;
    
    const newUserSeq = [...userSequence, index];
    setUserSequence(newUserSeq);
    
    if (index !== sequence[userSequence.length]) {
      adjustDifficulty(false);
      onComplete(Math.min(100, (level / maxLevel) * 100));
      return;
    }
    
    if (newUserSeq.length === sequence.length) {
      const timeTaken = Date.now() - startTime;
      const expectedTime = sequence.length * 1000;
      
      // If they were fast and correct, adjust difficulty
      if (timeTaken < expectedTime) {
        adjustDifficulty(true);
      }

      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 600);
      if (level >= maxLevel) {
        onComplete(100);
      } else {
        setLevel(l => l + 1);
        setTimeout(() => startLevel(level + 1), 800);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative">
      <SuccessPulse active={showPulse} />
      <TestHeader 
        title="Adaptive Memory Prism" 
        description="Repeat the pattern. The sequence complexity and speed will scale with your performance."
        icon={MeshBrain}
      />

      <ProgressBar current={level} total={maxLevel} />
      
      <div className="flex justify-center mb-6">
        <div className="px-4 py-1.5 border border-purple-100 rounded-full bg-white/80 shadow-sm">
           <span className="text-[9px] uppercase tracking-[0.2em] text-[#8A2BE2] font-bold">Neural Sync Level: {getDifficultyString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {[0, 1, 2, 3].map(i => (
          <motion.div
            key={i}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePadClick(i)}
            className={cn(
               "w-24 h-24 border border-purple-100 rounded-3xl transition-all duration-300 cursor-pointer flex items-center justify-center shadow-sm",
               activeIndex === i 
                 ? "bg-gradient-to-r from-[#8A2BE2] to-[#9979f4] border-transparent scale-105 shadow-md shadow-purple-600/20" 
                 : "bg-white hover:border-purple-300 hover:bg-[#8A2BE2]/5"
            )}
          >
            <div className={cn("w-2.5 h-2.5 rounded-full transition-all", activeIndex === i ? "bg-white animate-ping" : "bg-purple-200")} />
          </motion.div>
        ))}
      </div>

      {sequence.length === 0 ? (
        <FuturisticButton onClick={() => startLevel(1)}>Initiate Sync</FuturisticButton>
      ) : (
        <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#8c78a5] bg-purple-50 px-4 py-1.5 rounded-full border border-purple-100">Level {level} / {maxLevel}</div>
      )}
    </div>
  );
});

export const RiskTest = withStability(({ onComplete, difficulty = 'moderate', userProfile }: any) => {
  const [current, setCurrent] = useState(0);
  const [totalRisk, setTotalRisk] = useState(0);
  const [showPulse, setShowPulse] = useState(false);
  const [sessionKey] = useState(() => Math.random()); // Local session key

  const staticPool = [
    { q: "You find a shortcut that might save 30 minutes but could lead to a dead end. Do you take it?", a: ["Stick to the known path", "Take the shortcut"], scores: [20, 80] },
    { q: "A friend offers you a 'sure thing' investment with 50% returns, but you could lose the principal.", a: ["Stay safe", "Take the chance"], scores: [10, 90] },
    { q: "You are offered a stable job with a good salary, or a startup role with equity that could be worth millions or zero.", a: ["Stable job", "Startup role"], scores: [15, 85] },
    { q: "A new medical treatment has a 90% success rate but a 1% chance of severe side effects.", a: ["Wait for more data", "Take the treatment"], scores: [30, 70] },
    { q: "You're at a casino. Do you play the slot machines (low risk/reward) or the high-stakes poker table?", a: ["Slots", "Poker"], scores: [20, 90] },
    { q: "A stranger offers to sell you a mysterious map for a high price. Do you buy it?", a: ["Decline", "Buy it"], scores: [10, 90] },
    { q: "You're in a race. Do you take a dangerous but fast path or a safe but slow one?", a: ["Safe path", "Dangerous path"], scores: [20, 80] },
    { q: "You have a lead in a game. Do you play defensively to keep it or aggressively to increase it?", a: ["Play defensively", "Play aggressively"], scores: [15, 85] },
    { q: "Would you bet your entire monthly savings on a coin toss for a 5x return?", a: ["Definitely not", "Bring it on"], scores: [0, 100] },
    { q: "A bridge looks shaky but crossing it gets you home before a storm hits.", a: ["Find another way", "Cross the bridge"], scores: [25, 75] },
  ];

  const { questions, isLoading } = useDynamicQuestions('Risk', difficulty, staticPool, userProfile, sessionKey);

  const handleChoice = (idx: number) => {
    if (questions.length === 0) return;
    setShowPulse(true);
    setTimeout(() => setShowPulse(false), 500);
    const multiplier = difficulty === 'challenging' ? 1.2 : difficulty === 'gentle' ? 0.8 : 1;
    const scores = questions[current].scores || [20, 50, 80, 100];
    const newRisk = totalRisk + (scores[idx] * multiplier);
    if (current + 1 < questions.length) {
      setTotalRisk(newRisk);
      setTimeout(() => setCurrent(c => c + 1), 300);
    } else {
      onComplete(Math.min(100, Math.floor(newRisk / questions.length)));
    }
  };

  if (isLoading) return <LoadingOverlay message="Personalizing Risk Scenarios..." />;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-md mx-auto relative">
      <SuccessPulse active={showPulse} />
      <TestHeader 
        title="Risk Test" 
        description="Answer these questions to see how much risk you like to take."
        icon={Shield}
      />

      <ProgressBar current={current + 1} total={questions.length} />

      <div className="w-full bg-white/95 border border-purple-100 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl shadow-purple-600/5">
        <p className="text-lg sm:text-xl text-[#322851] font-serif font-normal italic leading-relaxed text-center">{questions[current].q}</p>
        <div className="space-y-3.5">
          {questions[current].a.map((ans, i) => (
            <button
              key={i}
              onClick={() => handleChoice(i)}
              className="w-full p-4.5 text-left border border-purple-100/70 hover:border-[#8A2BE2]/40 hover:bg-[#8A2BE2]/5 bg-white/50 active:scale-[0.98] transition-all rounded-2xl group flex items-center gap-4 cursor-pointer text-[#513c66] text-sm font-medium leading-normal shadow-sm"
            >
              <div className="w-5 h-5 rounded-full border border-purple-200 flex items-center justify-center group-hover:border-[#8A2BE2]/40 transition-colors bg-white font-mono text-[10px] font-bold text-[#8c78a5]">
                {String.fromCharCode(65 + i)}
              </div>
              <span className="group-hover:text-[#8A2BE2] transition-colors">{ans}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

export const CreativityTest = withStability(({ onComplete, difficulty = 'moderate', userProfile }: any) => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showPulse, setShowPulse] = useState(false);
  const [sessionKey] = useState(() => Math.random());

  const staticPool = [
    { q: "Which of these is the most 'creative' use for a paperclip?", a: ["Holding papers", "Ejecting a SIM tray", "Making a miniature sculpture", "A temporary lock pick"], scores: [20, 40, 90, 70] },
    { q: "If you could combine two animals to make the ultimate pet, which would they be?", a: ["Dog + Cat", "Eagle + Lion", "Elephant + Bird", "Dolphin + Wolf"], scores: [20, 60, 90, 80] },
    { q: "How would you describe the color 'blue' to someone who has never seen color?", a: ["Like the ocean", "Cold and vast", "A deep, silent hum", "The feeling of a clear sky"], scores: [30, 50, 90, 60] },
    { q: "What is the most unusual use for a common brick?", a: ["Building a wall", "A doorstop", "Grinding it into pigment for paint", "A weight for a DIY pulley system"], scores: [10, 30, 90, 70] },
    { q: "If animals could talk, which one would be the most philosophical?", a: ["Owl", "Elephant", "Octopus", "Sloth"], scores: [40, 60, 90, 70] },
    { q: "What would the perfect city look like if cars were banned?", a: ["Walking paths & horses", "Flying pods", "Moving sidewalks & green belts", "Underground shuttles"], scores: [40, 90, 70, 50] },
    { q: "Compose a title for a movie about a time-traveling toaster.", a: ["The Hot Past", "Burned Through Time", "Chronos-Toast", "Golden Brown Future"], scores: [30, 60, 80, 70] },
    { q: "Design a new olympic sport using only household furniture.", a: ["Chair vaulting", "Table curling", "Sofa hurdles", "Remote control archery"], scores: [40, 60, 90, 50] },
    { q: "What is the sound of one hand clapping?", a: ["Silence", "A light breeze", "The sound of nothingness", "A rhythmic snap"], scores: [20, 60, 90, 50] },
  ];

  const { questions, isLoading } = useDynamicQuestions('Creativity', difficulty, staticPool, userProfile, sessionKey);

  const handleChoice = (idx: number) => {
    if (questions.length === 0) return;
    setShowPulse(true);
    setTimeout(() => setShowPulse(false), 500);
    
    // Difficulty scaling: 'challenging' requires higher scores for same final result
    const multiplier = difficulty === 'challenging' ? 0.8 : difficulty === 'gentle' ? 1.2 : 1;
    const scores = questions[current].scores || [20, 50, 80, 100];
    const newScore = score + (scores[idx] * multiplier);
    
    if (current + 1 < questions.length) {
      setScore(newScore);
      setTimeout(() => setCurrent(c => c + 1), 300);
    } else {
      onComplete(Math.min(100, Math.floor(newScore / questions.length)));
    }
  };

  if (isLoading) return <LoadingOverlay message="Personalizing Creative Matrix..." />;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-md mx-auto relative">
      <SuccessPulse active={showPulse} />
      <TestHeader 
        title="Creativity Test" 
        description="Answer these questions to see how creative you are."
        icon={Sparkles}
      />

      <div className="w-full bg-white/95 border border-purple-100 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl shadow-purple-600/5">
        <p className="text-lg sm:text-xl text-[#322851] font-serif font-normal italic leading-relaxed text-center">{questions[current].q}</p>
        <div className="space-y-3.5">
          {questions[current].a.map((ans, i) => (
            <button
              key={i}
              onClick={() => handleChoice(i)}
              className="w-full p-4.5 text-left border border-purple-100/70 hover:border-[#8A2BE2]/40 hover:bg-[#8A2BE2]/5 bg-white/50 active:scale-[0.98] transition-all rounded-2xl group flex items-center gap-4 cursor-pointer text-[#513c66] text-sm font-medium leading-normal shadow-sm"
            >
              <div className="w-5 h-5 rounded-full border border-purple-200 flex items-center justify-center group-hover:border-[#8A2BE2]/40 transition-colors bg-white font-mono text-[10px] font-bold text-[#8c78a5]">
                {String.fromCharCode(65 + i)}
              </div>
              <span className="group-hover:text-[#8A2BE2] transition-colors">{ans}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

export const LogicTest = withStability(({ onComplete, difficulty = 'moderate', userProfile }: any) => {
  const { getDifficultyString, adjustDifficulty } = useAdaptiveDifficulty(difficulty);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showPulse, setShowPulse] = useState(false);
  const [accumulatedWeight, setAccumulatedWeight] = useState(0);
  const [sessionKey] = useState(() => Math.random());

  const staticPool = [
    { q: "If all cats are animals, and all animals need water, do all cats need water?", a: ["Yes", "No"], correct: 0 },
    { q: "A, C, E, G, ... What is next?", a: ["H", "I", "J"], correct: 1 },
    { q: "If you rotate a square, how many corners does it have?", a: ["4", "8", "Infinite"], correct: 0 },
    { q: "A toy and a box cost $1.10. The toy costs $1.00 more than the box. How much is the box?", a: ["$0.05", "$0.10", "$0.15"], correct: 0 },
    { q: "If 5 machines take 5 minutes to make 5 toys, how long do 100 machines take to make 100 toys?", a: ["5 minutes", "100 minutes", "50 minutes"], correct: 0 },
    { q: "If it's raining, the ground is wet. The ground is dry. Therefore:", a: ["It's raining", "It's not raining", "Someone spilled water"], correct: 1 },
    { q: "All bloops are razzmatazz. All razzmatazz are purple. Are all bloops purple?", a: ["Yes", "No", "Only some"], correct: 0 },
    { q: "If today is Monday, what was the day after the day before yesterday?", a: ["Sunday", "Monday", "Tuesday"], correct: 0 },
    { q: "Which number comes next in the sequence: 2, 4, 8, 16, ...?", a: ["24", "30", "32"], correct: 2 },
    { q: "Light is to Shadow as Sound is to:", a: ["Silence", "Noise", "Echo"], correct: 0 },
    { q: "If you divide 30 by half and add 10, what is the result?", a: ["25", "50", "70"], correct: 2 },
  ];

  const { questions, isLoading } = useDynamicQuestions('Logic', getDifficultyString(), staticPool, userProfile, sessionKey);

  const handleAnswer = (idx: number) => {
    if (questions.length === 0) return;
    const isCorrect = idx === questions[currentQuestion].correct;
    
    // Adaptive Engine: Adjust difficulty for next turn
    adjustDifficulty(isCorrect);
    
    if (isCorrect) {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 500);
    }

    // Scoring is now weighted by current adaptive difficulty level
    const currentDifficultyString = getDifficultyString();
    const weight = currentDifficultyString === 'challenging' ? 1.5 : currentDifficultyString === 'gentle' ? 0.7 : 1;
    
    const pointsPossible = 100 / questions.length;
    const pointsEarned = isCorrect ? pointsPossible * weight : 0;
    
    const nextScore = score + pointsEarned;
    const nextWeightTotal = accumulatedWeight + weight;

    if (currentQuestion + 1 < questions.length) {
      setScore(nextScore);
      setAccumulatedWeight(nextWeightTotal);
      setTimeout(() => setCurrentQuestion(q => q + 1), 300);
    } else {
      // Final normalization based on difficulty weights encountered
      const finalScore = (nextScore / ( (100 / questions.length) * (nextWeightTotal / questions.length) )) * (nextWeightTotal / questions.length) * (100 / questions.length);
      // Simpler: just cap at 100 but reward higher difficulty
      onComplete(Math.min(100, Math.floor(nextScore)));
    }
  };

  if (isLoading) return <LoadingOverlay message="Personalizing Logic Matrix..." />;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-md mx-auto relative">
      <SuccessPulse active={showPulse} />
      <TestHeader 
        title="Adaptive Logic Matrix" 
        description="Solve neural puzzles. The engine assesses your deductive capacity in real-time."
        icon={Puzzle}
      />

      <ProgressBar current={currentQuestion + 1} total={questions.length} />
      
      <div className="flex justify-center mb-6">
        <div className="px-4 py-1.5 border border-purple-100 rounded-full bg-white/80 shadow-sm">
           <span className="text-[9px] uppercase tracking-[0.2em] text-[#8A2BE2] font-bold">Logic Tier: {getDifficultyString()}</span>
        </div>
      </div>

      <div className="w-full bg-white/95 border border-purple-100 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl shadow-purple-600/5">
        <p className="text-lg sm:text-xl text-[#322851] font-serif font-normal italic leading-relaxed text-center">{questions[currentQuestion].q}</p>
        <div className="space-y-3.5">
          {questions[currentQuestion].a.map((ans: string, i: number) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className="w-full p-4.5 text-left border border-purple-100/70 hover:border-[#8A2BE2]/40 hover:bg-[#8A2BE2]/5 bg-white/50 active:scale-[0.98] transition-all rounded-2xl group flex items-center gap-4 cursor-pointer text-[#513c66] text-sm font-medium leading-normal shadow-sm"
            >
              <div className="w-5 h-5 rounded-full border border-purple-200 flex items-center justify-center group-hover:border-[#8A2BE2]/40 transition-colors bg-white font-mono text-[10px] font-bold text-[#8c78a5]">
                {String.fromCharCode(65 + i)}
              </div>
              <span className="group-hover:text-[#8A2BE2] transition-colors">{ans}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

export const DecisionTest = withStability(({ onComplete, difficulty = 'moderate' }: any) => {
  const { difficultyLevel, getDifficultyString, adjustDifficulty } = useAdaptiveDifficulty(difficulty);
  const [current, setCurrent] = useState(0);
  const [totalSpeed, setTotalSpeed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(difficultyLevel === 3 ? 3 : difficultyLevel === 1 ? 7 : 5);
  const [showPulse, setShowPulse] = useState(false);
  const [shuffledScenarios, setShuffledScenarios] = useState<any[]>([]);
  const [sessionKey] = useState(() => Math.random());

  const scenarioPool = [
    { q: "A critical server is down. Do you fix it immediately or notify the team first?", a: ["Fix immediately", "Notify team"], correct: 1 },
    { q: "You see a fire in a trash can. Do you use an extinguisher or pull the alarm?", a: ["Extinguisher", "Pull alarm"], correct: 1 },
    { q: "A client is angry on the phone. Do you listen patiently or offer a refund immediately?", a: ["Listen patiently", "Offer refund"], correct: 0 },
    { q: "Your laptop starts smoking. Do you unplug it or run for water?", a: ["Unplug it", "Run for water"], correct: 0 },
    { q: "You're late for a meeting. Do you speed or call to apologize?", a: ["Speed", "Call to apologize"], correct: 1 },
    { q: "A colleague is being bullied. Do you intervene or report it later?", a: ["Intervene", "Report later"], correct: 0 },
    { q: "You find a lost wallet with ID and cash. Do you try to contact the owner or hand it to the police?", a: ["Contact owner", "Hand to police"], correct: 0 },
    { q: "A stranger asks for directions to a place you know is dangerous. Do you tell them or warn them?", a: ["Tell them", "Warn them"], correct: 1 },
    { q: "You witness a minor car accident. Do you stop to help or keep driving?", a: ["Stop to help", "Keep driving"], correct: 0 },
    { q: "You're in an elevator that gets stuck. Do you press the alarm or try to pry the doors open?", a: ["Press alarm", "Pry doors"], correct: 0 },
  ];

  useEffect(() => {
    const count = 5;
    setShuffledScenarios([...scenarioPool].sort(() => Math.random() - 0.5).slice(0, count));
  }, [difficultyLevel, sessionKey]);

  useEffect(() => {
    if (timeLeft > 0 && shuffledScenarios.length > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && shuffledScenarios.length > 0) {
      handleChoice(-1); // Time out
    }
  }, [timeLeft, current, shuffledScenarios]);

  const handleChoice = (idx: number) => {
    const maxTime = difficultyLevel === 3 ? 3 : difficultyLevel === 1 ? 7 : 5;
    const timeTaken = maxTime - timeLeft;
    const isCorrect = idx !== -1 && idx === shuffledScenarios[current].correct;
    
    // Adaptive Engine adjustment
    adjustDifficulty(isCorrect);
    
    const speedScore = Math.max(0, 100 - (timeTaken * (100 / maxTime)));
    const finalRoundScore = isCorrect ? speedScore : speedScore * 0.5;
    const newTotalSpeed = totalSpeed + finalRoundScore;
    
    if (idx !== -1) {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 500);
    }

    if (current + 1 < shuffledScenarios.length) {
      setTotalSpeed(newTotalSpeed);
      setCurrent(c => c + 1);
      setTimeLeft(maxTime);
    } else {
      onComplete(Math.floor(newTotalSpeed / shuffledScenarios.length));
    }
  };

  if (shuffledScenarios.length === 0) return null;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-md mx-auto relative">
      <SuccessPulse active={showPulse} />
      <TestHeader 
        title="Adaptive Latency Test" 
        description="Rapid response scenarios. The engine scales response windows to your neural throughput."
        icon={Clock}
      />

      <ProgressBar current={current + 1} total={shuffledScenarios.length} />

      <div className="flex justify-center mb-6">
        <div className="px-4 py-1.5 border border-purple-100 rounded-full bg-white/80 shadow-sm">
           <span className="text-[9px] uppercase tracking-[0.2em] text-[#8A2BE2] font-bold">Latency Threshold: {getDifficultyString()}</span>
        </div>
      </div>

      <div className="w-full bg-white/95 border border-purple-100 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl shadow-purple-600/5">
        <div className="flex justify-between items-center border-b border-purple-50 pb-3">
          <span className="text-[10px] font-bold text-[#8c78a5] uppercase tracking-[0.3em]">Synapse Window</span>
          <span className={cn("text-lg font-mono font-bold px-3 py-0.5 rounded-lg bg-orange-50 border border-orange-100", timeLeft < 2 ? "text-red-500 animate-pulse bg-red-50 border-red-100" : "text-amber-600")}>{timeLeft}s</span>
        </div>
        <p className="text-lg sm:text-xl text-[#322851] font-serif font-normal italic leading-relaxed text-center">{shuffledScenarios[current].q}</p>
        <div className="space-y-3.5">
          {shuffledScenarios[current].a.map((ans: string, i: number) => (
            <button
              key={i}
              onClick={() => handleChoice(i)}
              className="w-full p-4.5 text-left border border-purple-100/70 hover:border-[#8A2BE2]/40 hover:bg-[#8A2BE2]/5 bg-white/50 active:scale-[0.98] transition-all rounded-2xl group flex items-center gap-4 cursor-pointer text-[#513c66] text-sm font-medium leading-normal shadow-sm"
            >
              <div className="w-5 h-5 rounded-full border border-purple-200 flex items-center justify-center group-hover:border-[#8A2BE2]/40 transition-colors bg-white font-mono text-[10px] font-bold text-[#8c78a5]">
                {String.fromCharCode(65 + i)}
              </div>
              <span className="group-hover:text-[#8A2BE2] transition-colors">{ans}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

export const SpatialTest = withStability(({ onComplete, difficulty = 'moderate' }: any) => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showPulse, setShowPulse] = useState(false);
  const [userRotation, setUserRotation] = useState(0);

  const questions = [
    { 
      type: 'rotation',
      q: "Turn the shape to match the target (90° to the right).", 
      targetRotation: 90,
      isInteractive: true
    },
    { 
      type: 'folding',
      q: "If you fold this into a box, which side is opposite the middle?", 
      isFolding: true,
      options: ["Top", "Bottom", "Left", "Right"],
      correct: 1 
    },
    { 
      type: 'perspective',
      q: "What does this look like from above?", 
      options: ["Square", "Triangle", "Circle", "Hexagon"], 
      correct: 0 
    },
  ];

  const handleAnswer = (idx?: number) => {
    let isCorrect = false;
    if (questions[current].isInteractive) {
      isCorrect = (userRotation % 360) === questions[current].targetRotation || (userRotation % 360) === -270;
    } else {
      isCorrect = idx === questions[current].correct;
    }

    if (isCorrect) {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 500);
    }
    const multiplier = difficulty === 'challenging' ? 1.5 : difficulty === 'gentle' ? 0.7 : 1;
    const newScore = isCorrect ? score + ((100 / questions.length) * multiplier) : score;
    
    if (current + 1 < questions.length) {
      setScore(newScore);
      setCurrent(c => c + 1);
      setUserRotation(0);
    } else {
      onComplete(Math.min(100, Math.max(70, newScore + 1)));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-md mx-auto relative">
      <SuccessPulse active={showPulse} />
      <TestHeader 
        title="Spatial Test" 
        description="Imagine shapes in your mind to solve these puzzles."
        icon={Box}
      />

      <ProgressBar current={current + 1} total={questions.length} />

      <div className="w-full bg-white/95 border border-purple-100 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl shadow-purple-600/5">
        <div className="flex justify-center py-6">
          {questions[current].isInteractive ? (
            <div className="relative flex flex-col items-center gap-8">
              <div className="flex gap-12 bg-purple-50/50 p-6 rounded-2xl border border-purple-100">
                <div className="text-center space-y-2">
                  <p className="text-[9px] uppercase tracking-widest text-[#8c78a5] font-bold">Target</p>
                  <div className="w-16 h-16 border border-purple-300 flex items-center justify-center relative rotate-90 rounded-xl bg-white shadow-sm">
                    <div className="w-1.5 h-6 bg-emerald-500 absolute top-0 rounded-b-md" />
                    <MeshBrain className="w-6 h-6 opacity-35 text-[#8A2BE2]" />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-[9px] uppercase tracking-widest text-[#8c78a5] font-bold">Current</p>
                  <motion.div 
                    animate={{ rotate: userRotation }}
                    className="w-16 h-16 border-2 border-[#8A2BE2] flex items-center justify-center relative bg-purple-50 rounded-xl shadow-md"
                  >
                    <div className="w-1.5 h-6 bg-purple-600 absolute top-0 rounded-b-md" />
                    <MeshBrain className="w-6 h-6 opacity-85 text-[#8A2BE2]" />
                  </motion.div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setUserRotation(r => r - 90)} className="p-2.5 border border-purple-200 rounded-full hover:bg-purple-50 text-[#8A2BE2] bg-white transition-colors cursor-pointer shadow-sm"><RefreshCw className="w-4 h-4 rotate-180" /></button>
                <button onClick={() => setUserRotation(r => r + 90)} className="p-2.5 border border-purple-200 rounded-full hover:bg-purple-50 text-[#8A2BE2] bg-white transition-colors cursor-pointer shadow-sm"><RefreshCw className="w-4 h-4" /></button>
                <button onClick={() => handleAnswer()} className="px-5 py-2.5 bg-gradient-to-r from-[#8A2BE2] to-[#9979f4] text-white text-[10px] font-bold uppercase tracking-widest rounded-full cursor-pointer shadow-md shadow-indigo-600/10 active:scale-95 transition-all">Confirm Match</button>
              </div>
            </div>
          ) : questions[current].isFolding ? (
            <div className="grid grid-cols-3 gap-2 p-6 bg-purple-50/50 rounded-2xl border border-purple-100">
              <div className="w-8 h-8 rounded border border-purple-200 bg-white/20" />
              <div className="w-8 h-8 rounded border border-purple-300 bg-purple-100" />
              <div className="w-8 h-8 rounded border border-purple-200 bg-white/20" />
              <div className="w-8 h-8 rounded border border-purple-300 bg-purple-100" />
              <div className="w-8 h-8 rounded-lg border-2 border-[#8A2BE2] bg-[#8A2BE2]/20 animate-pulse shadow-sm" />
              <div className="w-8 h-8 rounded border border-purple-300 bg-purple-100" />
              <div className="w-8 h-8 rounded border border-purple-200 bg-white/20" />
              <div className="w-8 h-8 rounded border border-purple-300 bg-purple-100" />
              <div className="w-8 h-8 rounded border border-purple-200 bg-white/20" />
            </div>
          ) : (
            <div className="w-24 h-24 border border-purple-200 hover:border-purple-300 transition-colors flex items-center justify-center relative rounded-2xl bg-purple-50/40 shadow-sm">
              <div className="absolute inset-0 border border-[#8A2BE2]/20 rounded-2xl scale-75 rotate-45 border-dashed" />
              <Box className="w-12 h-12 text-[#8A2BE2]" />
            </div>
          )}
        </div>
        <p className="text-lg sm:text-xl text-[#322851] font-serif font-normal italic leading-relaxed text-center">{questions[current].q}</p>
        {!questions[current].isInteractive && (
          <div className="grid grid-cols-2 gap-3.5">
            {questions[current].options?.map((ans, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className="p-4 text-center border border-purple-100/70 hover:border-[#8A2BE2]/40 hover:bg-[#8A2BE2]/5 bg-white/60 active:scale-[0.98] transition-all rounded-2xl text-[#513c66] text-sm font-medium leading-normal shadow-sm cursor-pointer"
              >
                {ans}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export const VerbalTest = withStability(({ onComplete, difficulty = 'moderate', userProfile }: any) => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showPulse, setShowPulse] = useState(false);
  const [sessionKey] = useState(() => Math.random());

  const staticPool = [
    { q: "Find the word that means the same as 'Large':", a: ["Small", "Big", "Tiny"], correct: 1 },
    { q: "Complete this: 'Hot' is to 'Cold' as 'Up' is to ?", a: ["High", "Down", "Sky"], correct: 1 },
    { q: "Which word is the opposite of 'Happy'?", a: ["Glad", "Sad", "Joyful"], correct: 1 },
    { q: "What does 'Ancient' mean?", a: ["New", "Old", "Fast"], correct: 1 },
    { q: "Pick the best word: 'The cat ___ on the mat.'", a: ["Sat", "Sit", "Sitting"], correct: 0 },
    { q: "Which word means the same as 'Quick'?", a: ["Slow", "Fast", "Quiet"], correct: 1 },
    { q: "What does 'Silent' mean?", a: ["Loud", "Quiet", "Noisy"], correct: 1 },
    { q: "Which word is the opposite of 'Strong'?", a: ["Tough", "Weak", "Big"], correct: 1 },
    { q: "The scientist made a major ___ in neural mapping.", a: ["Breakthrough", "Mistake", "Problem"], correct: 0 },
    { q: "Inevitable most nearly means:", a: ["Uncertain", "Unavoidable", "Impossible"], correct: 1 },
    { q: "Alacrity is best defined as:", a: ["Lethargy", "Brevity", "Eagerness"], correct: 2 },
    { q: "Which of these is a synonym for 'Ephemeral'?", a: ["Eternal", "Transient", "Beautiful"], correct: 1 },
    { q: "A 'Cacophony' is a ___ of sounds.", a: ["Harmony", "Clatter", "Symphony"], correct: 1 },
    { q: "To 'Ameliorate' a situation means to:", a: ["Worsen it", "Analyze it", "Improve it"], correct: 2 },
  ];

  const { questions, isLoading } = useDynamicQuestions('Verbal', difficulty, staticPool, userProfile, sessionKey);

  const handleAnswer = (idx: number) => {
    if (questions.length === 0) return;
    const isCorrect = idx === questions[current].correct;
    if (isCorrect) {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 500);
    }
    const multiplier = difficulty === 'challenging' ? 1.5 : difficulty === 'gentle' ? 0.7 : 1;
    const newScore = isCorrect ? score + ((100 / questions.length) * multiplier) : score;
    if (current + 1 < questions.length) {
      setScore(newScore);
      setCurrent(c => c + 1);
    } else {
      onComplete(Math.min(100, newScore + 1));
    }
  };

  if (isLoading) return <LoadingOverlay message="Personalizing Verbal Matrix..." />;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-md mx-auto relative">
      <SuccessPulse active={showPulse} />
      <TestHeader 
        title="Verbal Test" 
        description="Test your word skills with these questions."
        icon={MessageSquare}
      />
      
      <ProgressBar current={current + 1} total={questions.length} />

      <div className="w-full bg-white/95 border border-purple-100 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl shadow-purple-600/5">
        <p className="text-lg sm:text-xl text-[#322851] font-serif font-normal italic leading-relaxed text-center">{questions[current].q}</p>
        <div className="space-y-3.5">
          {questions[current].a.map((ans, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className="w-full p-4.5 text-left border border-purple-100/70 hover:border-[#8A2BE2]/40 hover:bg-[#8A2BE2]/5 bg-white/50 active:scale-[0.98] transition-all rounded-2xl group flex items-center gap-4 cursor-pointer text-[#513c66] text-sm font-medium leading-normal shadow-sm"
            >
              <div className="w-5 h-5 rounded-full border border-purple-200 flex items-center justify-center group-hover:border-[#8A2BE2]/40 transition-colors bg-white font-mono text-[10px] font-bold text-[#8c78a5]">
                {String.fromCharCode(65 + i)}
              </div>
              <span className="group-hover:text-[#8A2BE2] transition-colors">{ans}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

export const LearningStyleTest = withStability(({ onComplete }: any) => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showPulse, setShowPulse] = useState(false);

  const questions = [
    { 
      q: "You are exploring a new neural network architecture. Your first instinct is to:", 
      a: ["Study the visual topology and flowcharts", "Listen to the rhythmic data pulses and verbal explanations", "Interact with the nodes directly and feel the feedback"], 
      icons: [Globe, MessageSquare, Activity]
    },
    { 
      q: "When learning a new cognitive skill, you prefer:", 
      a: ["A high-resolution video demonstration", "A detailed audio walkthrough or podcast", "A hands-on sandbox environment"], 
      icons: [Sparkles, Clock, Zap]
    },
    { 
      q: "When you are stuck on a difficult problem, you usually:", 
      a: ["Draw a diagram to see the connections", "Talk it through with someone else", "Try different physical approaches until one works"], 
      icons: [Shapes, MessageSquare, Activity]
    },
  ];

  const handleChoice = (idx: number) => {
    setShowPulse(true);
    setTimeout(() => setShowPulse(false), 500);
    const newAnswers = [...answers, idx];
    if (current + 1 < questions.length) {
      setAnswers(newAnswers);
      setCurrent(c => c + 1);
    } else {
      // Calculate a style index: 0 (Visual), 50 (Auditory), 100 (Kinesthetic)
      const avg = newAnswers.reduce((a, b) => a + b, 0) / newAnswers.length;
      const styleIndex = Math.round(avg * 50); // 0 -> 0, 1 -> 50, 2 -> 100
      // We want to return a score that looks like a "Learning Efficiency" (85-100)
      // but the AI prompt uses it as a style index.
      // Wait, the AI prompt says: "Learning Style Index: ${profile.learningStyleScore || 50}/100 (0: Visual, 50: Auditory, 100: Kinesthetic)"
      // So if I return 90, it thinks they are Kinesthetic.
      // If the user wants to see "Learning" as a strength, I should probably return a high score.
      // But the AI needs the style.
      // Let's return the style index for now, but maybe the user wants to see a high percentage.
      // I'll return a value that represents the style but is also a "good" score.
      // Actually, let's just return the style index as requested by the prompt.
      onComplete(styleIndex || 1); // Avoid 0 to prevent "lacking" detection if not intended
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-md mx-auto relative">
      <SuccessPulse active={showPulse} />
      <TestHeader 
        title="Learning Style Test" 
        description="Find out how you learn best."
        icon={Sparkles}
      />

      <ProgressBar current={current + 1} total={questions.length} />

      <div className="w-full bg-white/95 border border-purple-100 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl shadow-purple-600/5">
        <p className="text-lg sm:text-xl text-[#322851] font-serif font-normal italic leading-relaxed text-center">{questions[current].q}</p>
        <div className="grid grid-cols-1 gap-3.5">
          {questions[current].a.map((ans, i) => {
            const Icon = questions[current].icons[i];
            return (
              <button
                key={i}
                onClick={() => handleChoice(i)}
                className="flex items-center gap-4 p-4.5 text-left border border-purple-100/70 hover:border-[#8A2BE2]/40 hover:bg-[#8A2BE2]/5 bg-white/50 active:scale-[0.98] transition-all rounded-2xl group cursor-pointer text-[#513c66] text-sm font-medium leading-normal shadow-sm"
              >
                <div className="w-8 h-8 rounded-full border border-purple-200 flex items-center justify-center group-hover:border-[#8A2BE2]/40 bg-white transition-colors">
                  <Icon className="w-4 h-4 text-[#8A2BE2] group-hover:text-[#9979f4] transition-colors" />
                </div>
                <span className="group-hover:text-[#8A2BE2] transition-colors">{ans}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export const EQTest = withStability(({ onComplete, difficulty = 'moderate', userProfile }: any) => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showPulse, setShowPulse] = useState(false);

  const staticPool = [
    { q: "A coworker is quiet and making mistakes. What do you do?", a: ["Tell them about their mistakes", "Ask if they are okay and help", "Do nothing"], correct: 1 },
    { q: "Someone gives you feedback that feels a bit mean. What do you do?", a: ["Argue with them", "Listen and find the helpful parts", "Get sad and stop working"], correct: 1 },
    { q: "A friend is happy about a project you don't like. What say you?", a: ["'It's okay, but not great'", "'I love your energy! Tell me more'", "'I don't think it will work'"], correct: 1 },
    { q: "You are having a big argument with someone. What is the best thing to do?", a: ["Walk away to cool down", "Keep arguing until you win", "Listen to their side first"], correct: 2 },
    { q: "A team member takes credit for your work. What do you do?", a: ["Shout at them in public", "Talk to them privately", "Do nothing"], correct: 1 },
    { q: "You see someone crying. What do you do?", a: ["Ignore them", "Offer a tissue or ask if they are okay", "Stare at them"], correct: 1 },
    { q: "Your boss gives you a task you don't understand. You:", a: ["Try to do it anyway", "Ask for help to understand it", "Wait and hope someone else does it"], correct: 1 },
  ];

  const { questions, isLoading } = useDynamicQuestions('EQ', difficulty, staticPool, userProfile);

  const handleChoice = (idx: number) => {
    if (questions.length === 0) return;
    const isCorrect = idx === questions[current].correct;
    if (isCorrect) {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 500);
    }
    
    // Difficulty scaling: 'challenging' gives fewer points per correct answer
    const pointsPerCorrect = 100 / questions.length;
    const multiplier = difficulty === 'challenging' ? 0.8 : difficulty === 'gentle' ? 1.2 : 1;
    const newScore = isCorrect ? score + (pointsPerCorrect * multiplier) : score;
    
    if (current + 1 < questions.length) {
      setScore(newScore);
      setCurrent(c => c + 1);
    } else {
      onComplete(Math.min(100, newScore));
    }
  };

  if (isLoading) return <LoadingOverlay message="Personalizing EQ Scenarios..." />;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-md mx-auto relative">
      <SuccessPulse active={showPulse} />
      <TestHeader 
        title="EQ Test" 
        description="See how well you understand emotions."
        icon={Smile}
      />
      <ProgressBar current={current + 1} total={questions.length} />
      <div className="w-full bg-white/95 border border-purple-100 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl shadow-purple-600/5">
        <p className="text-lg sm:text-xl text-[#322851] font-serif font-normal italic leading-relaxed text-center">{questions[current].q}</p>
        <div className="space-y-3.5">
          {questions[current].a.map((ans, i) => (
            <button
              key={i}
              onClick={() => handleChoice(i)}
              className="w-full p-4.5 text-left border border-purple-100/70 hover:border-[#8A2BE2]/40 hover:bg-[#8A2BE2]/5 bg-white/50 active:scale-[0.98] transition-all rounded-2xl group flex items-center gap-4 cursor-pointer text-[#513c66] text-sm font-medium leading-normal shadow-sm"
            >
              <div className="w-5 h-5 rounded-full border border-purple-200 flex items-center justify-center group-hover:border-[#8A2BE2]/40 transition-colors bg-white font-mono text-[10px] font-bold text-[#8c78a5]">
                {String.fromCharCode(65 + i)}
              </div>
              <span className="group-hover:text-[#8A2BE2] transition-colors">{ans}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

export const NumericalTest = withStability(({ onComplete, difficulty = 'moderate', userProfile }: any) => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showPulse, setShowPulse] = useState(false);

  const staticPool = [
    { q: "If a shirt costs $20 after a 20% discount, what was the original price?", a: ["$24", "$25", "$30"], correct: 1 },
    { q: "What is 15% of 200?", a: ["25", "30", "35"], correct: 1 },
    { q: "A train goes 120 miles in 2 hours. How fast is it going (miles per hour)?", a: ["50", "60", "70"], correct: 1 },
    { q: "If 3 times a number plus 5 is 20, what is the number?", a: ["3", "5", "15"], correct: 1 },
    { q: "What is the square root of 144?", a: ["10", "12", "14"], correct: 1 },
    { q: "A car uses 5 gallons of gas for 100 miles. How many gallons does it need for 250 miles?", a: ["10", "12.5", "15"], correct: 1 },
    { q: "If you buy 3 things for $4.50 each, how much do you pay in total?", a: ["$12.50", "$13.50", "$14.50"], correct: 1 },
    { q: "What is 2/3 of 90?", a: ["30", "60", "90"], correct: 1 },
  ];

  const { questions, isLoading } = useDynamicQuestions('Numerical', difficulty, staticPool, userProfile);

  const handleAnswer = (idx: number) => {
    if (questions.length === 0) return;
    const isCorrect = idx === questions[current].correct;
    if (isCorrect) {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 500);
    }
    const multiplier = difficulty === 'challenging' ? 1.5 : difficulty === 'gentle' ? 0.7 : 1;
    const newScore = isCorrect ? score + ((100 / questions.length) * multiplier) : score;
    if (current + 1 < questions.length) {
      setScore(newScore);
      setCurrent(c => c + 1);
    } else {
      onComplete(Math.min(100, newScore + 1));
    }
  };

  if (isLoading) return <LoadingOverlay message="Personalizing Numerical Matrix..." />;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-md mx-auto relative">
      <SuccessPulse active={showPulse} />
      <TestHeader 
        title="Math Test" 
        description="Solve these math problems."
        icon={Hash}
      />
      <ProgressBar current={current + 1} total={questions.length} />
      <div className="w-full bg-white/95 border border-purple-100 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl shadow-purple-600/5">
        <p className="text-lg sm:text-xl text-[#322851] font-serif font-normal italic leading-relaxed text-center">{questions[current].q}</p>
        <div className="space-y-3.5">
          {questions[current].a.map((ans, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className="w-full p-4.5 text-left border border-purple-100/70 hover:border-[#8A2BE2]/40 hover:bg-[#8A2BE2]/5 bg-white/50 active:scale-[0.98] transition-all rounded-2xl group flex items-center gap-4 cursor-pointer text-[#513c66] text-sm font-medium leading-normal shadow-sm"
            >
              <div className="w-5 h-5 rounded-full border border-purple-200 flex items-center justify-center group-hover:border-[#8A2BE2]/40 transition-colors bg-white font-mono text-[10px] font-bold text-[#8c78a5]">
                {String.fromCharCode(65 + i)}
              </div>
              <span className="group-hover:text-[#8A2BE2] transition-colors">{ans}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

export const AbstractTest = withStability(({ onComplete, difficulty = 'moderate', userProfile }: any) => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showPulse, setShowPulse] = useState(false);

  const staticPool = [
    { q: "Circle is to Sphere as Square is to:", a: ["Triangle", "Cube", "Rectangle"], correct: 1 },
    { q: "Which shape comes next? Triangle (3), Square (4), Pentagon (5), ...", a: ["Hexagon (6)", "Octagon (8)", "Circle"], correct: 0 },
    { q: "If 'BLUE' is '1234', what is 'LUBE'?", a: ["2314", "2431", "2134"], correct: 0 },
    { q: "Which of these is the odd one out?", a: ["Sphere", "Cube", "Pyramid", "Circle"], correct: 3 },
    { q: "If 'CAT' is '3120', what is 'DOG'?", a: ["4157", "4147", "5157"], correct: 0 },
    { q: "Complete the pattern: Up, Down, Left, Right, Up, Down, ?", a: ["Left", "Right", "Up"], correct: 0 },
    { q: "Which shape is a 3D version of a triangle?", a: ["Cone", "Pyramid", "Prism"], correct: 1 },
    { q: "If 'A' is 1 and 'B' is 2, what is 'CAB'?", a: ["312", "321", "123"], correct: 0 },
  ];

  const { questions, isLoading } = useDynamicQuestions('Abstract', difficulty, staticPool, userProfile);

  const handleAnswer = (idx: number) => {
    if (questions.length === 0) return;
    const isCorrect = idx === questions[current].correct;
    if (isCorrect) {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 500);
    }
    
    const pointsPerCorrect = 100 / questions.length;
    const multiplier = difficulty === 'challenging' ? 0.8 : difficulty === 'gentle' ? 1.2 : 1;
    const newScore = isCorrect ? score + (pointsPerCorrect * multiplier) : score;
    
    if (current + 1 < questions.length) {
      setScore(newScore);
      setCurrent(c => c + 1);
    } else {
      onComplete(Math.min(100, newScore));
    }
  };

  if (isLoading) return <LoadingOverlay message="Personalizing Abstract Matrix..." />;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-md mx-auto relative">
      <SuccessPulse active={showPulse} />
      <TestHeader 
        title="Abstract Test" 
        description="Find the patterns in these shapes."
        icon={Shapes}
      />
      <ProgressBar current={current + 1} total={questions.length} />
      <div className="w-full bg-white/95 border border-purple-100 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl shadow-purple-600/5">
        <p className="text-lg sm:text-xl text-[#322851] font-serif font-normal italic leading-relaxed text-center">{questions[current].q}</p>
        <div className="space-y-3.5">
          {questions[current].a.map((ans, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className="w-full p-4.5 text-left border border-purple-100/70 hover:border-[#8A2BE2]/40 hover:bg-[#8A2BE2]/5 bg-white/50 active:scale-[0.98] transition-all rounded-2xl group flex items-center gap-4 cursor-pointer text-[#513c66] text-sm font-medium leading-normal shadow-sm"
            >
              <div className="w-5 h-5 rounded-full border border-purple-200 flex items-center justify-center group-hover:border-[#8A2BE2]/40 transition-colors bg-white font-mono text-[10px] font-bold text-[#8c78a5]">
                {String.fromCharCode(65 + i)}
              </div>
              <span className="group-hover:text-[#8A2BE2] transition-colors">{ans}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

// --- Constants for Executive Test moves outside for stability ---
const EXECUTIVE_COLORS = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange'];
const EXECUTIVE_COLOR_VALUES = ['text-red-500', 'text-blue-500', 'text-green-500', 'text-yellow-500', 'text-purple-500', 'text-orange-500'];

export const ExecutiveTest = withStability(({ onComplete, difficulty = 'moderate', userProfile }: any) => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showPulse, setShowPulse] = useState(false);
  const [color, setColor] = useState('');
  const [text, setText] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [startTime, setStartTime] = useState(0);

  const staticPool = [{ q: "Stroop Effect", a: EXECUTIVE_COLORS, correct: 0 }];
  const { isLoading } = useDynamicQuestions('Executive', difficulty, staticPool, userProfile);

  const nextRound = useCallback(() => {
    const textColorIdx = Math.floor(Math.random() * EXECUTIVE_COLORS.length);
    const actualColorIdx = Math.floor(Math.random() * EXECUTIVE_COLORS.length);
    setText(EXECUTIVE_COLORS[textColorIdx]);
    setColor(EXECUTIVE_COLOR_VALUES[actualColorIdx]);
    
    const opts = [EXECUTIVE_COLORS[actualColorIdx]];
    while (opts.length < 4) {
      const c = EXECUTIVE_COLORS[Math.floor(Math.random() * EXECUTIVE_COLORS.length)];
      if (!opts.includes(c)) opts.push(c);
    }
    setOptions(opts.sort(() => Math.random() - 0.5));
    setStartTime(Date.now());
  }, []);

  useEffect(() => {
    nextRound();
  }, [nextRound]);

  const handleChoice = (choice: string) => {
    const colorIndex = EXECUTIVE_COLOR_VALUES.indexOf(color);
    const actualColorName = EXECUTIVE_COLORS[colorIndex];
    const isCorrect = choice === actualColorName;
    const timeTaken = Date.now() - startTime;
    const maxTime = difficulty === 'challenging' ? 1000 : difficulty === 'gentle' ? 3000 : 2000;
    
    let roundPoints = 0;
    if (isCorrect) {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 500);
      const speedBonus = Math.max(0, (maxTime - timeTaken) / maxTime) * 10;
      roundPoints = 15 + speedBonus; // Scaled to reach 100 max over 4 rounds
      setScore(s => s + roundPoints);
    }

    if (current + 1 < 5) {
      setCurrent(c => c + 1);
      nextRound();
    } else {
      // Use functional update or calculated next value to avoid stale closure
      setScore(s => {
        const finalScore = s + roundPoints;
        onComplete(Math.min(100, Math.floor(finalScore)));
        return finalScore;
      });
    }
  };

  if (isLoading) return <LoadingOverlay message="Personalizing Executive Matrix..." />;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-md mx-auto relative">
      <SuccessPulse active={showPulse} />
      <TestHeader 
        title="Executive Test" 
        description="Pick the COLOR of the word, not what the word says."
        icon={Activity}
      />
      <ProgressBar current={current + 1} total={5} />
      <div className="w-full bg-white/95 border border-purple-100 rounded-3xl p-6 sm:p-10 space-y-12 flex flex-col items-center shadow-xl shadow-purple-600/5">
        <motion.div 
          key={current}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn("text-5xl font-bold uppercase tracking-widest py-4 drop-shadow-sm filter", color)}
        >
          {text}
        </motion.div>
        <div className="grid grid-cols-2 gap-3.5 w-full">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleChoice(opt)}
              className="p-4 border border-purple-100/70 hover:border-[#8A2BE2]/40 hover:bg-[#8A2BE2]/5 bg-white/50 active:scale-[0.98] transition-all rounded-2xl text-[#513c66] text-xs font-bold uppercase tracking-widest cursor-pointer shadow-sm"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

export const ResilienceTest = withStability(({ onComplete, difficulty = 'moderate' }: any) => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showPulse, setShowPulse] = useState(false);
  const [problem, setProblem] = useState({ a: 0, b: 0, op: '+', ans: 0 });
  const [options, setOptions] = useState<number[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [isDistracted, setIsDistracted] = useState(false);

  const generateProblem = useCallback(() => {
    const a = Math.floor(Math.random() * (difficulty === 'challenging' ? 50 : 20)) + 1;
    const b = Math.floor(Math.random() * (difficulty === 'challenging' ? 50 : 20)) + 1;
    const ops = ['+', '-'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    const ans = op === '+' ? a + b : a - b;
    
    const opts = [ans];
    while (opts.length < 4) {
      const wrong = ans + (Math.floor(Math.random() * 10) - 5);
      if (!opts.includes(wrong)) opts.push(wrong);
    }
    
    setProblem({ a, b, op, ans });
    setOptions(opts.sort(() => Math.random() - 0.5));
    setStartTime(Date.now());
    setIsDistracted(false);
  }, [difficulty]);

  useEffect(() => {
    generateProblem();
  }, [generateProblem]);

  useEffect(() => {
    if (current > 3) {
      const interval = setInterval(() => {
        setIsDistracted(prev => !prev);
      }, Math.max(200, 800 - (current * 50)));
      return () => clearInterval(interval);
    }
  }, [current]);

  const handleChoice = (choice: number) => {
    const isCorrect = choice === problem.ans;
    const timeTaken = Date.now() - startTime;
    const maxTime = difficulty === 'challenging' ? 1500 : difficulty === 'gentle' ? 4000 : 2500;
    
    const speedBonus = isCorrect ? Math.max(0, (maxTime - timeTaken) / maxTime) * 10 : 0;
    const gainedPoints = isCorrect ? 15 + speedBonus : 0; // Scaled to reach 100 max over 4 rounds

    if (isCorrect) {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 500);
      setScore(s => s + gainedPoints);
    }

    if (current + 1 < 5) {
      setCurrent(c => c + 1);
      generateProblem();
    } else {
      onComplete(Math.min(100, Math.floor(score + gainedPoints)));
    }
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center w-full h-full max-w-md mx-auto relative transition-all duration-300",
      isDistracted && "scale-[1.02] opacity-80"
    )}>
      <SuccessPulse active={showPulse} />
      <TestHeader 
        title="Resilience Test" 
        description="Solve problems under increasing cognitive load and visual pressure."
        icon={Shield}
      />
      <ProgressBar current={current + 1} total={5} />
      <div className={cn(
        "w-full bg-white/95 border border-purple-100 rounded-3xl p-6 sm:p-10 space-y-12 flex flex-col items-center relative overflow-hidden shadow-xl shadow-purple-600/5 transition-all duration-300",
        isDistracted && "bg-red-50/95 border-red-200"
      )}>
        {isDistracted && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            className="absolute inset-0 bg-red-500 pointer-events-none"
          />
        )}
        <motion.div 
          key={current}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn("text-5xl font-serif italic font-bold", isDistracted ? "text-red-700 animate-bounce" : "text-[#322851]")}
        >
          {problem.a} {problem.op} {problem.b}
        </motion.div>
        <div className="grid grid-cols-2 gap-3.5 w-full">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleChoice(opt)}
              className={cn("p-4 border hover:bg-[#8A2BE2]/5 active:scale-[0.98] transition-all rounded-2xl text-sm font-bold shadow-sm cursor-pointer", isDistracted ? "border-red-200 bg-white text-red-700 hover:bg-red-50" : "border-purple-100 bg-white text-[#513c66]")}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

export const AestheticTest = withStability(({ onComplete }: any) => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showPulse, setShowPulse] = useState(false);

  const palettes = [
    { main: '#1a1a1a', options: [['#333333', '#4d4d4d'], ['#ff0000', '#00ff00'], ['#121212', '#242424']], correct: 2 },
    { main: '#ff5733', options: [['#c70039', '#900c3f'], ['#33ff57', '#3357ff'], ['#ff8d1a', '#ffc300']], correct: 0 },
    { main: '#3357ff', options: [['#ff3357', '#57ff33'], ['#1a3399', '#0d1a4d'], ['#33ffff', '#33ffaa']], correct: 1 },
  ];

  const handleChoice = (idx: number) => {
    if (idx === palettes[current].correct) {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 500);
      setScore(s => s + 20);
    }
    if (current + 1 < palettes.length) {
      setCurrent(c => c + 1);
    } else {
      onComplete(score);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-md mx-auto relative">
      <SuccessPulse active={showPulse} />
      <TestHeader 
        title="Aesthetic Sensitivity" 
        description="Choose the palette that most harmoniously complements the main color."
        icon={Sparkles}
      />
      <ProgressBar current={current + 1} total={palettes.length} />
      <div className="w-full bg-white/95 border border-purple-100 rounded-3xl p-6 sm:p-10 space-y-12 flex flex-col items-center shadow-xl shadow-purple-600/5">
        <div className="w-24 h-24 rounded-3xl shadow-xl border-4 border-white" style={{ backgroundColor: palettes[current].main }} />
        <div className="grid grid-cols-1 gap-3.5 w-full">
          {palettes[current].options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleChoice(i)}
              className="flex gap-2 p-4.5 border border-purple-100/75 hover:border-[#8A2BE2]/40 hover:bg-[#8A2BE2]/5 bg-white/50 active:scale-[0.98] rounded-2xl transition-all cursor-pointer shadow-sm"
            >
              {opt.map((c, j) => (
                <div key={j} className="flex-1 h-8 rounded-lg shadow-inner border border-black/5" style={{ backgroundColor: c }} />
              ))}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});export const PerformativeTest = withStability(({ onComplete, difficulty = 'moderate' }: any) => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showPulse, setShowPulse] = useState(false);
  const [sessionKey] = useState(() => Math.random());

  const staticPool = [
    { q: "You just won a major award, but your best friend just lost their job. How do you react?", a: ["Celebrate loudly", "Hide your joy and comfort them", "Tell them they'll do better next time", "Ask them to come to your party"], correct: 1 },
    { q: "A character is mourning a loss in a quiet room. What is the most effective physical action?", a: ["Screaming at the wall", "Staring blankly at a personal object", "Pacing rapidly", "Calling a friend"], correct: 1 },
    { q: "You need to deliver bad news to a sensitive person. Your tone should be:", a: ["Blunt and direct", "Apologetic and soft", "Cheerful to lighten the mood", "Indifferent"], correct: 1 },
    { q: "In a high-stakes negotiation, your body language should be:", a: ["Slumped and relaxed", "Open but firm", "Aggressive and leaning in", "Fidgety"], correct: 1 },
    { q: "A character is lying but trying to seem honest. They should:", a: ["Avoid all eye contact", "Maintain steady, slightly too long eye contact", "Blink rapidly", "Look at the floor"], correct: 1 },
    { q: "Your audience looks bored. What do you do?", a: ["Talk faster", "Tell a story or ask a question", "Show more slides", "End early"], correct: 1 },
    { q: "A technical glitch ruins your presentation. Your response:", a: ["Apologize profusely", "Keep going without slides confidently", "Try to fix it for 10 minutes", "End the presentation"], correct: 1 },
    { q: "Someone interrupts you during a speech. Best path:", a: ["Ignore them", "Acknowledge briefly and move back to point", "Argue with them", "Ask them to leave"], correct: 1 },
    { q: "You forgot your next point in a speech. You should:", a: ["Panic", "Pause intentionally for 5 seconds", "Say 'I forgot'", "Repeat the last sentence"], correct: 1 },
  ];

  const { questions, isLoading } = useDynamicQuestions('Performative', difficulty, staticPool, undefined, sessionKey);

  const handleChoice = (idx: number) => {
    if (questions.length === 0) return;
    if (idx === questions[current].correct) {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 500);
      setScore(s => s + (100 / questions.length));
    }
    if (current + 1 < questions.length) {
      setCurrent(c => c + 1);
    } else {
      onComplete(score);
    }
  };

  if (isLoading) return <LoadingOverlay message="Personalizing Performative Matrix..." />;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-md mx-auto relative">
      <SuccessPulse active={showPulse} />
      <TestHeader 
        title="Performative Expression" 
        description="Choose the most emotionally resonant response for each scenario."
        icon={Heart}
      />
      <ProgressBar current={current + 1} total={questions.length} />
      <div className="w-full bg-white/95 border border-purple-100 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl shadow-purple-600/5">
        <p className="text-lg sm:text-xl text-[#322851] font-serif font-normal italic leading-relaxed text-center">{questions[current].q}</p>
        <div className="space-y-3.5">
          {questions[current].a.map((ans, i) => (
            <button
              key={i}
              onClick={() => handleChoice(i)}
              className="w-full p-4.5 text-left border border-purple-100/70 hover:border-[#8A2BE2]/40 hover:bg-[#8A2BE2]/5 bg-white/50 active:scale-[0.98] transition-all rounded-2xl group flex items-center gap-4 cursor-pointer text-[#513c66] text-sm font-medium leading-normal shadow-sm"
            >
              <div className="w-5 h-5 rounded-full border border-purple-200 flex items-center justify-center group-hover:border-[#8A2BE2]/40 transition-colors bg-white font-mono text-[10px] font-bold text-[#8c78a5]">
                {String.fromCharCode(65 + i)}
              </div>
              <span className="group-hover:text-[#8A2BE2] transition-colors">{ans}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

export const AuditoryTest = withStability(({ onComplete, difficulty = 'moderate', userProfile }: any) => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showPulse, setShowPulse] = useState(false);

  const staticPool = [
    { p: "Tap - Tap - Pause - Tap", options: ["1-1-0-1", "1-0-1-1", "1-1-1-0"], correct: 0 },
    { p: "Long - Short - Short - Long", options: ["L-S-S-L", "S-L-L-S", "L-L-S-S"], correct: 0 },
    { p: "Fast - Fast - Fast - Slow", options: ["F-F-S-F", "F-F-F-S", "S-F-F-F"], correct: 1 },
    { p: "High - Low - High - Low", options: ["H-L-H-L", "L-H-L-H", "H-H-L-L"], correct: 0 },
    { p: "Rising - Falling - Rising", options: ["F-R-F", "R-F-R", "R-R-F"], correct: 1 },
  ];

  const { questions, isLoading } = useDynamicQuestions('Auditory', difficulty, staticPool, userProfile);

  const handleChoice = (idx: number) => {
    if (questions.length === 0) return;
    if (idx === questions[current].correct) {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 500);
      setScore(s => s + (100 / questions.length));
    }
    if (current + 1 < questions.length) {
      setCurrent(c => c + 1);
    } else {
      onComplete(score);
    }
  };

  if (isLoading) return <LoadingOverlay message="Personalizing Auditory Matrix..." />;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-md mx-auto relative">
      <SuccessPulse active={showPulse} />
      <TestHeader 
        title="Auditory Perception" 
        description="Identify the rhythmic or tonal pattern described."
        icon={RefreshCw}
      />
      <ProgressBar current={current + 1} total={questions.length} />
      <div className="w-full bg-white/95 border border-purple-100 rounded-3xl p-6 sm:p-10 space-y-12 flex flex-col items-center shadow-xl shadow-purple-600/5">
        <div className="text-2xl font-mono text-[#8A2BE2] tracking-widest text-center bg-purple-50/80 px-6 py-3 rounded-2xl border border-purple-100 font-bold">{questions[current].p}</div>
        <div className="grid grid-cols-1 gap-3.5 w-full">
          {questions[current].options?.map((opt: any, i: number) => (
            <button
              key={i}
              onClick={() => handleChoice(i)}
              className="p-4 border border-purple-100/70 hover:border-[#8A2BE2]/40 hover:bg-[#8A2BE2]/5 bg-white/50 active:scale-[0.98] transition-all rounded-2xl text-[#513c66] text-sm font-bold tracking-widest cursor-pointer shadow-sm"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

export const NarrativeTest = withStability(({ onComplete, difficulty = 'moderate', userProfile }: any) => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showPulse, setShowPulse] = useState(false);

  const staticPool = [
    { q: "Order these to form a story:", p: ["A. He found a key.", "B. The door opened.", "C. He walked to the gate."], options: ["C-A-B", "A-C-B", "B-A-C"], correct: 0 },
    { q: "Order these to form a story:", p: ["A. It started to rain.", "B. She forgot her umbrella.", "C. She got soaked."], options: ["B-A-C", "A-B-C", "C-B-A"], correct: 0 },
    { q: "Order these to form a story:", p: ["A. The cake was delicious.", "B. He mixed the flour.", "C. He put it in the oven."], options: ["B-C-A", "C-B-A", "A-B-C"], correct: 0 },
    { q: "Order these to form a story:", p: ["A. They reached the summit.", "B. They started the climb.", "C. The sun began to set."], options: ["B-A-C", "C-B-A", "A-C-B"], correct: 0 },
    { q: "Order these to form a story:", p: ["A. The phone rang.", "B. She answered it.", "C. She was sleeping."], options: ["C-A-B", "A-C-B", "B-A-C"], correct: 0 },
  ];

  const { questions, isLoading } = useDynamicQuestions('Narrative', difficulty, staticPool, userProfile);

  const handleChoice = (idx: number) => {
    if (questions.length === 0) return;
    if (idx === questions[current].correct) {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 500);
      setScore(s => s + (100 / questions.length));
    }
    if (current + 1 < questions.length) {
      setCurrent(c => c + 1);
    } else {
      onComplete(score);
    }
  };

  if (isLoading) return <LoadingOverlay message="Personalizing Narrative Matrix..." />;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-md mx-auto relative">
      <SuccessPulse active={showPulse} />
      <TestHeader 
        title="Narrative Construction" 
        description="Sequence the fragments to create a logical narrative flow."
        icon={MessageSquare}
      />
      <ProgressBar current={current + 1} total={questions.length} />
      <div className="w-full bg-white/95 border border-purple-100 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl shadow-purple-600/5">
        <div className="space-y-3 bg-purple-50/45 p-6 rounded-2xl border border-purple-100 text-center">
          {questions[current].p.map((line: any, i: number) => (
            <div key={i} className="text-sm text-[#4a4164] font-medium italic">{line}</div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-3.5 w-full">
          {questions[current].options?.map((opt: any, i: number) => (
            <button
              key={i}
              onClick={() => handleChoice(i)}
              className="p-4 border border-purple-100/70 hover:border-[#8A2BE2]/40 hover:bg-[#8A2BE2]/5 bg-white/50 active:scale-[0.98] transition-all rounded-2xl text-[#513c66] text-sm font-bold tracking-widest cursor-pointer shadow-sm"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});
