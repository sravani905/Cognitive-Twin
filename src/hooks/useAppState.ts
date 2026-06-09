import { useState, useEffect, useRef } from 'react';
import { CognitiveInsights, Difficulty } from '../types';
import { BehaviorMetrics } from '../components/BehaviorTracker';
import { LogEntry } from '../components/TrendAnalysis';
import { generateCognitiveInsights, getMarketInsights, generateDetailedRoadmap, DEFAULT_INSIGHTS } from '../services/geminiService';
import { findKNearestCareers } from '../services/knnService';
import { tests } from '../constants/tests';

export function useAppState() {
  const [user, setUser] = useState<{ uid: string; email?: string; displayName?: string } | null>(() => {
    try {
      const saved = localStorage.getItem('COGNITIVE_TWIN_USER');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [step, setStep] = useState<'welcome' | 'onboarding' | 'context' | 'testing' | 'analyzing' | 'dashboard' | 'report' | 'library' | 'roadmap'>('welcome');
  const [testIndex, setTestIndex] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>('moderate');
  const [insights, setInsights] = useState<CognitiveInsights | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dashboardTab, setDashboardTab] = useState<'identity' | 'trajectory' | 'performance' | 'resilience' | 'enhancement' | 'learning' | 'system'>('identity');
  
  const [metrics, setMetrics] = useState<any>({
    name: '', gender: 'Other', age: 25, ageRange: '22–30', role: 'Working Professional', field: 'Other',
    learningTime: '1 hour per day', learningStyle: 'Visual learning', 
    comprehensiveScore: 0, focusScore: 0, memoryScore: 0,
    logicScore: 0, riskScore: 0, speedScore: 0, creativityScore: 0, spatialScore: 0, verbalScore: 0,
    learningStyleScore: 0, eqScore: 0, numericalScore: 0, abstractScore: 0, executiveScore: 0,
    resilienceScore: 0, aestheticScore: 0, performativeScore: 0, auditoryScore: 0, narrativeScore: 0,
    timestamp: Date.now()
  });

  const [history, setHistory] = useState<any[]>([]);
  const [lifestyleLogs, setLifestyleLogs] = useState<LogEntry[]>([]);
  const [completedGrowthAreas, setCompletedGrowthAreas] = useState<string[]>([]);
  const [completedRoadmapTasks, setCompletedRoadmapTasks] = useState<Record<string, string[]>>({});
  const [roadmapProgress, setRoadmapProgress] = useState<Record<string, number>>({});
  const [selectedRoadmap, setSelectedRoadmap] = useState<any>(null);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [marketInsights, setMarketInsights] = useState<Record<string, any>>({});
  const [loadingInsights, setLoadingInsights] = useState<Record<string, boolean>>({});
  const [knnMatches, setKnnMatches] = useState<any[]>([]);
  const [trackingEnabled, setTrackingEnabled] = useState(() => {
    try {
      return localStorage.getItem('NEURAL_TRACKING_ENABLED') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    if (metrics.focusScore > 0 && metrics.logicScore > 0) {
      setKnnMatches(findKNearestCareers(metrics, 3));
    }
  }, [metrics]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('COGNITIVE_TWIN_USER', JSON.stringify(user));
    } else {
      localStorage.removeItem('COGNITIVE_TWIN_USER');
    }
  }, [user]);

  const handleTestComplete = async (score: number) => {
    let newMetrics = { ...metrics };
    
    if (score === -1) {
      // Fast-track remaining tests with realistic, positive scores!
      tests.forEach(test => {
        const key = test.key;
        if (!newMetrics[key] || newMetrics[key] === 0) {
          newMetrics[key] = Math.floor(Math.random() * 20) + 75; // Generates a solid 75-95 score
        }
      });
      setMetrics(newMetrics);
      setStep('analyzing');
      setIsGenerating(true);
      try {
        const aiInsights = await generateCognitiveInsights(newMetrics);
        setInsights(aiInsights);
        if (user) {
          const profileData = { uid: user.uid, metrics: newMetrics, insights: aiInsights, history, lifestyleLogs, updatedAt: Date.now() };
          localStorage.setItem(`profile_${user.uid}`, JSON.stringify(profileData));
          const updatedHistory = [...history, { metrics: newMetrics, insights: aiInsights, timestamp: Date.now() }];
          setHistory(updatedHistory);
        }
      } catch (e) {
        setInsights(DEFAULT_INSIGHTS);
      } finally {
        setIsGenerating(false);
        setStep('report');
        // Grand celebration confetti sequence!
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('cognitive-success-particles', { detail: { type: 'test' } }));
        }, 150);
      }
      return;
    }

    const key = tests[testIndex].key;
    newMetrics = { ...newMetrics, [key]: score };
    setMetrics(newMetrics);

    // Intermediate test score success blast
    window.dispatchEvent(new CustomEvent('cognitive-success-particles', { detail: { type: 'milestone' } }));

    if (testIndex + 1 < tests.length) {
      setTestIndex(testIndex + 1);
    } else {
      setStep('analyzing');
      setIsGenerating(true);
      try {
        const aiInsights = await generateCognitiveInsights(newMetrics);
        setInsights(aiInsights);
        if (user) {
          const profileData = { uid: user.uid, metrics: newMetrics, insights: aiInsights, history, lifestyleLogs, updatedAt: Date.now() };
          localStorage.setItem(`profile_${user.uid}`, JSON.stringify(profileData));
          const updatedHistory = [...history, { metrics: newMetrics, insights: aiInsights, timestamp: Date.now() }];
          setHistory(updatedHistory);
        }
      } catch (e) {
        setInsights(DEFAULT_INSIGHTS);
      } finally {
        setIsGenerating(false);
        setStep('report');
        // Grand celebration confetti sequence!
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('cognitive-success-particles', { detail: { type: 'test' } }));
        }, 150);
      }
    }
  };

  const handleLaunchRoadmap = async (careerTitle: string) => {
    setIsGeneratingRoadmap(true);
    try {
      const roadmap = await generateDetailedRoadmap(careerTitle, metrics);
      if (roadmap) {
        const roadmapWithId = { ...roadmap, careerTitle, timestamp: Date.now() };
        setSelectedRoadmap(roadmapWithId);
        setStep('roadmap');
      }
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  const handleNewAssessment = () => {
    setMetrics((prev: any) => ({
      ...prev,
      comprehensiveScore: 0, focusScore: 0, memoryScore: 0, logicScore: 0, riskScore: 0, speedScore: 0,
      creativityScore: 0, spatialScore: 0, verbalScore: 0, learningStyleScore: 0,
      eqScore: 0, numericalScore: 0, abstractScore: 0, executiveScore: 0,
      resilienceScore: 0, aestheticScore: 0, performativeScore: 0, auditoryScore: 0,
      narrativeScore: 0, timestamp: Date.now()
    }));
    setTestIndex(0);
    setStep('testing');
    setShowResetConfirm(false);
  };

  const confirmStartFresh = () => {
    setMetrics({
      age: 25, ageRange: '22–30', role: 'Working Professional', field: 'Other',
      learningTime: '1 hour per day', learningStyle: 'Visual learning',
      comprehensiveScore: 0, focusScore: 0, memoryScore: 0, logicScore: 0, riskScore: 0, speedScore: 0,
      creativityScore: 0, spatialScore: 0, verbalScore: 0, learningStyleScore: 0,
      eqScore: 0, numericalScore: 0, abstractScore: 0, executiveScore: 0,
      resilienceScore: 0, aestheticScore: 0, performativeScore: 0, auditoryScore: 0,
      narrativeScore: 0, timestamp: Date.now()
    });
    setInsights(null);
    setCompletedGrowthAreas([]);
    setTestIndex(0);
    setStep('context');
    setShowResetConfirm(false);
  };

  const toggleGrowthArea = async (skill: string) => {
    if (!user) return;
    const isAdding = !completedGrowthAreas.includes(skill);
    const newCompleted = completedGrowthAreas.includes(skill)
      ? completedGrowthAreas.filter(s => s !== skill)
      : [...completedGrowthAreas, skill];
    setCompletedGrowthAreas(newCompleted);

    if (isAdding) {
      window.dispatchEvent(new CustomEvent('cognitive-success-particles', { detail: { type: 'milestone' } }));
    }

    const savedProfile = localStorage.getItem(`profile_${user.uid}`);
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      localStorage.setItem(`profile_${user.uid}`, JSON.stringify({ ...profile, completedGrowthAreas: newCompleted }));
    }
  };

  const toggleRoadmapTask = async (taskId: string) => {
    if (!selectedRoadmap || !user) return;
    const careerKey = selectedRoadmap.careerTitle || 'General';
    const currentCompleted = completedRoadmapTasks[careerKey] || [];
    const isAdding = !currentCompleted.includes(taskId);
    const newCompleted = currentCompleted.includes(taskId)
      ? currentCompleted.filter(t => t !== taskId)
      : [...currentCompleted, taskId];
    
    if (isAdding) {
      window.dispatchEvent(new CustomEvent('cognitive-success-particles', { detail: { type: 'milestone' } }));
    }

    const totalTasks = (selectedRoadmap.phases || []).reduce((acc: number, phase: any) => acc + (phase.milestones || []).length, 0);
    const progress = totalTasks > 0 ? (newCompleted.length / totalTasks) * 100 : 0;
    const updatedCompletedMap = { ...completedRoadmapTasks, [careerKey]: newCompleted };
    const updatedProgressMap = { ...roadmapProgress, [careerKey]: Math.round(progress) };
    setCompletedRoadmapTasks(updatedCompletedMap);
    setRoadmapProgress(updatedProgressMap);
    const savedProfile = localStorage.getItem(`profile_${user.uid}`);
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      localStorage.setItem(`profile_${user.uid}`, JSON.stringify({ ...profile, completedRoadmapTasks: updatedCompletedMap, roadmapProgress: updatedProgressMap }));
    }
  };

  return {
    user, setUser, step, setStep, testIndex, setTestIndex, difficulty, setDifficulty,
    insights, setInsights, isGenerating, dashboardTab, setDashboardTab, metrics, setMetrics,
    history, setHistory, lifestyleLogs, setLifestyleLogs, completedGrowthAreas, setCompletedGrowthAreas,
    completedRoadmapTasks, setCompletedRoadmapTasks, roadmapProgress, setRoadmapProgress,
    selectedRoadmap, setSelectedRoadmap, isGeneratingRoadmap, marketInsights, setMarketInsights,
    loadingInsights, setLoadingInsights, knnMatches, trackingEnabled, setTrackingEnabled,
    handleTestComplete, handleLaunchRoadmap, showResetConfirm, setShowResetConfirm,
    handleNewAssessment, confirmStartFresh, toggleGrowthArea, toggleRoadmapTask
  };
}
