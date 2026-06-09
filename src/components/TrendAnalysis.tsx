import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Activity, Moon, Utensils, Zap, Plus, X, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';

export interface LogEntry {
  timestamp: number;
  sleep: number; // hours
  exercise: 'none' | 'low' | 'moderate' | 'high';
  diet: 'unhealthy' | 'neutral' | 'clean';
  notes: string;
}

export const TrendAnalysis = ({ history, lifestyleLogs, onAddLog }: { 
  history: any[], 
  lifestyleLogs: LogEntry[],
  onAddLog: (log: LogEntry) => void
}) => {
  const [showLogModal, setShowLogModal] = useState(false);
  const [newLog, setNewLog] = useState<Omit<LogEntry, 'timestamp'>>({
    sleep: 8,
    exercise: 'moderate',
    diet: 'neutral',
    notes: ''
  });

  const chartData = history.slice(-10).map((h, i) => ({
    name: new Date(h.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    focus: h.focusScore,
    memory: h.memoryScore,
    logic: h.logicScore,
    resilience: h.resilienceScore || 50
  }));

  const handleSaveLog = () => {
    onAddLog({ ...newLog, timestamp: Date.now() });
    setShowLogModal(false);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-2xl font-medium tracking-tight">Temporal Trends</h2>
            <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">Historical Cognitive Trajectory</p>
          </div>
        </div>
        <button 
          onClick={() => setShowLogModal(true)}
          className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Log Lifestyle Factor
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 p-8 rounded-[3rem] bg-surface/50 border border-white/5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-8">Performance Spectrum</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#64748b' }} 
                />
                <YAxis 
                  domain={[0, 100]} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#64748b' }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="focus" stroke="#3b82f6" fillOpacity={1} fill="url(#colorFocus)" strokeWidth={2} />
                <Area type="monotone" dataKey="memory" stroke="#10b981" fillOpacity={0} strokeWidth={2} />
                <Area type="monotone" dataKey="logic" stroke="#8b5cf6" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="p-8 rounded-[3rem] bg-surface/50 border border-white/5 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Biological Anchors</h3>
            <div className="space-y-4">
              {lifestyleLogs.slice(-3).reverse().map((log, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[8px] font-mono text-slate-500 uppercase">
                      {new Date(log.timestamp).toLocaleDateString()}
                    </span>
                    <div className="flex gap-1.5">
                      <div className="p-1 rounded-md bg-blue-500/10"><Moon className="w-2.5 h-2.5 text-blue-500" /></div>
                      <div className="p-1 rounded-md bg-emerald-500/10"><Activity className="w-2.5 h-2.5 text-emerald-500" /></div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed italic">"{log.notes || 'Baseline optimized.'}"</p>
                  <div className="flex gap-4 pt-1">
                    <div className="flex flex-col">
                      <span className="text-[8px] text-slate-500 uppercase tracking-tighter">Sleep</span>
                      <span className="text-[10px] text-primary">{log.sleep}h</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-slate-500 uppercase tracking-tighter">Activity</span>
                      <span className="text-[10px] text-primary capitalize">{log.exercise}</span>
                    </div>
                  </div>
                </div>
              ))}
              {lifestyleLogs.length === 0 && (
                <div className="py-8 text-center text-slate-600 text-[10px] uppercase tracking-widest leading-relaxed">
                  No correlation data available.<br/>Initialize logging.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowLogModal(false)} 
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-md bg-slate-900 border border-white/10 p-8 rounded-[3rem] shadow-2xl space-y-6"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-medium tracking-tight">Lifestyle Factor Log</h3>
              <button onClick={() => setShowLogModal(false)}><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Sleep Duration (Hours)</label>
                <input 
                  type="number" step="0.5" value={newLog.sleep}
                  onChange={(e) => setNewLog({ ...newLog, sleep: parseFloat(e.target.value) })}
                  className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Exercise Intensity</label>
                <div className="flex gap-2">
                  {['none', 'low', 'moderate', 'high'].map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => setNewLog({ ...newLog, exercise: lvl as any })}
                      className={cn(
                        "flex-1 py-2 text-[10px] font-bold rounded-lg border uppercase tracking-tighter transition-all",
                        newLog.exercise === lvl ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-500" : "bg-white/5 border-white/5 text-slate-500"
                      )}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Cognitive Load Notes</label>
                <textarea 
                  value={newLog.notes}
                  onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
                  placeholder="e.g. Deep sleep, but caffeine intake high..."
                  className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none text-xs h-24 resize-none"
                />
              </div>
              <button 
                onClick={handleSaveLog}
                className="w-full py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest"
              >
                Sync with Twin
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
