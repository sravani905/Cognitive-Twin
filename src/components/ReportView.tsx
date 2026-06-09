import React, { useState, useEffect, useRef, useMemo, Fragment } from 'react';
import { motion } from 'motion/react';
import { RefreshCw, Zap, Activity, Share2, FileText, Check, Download, Globe, TrendingUp, ArrowLeft } from 'lucide-react';
import { MeshBrain } from './Branding';
import { TechnicalCard } from './GlassCard';
import { cn } from '../lib/utils';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { DEFAULT_INSIGHTS, DEFAULT_MARKET } from '../services/geminiService';

export const ReportView = ({ 
  insights, 
  metrics,
  onStartFresh, 
  onNewAssessment,
  onBack, 
  onBackToLanding,
  onLaunchRoadmap, 
  isGeneratingRoadmap,
  completedGrowthAreas,
  onToggleGrowthArea,
  onShare,
  isSharing,
  isReadOnly,
  onFetchMarketData,
  marketData = {},
  loadingMarketData = {},
  knnMatches = [],
  roadmapProgress = {}
}: { 
  insights: any, 
  metrics: any, 
  onStartFresh: () => void, 
  onNewAssessment: () => void,
  onBack: () => void, 
  onBackToLanding?: () => void,
  onLaunchRoadmap: (title: string) => void, 
  isGeneratingRoadmap: boolean,
  completedGrowthAreas: string[],
  onToggleGrowthArea: (skill: string) => void,
  onShare?: () => void,
  isSharing?: boolean,
  isReadOnly?: boolean,
  onFetchMarketData?: (title: string) => void,
  marketData?: Record<string, any>,
  loadingMarketData?: Record<string, boolean>,
  knnMatches?: any[],
  roadmapProgress?: Record<string, number>
}) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    try {
      const element = reportRef.current;
      // Scroll to top to avoid alignment issues in html2canvas
      window.scrollTo(0, 0);
      
      const canvas = await html2canvas(element, {
        scale: 1.5, // Reduced from 2 to avoid memory crashes on high-res displays
        useCORS: true,
        backgroundColor: '#050505',
        logging: false,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.85); // Use JPEG for smaller size/less memory
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      // If report is too long, split into pages or scale down
      // For now, let's just ensure we don't divide by zero
      if (imgProps.width > 0) {
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`CognitiveTwin_Report_${new Date().getTime()}.pdf`);
      } else {
        throw new Error("Invalid image dimensions");
      }
    } catch (e) {
      console.error("PDF Export failed", e);
      alert("PDF Export failed. The report might be too complex for local rendering. Try taking a screenshot instead.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div ref={reportRef} className="max-w-5xl mx-auto space-y-16 md:space-y-24 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-primary/5 pb-12 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <p className="micro-label">Technical Analysis Report {isReadOnly && "• Shared Access"}</p>
            {metrics?.name && (
              <span className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded text-[8px] font-bold text-primary uppercase tracking-widest">
                Subject: {metrics.name}
              </span>
            )}
            {insights?.isStandard && (
              <span className="px-2 py-0.5 bg-accent-blue/10 border border-accent-blue/30 rounded text-[8px] font-bold text-accent-blue uppercase tracking-widest animate-pulse">
                Standard Intelligence Mode
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif italic text-primary tracking-tighter">Cognitive Twin Summary</h1>
        </div>
        <div className="flex flex-wrap gap-4 print:hidden">
          {!isReadOnly && onShare && (
            <button 
              onClick={onShare}
              disabled={isSharing}
              className="btn-secondary flex items-center gap-2"
            >
              {isSharing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
              Share Insights
            </button>
          )}
          <button 
            onClick={handleExportPDF}
            disabled={isExporting}
            className="btn-secondary flex items-center gap-2"
          >
            {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Export PDF
          </button>
          {onBackToLanding && (
            <button 
              onClick={onBackToLanding}
              className="btn-secondary flex items-center gap-2 text-[#5c4ce1] hover:text-[#4a3bc3] border-[#5c4ce1]/20 bg-[#5c4ce1]/5"
            >
              <ArrowLeft className="w-4 h-4" />
              Landing Page
            </button>
          )}
          <button 
            onClick={onBack}
            className="btn-secondary"
          >
            {isReadOnly ? "Exit View" : "Dashboard"}
          </button>
          {!isReadOnly && (
            <button 
              onClick={onNewAssessment}
              className="btn-primary"
            >
              New Assessment
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-primary/5 border border-primary/5">
        <div className="p-6 md:p-12 space-y-10 bg-main">
          <h3 className="micro-label">Cognitive Synthesis</h3>
          <p className="text-2xl md:text-3xl text-primary font-serif italic leading-tight">
            "{insights?.summary || DEFAULT_INSIGHTS.summary}"
          </p>
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-primary/5">
            <div className="space-y-2">
              <p className="micro-label">Archetype</p>
              <p className="text-primary font-medium text-sm md:text-base">
                {insights?.archetype?.title || DEFAULT_INSIGHTS.archetype.title}
              </p>
            </div>
            <div className="space-y-2">
              <p className="micro-label">Primary Learning</p>
              <p className="text-primary font-medium text-sm md:text-base">
                {insights?.studyMethod || DEFAULT_INSIGHTS.studyMethod}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-12 space-y-10 bg-main">
          <h3 className="micro-label">Strategic Growth Areas</h3>
          <div className="space-y-10">
            {(insights?.growthAreas || DEFAULT_INSIGHTS.growthAreas).map((area: any, i: number) => {
              const isCompleted = completedGrowthAreas.includes(area.skill);
              return (
                <div key={i} className="group space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => !isReadOnly && onToggleGrowthArea(area.skill)}
                        disabled={isReadOnly}
                        className={cn(
                          "w-5 h-5 border transition-all flex items-center justify-center",
                          isCompleted ? "bg-accent-blue border-accent-blue" : "border-primary/20",
                          !isReadOnly && !isCompleted && "hover:border-accent-blue/50",
                          isReadOnly && "cursor-default"
                        )}
                      >
                        {isCompleted && <div className="w-2.5 h-2.5 bg-main" />}
                      </button>
                      <p className={cn(
                        "text-xs font-mono uppercase tracking-widest transition-all",
                        isCompleted ? "text-muted line-through" : "text-primary"
                      )}>
                        {area.skill}
                      </p>
                    </div>
                    {area.resourceLink && (
                      <a 
                        href={area.resourceLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] text-accent-blue uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                      >
                        Learn More →
                      </a>
                    )}
                  </div>
                  <p className={cn(
                    "text-sm leading-relaxed italic transition-all",
                    isCompleted ? "text-muted/50" : "text-secondary"
                  )}>
                    "{area.strategy}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-12">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border border-primary/10 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-muted" />
          </div>
          <h2 className="text-2xl md:text-3xl font-serif italic text-primary">KNN Algorithm Analysis</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <p className="text-sm text-secondary leading-relaxed font-light italic px-2">
              Our K-Nearest Neighbors (KNN) implementation calculates the mathematical distance between your 18D cognitive vector and thousands of professional benchmarks in Euclidean space.
            </p>
            <div className="space-y-8 pt-6 px-2">
              {knnMatches.map((match: any, idx: number) => (
                <div key={idx} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] uppercase tracking-widest text-primary font-bold">{match.title}</span>
                    <span className="text-xs font-mono text-accent-blue">{match.affinityScore}% Match</span>
                  </div>
                  <div className="h-1 bg-primary/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${match.affinityScore}%` }}
                      transition={{ duration: 1, delay: idx * 0.2 }}
                      className="h-full bg-accent-blue shadow-[0_0_8px_rgba(0,174,239,0.4)]"
                    />
                  </div>
                  <p className="text-[10px] text-muted italic leading-tight">"{match.description}"</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 border border-primary/5 bg-primary/[0.01] p-6 md:p-12 relative overflow-hidden flex items-center justify-center min-h-[400px]">
             {/* Simple D3-style SVG visualization showing vector proximity */}
             <div className="absolute inset-0 opacity-20 pointer-events-none">
               <svg width="100%" height="100%" className="text-primary/10">
                 <pattern id="grid-knn" width="40" height="40" patternUnits="userSpaceOnUse">
                   <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                 </pattern>
                 <rect width="100%" height="100%" fill="url(#grid-knn)" />
               </svg>
             </div>
             
             <div className="relative z-10 text-center space-y-8 max-w-lg">
                <div className="flex justify-center">
                  <div className="relative">
                    <MeshBrain className="w-24 h-24 animate-pulse" />
                    <div className="absolute -inset-4 border border-accent-blue/20 rounded-full animate-spin-slow" style={{ animationDuration: '10s' }} />
                    <div className="absolute -inset-8 border border-primary/10 rounded-full animate-spin-slow" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="micro-label text-accent-blue tracking-[0.3em]">Euclidean Vector Proximity</h4>
                  <p className="text-xl text-primary font-serif italic">
                    The algorithm confirms high alignment {knnMatches && knnMatches[0] ? (
                      <>with <span className="text-primary font-medium underline decoration-accent-blue/30">{knnMatches[0].title}</span> based on your extreme logic and abstract reasoning nodes.</>
                    ) : (
                      <>with your cognitive profile based on current metrics.</>
                    )}
                  </p>
                </div>
                <div className="flex justify-center gap-12 pt-4">
                   <div className="text-center">
                     <p className="text-2xl font-mono text-primary">{knnMatches && knnMatches[0] && typeof knnMatches[0].distance === 'number' ? knnMatches[0].distance.toFixed(1) : "0.0"}</p>
                     <p className="text-[8px] uppercase tracking-widest text-muted">Vector Distance</p>
                   </div>
                   <div className="text-center">
                     <p className="text-2xl font-mono text-primary">18</p>
                     <p className="text-[8px] uppercase tracking-widest text-muted">Dimensions</p>
                   </div>
                   <div className="text-center">
                     <p className="text-2xl font-mono text-primary">{knnMatches && knnMatches[0] && typeof knnMatches[0].affinityScore === 'number' ? (knnMatches[0].affinityScore/100).toFixed(2) : "0.00"}</p>
                     <p className="text-[8px] uppercase tracking-widest text-muted">Cosine Sim (Est)</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="space-y-16">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border border-primary/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-muted" />
          </div>
          <h2 className="text-3xl font-serif italic text-primary">Career Trajectories</h2>
        </div>

        <div className="grid grid-cols-1 gap-px bg-primary/5 border border-primary/5">
          {(insights?.careerGuide && insights.careerGuide.length > 0 ? insights.careerGuide : DEFAULT_INSIGHTS.careerGuide).map((career: any, i: number) => (
            <div key={i} className="p-6 md:p-12 space-y-10 bg-main hover:bg-primary/[0.01] transition-colors">
              <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                <div className="space-y-4">
                  <span className="micro-label text-emerald-500/60">Trajectory 0{i+1}</span>
                  <h4 className="text-3xl md:text-4xl font-serif italic text-primary">{career?.title}</h4>
                </div>
                
                {roadmapProgress[career?.title || ''] !== undefined && roadmapProgress[career?.title || ''] > 0 && (
                  <div className="w-full md:w-48 space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[9px] uppercase tracking-widest text-accent-blue font-bold">Path Progress</span>
                      <span className="text-xs font-mono text-primary">{roadmapProgress[career?.title || '']}%</span>
                    </div>
                    <div className="h-1 w-full bg-primary/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${roadmapProgress[career?.title || '']}%` }}
                        className="h-full bg-accent-blue shadow-[0_0_8px_rgba(0,174,239,0.3)]"
                      />
                    </div>
                  </div>
                )}

                  {!isReadOnly && (
                    <div className="flex flex-wrap gap-4">
                      <button 
                        onClick={() => onFetchMarketData?.(career?.title || "")}
                        disabled={career?.title ? loadingMarketData[career.title] : false}
                        className="btn-secondary flex items-center gap-2"
                      >
                        {career?.title && loadingMarketData[career.title] ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                        <span className="hidden sm:inline">Market Analysis</span>
                        <span className="sm:hidden">Market</span>
                      </button>
                      <button 
                        onClick={() => career?.title && onLaunchRoadmap(career.title)}
                        disabled={isGeneratingRoadmap}
                        className="btn-primary"
                      >
                        {isGeneratingRoadmap ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                        Launch Path
                      </button>
                    </div>
                  )}
              </div>
              
              <p className="text-base md:text-lg text-secondary font-light italic leading-relaxed max-w-3xl">"{career?.why}"</p>

              {career?.title && marketData[career.title] && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 md:p-8 border border-accent-blue/20 bg-accent-blue/[0.02] technical-grid">
                  <div className="space-y-2">
                    <p className="micro-label text-accent-blue">Current Demand</p>
                    <p className="text-xl md:text-2xl font-serif italic text-primary uppercase tracking-tighter">
                      {marketData[career.title]?.marketDemand || "Standard"}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <p className="micro-label text-accent-blue">Emerging Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {(marketData[career.title]?.emergingSkills || ["Core Analytical Logic", "Cross-Disciplinary Synthesis"]).map((skill: string, idx: number) => (
                        <span key={idx} className="text-[10px] font-mono text-primary bg-primary/5 px-2 py-1 border border-primary/10">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="micro-label text-accent-blue">Top Certification</p>
                    <p className="text-[10px] md:text-xs text-secondary font-medium uppercase leading-relaxed">
                      {marketData[career.title]?.topCertification || "Standard Professional Context"}
                    </p>
                    <a 
                      href={marketData[career.title]?.resourceLink || "https://www.google.com"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-[10px] text-accent-blue border-b border-accent-blue/30 hover:border-accent-blue transition-all uppercase tracking-widest mt-2"
                    >
                      Official Resource →
                    </a>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pt-12 border-t border-primary/5">
                {(career.detailedRoadmap || []).map((stage: any, si: number) => (
                  <div key={si} className="space-y-4">
                    <p className="micro-label">Phase 0{si+1}</p>
                    <p className="text-[10px] md:text-xs text-primary font-medium uppercase tracking-wider line-clamp-1">{stage.stage}</p>
                    <div className="flex flex-wrap gap-2">
                      {(stage.tasks || []).slice(0, 1).map((t: string, ti: number) => (
                        <span key={ti} className="text-[9px] font-mono text-muted bg-primary/5 px-2 py-1 truncate max-w-full">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-8 pt-12">
        <p className="micro-label italic text-muted">Neural reflection timestamp: {new Date().toLocaleDateString()}</p>
        {isReadOnly && (
          <p className="text-[10px] text-accent-blue/60 uppercase tracking-[0.2em] animate-pulse">Read-Only Shared Research</p>
        )}
      </div>
    </div>
  );
};
