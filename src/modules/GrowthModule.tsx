import React from 'react';
import { motion } from 'motion/react';
import { LibraryView } from '../components/LibraryView';
import { RoadmapDashboard } from '../components/RoadmapDashboard';
import { ReportView } from '../components/ReportView';
import { StudyPlanner } from '../components/StudyPlanner';
import { EnhancementModule } from '../components/EnhancementModule';
import { StudyPlanGenerator } from '../components/StudyPlanGenerator';
import { CognitiveInsights } from '../types';

interface GrowthModuleProps {
  step: string;
  tab: string;
  metrics: any;
  insights: CognitiveInsights | null;
  onBackToDashboard: () => void;
  onStartFresh: () => void;
  onNewAssessment: () => void;
  onSelectLibraryProfile: (m: any, i: any) => void;
  selectedRoadmap: any;
  completedRoadmapTasks: string[];
  onToggleRoadmapTask: (taskId: string) => void;
  onLaunchRoadmap: (career: string) => void;
  marketData: any;
  loadingMarketData: any;
  onFetchMarketData: (career: string) => void;
  completedGrowthAreas: string[];
  onToggleGrowthArea: (s: string) => void;
  onShareReport: () => void;
  isSharing: boolean;
  knnMatches: any[];
  roadmapProgress: any;
}

export const GrowthModule: React.FC<GrowthModuleProps> = ({
  step,
  tab,
  metrics,
  insights,
  onBackToDashboard,
  onStartFresh,
  onNewAssessment,
  onSelectLibraryProfile,
  selectedRoadmap,
  completedRoadmapTasks,
  onToggleRoadmapTask,
  onLaunchRoadmap,
  marketData,
  loadingMarketData,
  onFetchMarketData,
  completedGrowthAreas,
  onToggleGrowthArea,
  onShareReport,
  isSharing,
  knnMatches,
  roadmapProgress,
}) => {
  if (step === 'library') {
    return (
      <motion.div key="library" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
        <LibraryView 
          onBack={onBackToDashboard}
          onStartFresh={onStartFresh}
          onNewAssessment={onNewAssessment}
          onSelect={onSelectLibraryProfile}
        />
      </motion.div>
    );
  }

  if (step === 'roadmap' && selectedRoadmap) {
    return (
      <motion.div key="roadmap" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
        <RoadmapDashboard 
          roadmap={selectedRoadmap}
          onBack={onBackToDashboard}
          onStartFresh={onStartFresh}
          onNewAssessment={onNewAssessment}
          completedTasks={completedRoadmapTasks}
          onToggleTask={onToggleRoadmapTask}
        />
      </motion.div>
    );
  }

  if (step === 'dashboard') {
    if (tab === 'trajectory') {
      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
          <ReportView 
            insights={insights!} 
            metrics={metrics}
            onLaunchRoadmap={onLaunchRoadmap}
            marketData={marketData}
            loadingMarketData={loadingMarketData}
            onFetchMarketData={onFetchMarketData}
            onStartFresh={onStartFresh}
            onNewAssessment={onNewAssessment}
            onBack={onBackToDashboard}
            isGeneratingRoadmap={false}
            completedGrowthAreas={completedGrowthAreas}
            onToggleGrowthArea={onToggleGrowthArea}
            onShare={onShareReport}
            isSharing={isSharing}
            knnMatches={knnMatches}
            roadmapProgress={roadmapProgress}
          />
          <div className="pt-16 border-t border-white/5">
            <h3 className="micro-label mb-8">AI-Powered Skill Architect</h3>
            <StudyPlanner profile={{ metrics, insights, field: metrics.field }} />
          </div>
        </motion.div>
      );
    }

    if (tab === 'enhancement') {
      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <EnhancementModule metrics={metrics} />
        </motion.div>
      );
    }

    if (tab === 'learning') {
      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <StudyPlanGenerator profile={{ metrics, insights }} />
        </motion.div>
      );
    }
  }

  return null;
};
