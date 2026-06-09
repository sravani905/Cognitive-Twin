import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Target, Zap, Shield, Sparkles, GraduationCap, Key, Book, MessageSquare, CheckSquare, Trash2, Layers, Trophy } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { ReportView } from '../components/ReportView';
import { LatentSpaceExplorer } from '../components/LatentSpaceExplorer';
import { BehaviorTracker } from '../components/BehaviorTracker';
import { ResilienceModule } from '../components/ResilienceModule';
import { TrendAnalysis } from '../components/TrendAnalysis';
import { ApiKeySettings } from '../components/ApiKeySettings';
import { PassiveTrackingHub } from '../components/PassiveTrackingHub';
import { cn } from '../lib/utils';
import { tests } from '../constants/tests';
import { CognitiveInsights } from '../types';

interface IntelligenceModuleProps {
  step: string;
  tab: string;
  setTab: (tab: any) => void;
  metrics: any;
  setMetrics: (m: any) => void;
  insights: CognitiveInsights | null;
  sharedReport: any;
  setSharedReport: (r: any) => void;
  trackingEnabled: boolean;
  setTrackingEnabled: (e: boolean) => void;
  history: any[];
  lifestyleLogs: any[];
  setLifestyleLogs: (cb: (prev: any[]) => any[]) => void;
  onStartFresh: () => void;
  onNewAssessment: () => void;
  onLaunchRoadmap: (career: string) => void;
  isGeneratingRoadmap: boolean;
  completedGrowthAreas: string[];
  onToggleGrowthArea: (s: string) => void;
  onShareReport: () => void;
  isSharing: boolean;
  onFetchMarketData: (career: string) => void;
  marketData: any;
  loadingMarketData: any;
  knnMatches: any[];
  onRetakeTest: (index: number) => void;
  setStep: (s: any) => void;
}

export const IntelligenceModule: React.FC<IntelligenceModuleProps> = ({
  step,
  tab,
  setTab,
  metrics,
  setMetrics,
  insights,
  sharedReport,
  setSharedReport,
  trackingEnabled,
  setTrackingEnabled,
  history,
  lifestyleLogs,
  setLifestyleLogs,
  onStartFresh,
  onNewAssessment,
  onLaunchRoadmap,
  isGeneratingRoadmap,
  completedGrowthAreas,
  onToggleGrowthArea,
  onShareReport,
  isSharing,
  onFetchMarketData,
  marketData,
  loadingMarketData,
  knnMatches,
  onRetakeTest,
  setStep,
}) => {
  const chartData = [
    { subject: 'Meta', A: metrics.comprehensiveScore, fullMark: 100 },
    { subject: 'Focus', A: metrics.focusScore, fullMark: 100 },
    { subject: 'Memory', A: metrics.memoryScore, fullMark: 100 },
    { subject: 'Logic', A: metrics.logicScore, fullMark: 100 },
    { subject: 'Risk', A: metrics.riskScore, fullMark: 100 },
    { subject: 'Speed', A: metrics.speedScore, fullMark: 100 },
    { subject: 'Creativity', A: metrics.creativityScore, fullMark: 100 },
    { subject: 'Spatial', A: metrics.spatialScore, fullMark: 100 },
    { subject: 'Verbal', A: metrics.verbalScore, fullMark: 100 },
    { subject: 'Learning', A: metrics.learningStyleScore, fullMark: 100 },
    { subject: 'EQ', A: metrics.eqScore, fullMark: 100 },
    { subject: 'Numerical', A: metrics.numericalScore, fullMark: 100 },
    { subject: 'Abstract', A: metrics.abstractScore, fullMark: 100 },
    { subject: 'Executive', A: metrics.executiveScore, fullMark: 100 },
    { subject: 'Resilience', A: metrics.resilienceScore, fullMark: 100 },
    { subject: 'Aesthetic', A: metrics.aestheticScore, fullMark: 100 },
    { subject: 'Performative', A: metrics.performativeScore, fullMark: 100 },
    { subject: 'Auditory', A: metrics.auditoryScore, fullMark: 100 },
    { subject: 'Narrative', A: metrics.narrativeScore, fullMark: 100 },
  ];

  if (step === 'report' && (insights || sharedReport)) {
    return (
      <motion.div key="report" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <ReportView 
          insights={sharedReport || insights}
          metrics={sharedReport?.metrics || metrics}
          onStartFresh={onStartFresh}
          onNewAssessment={onNewAssessment}
          onBack={() => {
            if (sharedReport) {
              setSharedReport(null);
              window.history.replaceState({}, '', window.location.origin);
            }
            setStep('dashboard');
          }}
          onLaunchRoadmap={onLaunchRoadmap}
          isGeneratingRoadmap={isGeneratingRoadmap}
          completedGrowthAreas={completedGrowthAreas}
          onToggleGrowthArea={onToggleGrowthArea}
          onShare={onShareReport}
          isSharing={isSharing}
          isReadOnly={!!sharedReport}
          onFetchMarketData={onFetchMarketData}
          marketData={marketData}
          loadingMarketData={loadingMarketData}
          knnMatches={knnMatches}
        />
      </motion.div>
    );
  }

  if (step === 'dashboard') {
    return (
      <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16 py-12 px-6">
        <div className="flex flex-wrap items-center justify-center gap-2 bg-surface/30 p-2 rounded-[2rem] border border-subtle backdrop-blur-xl max-w-2xl mx-auto shadow-sm">
          {[
            { id: 'identity', label: 'My Digital Twin', icon: User },
            { id: 'trajectory', label: 'Career Future', icon: Target },
            { id: 'performance', label: 'Brain Lab', icon: Zap },
            { id: 'resilience', label: 'Resilience', icon: Shield },
            { id: 'enhancement', label: 'Neural Growth', icon: Sparkles },
            { id: 'learning', label: 'Study Architect', icon: GraduationCap },
            { id: 'system', label: 'System Access', icon: Key }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={cn(
                "flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3 rounded-full md:rounded-2xl text-[8px] md:text-[10px] uppercase font-bold tracking-widest transition-all shrink-0",
                tab === item.id ? "bg-primary text-main shadow-lg" : "text-muted hover:text-primary hover:bg-surface/50"
              )}
            >
              <item.icon className="w-3.5 h-3.5 md:w-4 md:h-4" /> {item.label}
            </button>
          ))}
        </div>

        {tab === 'identity' && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8 space-y-8">
                <LatentSpaceExplorer userMetrics={metrics} />
                <BehaviorTracker isEnabled={true} onToggle={() => {}} onMetricsUpdate={() => {}} />
              </div>
              <div className="lg:col-span-4 space-y-8">
                <div className="p-8 border border-white/5 bg-surface/30 rounded-[3rem] backdrop-blur-xl">
                  <span className="micro-label text-accent-blue mb-4 block">Primary Personality Type</span>
                  <h3 className="text-3xl font-serif italic text-primary mb-6">{insights?.archetype?.title}</h3>
                  <p className="text-xs text-secondary leading-relaxed opacity-80">{insights?.archetype?.description}</p>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                      <PolarGrid stroke="#ffffff10" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff40', fontSize: 8 }} />
                      <Radar name="Neural Profile" dataKey="A" stroke="#00AEEF" fill="#00AEEF" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/5">
              {[
                { label: "Memory Recall", val: "90% Accuracy", icon: Book },
                { label: "Quick Thinking", val: "Fast Response", icon: Zap },
                { label: "Multitasking", val: "Efficient", icon: Layers },
                { label: "Communication", val: "Above Average", icon: MessageSquare },
                { label: "Under Pressure", val: "Calm & Stable", icon: Shield },
                { label: "Distraction Level", val: "Well Controlled", icon: CheckSquare }
              ].map((trait, i) => (
                <div key={i} className="flex gap-4 items-center group">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-accent-blue/20 transition-colors">
                    <trait.icon className="w-5 h-5 text-accent-blue" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase tracking-wider text-muted font-bold">{trait.label}</p>
                    <p className="text-xs text-white font-medium">{trait.val}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-8 pt-12">
              <button onClick={() => setStep('report')} className="btn-primary">View Full Profile</button>
              <button onClick={onNewAssessment} className="btn-secondary uppercase tracking-[0.2em]">New Assessment</button>
              <button onClick={onStartFresh} className="p-2 text-muted hover:text-red-400 transition-colors" title="Start Over">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {tab === 'resilience' && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
            <ResilienceModule profile={{ ...metrics, insights }} onUpdateProfile={setMetrics} />
          </motion.div>
        )}

        {tab === 'performance' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
            <TrendAnalysis 
              history={history.length > 0 ? history : [metrics]} 
              lifestyleLogs={lifestyleLogs}
              onAddLog={(log) => setLifestyleLogs(prev => [...prev, log])}
            />
            <div className="pt-16 border-t border-white/5">
              <h2 className="text-2xl font-medium tracking-tight mb-8">Active Benchmarking</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tests.map((t, i) => (
                  <div key={t.id} className="p-8 border border-white/5 bg-surface/30 rounded-[2.5rem] backdrop-blur-xl group hover:border-white/10 transition-all">
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3 rounded-2xl bg-white/5"><t.icon className="w-5 h-5 text-slate-500 group-hover:text-primary transition-colors" /></div>
                      <span className="text-[10px] font-mono text-slate-500">{metrics[t.key] || 0}%</span>
                    </div>
                    <h3 className="text-lg font-medium mb-2">{t.label}</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-6">Last Synced: {metrics.timestamp ? new Date(metrics.timestamp).toLocaleDateString() : 'Never'}</p>
                    <button onClick={() => onRetakeTest(i)} className="w-full py-3 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white text-black transition-all bg-white/90">
                      Re-calibrate Link
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'system' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            <ApiKeySettings />
          </motion.div>
        )}
      </motion.div>
    );
  }

  return null;
};
