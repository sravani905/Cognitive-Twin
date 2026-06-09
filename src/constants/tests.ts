import { Zap, BrainCircuit, Target, Activity, Sparkles, Clock, Layers, MessageSquare, BookOpen, Heart, Microscope, Globe, Shield, Sparkle, Bot, Info } from 'lucide-react';
import { AttentionTest, MemoryTest, LogicTest, RiskTest, CreativityTest, DecisionTest, SpatialTest, VerbalTest, LearningStyleTest, EQTest, NumericalTest, AbstractTest, ExecutiveTest, ResilienceTest, AestheticTest, PerformativeTest, AuditoryTest, NarrativeTest, ComprehensiveLocalTest } from '../components/Tests';

export const tests = [
  { id: 'comprehensive', component: ComprehensiveLocalTest, key: 'comprehensiveScore', label: 'Neural Benchmark', icon: Target },
  { id: 'attention', component: AttentionTest, key: 'focusScore', label: 'Focus & Attention', icon: Zap },
  { id: 'memory', component: MemoryTest, key: 'memoryScore', label: 'Memory', icon: BrainCircuit },
  { id: 'logic', component: LogicTest, key: 'logicScore', label: 'Logical Reasoning', icon: Target },
  { id: 'risk', component: RiskTest, key: 'riskScore', label: 'Risk Taking', icon: Activity },
  { id: 'creativity', component: CreativityTest, key: 'creativityScore', label: 'Creative Thinking', icon: Sparkles },
  { id: 'decision', component: DecisionTest, key: 'speedScore', label: 'Quick Decisions', icon: Clock },
  { id: 'spatial', component: SpatialTest, key: 'spatialScore', label: 'Spatial Visualization', icon: Layers },
  { id: 'verbal', component: VerbalTest, key: 'verbalScore', label: 'Verbal Skills', icon: MessageSquare },
  { id: 'learning', component: LearningStyleTest, key: 'learningStyleScore', label: 'How You Learn', icon: BookOpen },
  { id: 'eq', component: EQTest, key: 'eqScore', label: 'Social Awareness', icon: Heart },
  { id: 'numerical', component: NumericalTest, key: 'numericalScore', label: 'Math Skills', icon: Microscope },
  { id: 'abstract', component: AbstractTest, key: 'abstractScore', label: 'Pattern Discovery', icon: Globe },
  { id: 'executive', component: ExecutiveTest, key: 'executiveScore', label: 'Self-Control', icon: Shield },
  { id: 'resilience', component: ResilienceTest, key: 'resilienceScore', label: 'Stress Resilience', icon: Activity },
  { id: 'aesthetic', component: AestheticTest, key: 'aestheticScore', label: 'Design Sense', icon: Sparkle },
  { id: 'performative', component: PerformativeTest, key: 'performativeScore', label: 'Public Confidence', icon: Bot },
  { id: 'auditory', component: AuditoryTest, key: 'auditoryScore', label: 'Listening Skills', icon: Activity },
  { id: 'narrative', component: NarrativeTest, key: 'narrativeScore', label: 'Communication', icon: Info },
];
