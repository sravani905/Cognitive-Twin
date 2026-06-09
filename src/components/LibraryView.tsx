import React, { useState, useEffect, useCallback, useMemo, Fragment } from 'react';
import { RefreshCw, Clock, ChevronRight, X, GitCompare, ArrowUpRight, ArrowDownRight, Minus, Sparkles, Check, Info } from 'lucide-react';
import { TechnicalCard } from './GlassCard';
import { generateComparison } from '../services/geminiService';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const LibraryView = ({ onSelect, onBack, onStartFresh, onNewAssessment }: { onSelect: (metrics: any, insights: any) => void, onBack: () => void, onStartFresh: () => void, onNewAssessment: () => void }) => {
  const [user] = useState(() => {
    const saved = localStorage.getItem('COGNITIVE_TWIN_USER');
    return saved ? JSON.parse(saved) : null;
  });
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [comparison, setComparison] = useState<any>(null);
  const [isComparing, setIsComparing] = useState(false);

  useEffect(() => {
    if (user) {
      const history = JSON.parse(localStorage.getItem(`history_${user.uid}`) || '[]');
      const data = history.map((h: any, i: number) => ({ id: h.id || `h_${i}_${h.timestamp}`, ...h }))
        .sort((a: any, b: any) => b.timestamp - a.timestamp);
      setResults(data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user]);

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedForCompare(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const getSortedSelected = () => {
    if (selectedForCompare.length !== 2) return null;
    const res1 = results.find(r => r.id === selectedForCompare[0]);
    const res2 = results.find(r => r.id === selectedForCompare[1]);
    if (!res1 || !res2) return null;
    return res1.timestamp < res2.timestamp ? { base: res1, current: res2 } : { base: res2, current: res1 };
  };

  const handleCompare = async () => {
    const sorted = getSortedSelected();
    if (!sorted) return;
    
    setIsComparing(true);
    setComparison(null);
    try {
      const result = await generateComparison(sorted.base, sorted.current);
      setComparison(result);
    } catch (err) {
      console.error("Comparison error:", err);
    } finally {
      setIsComparing(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    try {
      const updatedResults = results.filter(r => r.id !== id);
      setResults(updatedResults);
      localStorage.setItem(`history_${user.uid}`, JSON.stringify(updatedResults));
      setSelectedForCompare(prev => prev.filter(i => i !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const sortedSelected = getSortedSelected();

  return (
    <div className="space-y-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-12 gap-8">
        <div className="space-y-4">
          <p className="micro-label">Research Archives</p>
          <h1 className="text-5xl md:text-7xl font-serif italic text-primary tracking-tighter">Neural Library</h1>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="hidden lg:flex items-center gap-3 px-4 py-2 border border-white/5 bg-white/[0.02] rounded-full mr-4">
            <Info className="w-3 h-3 text-muted" />
            <span className="text-[9px] uppercase tracking-wider text-muted">
              {selectedForCompare.length === 0 ? "Select 2 records to compare" : 
               selectedForCompare.length === 1 ? "Select 1 more record" : 
               "Ready for analysis"}
            </span>
          </div>

          {selectedForCompare.length === 2 && (
            <button 
              onClick={handleCompare}
              disabled={isComparing}
              className="px-6 py-3 bg-accent-blue text-white rounded-xl font-bold flex items-center gap-3 hover:bg-accent-blue/80 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(0,174,239,0.2)]"
            >
              {isComparing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <GitCompare className="w-4 h-4" />}
              {isComparing ? "Analyzing Drift..." : "Architect Comparison"}
            </button>
          )}
          <button 
            onClick={onBack}
            className="btn-secondary"
          >
            Dashboard
          </button>
          <button 
            onClick={onNewAssessment}
            className="btn-primary"
          >
            New Assessment
          </button>
        </div>
      </div>

      <AnimatePresence>
        {comparison && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-[#0A0A0A] border border-accent-blue/30 rounded-[2.5rem] p-8 md:p-16 space-y-16 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Sparkles className="w-64 h-64 text-accent-blue" />
            </div>
            
            <div className="flex justify-between items-start relative z-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-blue/20 border border-accent-blue/30 rounded-full text-accent-blue">
                   <GitCompare className="w-3 h-3" />
                   <span className="text-[10px] font-bold uppercase tracking-widest">Comparative Analysis</span>
                </div>
                <h3 className="text-4xl md:text-6xl font-serif italic text-primary leading-tight mt-4">Evolutionary Drift Analysis</h3>
              </div>
              <button 
                onClick={() => setComparison(null)}
                className="w-12 h-12 border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all text-muted"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 relative z-10">
              <div className="space-y-12">
                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-6">
                  <h4 className="micro-label text-accent-blue font-bold opacity-80 decoration-accent-blue underline-offset-8 underline">Neural Trend Summary</h4>
                  <p className="text-lg md:text-xl text-primary leading-relaxed font-light italic">
                    "{comparison.overallTrend}"
                  </p>
                </div>
                
                <div className="space-y-8">
                  <h4 className="micro-label uppercase tracking-[0.3em]">Quantitative Shift</h4>
                  <div className="space-y-4">
                    {comparison.metricDeltas.map((delta: any, i: number) => (
                      <div key={i} className="flex flex-col gap-4 p-6 border border-white/5 bg-white/[0.01] rounded-2xl group/delta hover:bg-white/[0.03] transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border",
                              delta.symbol === 'up' ? "bg-green-500/10 border-green-500/20 text-green-500" :
                              delta.symbol === 'down' ? "bg-red-500/10 border-red-500/20 text-red-500" :
                              "bg-slate-500/10 border-slate-500/20 text-slate-500"
                            )}>
                              {delta.symbol === 'up' ? <ArrowUpRight className="w-6 h-6" /> : 
                               delta.symbol === 'down' ? <ArrowDownRight className="w-6 h-6" /> : 
                               <Minus className="w-6 h-6" />}
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-sm font-bold text-primary block">{delta.metric}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-muted font-mono">{delta.prevValue}%</span>
                                <ChevronRight className="w-2 h-2 text-muted/30" />
                                <span className="text-[10px] text-primary font-bold font-mono">{delta.currValue}%</span>
                              </div>
                            </div>
                          </div>
                          <span className={cn(
                            "text-[10px] font-mono px-2 py-1 border rounded uppercase",
                            delta.symbol === 'up' ? "text-green-500 border-green-500/30" :
                            delta.symbol === 'down' ? "text-red-500 border-red-500/30" :
                            "text-muted border-white/10"
                          )}>
                            {delta.change}
                          </span>
                        </div>
                        <p className="text-xs text-secondary leading-relaxed opacity-80 pl-16 pr-4 border-l border-white/5 italic">
                          {delta.interpretation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-16">
                <div className="space-y-6">
                  <h4 className="micro-label uppercase tracking-[0.3em]">Qualitative Archetype Evolution</h4>
                  <div className="p-8 border-l-2 border-accent-blue/30 bg-accent-blue/[0.02]">
                    <p className="text-base md:text-lg text-secondary leading-relaxed font-light">
                      {comparison.archetypeEvolution}
                    </p>
                  </div>
                </div>

                <div className="pt-12 border-t border-white/5 space-y-6">
                  <h4 className="micro-label text-accent-purple font-bold tracking-[0.3em]">Neural Protocol Synthesis</h4>
                  <div className="p-10 border border-accent-purple/20 bg-accent-purple/[0.03] rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Sparkles className="w-12 h-12 text-accent-purple" />
                    </div>
                    <p className="text-lg md:text-2xl text-primary font-mono leading-relaxed relative z-10">
                      {comparison.criticalInsight}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="text-center py-32 animate-pulse micro-label">Accessing Research Archives...</div>
      ) : results.length === 0 ? (
        <div className="text-center py-32 text-slate-600 italic font-mono text-xs uppercase tracking-widest">No historical reflections found.</div>
      ) : (
        <div className="space-y-10">
           <div className="flex items-center gap-4 px-6">
             <div className="h-[1px] flex-1 bg-white/5" />
             <span className="micro-label opacity-40 uppercase tracking-[0.5em]">Reflection Chronology</span>
             <div className="h-[1px] flex-1 bg-white/5" />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5">
            {results.map((res) => {
              const isSelected = selectedForCompare.includes(res.id);
              const isBase = sortedSelected?.base?.id === res.id;
              const isCurrent = sortedSelected?.current?.id === res.id;

              return (
                <TechnicalCard 
                  key={res.id} 
                  className={cn(
                    "cursor-pointer hover:bg-white/[0.02] transition-all group relative bg-[#080808]",
                    isSelected ? "border-accent-blue/60 ring-2 ring-accent-blue/10 bg-accent-blue/[0.01]" : ""
                  )}
                  onClick={() => onSelect(res.metrics, res.insights)}
                >
                  <div className="absolute top-8 right-8 flex flex-col items-end gap-3 z-20">
                    <button 
                      onClick={(e) => toggleSelect(res.id, e)}
                      className={cn(
                        "w-8 h-8 rounded-lg border flex items-center justify-center transition-all shadow-xl",
                        isSelected 
                          ? "bg-accent-blue border-accent-blue text-white" 
                          : "bg-surface border-slate-800 hover:border-slate-600 text-transparent"
                      )}
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    {isSelected && (
                      <motion.span 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                          "text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded",
                          isBase ? "bg-slate-700 text-white" : "bg-accent-blue text-white"
                        )}
                      >
                        {isBase ? "Baseline Point" : "Comparison Point"}
                      </motion.span>
                    )}
                    <button 
                      onClick={(e) => handleDelete(res.id, e)}
                      className="text-slate-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-8">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 border border-subtle flex items-center justify-center">
                        <Clock className="w-4 h-4 text-slate-600" />
                      </div>
                      <span className="micro-label">
                        {new Date(res.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-2xl font-serif italic text-primary group-hover:text-accent-blue transition-colors">
                        {res.insights?.archetype?.title || "Neural Reflection"}
                      </h4>
                      <p className="micro-label text-slate-600">
                        Subject Level: {res.metrics?.difficulty || 'Standard'}
                      </p>
                    </div>
                    <div className="pt-8 border-t border-subtle flex justify-between items-center px-2">
                      <div className="flex items-center gap-6">
                        {['focus', 'memory', 'speed'].map((m) => (
                          <div key={m} className="space-y-1">
                            <span className="text-[10px] text-muted block uppercase tracking-tighter">{m.slice(0, 3)}</span>
                            <span className="text-xs font-mono text-primary">{res.metrics?.[m] || 0}%</span>
                          </div>
                        ))}
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-700 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </TechnicalCard>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
