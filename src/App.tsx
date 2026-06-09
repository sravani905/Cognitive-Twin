import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  RefreshCw, Book, Share2, Check, Clock, User, LogOut, MessageSquare, Globe, LogIn,
  Compass, Award, BrainCircuit, Sparkles, Heart, Bell, AlertTriangle, ShieldCheck, Play, Pause, Trophy, FileText, ArrowLeft, Mail, Key
} from 'lucide-react';
import { cn } from './lib/utils';
import { getApiKeyInfo, getMarketInsights } from './services/geminiService';
import { findKNearestCareers } from './services/knnService';
import { useAppState } from './hooks/useAppState';
import { PRELOADED_COGNITIVE_SETS } from './constants/preloadedCognitiveSets';

// Components & Modules
import { NeuralCore } from './components/NeuralCore';
import { SparkleBackground } from './components/SparkleBackground';
import { ChatBot } from './components/ChatBot';
import { MeshBrain } from './components/Branding';
import { FeedbackModal } from './components/FeedbackModal';
import { AuthModule } from './modules/AuthModule';
import { AssessmentModule } from './modules/AssessmentModule';
import { IntelligenceModule } from './modules/IntelligenceModule';
import { GrowthModule } from './modules/GrowthModule';
import { AestheticDashboard } from './components/AestheticDashboard';
import { AboutView } from './components/AboutView';
import { PrivacyView } from './components/PrivacyView';
import { ContactView } from './components/ContactView';
import { ApiConfigView } from './components/ApiConfigView';
import { PassiveTrackingHub } from './components/PassiveTrackingHub';

// Pixel faithful Recreated Cognitive twin views
import { MyMindProfileView } from './components/MyMindProfileView';
import { CareerMatchesView } from './components/CareerMatchesView';
import { ArchetypeRoadmapView } from './components/ArchetypeRoadmapView';
import { SessionLogView } from './components/SessionLogView';
import { RecommendationsView } from './components/RecommendationsView';
import { GrowthMapView } from './components/GrowthMapView';
import { ReportView } from './components/ReportView';
import { SuccessParticleCanvas } from './components/SuccessParticleCanvas';
import { QuickActionsFloatingMenu } from './components/QuickActionsFloatingMenu';

export default function App() {
  const state = useAppState();
  const {
    user, setUser, step, setStep, testIndex, difficulty, insights, setInsights, dashboardTab, setDashboardTab, 
    metrics, setMetrics, history, lifestyleLogs, setLifestyleLogs, completedGrowthAreas, 
    selectedRoadmap, isGeneratingRoadmap, marketInsights, setMarketInsights,
    loadingInsights, setLoadingInsights, knnMatches, trackingEnabled, setTrackingEnabled, 
    handleTestComplete, handleLaunchRoadmap, showResetConfirm, setShowResetConfirm, 
    handleNewAssessment, confirmStartFresh, toggleGrowthArea, toggleRoadmapTask, 
    roadmapProgress, completedRoadmapTasks
  } = state;

  // Local Navigation State matching the side navigation in the image
  const [activeTab, setActiveTab] = useState<'home' | 'profile' | 'careers' | 'archetype' | 'growth' | 'progress' | 'sessions' | 'recommendations' | 'hub'>('home');

  // Local UI State
  const [showAbout, setShowAbout] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [authEmail, setAuthEmail] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [sharedReport, setSharedReport] = useState<any>(null);

  // Demo / Explorer Mode State
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [selectedDemoArchetypeId, setSelectedDemoArchetypeId] = useState(PRELOADED_COGNITIVE_SETS[0]?.id || '');

  const handleExploreDemo = () => {
    setIsDemoMode(true);
    const defaultSet = PRELOADED_COGNITIVE_SETS[0];
    if (!defaultSet) return;
    
    setSelectedDemoArchetypeId(defaultSet.id);
    setUser({
      uid: 'demo_user',
      email: 'explorer@cognitivetwin.ai',
      displayName: 'Demo Explorer'
    });

    setMetrics({
      name: 'Demo Explorer',
      gender: 'Female',
      age: 21,
      ageRange: '18–22',
      role: 'Data Science Scholar',
      field: 'Data Science',
      learningTime: '2 hours per day',
      learningStyle: 'Multimodal study',
      ...defaultSet.idealScores,
      focusScore: defaultSet.idealScores.focusScore || 85,
      logicScore: defaultSet.idealScores.logicScore || 90,
      memoryScore: defaultSet.idealScores.memoryScore || 80,
      speedScore: defaultSet.idealScores.speedScore || 88,
      creativityScore: defaultSet.idealScores.creativityScore || 85,
      spatialScore: defaultSet.idealScores.spatialScore || 75,
      verbalScore: defaultSet.idealScores.verbalScore || 80,
      eqScore: defaultSet.idealScores.eqScore || 82,
      numericalScore: defaultSet.idealScores.numericalScore || 88,
      abstractScore: defaultSet.idealScores.abstractScore || 90,
      resilienceScore: 85,
      aestheticScore: 80,
      auditoryScore: 78,
      executiveScore: 90,
      comprehensiveScore: 86,
      timestamp: Date.now()
    });

    setInsights({
      isStandard: false,
      isHeuristic: true,
      archetype: {
        title: defaultSet.archetype.title,
        description: defaultSet.archetype.description,
        color: defaultSet.archetype.color
      },
      studyMethod: defaultSet.studyMethod,
      productivityStyle: defaultSet.productivityStyle,
      workEnvironment: defaultSet.workEnvironment,
      careerGuide: defaultSet.careerGuide,
      summary: `Interactive Demonstration Mode representing the "${defaultSet.archetype.title}" model. ${defaultSet.summary}`,
      growthAreas: defaultSet.growthAreas
    });

    setStep('report');
    setActiveTab('home');

    // Trigger sweet celebration confetti!
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('cognitive-success-particles', { detail: { type: 'test' } }));
    }, 200);
  };

  const handleSelectDemoArchetype = (archetypeId: string) => {
    setSelectedDemoArchetypeId(archetypeId);
    const selectedSet = PRELOADED_COGNITIVE_SETS.find(s => s.id === archetypeId);
    if (!selectedSet) return;

    setMetrics((prev: any) => ({
      ...prev,
      ...selectedSet.idealScores,
      focusScore: selectedSet.idealScores.focusScore || 85,
      logicScore: selectedSet.idealScores.logicScore || 90,
      memoryScore: selectedSet.idealScores.memoryScore || 80,
      speedScore: selectedSet.idealScores.speedScore || 88,
      creativityScore: selectedSet.idealScores.creativityScore || 85,
      spatialScore: selectedSet.idealScores.spatialScore || 75,
      verbalScore: selectedSet.idealScores.verbalScore || 80,
      eqScore: selectedSet.idealScores.eqScore || 82,
      numericalScore: selectedSet.idealScores.numericalScore || 88,
      abstractScore: selectedSet.idealScores.abstractScore || 90,
    }));

    setInsights({
      isStandard: false,
      isHeuristic: true,
      archetype: {
        title: selectedSet.archetype.title,
        description: selectedSet.archetype.description,
        color: selectedSet.archetype.color
      },
      studyMethod: selectedSet.studyMethod,
      productivityStyle: selectedSet.productivityStyle,
      workEnvironment: selectedSet.workEnvironment,
      careerGuide: selectedSet.careerGuide,
      summary: `Interactive Demonstration Mode representing the "${selectedSet.archetype.title}" model. ${selectedSet.summary}`,
      growthAreas: selectedSet.growthAreas
    });

    window.dispatchEvent(new CustomEvent('cognitive-success-particles', { detail: { type: 'milestone' } }));
  };

  // Focus Audio State for Left Sidebar Player
  const [sidebarAudioActive, setSidebarAudioActive] = useState(false);
  const synthCtxRef = useRef<AudioContext | null>(null);
  const synthNodesRef = useRef<{ osc: OscillatorNode; noiseFilter: BiquadFilterNode; gain: GainNode } | null>(null);

  const toggleSidebarAudio = () => {
    if (sidebarAudioActive) {
      if (synthNodesRef.current && synthCtxRef.current) {
        const gain = synthNodesRef.current.gain;
        gain.gain.setValueAtTime(gain.gain.value, synthCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, synthCtxRef.current.currentTime + 1);
        setTimeout(() => {
          try {
            synthNodesRef.current?.osc.stop();
            synthCtxRef.current?.close();
            synthCtxRef.current = null;
            synthNodesRef.current = null;
          } catch (e) {}
        }, 1100);
      }
      setSidebarAudioActive(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        synthCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        // Binaural relaxation waves at 90Hz
        osc.frequency.setValueAtTime(90, ctx.currentTime);
        osc.type = 'triangle';

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(150, ctx.currentTime);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1.5);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        synthNodesRef.current = { osc, noiseFilter: filter, gain };
        setSidebarAudioActive(true);
      } catch (err) {
        console.warn("Synthesis declined:", err);
      }
    }
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setTimeout(() => {
      const mockUser = {
        uid: 'guest_' + Math.random().toString(36).substring(2, 11),
        email: authEmail || 'sravani.ghattu@gmail.com',
        displayName: authEmail ? authEmail.split('@')[0] : 'Sravani'
      };
      setUser(mockUser);
      setIsAuthenticating(false);
      setStep('onboarding');
    }, 800);
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fetchMarketData = async (career: string) => {
    if (loadingInsights[career]) return;
    setLoadingInsights(p => ({ ...p, [career]: true }));
    try {
      const data = await getMarketInsights(career, metrics);
      if (data) setMarketInsights(p => ({ ...p, [career]: data }));
    } finally {
      setLoadingInsights(p => ({ ...p, [career]: false }));
    }
  };

  // Sync state nav links to older dual modules
  useEffect(() => {
    if (activeTab === 'profile') setDashboardTab('identity');
    if (activeTab === 'careers') setDashboardTab('trajectory');
    if (activeTab === 'archetype') setDashboardTab('resilience');
    if (activeTab === 'growth') setDashboardTab('enhancement');
    if (activeTab === 'progress') setDashboardTab('performance');
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-transparent text-secondary font-sans selection:bg-accent-purple/10 relative">
      <SparkleBackground />
      <NeuralCore />
      <SuccessParticleCanvas />
      
      {/* Quick Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm" onClick={() => setShowResetConfirm(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-black/5 space-y-8" onClick={e => e.stopPropagation()}>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-accent-purple/10 flex items-center justify-center mx-auto"><RefreshCw className="w-8 h-8 text-accent-purple" /></div>
                <h2 className="text-2xl font-serif italic text-primary">Start Fresh?</h2>
                <p className="text-xs text-muted leading-relaxed">This will reset your current cognitive mapping session. Previous results are in the Library.</p>
              </div>
              <div className="flex flex-col gap-3">
                <button onClick={confirmStartFresh} className="btn-primary">Confirm Reset</button>
                <button onClick={() => setShowResetConfirm(false)} className="w-full py-4 border border-black/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-muted hover:text-primary">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RENDER STEPS */}
      <AnimatePresence mode="wait">
        
        {/* Step A: Welcome / Auth screens */}
        {step === 'welcome' && (
          <AuthModule 
            authEmail={authEmail} setAuthEmail={setAuthEmail} authPass={authPass} setAuthPass={setAuthPass}
            isSignUp={isSignUp} setIsSignUp={setIsSignUp} authError={authError} isAuthenticating={isAuthenticating}
            onAuthenticate={handleAuthenticate}
            onShowAbout={() => setShowAbout(true)}
            onShowPrivacy={() => setShowPrivacy(true)}
            onShowContact={() => setShowContact(true)}
            onShowApiConfig={() => setShowApiConfig(true)}
            onExploreDemo={handleExploreDemo}
          />
        )}

        {/* Step B: Onboarding Assessment screens */}
        {(['onboarding', 'context', 'testing', 'analyzing'].includes(step)) && (
          <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen">
            <AssessmentModule 
              step={step} testIndex={testIndex} difficulty={difficulty} metrics={metrics}
              onStartContext={() => setStep('context')} onCompleteContext={(ctx) => {
                const newUser = user || { uid: 'anon_' + Date.now(), displayName: ctx.name || 'Anonymous' };
                if (!user) setUser(newUser);
                setMetrics({ ...metrics, ...ctx });
                setStep('testing');
              }}
              onTestComplete={handleTestComplete}
              onShowAbout={() => setShowAbout(true)}
              onBackToLanding={() => {
                setIsDemoMode(false);
                setStep('welcome');
              }}
            />
          </div>
        )}

        {/* Step C: DASHBOARD WORKSPACE (Bento & Glass Sidebar layout) */}
        {(step === 'dashboard' || step === 'report' || step === 'library' || step === 'roadmap') && (
          <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">
            
            {/* Top Info Ribbon */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white/30 border border-white/60 p-4 rounded-3xl gap-4">
              <div className="flex items-center gap-3">
                <MeshBrain className="w-8 h-8 text-accent-purple" />
                <div>
                  <h3 className="font-serif italic text-primary text-sm font-bold">Cognitive Twin Space</h3>
                  <p className="text-[10px] text-muted tracking-widest uppercase">Lab Protocol Active</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 border-l border-purple-100/30 pl-4 flex-wrap">
                <button onClick={() => { setIsDemoMode(false); setStep('welcome'); }} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#5c4ce1] hover:brightness-110 border border-[#5c4ce1]/25 px-4 py-1.5 rounded-full bg-[#5c4ce1]/5 shrink-0"><ArrowLeft className="w-3.5 h-3.5" /> Landing Page</button>
                <button onClick={() => setShowApiConfig(true)} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-accent-blue hover:brightness-110 border border-accent-blue/20 px-4 py-1.5 rounded-full bg-blue-50/10 shrink-0"><Key className="w-3.5 h-3.5" /> API Settings</button>
                <button onClick={() => setShowAbout(true)} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#8161e1] hover:brightness-110 border border-[#8161e1]/20 px-4 py-1.5 rounded-full bg-[#8161e1]/8 shrink-0"><Sparkles className="w-3.5 h-3.5" /> About Platform</button>
                <button onClick={() => setShowResetConfirm(true)} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-accent-purple hover:brightness-110 border border-accent-purple/20 px-4 py-1.5 rounded-full bg-white/40 shrink-0"><RefreshCw className="w-3.5 h-3.5" /> Start Fresh</button>
                <button onClick={handleShare} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-primary shrink-0">{copied ? <Check className="w-3 h-3 text-accent-emerald" /> : <Share2 className="w-3.5 h-3.5" />}{copied ? "Copied" : "Share URL"}</button>
                <button onClick={() => { setUser(null); setIsDemoMode(false); setStep('welcome'); }} className="text-xs font-semibold uppercase text-red-500 hover:scale-[0.98] transition-all">Sign out</button>
              </div>
            </div>

            {/* Interactive Demo Selector Panel */}
            {isDemoMode && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="bg-gradient-to-r from-[#8161e1]/8 via-[#e59ec1]/5 to-[#8161e1]/8 border border-[#8161e1]/20 p-5 rounded-3xl relative overflow-hidden backdrop-blur-md shadow-sm space-y-4 md:space-y-0 flex flex-col md:flex-row items-center justify-between gap-6"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-2xl bg-[#8161e1]/10 flex items-center justify-center text-xl animate-pulse">✨</div>
                    <div className="absolute inset-0 bg-[#8161e1]/10 rounded-2xl animate-ping opacity-30" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-primary flex flex-wrap items-center gap-2">
                      Interactive Feature Showcase Playground 🔬
                      <span className="bg-pink-100 text-pink-700 text-[8px] px-2 py-0.5 rounded-full uppercase tracking-wider font-mono font-bold">Sandbox Active</span>
                    </h3>
                    <p className="text-[11px] text-[#514371] mt-1 max-w-2xl leading-relaxed">
                      Explore how Cognitive Twin models reports, mind profiles, career matches, and growth maps. 
                      <strong>Select an archetype below</strong> to instantly re-hydrate the workspace!
                    </p>
                  </div>
                </div>

                <div className="shrink-0 w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white/40 p-2 rounded-2xl border border-white/80">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#7c779e] font-mono shrink-0 pl-2">Match Profile:</span>
                  <select
                    value={selectedDemoArchetypeId}
                    onChange={(e) => handleSelectDemoArchetype(e.target.value)}
                    className="bg-white/95 border border-purple-100 focus:border-accent-purple text-[11px] font-bold px-4 py-2 rounded-xl text-[#1e1a42] focus:ring-1 focus:ring-accent-purple sm:w-60 cursor-pointer shadow-sm"
                  >
                    {PRELOADED_COGNITIVE_SETS.map((set) => (
                      <option key={set.id} value={set.id}>
                        {set.archetype.title}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}

            {/* Sidebar Columns Divider */}
            {step === 'report' && (
              <motion.div 
                key="report-view-container"
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="w-full bg-white/20 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-xl"
              >
                <ReportView 
                  insights={insights}
                  metrics={metrics}
                  onStartFresh={() => setShowResetConfirm(true)}
                  onNewAssessment={handleNewAssessment}
                  onBack={() => {
                    setStep('dashboard');
                    setActiveTab('home');
                  }}
                  onBackToLanding={() => {
                    setIsDemoMode(false);
                    setStep('welcome');
                  }}
                  onLaunchRoadmap={handleLaunchRoadmap}
                  isGeneratingRoadmap={isGeneratingRoadmap}
                  completedGrowthAreas={completedGrowthAreas}
                  onToggleGrowthArea={toggleGrowthArea}
                  onShare={handleShare}
                  isReadOnly={false}
                  onFetchMarketData={fetchMarketData}
                  marketData={marketInsights}
                  loadingMarketData={loadingInsights}
                  knnMatches={knnMatches}
                  roadmapProgress={roadmapProgress}
                />
              </motion.div>
            )}

            {step !== 'report' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: NAVIGATION & CONTROLS (3 COLS) */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* Active Navigation Capsule List */}
                <div className="glow-card p-6 rounded-3xl space-y-2">
                  <div className="pb-4 border-b border-black/5">
                    <p className="micro-label">Laboratory Console</p>
                    <p className="text-xs font-serif text-primary font-bold">Workspace Navigation</p>
                  </div>

                  <div className="space-y-1 pt-3">
                    {[
                      { id: 'home', label: 'Home', icon: Compass },
                      { id: 'report', label: 'Diagnostics Report', icon: FileText },
                      { id: 'profile', label: 'My Mind Profile', icon: User },
                      { id: 'careers', label: 'Career Matches', icon: Award },
                      { id: 'archetype', label: 'Archetype Roadmap', icon: BrainCircuit },
                      { id: 'growth', label: 'Growth Map', icon: Sparkles },
                      { id: 'sessions', label: 'Session Log', icon: Book },
                      { id: 'recommendations', label: 'Recommendations', icon: Heart },
                      { id: 'hub', label: 'Sync & Rewards', icon: Trophy }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (item.id === 'report') {
                            setStep('report');
                          } else {
                            setActiveTab(item.id as any);
                            setStep('dashboard');
                          }
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] uppercase font-bold tracking-widest transition-all",
                          (step === 'dashboard' && activeTab === item.id)
                            ? "bg-accent-purple text-white shadow-md shadow-accent-purple/20" 
                            : "text-secondary hover:text-primary hover:bg-white/30"
                        )}
                      >
                        <item.icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    ))}

                    <div className="pt-4 mt-4 border-t border-black/5 space-y-2">
                      <button
                        onClick={() => {
                          setIsDemoMode(false);
                          setStep('welcome');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] uppercase font-bold tracking-widest transition-all text-[#5c4ce1] hover:text-[#4a3bc3] hover:bg-[#5c4ce1]/5 border border-[#5c4ce1]/20 bg-white/10"
                      >
                        <ArrowLeft className="w-4 h-4 shrink-0 text-[#5c4ce1]" />
                        <span>Back to Landing</span>
                      </button>
                    </div>

                  </div>
                </div>

                {/* FOCUS MODE OSCILLATOR PLAYER */}
                <div className="glow-card p-6 rounded-3xl space-y-4 bg-gradient-to-br from-white/60 to-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-primary">Focus mode</p>
                      <p className="text-[10px] text-muted font-mono">lofi music - rain</p>
                    </div>
                    <Sparkles className="w-4 h-4 text-accent-purple animate-ping" />
                  </div>

                  {/* Bouncing Visualizer Bars (Only animated when playing!) */}
                  <div className="h-8 flex items-end justify-center gap-1.5 p-1 bg-black/5 rounded-xl">
                    {[12, 28, 16, 24, 18, 22, 14, 26, 12, 20].map((v, i) => (
                      <motion.div 
                        key={i} 
                        className="w-1.5 bg-accent-purple/80 rounded-full"
                        animate={{ 
                          height: sidebarAudioActive ? [6, v, 6] : 6 
                        }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 1 + (i % 3) * 0.2, 
                          ease: "easeInOut" 
                        }}
                      />
                    ))}
                  </div>

                  <button 
                    onClick={toggleSidebarAudio}
                    className="w-full py-3 rounded-xl bg-accent-purple text-white text-[10px] font-bold uppercase tracking-widest hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    {sidebarAudioActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{sidebarAudioActive ? "Pause Focus" : "Activating Rain"}</span>
                  </button>
                </div>

                {/* USER PROFILE CARD */}
                <div className="glow-card p-4 rounded-2xl flex items-center gap-3 bg-white/50">
                  <div className="w-10 h-10 rounded-full bg-accent-violet flex items-center justify-center font-bold text-white uppercase text-sm shadow-md">
                    {user?.displayName?.[0] || user?.email?.[0] || 'S'}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-primary">
                      {user?.displayName || user?.email?.split('@')[0] || 'Sravani ♡'}
                    </h4>
                    <span className="text-[10px] text-muted font-mono block">keep growing 🌱</span>
                  </div>
                </div>

              </div>

              {/* MAIN ACTIVE CONTENT VIEWS - SWITCH SIZING DEPENDING ON TAB */}
              {activeTab === 'home' ? (
                <>
                  {/* CENTER COLUMN: ACTIVE CONTENT VIEWS (6 COLS) */}
                  <div className="lg:col-span-6 space-y-6">
                    <AnimatePresence mode="wait">
                      {step === 'dashboard' && (
                        <motion.div key="home-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <AestheticDashboard 
                            metrics={metrics}
                            insights={insights}
                            knnMatches={knnMatches}
                            user={user}
                            onLaunchRoadmap={handleLaunchRoadmap}
                            onNewAssessment={handleNewAssessment}
                            onStartFresh={() => setShowResetConfirm(true)}
                            completedGrowthAreas={completedGrowthAreas}
                            onToggleGrowthArea={toggleGrowthArea}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* RIGHT COLUMN: QUICK ACTIVITY TRACKERS (3 COLS) */}
                  <div className="lg:col-span-3 space-y-6">
                    
                    {/* Bell Alert notification bar */}
                    <div className="glow-card p-6 rounded-3xl space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="w-5 h-5 text-accent-purple" />
                          <span className="text-xs font-bold text-primary font-mono">Notifications</span>
                        </div>
                        <span className="w-5 h-5 bg-accent-purple text-white text-[10px] font-mono rounded-full flex items-center justify-center font-bold">2</span>
                      </div>

                      <div className="space-y-3 pt-2 text-[11px] text-secondary leading-relaxed">
                        <p className="border-l-2 border-accent-purple pl-3 py-1 bg-black/5 rounded-r">
                          Deep focus rhythm is recommended to correct attention jitter.
                        </p>
                        <p className="border-l-2 border-accent-blue pl-3 py-1 bg-black/5 rounded-r">
                          Quantum Researcher alignment updated based on logic test.
                        </p>
                      </div>
                    </div>

                    {/* FRMYTHING SAVE PROGRESS PANEL */}
                    <div className="glow-card p-6 rounded-3xl space-y-4">
                      <p className="micro-label">Temporal Save State</p>
                      <p className="text-xs font-bold text-primary">Frmything Save</p>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent-purple/10 flex items-center justify-center font-bold text-xs text-accent-purple">S</div>
                        <div>
                          <p className="text-[10px] font-bold text-primary">by sravani.ghattu</p>
                          <p className="text-[9px] text-muted">Acuity baseline state: 0.1217</p>
                        </div>
                      </div>

                      {/* Acuity Slider Progress */}
                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-[9px] font-mono text-muted">
                          <span>Baseline Level</span>
                          <span>85% Stability</span>
                        </div>
                        <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden">
                          <div className="h-full bg-accent-purple rounded-full transition-all" style={{ width: '85%' }} />
                        </div>
                      </div>

                      {/* Fatigue flag info */}
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[10px] font-medium leading-relaxed">
                        <strong>Jitter Warning:</strong> Executive fatigue indicator represents mild work stress. Rain soundtrack is operational.
                      </div>
                    </div>

                    {/* SMALL TEMPORAL SPARKLINE */}
                    <div className="glow-card p-6 rounded-3xl space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-primary">Temporal Trends</p>
                        <span className="text-[9px] text-muted font-mono">Mind Acuity</span>
                      </div>

                      {/* Vector SVG Sparkline representing fluctuation */}
                      <div className="h-16 w-full pt-3">
                        <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                          <path 
                            d="M0,15 Q15,5 30,22 T60,8 T90,20 L100,10" 
                            fill="none" 
                            stroke="var(--accent-purple)" 
                            strokeWidth="2" 
                            strokeLinecap="round"
                          />
                          <circle cx="30" cy="22" r="3" fill="var(--accent-purple)" />
                          <circle cx="60" cy="8" r="3" fill="var(--accent-blue)" />
                          <circle cx="90" cy="20" r="3" fill="var(--accent-purple)" />
                        </svg>
                      </div>

                      <div className="flex justify-between text-[8px] font-mono text-muted pt-2 border-t border-black/5">
                        <span>123% Acuity score</span>
                        <span>13 Sessions tracked</span>
                      </div>
                    </div>

                  </div>
                </>
              ) : (
                /* CUSTOM FULL SIZE MAIN WORKSPACE VIEW (9 COLS) */
                <div className="lg:col-span-9 space-y-6">
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={activeTab} 
                      initial={{ opacity: 0, y: 15 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: 15 }}
                      transition={{ duration: 0.15 }}
                    >
                      {activeTab === 'profile' && (
                        <MyMindProfileView metrics={metrics} onRetake={handleNewAssessment} />
                      )}
                      
                      {activeTab === 'careers' && (
                        <CareerMatchesView metrics={metrics} onLaunchRoadmap={handleLaunchRoadmap} knnMatches={knnMatches} />
                      )}
                      
                      {activeTab === 'archetype' && (
                        <ArchetypeRoadmapView />
                      )}
                      
                      {activeTab === 'growth' && (
                        <GrowthMapView metrics={metrics} />
                      )}
                      
                      {activeTab === 'sessions' && (
                        <SessionLogView />
                      )}
                      
                      {activeTab === 'recommendations' && (
                        <RecommendationsView metrics={metrics} insights={insights} />
                      )}
                      
                      {activeTab === 'hub' && (
                        <PassiveTrackingHub metrics={metrics} setMetrics={setMetrics} trackingEnabled={trackingEnabled} setTrackingEnabled={setTrackingEnabled} />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}

            </div>
            )}

          </div>
        )}

      </AnimatePresence>
      
      {/* Bot Chat Window Toggle button */}
      {step === 'dashboard' && <ChatBot profile={{ metrics, insights }} showCounsellor={false} setShowCounsellor={() => {}} />}

      {/* Quick Actions Floating Menu */}
      {(['dashboard', 'report', 'library', 'roadmap'].includes(step)) && (
        <QuickActionsFloatingMenu
          onStartAssessment={handleNewAssessment}
          onNavigateTab={(tab) => {
            setActiveTab(tab);
            setStep('dashboard');
          }}
          onStartFresh={() => setShowResetConfirm(true)}
          sidebarAudioActive={sidebarAudioActive}
          onToggleSidebarAudio={toggleSidebarAudio}
        />
      )}
      
      {/* User modal forms */}
      <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} rating={feedbackRating} setRating={setFeedbackRating} text={feedbackText} setText={setFeedbackText} onSubmit={() => setShowFeedback(false)} isSubmitting={false} />

      <AnimatePresence>
        {showAbout && <AboutView onClose={() => setShowAbout(false)} />}
        {showPrivacy && <PrivacyView onClose={() => setShowPrivacy(false)} />}
        {showContact && <ContactView onClose={() => setShowContact(false)} />}
        {showApiConfig && <ApiConfigView onClose={() => setShowApiConfig(false)} />}
      </AnimatePresence>

      <footer className="relative z-10 mt-12 p-8 border-t border-black/5 text-center flex flex-col items-center gap-4">
        <div className="flex gap-4 flex-wrap justify-center">
          <button id="btn-footer-contact" onClick={() => setShowContact(true)} className="px-6 py-2 rounded-full border border-black/5 text-[10px] font-bold text-muted uppercase tracking-widest hover:bg-white/40 transition-all"><Mail className="w-3 h-3 inline mr-2" /> Contact</button>
          <button id="btn-footer-api-config" onClick={() => setShowApiConfig(true)} className="px-6 py-2 rounded-full border border-black/5 text-[10px] font-bold text-[#8161e1] uppercase tracking-widest hover:bg-white/40 transition-all"><Key className="w-3 h-3 inline mr-2" /> API Settings</button>
        </div>
        <p className="text-[9px] font-semibold text-muted uppercase tracking-[0.4em]">Cognitive Twin • Your Mind, Reflected</p>
      </footer>
    </div>
  );
}
