import React, { useState, useEffect, useRef } from 'react';
import { Activity, ShieldAlert, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

export interface BehaviorMetrics {
  typingSpeed: number; // characters per minute
  mouseJitter: number; // 0-100 scale
  interactionFrequency: number; // clicks/movements per minute
  activeTime: number;
}

export const BehaviorTracker = ({ onMetricsUpdate, isEnabled, onToggle }: { 
  onMetricsUpdate: (m: BehaviorMetrics) => void, 
  isEnabled: boolean,
  onToggle: (v: boolean) => void
}) => {
  const [sessionMetrics, setSessionMetrics] = useState<BehaviorMetrics>({
    typingSpeed: 0,
    mouseJitter: 0,
    interactionFrequency: 0,
    activeTime: 0
  });

  const lastPos = useRef({ x: 0, y: 0 });
  const movementBuffer = useRef<number[]>([]);
  const charCount = useRef(0);
  const interactionCount = useRef(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    if (!isEnabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = Math.abs(e.clientX - lastPos.current.x);
      const dy = Math.abs(e.clientY - lastPos.current.y);
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > 5) {
        movementBuffer.current.push(dist);
        if (movementBuffer.current.length > 50) movementBuffer.current.shift();
      }
      
      lastPos.current = { x: e.clientX, y: e.clientY };
      interactionCount.current++;
    };

    const handleKeyDown = () => {
      charCount.current++;
      interactionCount.current++;
    };

    const handleClick = () => {
      interactionCount.current++;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClick);

    const interval = setInterval(() => {
      const elapsedMins = (Date.now() - startTime.current) / 60000;
      if (elapsedMins < 0.01) return;

      // Calculate Jitter (standard deviation of movement distances as a proxy)
      const avg = movementBuffer.current.reduce((a, b) => a + b, 0) / (movementBuffer.current.length || 1);
      const variance = movementBuffer.current.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / (movementBuffer.current.length || 1);
      const jitter = Math.min(100, Math.sqrt(variance) * 2);

      const newMetrics = {
        typingSpeed: Math.round(charCount.current / elapsedMins),
        mouseJitter: Math.round(jitter),
        interactionFrequency: Math.round(interactionCount.current / elapsedMins),
        activeTime: Math.round(elapsedMins * 60)
      };

      setSessionMetrics(newMetrics);
      onMetricsUpdate(newMetrics);
    }, 5000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClick);
      clearInterval(interval);
    };
  }, [isEnabled, onMetricsUpdate]);

  return (
    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isEnabled ? <ShieldCheck className="w-5 h-5 text-emerald-500" /> : <ShieldAlert className="w-5 h-5 text-slate-500" />}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary">Neural Flux Tracking</h3>
            <p className="text-[10px] text-slate-500">Real-time interaction analysis (Privacy Secured)</p>
          </div>
        </div>
        <button 
          onClick={() => onToggle(!isEnabled)}
          className={cn(
            "px-3 py-1 rounded-full text-[10px] font-bold transition-all",
            isEnabled ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-white/5 text-slate-400 border border-white/10"
          )}
        >
          {isEnabled ? 'ACTIVE' : 'OPT-IN'}
        </button>
      </div>

      {isEnabled && (
        <div className="grid grid-cols-3 gap-2 pt-2">
          <MetricBit label="CPM" value={sessionMetrics.typingSpeed} icon={Zap} />
          <MetricBit label="Jitter" value={sessionMetrics.mouseJitter} icon={Activity} />
          <MetricBit label="IFreq" value={sessionMetrics.interactionFrequency} icon={Activity} />
        </div>
      )}
    </div>
  );
};

const MetricBit = ({ label, value, icon: Icon }: any) => (
  <div className="bg-white/[0.02] p-2 rounded-xl border border-white/5">
    <div className="flex items-center gap-1.5 mb-1">
      <Icon className="w-2.5 h-2.5 text-slate-500" />
      <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">{label}</span>
    </div>
    <div className="text-sm font-mono font-medium text-primary">{value}</div>
  </div>
);
