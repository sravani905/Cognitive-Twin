import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';
import { getProjectedBenchmarks, projectTo2D } from '../services/knnService';
import { TechnicalCard } from './GlassCard';
import { Zap, Brain, Target, Globe, Microscope, Activity } from 'lucide-react';

export const LatentSpaceExplorer = ({ userMetrics }: { userMetrics: any }) => {
  if (!userMetrics) return null;

  const data = useMemo(() => {
    const benchmarks = getProjectedBenchmarks();
    const userArr = [
      userMetrics.focusScore, userMetrics.memoryScore, userMetrics.logicScore, 
      userMetrics.riskScore, userMetrics.speedScore, userMetrics.creativityScore, 
      userMetrics.spatialScore, userMetrics.verbalScore, userMetrics.learningStyleScore, 
      userMetrics.eqScore, userMetrics.numericalScore, userMetrics.abstractScore, 
      userMetrics.executiveScore, userMetrics.resilienceScore, userMetrics.aestheticScore, 
      userMetrics.performativeScore, userMetrics.auditoryScore, userMetrics.narrativeScore
    ].map(v => v || 50);
    
    const userProjection = projectTo2D(userArr);

    return [
      ...benchmarks.map(b => ({
        x: b.projection.x,
        y: b.projection.y,
        name: b.title,
        type: 'benchmark',
        category: b.category
      })),
      {
        x: userProjection.x,
        y: userProjection.y,
        name: 'YOU (Cognitive Twin)',
        type: 'user',
        category: 'Self'
      }
    ];
  }, [userMetrics.timestamp, userMetrics.focusScore, userMetrics.logicScore]); // Only recompute on significant changes

  const benchmarksList = useMemo(() => {
    return getProjectedBenchmarks().slice(0, 3);
  }, []);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      return (
        <div className="bg-surface/90 border border-white/10 p-4 backdrop-blur-xl shadow-2xl">
          <p className="text-[10px] uppercase tracking-widest text-muted mb-1">{point.category}</p>
          <p className="text-sm font-bold text-primary">{point.name}</p>
          <div className="mt-2 flex gap-4 text-[8px] font-mono text-secondary">
             <span>Component X: {point.x.toFixed(1)}</span>
             <span>Component Y: {point.y.toFixed(1)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
         <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-blue/10 border border-accent-blue/20 rounded-full text-accent-blue">
            <Globe className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-widest">How You Compare</span>
         </div>
         <h2 className="text-3xl md:text-5xl font-serif italic text-primary tracking-tighter">Your Cognitive Landscape</h2>
         <p className="text-secondary micro-label max-w-xl mx-auto leading-relaxed">
           This visualization places your "Digital Twin" in the professional world. 
           The closer you are to a benchmark, the more similar your cognitive strengths are.
         </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        <div className="lg:col-span-8 h-[500px] bg-black/40 border border-white/10 rounded-[3rem] p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
               <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--color-primary)_0%,_transparent_70%)] opacity-20" />
            </div>
            
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                   type="number" 
                   dataKey="x" 
                   name="Analytical vs Creative" 
                   hide
                   domain={['auto', 'auto']}
                />
                <YAxis 
                   type="number" 
                   dataKey="y" 
                   name="Execution vs Resonance" 
                   hide
                   domain={['auto', 'auto']}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                <Scatter data={data}>
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.type === 'user' ? '#00AEEF' : '#ffffff20'}
                      stroke={entry.type === 'user' ? '#fff' : 'none'}
                      strokeWidth={entry.type === 'user' ? 2 : 0}
                    />
                  ))}
                  <LabelList 
                    dataKey="name" 
                    position="top" 
                    offset={10}
                    content={(props: any) => {
                       const { x, y, value, payload } = props;
                       if (!payload || (payload.type !== 'user' && !['High-Frequency Trader', 'Quantum Algorithm Researcher', 'Cinematic Narrative Designer'].includes(value))) return null;
                       return (
                         <text x={x} y={y - 15} fill={payload?.type === 'user' ? '#fff' : '#666'} fontSize={8} textAnchor="middle" className="uppercase font-bold tracking-widest font-mono">
                           {value}
                         </text>
                       );
                    }}
                  />
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>

            {/* Axis Legends */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex justify-between w-[80%] text-[8px] font-bold text-muted uppercase tracking-[0.3em] font-mono">
               <span>Creative & Abstract</span>
               <span>Analytical & Logic</span>
            </div>
            <div className="absolute left-8 top-1/2 -translate-y-1/2 -rotate-90 flex justify-between w-[50%] text-[8px] font-bold text-muted uppercase tracking-[0.3em] font-mono origin-left">
               <span>Intuitive Flow</span>
               <span>Structured Execution</span>
            </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <TechnicalCard className="bg-white/5 border-white/10 p-8 space-y-6">
              <div className="flex items-center gap-3">
                 <Activity className="w-5 h-5 text-accent-blue" />
                 <h4 className="micro-label">Similar Profiles</h4>
              </div>
              <div className="space-y-4">
                 {benchmarksList.map((b, i) => (
                   <div key={i} className="flex justify-between items-center p-3 border border-white/5 bg-white/[0.02] rounded-xl">
                      <span className="text-[10px] font-bold text-primary">{b.title}</span>
                      <span className="text-[10px] font-mono text-muted">High Match</span>
                   </div>
                 ))}
              </div>
           </TechnicalCard>

           <div className="p-6 border border-accent-purple/20 bg-accent-purple/[0.02] rounded-2xl space-y-4">
              <div className="flex items-center gap-2">
                 <Microscope className="w-4 h-4 text-accent-purple" />
                 <h4 className="micro-label text-accent-purple">How this works</h4>
              </div>
              <p className="text-[10px] text-secondary leading-relaxed opacity-60 font-mono">
                We compare your test data across 18 cognitive points against high-performers in different fields to show where your natural strengths overlap with success.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};
