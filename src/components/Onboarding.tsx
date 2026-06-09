import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, ChevronDown, Activity, Sparkles, Heart, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { SparkleBackground } from './SparkleBackground';

interface OnboardingProps {
  onStart: () => void;
  onShowAbout?: () => void;
  onBackToLanding?: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onStart, onShowAbout, onBackToLanding }) => {
  const [page, setPage] = useState(0);

  // In Image 2, the content is "Meet Your Digital Twin"
  const slides = [
    {
      title: "Meet Your Digital Twin",
      desc: "We'll explore how you think, learn, and grow to create a digital reflection of your unique mind.",
    }
  ];

  const currentSlide = slides[page];

  return (
    <div className="relative min-h-[100vh] w-full flex flex-col justify-between items-center py-20 px-4 select-none">
      <SparkleBackground />

      {onBackToLanding && (
        <button
          onClick={onBackToLanding}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 px-5 py-2.5 bg-white/60 hover:bg-white active:scale-95 text-[#8161e1] text-[10px] font-bold uppercase tracking-widest border border-purple-100/40 rounded-full transition-all duration-200 cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Landing Page
        </button>
      )}

      {/* Main card matching Image 2 perfectly */}
      <div className="relative z-10 w-full max-w-[580px] bg-white/75 backdrop-blur-2xl border border-white/80 shadow-2xl shadow-[#8161e1]/10 rounded-[2.5rem] p-8 sm:p-12 text-center flex flex-col items-center justify-between min-h-[380px] my-auto">
        
        {/* Pulse Heartbeat / Wave outline Icon exactly as Image 2 */}
        <div className="w-14 h-14 bg-white/40 border border-purple-100/50 rounded-xl flex items-center justify-center text-[#8161e1] shadow-sm mb-6">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M3 12h3l3-9 4 18 3-12h5" />
          </svg>
        </div>

        {/* Text Section */}
        <div className="space-y-4 mb-10 w-full">
          <h2 className="text-3xl sm:text-4xl text-[#322851] font-serif italic font-normal tracking-tight">
            {currentSlide.title}
          </h2>
          <p className="text-[#6e5380] text-sm leading-relaxed font-light max-w-sm mx-auto">
            {currentSlide.desc}
          </p>
        </div>

        {/* Buttons Grid exactly matched side-by-side as in Image 2 */}
        <div className="flex flex-row items-center justify-center gap-4 w-full">
          <button
            onClick={onStart}
            className="flex-1 py-3 px-6 bg-[#f4ecf8] border border-purple-100/55 hover:bg-[#ebdff2] active:scale-95 text-[#6a427f] rounded-full font-sans font-bold text-[10px] sm:text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer"
          >
            Skip Intro
          </button>

          <button
            onClick={onStart}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-[#8161e1] to-[#9979f4] hover:brightness-105 active:scale-95 text-white rounded-full font-sans font-bold text-[10px] sm:text-xs uppercase tracking-widest shadow-md shadow-indigo-600/10 transition-all duration-200 cursor-pointer"
          >
            Continue
          </button>
        </div>

      </div>

      {/* FOOTER */}
      <footer className="w-full relative z-10 bottom-0 select-none px-6">
        <div className="max-w-6xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-[#bfaad4]/40 to-transparent" />
        <div className="max-w-6xl mx-auto py-8 flex items-center justify-center text-xs text-[#7c779e] font-sans">
          <ul className="flex items-center gap-4 uppercase font-medium tracking-widest text-[10px]">
            <li className="cursor-pointer hover:text-[#1e1a42] transition-colors" onClick={() => onShowAbout ? onShowAbout() : alert("Cognitive Twin is a state-of-the-art mental mapping tool designed to reflect your cognitive parameters securely.")}>About</li>
            <li className="text-purple-300">|</li>
            <li className="cursor-pointer hover:text-[#1e1a42] transition-colors" onClick={() => alert("Your privacy is absolute. All brain profiles and interaction telemetry are stored client-side securely.")}>Privacy</li>
            <li className="text-purple-300">|</li>
            <li className="cursor-pointer hover:text-[#1e1a42] transition-colors" onClick={() => alert("Contact support at researcher@cognitivetwin.ai for lab verification.")}>Contact</li>
          </ul>
        </div>
      </footer>
    </div>
  );
};


interface ContextFormProps {
  onComplete: (data: any) => void;
  onShowAbout?: () => void;
  onBackToLanding?: () => void;
}

export const ContextForm: React.FC<ContextFormProps> = ({ onComplete, onShowAbout, onBackToLanding }) => {
  const [data, setData] = useState({
    name: '',
    gender: 'Other',
    ageRange: '18–22',
    role: 'College Student',
    field: 'Engineering',
    learningTime: '1 hour per day',
    learningStyle: 'Visual learning'
  });

  const options = {
    gender: ['Male', 'Female', 'Non-binary', 'Other'],
    ageRange: ['Under 16', '16–18', '18–22', '22–30', '30+'],
    role: ['Student', 'College Student', 'Job Seeker', 'Working Professional', 'Career Switcher', 'Entrepreneur'],
    field: ['Engineering', 'Business/Finance', 'Arts/Media', 'Science/Research', 'Law/Social Sciences', 'Other'],
    learningTime: ['30 minutes per day', '1 hour per day', '2–3 hours per day', 'weekends only']
  };

  const labels: Record<string, string> = {
    gender: 'Gender',
    ageRange: 'Age Range',
    role: 'Role',
    field: 'Field',
    learningTime: 'Learning Time'
  };

  const handleStart = () => {
    // Validate name or use default fallback if name is empty, then trigger onComplete
    const submission = {
      ...data,
      name: data.name.trim() || 'Anonymous Companion'
    };
    onComplete(submission);
  };

  return (
    <div className="relative min-h-[100vh] w-full flex flex-col justify-between items-center py-20 px-4 select-none">
      <SparkleBackground />

      {onBackToLanding && (
        <button
          onClick={onBackToLanding}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 px-5 py-2.5 bg-white/60 hover:bg-white active:scale-95 text-[#8161e1] text-[10px] font-bold uppercase tracking-widest border border-purple-100/40 rounded-full transition-all duration-200 cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Landing Page
        </button>
      )}

      {/* Main card matching Image 1 ("A Bit About You") */}
      <div className="relative z-10 w-full max-w-[850px] bg-white/75 backdrop-blur-2xl border border-white/80 shadow-2xl shadow-[#8161e1]/10 rounded-[2.5rem] p-8 sm:p-12 text-center flex flex-col items-center justify-between my-auto">
        
        {/* Top Logo and Title Section */}
        <div className="flex flex-col items-center gap-4 mb-2">
          {/* Logo with central brain/node emblem */}
          <div className="w-14 h-14 bg-gradient-to-tr from-[#8161e1] to-[#a78bfa] rounded-full flex items-center justify-center text-white text-2xl shadow-md border-2 border-white/70">
            🧠
          </div>
          
          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-4xl text-[#322851] font-serif italic font-normal tracking-tight">
              A Bit About You
            </h1>
            <p className="text-[#6e5380] text-sm font-light">
              Help us personalize your Cognitive Twin experience.
            </p>
          </div>
        </div>

        {/* Inputs Layout matching Image 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 w-full pt-8 text-left">
          
          {/* 1. Name input with user icon inside */}
          <div className="space-y-2">
            <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#8c78a5] block pl-1">
              What Should We Call You?
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Your name..."
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="w-full bg-white/60 focus:bg-white border border-[#8161e1]/20 focus:border-[#8161e1]/50 focus:ring-1 focus:ring-[#8161e1]/50 rounded-2xl py-3.5 pl-11 pr-4 text-xs sm:text-sm text-[#322851] placeholder-[#8c78a5]/50 outline-none transition-all duration-200"
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8161e1]/50" />
            </div>
          </div>

          {/* Render remaining 5 inputs from options */}
          {Object.entries(options).map(([key, vals]) => (
            <div key={key} className="space-y-2">
              <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#8c78a5] block pl-1">
                {labels[key] || key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <div className="relative">
                <select
                  value={(data as any)[key]}
                  onChange={(e) => setData({ ...data, [key]: e.target.value })}
                  className="w-full bg-white/60 focus:bg-white border border-[#8161e1]/20 focus:border-[#8161e1]/50 focus:ring-1 focus:ring-[#8161e1]/50 rounded-2xl py-3.5 pl-4 pr-11 text-xs sm:text-sm text-[#322851] appearance-none outline-none transition-all duration-200"
                >
                  {vals.map((v) => (
                    <option key={v} value={v} className="bg-white text-[#322851]">
                      {v}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8161e1]/50 pointer-events-none" />
              </div>
            </div>
          ))}

        </div>

        {/* Bottom Begin the Journey Pill button */}
        <div className="w-full flex flex-col items-center gap-4 pt-10">
          <button
            onClick={handleStart}
            className="w-full max-w-sm py-4 px-8 bg-gradient-to-r from-[#8161e1] via-[#8c6be8] to-[#9979f4] hover:brightness-105 active:scale-95 text-white rounded-full font-sans font-bold text-xs sm:text-sm uppercase tracking-widest shadow-lg shadow-indigo-600/10 cursor-pointer transition-all duration-200"
          >
            Begin The Journey
          </button>

          <button
            onClick={handleStart}
            className="text-xs text-[#8c78a5]/80 hover:text-[#8161e1] hover:underline transition-colors mt-2"
          >
            Skip for now
          </button>
        </div>

      </div>

      {/* FOOTER */}
      <footer className="w-full relative z-10 bottom-0 select-none px-6">
        <div className="max-w-6xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-[#bfaad4]/40 to-transparent" />
        <div className="max-w-6xl mx-auto py-8 flex items-center justify-center text-xs text-[#7c779e] font-sans">
          <ul className="flex items-center gap-4 uppercase font-medium tracking-widest text-[10px]">
            <li className="cursor-pointer hover:text-[#1e1a42] transition-colors" onClick={() => onShowAbout ? onShowAbout() : alert("Cognitive Twin is a state-of-the-art mental mapping tool designed to reflect your cognitive parameters securely.")}>About</li>
            <li className="text-purple-300">|</li>
            <li className="cursor-pointer hover:text-[#1e1a42] transition-colors" onClick={() => alert("Your privacy is absolute. All brain profiles and interaction telemetry are stored client-side securely.")}>Privacy</li>
            <li className="text-purple-300">|</li>
            <li className="cursor-pointer hover:text-[#1e1a42] transition-colors" onClick={() => alert("Contact support at researcher@cognitivetwin.ai for lab verification.")}>Contact</li>
          </ul>
        </div>
      </footer>
    </div>
  );
};
