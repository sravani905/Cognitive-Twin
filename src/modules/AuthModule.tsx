import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Sparkles, TrendingUp, Briefcase, User, Eye, EyeOff, AlertCircle, ArrowLeft, Heart, Info, Globe } from 'lucide-react';
import { cn } from '../lib/utils';
import { SparkleBackground } from '../components/SparkleBackground';

interface AuthModuleProps {
  authEmail: string;
  setAuthEmail: (email: string) => void;
  authPass: string;
  setAuthPass: (pass: string) => void;
  isSignUp: boolean;
  setIsSignUp: (isSignUp: boolean) => void;
  authError: string | null;
  isAuthenticating: boolean;
  onAuthenticate: (e: React.FormEvent) => void;
  onShowAbout?: () => void;
  onExploreDemo?: () => void;
  onShowPrivacy?: () => void;
  onShowContact?: () => void;
  onShowApiConfig?: () => void;
}

export const AuthModule: React.FC<AuthModuleProps> = ({
  authEmail,
  setAuthEmail,
  authPass,
  setAuthPass,
  isSignUp,
  setIsSignUp,
  authError,
  isAuthenticating,
  onAuthenticate,
  onShowAbout,
  onExploreDemo,
  onShowPrivacy,
  onShowContact,
  onShowApiConfig,
}) => {
  // Local state to toggle between the landing page (Image 7) and login screen (Image 8)
  const [view, setView] = useState<'landing' | 'auth'>('landing');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  // States for interactive demo overlays
  const [activeDemo, setActiveDemo] = useState<'profile' | 'careers' | 'map' | null>(null);

  // Sandbox sliders for Mind Profile Demo
  const [sumAttention, setSumAttention] = useState<number>(82);
  const [sumReasoning, setSumReasoning] = useState<number>(88);
  const [sumSpatial, setSumSpatial] = useState<number>(75);

  // Sandbox sliders for Career matches KNN Euclidean calculations
  const [guestKnnAttention, setGuestKnnAttention] = useState<number>(85);
  const [guestKnnLogic, setGuestKnnLogic] = useState<number>(90);
  const [guestKnnCreativity, setGuestKnnCreativity] = useState<number>(70);

  // Sandbox sliders for Growth Map projection math
  const [guestProjCreativity, setGuestProjCreativity] = useState<number>(78);
  const [guestProjLogic, setGuestProjLogic] = useState<number>(85);

  // Switch to auth mode and prefill if explore is clicked
  const handleExploreEnterAsGuest = () => {
    if (onExploreDemo) {
      onExploreDemo();
    } else {
      setAuthEmail('guest.user@cognitivetwin.ai');
      setAuthPass('guestSecure123');
      setView('auth');
    }
  };

  return (
    <div className="relative min-h-[100vh] w-full flex flex-col justify-between font-sans overflow-x-hidden selection:bg-accent-purple/15 bg-transparent">
      <SparkleBackground />

      {/* RENDER THE TWO DUAL VIEWS */}
      <AnimatePresence mode="wait">
        {view === 'landing' ? (
          /* ==================== 1. LANDING/WELCOME PAGE (IMAGE 7) ==================== */
          <motion.div
            key="landing-page"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col items-center justify-center py-20 px-4 relative z-10 w-full"
          >
            {/* Title Section with Behind-the-text Glowing Globe Grid */}
            <div className="relative text-center max-w-xl mx-auto space-y-6 pb-4 select-none">
              
              {/* Spherical grid overlay graphic behind "Cognitive Twin" */}
              <div className="absolute top-1/2 left-1/2 -translate-x-[42%] -translate-y-[70%] w-64 h-64 bg-radial-gradient from-violet-300/30 to-transparent blur-sm rounded-full pointer-events-none z-0">
                <svg className="w-full h-full text-white/45 animate-[spin_60s_linear_infinite]" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  <ellipse cx="50" cy="50" rx="45" ry="12" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  <ellipse cx="50" cy="50" rx="12" ry="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.5" />
                  <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.5" />
                </svg>
              </div>

              {/* Cognitive Twin Text with custom smile underlines */}
              <div className="relative inline-block z-10 pt-4">
                <h1 className="text-white text-5xl sm:text-7xl lg:text-8xl tracking-wide font-normal font-serif select-none drop-shadow-[0_4px_16px_rgba(138,43,226,0.12)]">
                  Cognitive Twin
                </h1>
                
                {/* Dual orbit underline under the word Twin exactly as in screenshot */}
                <div className="absolute -bottom-3 left-[35%] right-[2%] h-4 pointer-events-none overflow-visible opacity-80">
                  <svg className="w-full h-full text-white/60" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0,3 Q50,9 100,3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M8,6 Q50,11 92,6" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                  </svg>
                </div>
              </div>

              <p className="text-[#3b3068]/80 text-sm sm:text-lg tracking-widest font-normal uppercase pt-4 z-10 relative">
                Your Living Digital Reflection
              </p>
            </div>

            {/* Middle Big Buttons Grid Section */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10 pb-16 z-10 w-full max-w-md">
              <button
                onClick={() => setView('auth')}
                className="w-full sm:w-56 py-4 px-6 bg-gradient-to-r from-[#8A2BE2] via-[#8c6be8] to-[#9979f4] text-white rounded-full font-sans font-medium text-xs sm:text-sm uppercase tracking-widest shadow-lg shadow-indigo-600/15 hover:brightness-105 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                Start Assessment
              </button>

              <button
                onClick={handleExploreEnterAsGuest}
                className="w-full sm:w-56 py-4 px-6 bg-gradient-to-r from-[#da8bb2] via-[#e59ec1] to-[#cca1bd] text-white rounded-full font-sans font-medium text-xs sm:text-sm uppercase tracking-widest shadow-lg shadow-pink-600/15 hover:brightness-105 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                Explore Features
              </button>
            </div>

            {/* Bottom 3-Pill Interactive Cards Grid Section (matching Image 7) */}
            <div className="w-full max-w-5xl px-4 grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 z-10 font-sans">
              
              {/* Pill Card 1: Mind Profile */}
              <div 
                id="btn-mind-profile-demo"
                onClick={() => setActiveDemo('profile')}
                className="bg-white/80 border border-white/95 rounded-[1.5rem] px-6 py-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_8px_24px_-6px_rgba(138,43,226,0.06)] relative group overflow-hidden border-b-2 border-b-[#8A2BE2]/10"
              >
                <div className="flex items-center gap-4">
                  {/* Icon Frame */}
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0">
                    <div className="w-8 h-8 rounded-xl bg-[#8A2BE2]/15 text-[#8A2BE2] flex items-center justify-center font-bold text-lg">
                      🧠
                    </div>
                  </div>
                  <div className="space-y-0.5 text-left">
                    <h3 className="text-xs font-bold text-[#1e1a42] uppercase tracking-wider font-sans leading-none">Mind Profile Demo</h3>
                    <p className="text-[11px] text-[#7c779e] font-sans">See how your unique strengths are mapped</p>
                  </div>
                </div>
                <div className="text-[#a78bfa] group-hover:translate-x-1 transition-transform">→</div>
              </div>

              {/* Pill Card 2: Career Matches */}
              <div 
                id="btn-career-matches-demo"
                onClick={() => setActiveDemo('careers')}
                className="bg-white/80 border border-white/95 rounded-[1.5rem] px-6 py-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_8px_24px_-6px_rgba(138,43,226,0.06)] relative group overflow-hidden border-b-2 border-b-[#8A2BE2]/10"
              >
                <div className="flex items-center gap-4">
                  {/* Icon Frame */}
                  <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center shrink-0">
                    <div className="w-8 h-8 rounded-xl bg-[#8A2BE2]/15 text-[#8A2BE2] flex items-center justify-center">
                      <Briefcase className="w-4.5 h-4.5 text-[#8A2BE2]" />
                    </div>
                  </div>
                  <div className="space-y-0.5 text-left">
                    <h3 className="text-xs font-bold text-[#1e1a42] uppercase tracking-wider font-sans leading-none">Career Matches Demo</h3>
                    <p className="text-[11px] text-[#7c779e] font-sans">Find job clusters that fit your personality</p>
                  </div>
                </div>
                <div className="text-[#a78bfa] group-hover:translate-x-1 transition-transform">→</div>
              </div>

              {/* Pill Card 3: Growth Map */}
              <div 
                id="btn-growth-map-demo"
                onClick={() => setActiveDemo('map')}
                className="bg-white/80 border border-white/95 rounded-[1.5rem] px-6 py-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_8px_24px_-6px_rgba(138,43,226,0.06)] relative group overflow-hidden border-b-2 border-b-[#8A2BE2]/10"
              >
                <div className="flex items-center gap-4">
                  {/* Icon Frame */}
                  <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center shrink-0">
                    <div className="w-8 h-8 rounded-xl bg-[#e59ec1]/20 text-[#e59ec1] flex items-center justify-center">
                      <TrendingUp className="w-4.5 h-4.5 text-[#d470a1]" />
                    </div>
                  </div>
                  <div className="space-y-0.5 text-left">
                    <h3 className="text-xs font-bold text-[#1e1a42] uppercase tracking-wider font-sans leading-none">Growth Map Demo</h3>
                    <p className="text-[11px] text-[#7c779e] font-sans">Set personal steps to grow your traits</p>
                  </div>
                </div>
                <div className="text-[#a78bfa] group-hover:translate-x-1 transition-transform">→</div>
              </div>

            </div>
          </motion.div>
        ) : (
          /* ==================== 2. SPLIT LOGIN/SIGN-UP SCREEN (IMAGE 8) ==================== */
          <motion.div
            key="auth-page"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex items-center justify-center py-10 px-6 sm:px-12 relative z-10 w-full"
          >
            <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mx-auto">
              
              {/* Left Column Section: Brand Presentation */}
              <div className="lg:col-span-5 text-center lg:text-left space-y-6">
                
                {/* Large custom logo matching Image 8 layout */}
                <div className="flex justify-center lg:justify-start">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8A2BE2] to-[#a78bfa] flex items-center justify-center shadow-lg shadow-purple-500/10 text-white text-3xl font-bold border-2 border-white/65 cursor-pointer hover:rotate-6 transition-transform" onClick={() => setView('landing')}>
                    🧠
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="relative inline-block">
                    <h2 className="text-[#322851] text-4xl sm:text-5xl font-serif tracking-tight font-normal">
                      Cognitive Twin
                    </h2>
                    {/* Tiny orbit ribbon below logo heading */}
                    <div className="w-full h-1 bg-[#8A2BE2]/25 mt-1 rounded-full" />
                  </div>
                  
                  <p className="text-[#514371] text-xs sm:text-sm tracking-widest font-bold uppercase">
                    Your Living Digital Reflection
                  </p>
                </div>

                <button 
                  onClick={() => setView('landing')}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8A2BE2] hover:text-[#5e3fba] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Welcome Home</span>
                </button>
              </div>

              {/* Right Column Section: The Beautiful Rounded Soft-shadow Auth Card */}
              <div className="lg:col-span-7 flex justify-center w-full">
                
                <div className="bg-white/80 backdrop-blur-xl border border-white/70 shadow-2xl shadow-[#8A2BE2]/5 rounded-[2.5rem] p-8 sm:p-10 w-full max-w-[460px] relative overflow-hidden flex flex-col justify-between">
                  
                  {/* Heart Sparkle deco bubble in the top right corner exactly like screenshot */}
                  <div className="absolute top-4 right-4 bg-pink-100/50 p-2 rounded-full text-pink-500 animate-pulse pointer-events-none">
                    <Heart className="w-4.5 h-4.5 fill-pink-300 stroke-pink-400" />
                  </div>

                  <div className="space-y-6">
                    {/* Header */}
                    <div className="space-y-1 text-left">
                      <h3 className="text-xl sm:text-2xl font-serif text-[#1e1442] italic font-normal tracking-tight">
                        Log In to Your Account
                      </h3>
                      <p className="text-[10px] text-[#7c779e] uppercase tracking-widest font-mono">
                        Establish secure twin connection parameters
                      </p>
                    </div>

                    {/* Authentication form */}
                    <form onSubmit={onAuthenticate} className="space-y-5">
                      
                      {/* Email field with left mail icon */}
                      <div className="space-y-1 text-left">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#7c779e] font-sans pl-1">Email Connection</label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            placeholder="Email"
                            value={authEmail}
                            onChange={(e) => setAuthEmail(e.target.value)}
                            className="pl-11 pr-4 py-3 bg-white/45 border border-purple-100 focus:bg-white rounded-xl w-full text-sm font-sans focus:ring-1 focus:ring-accent-purple shrink-0 placeholder-purple-300 text-[#1e1a42]"
                          />
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
                        </div>
                      </div>

                      {/* Password field with left lock icon and eye toggle */}
                      <div className="space-y-1 text-left">
                        <div className="flex justify-between items-center pr-1">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#7c779e] font-sans pl-1">Security Key</label>
                        </div>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            placeholder="Password"
                            value={authPass}
                            onChange={(e) => setAuthPass(e.target.value)}
                            className="pl-11 pr-11 py-3 bg-white/45 border border-purple-100 focus:bg-white rounded-xl w-full text-sm font-sans focus:ring-1 focus:ring-accent-purple shrink-0 placeholder-purple-300 text-[#1e1a42]"
                          />
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-300 hover:text-purple-500 focus:outline-none"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Row of checkbox and forgot password link */}
                      <div className="flex items-center justify-between text-xs pt-1">
                        <label className="flex items-center gap-2 cursor-pointer text-[#4a456e] select-none">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="rounded text-accent-purple focus:ring-accent-purple border-purple-200"
                          />
                          <span>Remember Me</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => alert("Cognitive logic key retrieval has been sent! Presettle password index to log back in.")}
                          className="text-[#8A2BE2] font-bold hover:underline"
                        >
                          Forgot Password?
                        </button>
                      </div>

                      {/* Display error message if authenticated credentials mismatch */}
                      {authError && (
                        <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs flex items-start gap-2 animate-shake">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          <p>{authError}</p>
                        </div>
                      )}

                      {/* Buttons: Log In (Indigo fill) and Sign Up (Pink pastel fill) exactly layout as Image 8 */}
                      <div className="space-y-4 pt-4">
                        <button
                          type="submit"
                          onClick={() => setIsSignUp(false)}
                          disabled={isAuthenticating}
                          className="w-full py-4 bg-gradient-to-r from-[#8A2BE2] via-[#8c6be8] to-[#9979f4] hover:brightness-105 active:scale-95 disabled:opacity-60 text-white font-sans font-bold text-xs uppercase tracking-widest rounded-2xl shadow-md shadow-indigo-600/10 cursor-pointer transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          {isAuthenticating && !isSignUp ? (
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          ) : null}
                          <span>Log In</span>
                        </button>

                        <button
                          type="submit"
                          onClick={() => setIsSignUp(true)}
                          disabled={isAuthenticating}
                          className="w-full py-4 bg-[#fed9de] border border-[#ea96bc]/45 hover:bg-[#ffcacc] active:scale-95 disabled:opacity-60 text-[#4e2c60] font-sans font-bold text-xs uppercase tracking-widest rounded-2xl shadow-sm cursor-pointer transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          {isAuthenticating && isSignUp ? (
                            <svg className="animate-spin h-4 w-4 text-[#4e2c60]" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          ) : null}
                          <span>Sign Up</span>
                        </button>
                      </div>

                    </form>
                  </div>

                  {/* Footnote matching Image 8 disclaimer */}
                  <div className="pt-6 border-t border-purple-100/40 text-center">
                    <p className="text-[10px] text-[#7c779e]">
                      By continuing, you agree to our{' '}
                      <span className="text-[#8A2BE2] hover:underline cursor-pointer">Terms & Privacy</span>.
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conditionally Rendered Interactive Sandbox Demo Modals */}
      <AnimatePresence>
        {activeDemo === 'profile' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#161234]/75 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] border border-purple-100 shadow-2xl p-6 sm:p-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto relative space-y-6 text-slate-800 font-sans"
            >
              <button 
                onClick={() => setActiveDemo(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors pointer-events-auto font-mono text-sm border border-slate-200 cursor-pointer"
              >
                ×
              </button>

              <div className="space-y-1.5 text-left font-sans">
                <span className="text-[10px] font-mono tracking-widest text-[#8A2BE2] font-bold uppercase block">
                  COGNITIVE PROFILE WORKFLOW
                </span>
                <h2 className="text-3xl font-serif italic text-[#1e1a42] tracking-tight font-normal">
                  Unlocking Your Mind's Potential
                </h2>
                <p className="text-xs text-slate-500 font-sans leading-relaxed">
                  Discover how our friendly, game-like exercises translate into a beautiful visual map of your core attributes. No stress, no complex tests!
                </p>
              </div>

              {/* Workflow Flowcharts simplified */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-sans">
                <div className="p-3.5 bg-indigo-50/50 rounded-2xl border border-indigo-150/20 text-left font-sans">
                  <span className="font-sans text-xs font-bold text-[#8A2BE2] block mb-0.5">01. FUN TASKS</span>
                  <p className="text-[10.5px] text-slate-600 leading-normal">Play responsive mental games that measure your reactions in a totally stress-free way.</p>
                </div>
                <div className="p-3.5 bg-violet-50/50 rounded-2xl border border-violet-150/20 text-left font-sans">
                  <span className="font-sans text-xs font-bold text-[#8A2BE2] block mb-0.5">02. WHERE YOU STAND</span>
                  <p className="text-[10.5px] text-slate-600 leading-normal">Instead of scary pass/fail grades, we balance your score to show where your natural talents shine.</p>
                </div>
                <div className="p-3.5 bg-pink-50/50 rounded-2xl border border-pink-150/20 text-left font-sans">
                  <span className="font-sans text-xs font-bold text-pink-600 block mb-0.5">03. YOUR RADAR MAP</span>
                  <p className="text-[10.5px] text-slate-600 leading-normal">We organize your strengths into five simple categories to create your gorgeous personal chart.</p>
                </div>
              </div>

              {/* Live Interactive Sandbox Calculator */}
              <div className="bg-[#FAF9FE] border border-purple-100 rounded-3xl p-5 space-y-4 font-sans text-left">
                <h3 className="text-xs font-bold text-[#1e1a42] uppercase tracking-wider font-sans flex items-center gap-2">
                  🧮 Try Your Strengths Slider Sandbox
                </h3>
                <p className="text-[11px] text-slate-500 font-sans">
                  Drag the sliders below to see how easy it is to trace your skills in real-time:
                </p>

                <div className="space-y-3.5 pt-1">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-sans">
                      <span className="font-medium text-slate-700">Executive Attention Speed</span>
                      <span className="font-mono font-bold text-[#8A2BE2]">{sumAttention}%</span>
                    </div>
                    <input 
                      type="range" min="10" max="100" value={sumAttention} 
                      onChange={(e) => setSumAttention(Number(e.target.value))}
                      className="w-full accent-[#8A2BE2] cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1 font-sans">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700">Logical Reasoning Accuracy</span>
                      <span className="font-mono font-bold text-[#8A2BE2]">{sumReasoning}%</span>
                    </div>
                    <input 
                      type="range" min="10" max="100" value={sumReasoning} 
                      onChange={(e) => setSumReasoning(Number(e.target.value))}
                      className="w-full accent-[#8A2BE2] cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1 font-sans">
                    <div className="flex justify-between text-xs font-sans">
                      <span className="font-medium text-slate-700">Spatial Invariant Transform</span>
                      <span className="font-mono font-bold text-[#8A2BE2]">{sumSpatial}%</span>
                    </div>
                    <input 
                      type="range" min="10" max="100" value={sumSpatial} 
                      onChange={(e) => setSumSpatial(Number(e.target.value))}
                      className="w-full accent-[#8A2BE2] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Real-time intuitive display instead of formula */}
                <div className="p-4 bg-slate-900 text-slate-200 rounded-2xl font-sans text-xs space-y-2.5 text-left leading-relaxed">
                  <p className="text-purple-300 font-bold uppercase tracking-wider text-[10px]">✨ YOUR ESTIMATED TALENT RATING:</p>
                  <div>
                    <span className="text-white font-medium">Overall Average Score:</span>{" "}
                    <span className="text-emerald-400 font-mono font-bold">{Math.round((sumAttention + sumReasoning + sumSpatial) / 3)}%</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    This overall average combines your attention, logic, and visualization levels instantly. You won't have to carry out any manual calculation!
                  </p>
                  <div className="pt-2 border-t border-white/10 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-slate-400 font-medium">Your Cognitive Skill Rank:</span>
                    <span className="bg-emerald-500/20 text-emerald-300 font-bold px-3 py-1 rounded text-[10px] uppercase tracking-wider text-center">
                      {Math.round((sumAttention + sumReasoning + sumSpatial) / 3) >= 86 ? "Superior Talent Tier" : Math.round((sumAttention + sumReasoning + sumSpatial) / 3) >= 72 ? "Optimal Talent Tier" : "Growing Talent Tier"}
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex gap-3 justify-end pt-2 font-sans font-sans">
                <button 
                  onClick={() => setActiveDemo(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Close Demo
                </button>
                <button 
                  onClick={() => { setActiveDemo(null); setView('auth'); }}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#8A2BE2] to-[#9979f4] text-white rounded-full text-xs font-semibold uppercase tracking-wider shadow-md hover:brightness-105 transition-all cursor-pointer"
                >
                  Start Assessment Mapped Path
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeDemo === 'careers' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#161234]/75 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] border border-purple-100 shadow-2xl p-6 sm:p-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto relative space-y-6 text-slate-800 font-sans"
            >
              <button 
                onClick={() => setActiveDemo(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors pointer-events-auto font-mono text-sm border border-slate-200 cursor-pointer"
              >
                ×
              </button>

              <div className="space-y-1.5 text-left font-sans">
                <span className="text-[10px] font-mono tracking-widest text-[#8A2BE2] font-bold uppercase block">
                  INTELLIGENT MATCHING PROCESS
                </span>
                <h2 className="text-3xl font-serif italic text-[#1e1a42] tracking-tight font-normal">
                  Finding Your Perfect Career Matches
                </h2>
                <p className="text-xs text-slate-500 font-sans leading-relaxed">
                  We compare your custom scores in real-time with baseline profiles of top industry careers to instantly pinpoint where your talents fit best.
                </p>
              </div>

              {/* Intuitive visual explanation banner */}
              <div className="bg-[#FAF9FE] p-5 rounded-2xl border border-purple-100 text-left space-y-2 font-sans">
                <p className="text-xs text-slate-700 font-sans font-bold">🗺️ How matching works on a skill map:</p>
                <p className="text-[11px] text-slate-600 leading-normal font-sans">
                  Think of your skills as standard directions on a map. By matching how high your level of Logic or Attention is against standard industry requirements, we find the "closest" careers. The closer an activity is to your style, the higher your match percentage!
                </p>
              </div>

              {/* Live sandbox vectors */}
              <div className="bg-[#FAF9FE] border border-purple-100 rounded-3xl p-5 space-y-4 text-left font-sans">
                <h3 className="text-xs font-bold text-[#1e1a42] uppercase tracking-wider font-sans flex items-center gap-2">
                  🎯 Try Customizing Your Skill Levels Right Now
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-sans">
                  <div className="space-y-1 font-sans">
                    <div className="flex justify-between text-[11px] font-bold text-slate-600">
                      <span>Attention Level</span>
                      <span className="font-mono text-purple-600">{guestKnnAttention}%</span>
                    </div>
                    <input 
                      type="range" min="10" max="100" value={guestKnnAttention} 
                      onChange={(e) => setGuestKnnAttention(Number(e.target.value))}
                      className="w-full accent-[#8A2BE2] cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1 font-sans">
                    <div className="flex justify-between text-[11px] font-bold text-slate-600">
                      <span>Logical Power</span>
                      <span className="font-mono text-purple-600">{guestKnnLogic}%</span>
                    </div>
                    <input 
                      type="range" min="10" max="100" value={guestKnnLogic} 
                      onChange={(e) => setGuestKnnLogic(Number(e.target.value))}
                      className="w-full accent-[#8A2BE2] cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1 font-sans">
                    <div className="flex justify-between text-[11px] font-bold text-slate-600">
                      <span>Creative Focus</span>
                      <span className="font-mono text-purple-600">{guestKnnCreativity}%</span>
                    </div>
                    <input 
                      type="range" min="10" max="100" value={guestKnnCreativity} 
                      onChange={(e) => setGuestKnnCreativity(Number(e.target.value))}
                      className="w-full accent-[#1e1a42] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Simulated distance outputs table with clean progress bars */}
                <div className="space-y-2 pt-2 text-left font-sans">
                  <span className="text-[10px] font-sans font-bold uppercase text-slate-400 tracking-wider">Dynamic Career Fit Estimation:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    
                    {/* Centroid 1 */}
                    {(() => {
                      const d = Math.sqrt(Math.pow(guestKnnAttention - 90, 2) + Math.pow(guestKnnLogic - 95, 2) + Math.pow(guestKnnCreativity - 45, 2));
                      const percent = Math.max(0, Math.min(100, Math.round(100 * (1 - d / 120))));
                      return (
                        <div className="bg-white p-4.5 rounded-2xl border border-slate-100 flex flex-col justify-between space-y-2.5 shadow-sm font-sans text-left">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-bold text-slate-800 text-xs leading-tight block">🔬 Data Scientist & AI Researcher</span>
                              <span className="text-[9.5px] text-slate-400 block mt-0.5">High Focus & Logic Benchmark</span>
                            </div>
                            <span className="text-indigo-600 font-sans font-bold text-xs">{percent}% fit</span>
                          </div>
                          <div className="space-y-1">
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
                              <div className="h-full bg-indigo-500 rounded-full transition-all duration-300" style={{ width: `${percent}%` }} />
                            </div>
                            <span className="text-[9px] text-slate-400 block">Matches closely with systematic, detail-oriented styles.</span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Centroid 2 */}
                    {(() => {
                      const d = Math.sqrt(Math.pow(guestKnnAttention - 55, 2) + Math.pow(guestKnnLogic - 60, 2) + Math.pow(guestKnnCreativity - 92, 2));
                      const percent = Math.max(0, Math.min(100, Math.round(100 * (1 - d / 120))));
                      return (
                        <div className="bg-white p-4.5 rounded-2xl border border-slate-100 flex flex-col justify-between space-y-2.5 shadow-sm font-sans text-left">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-bold text-slate-800 text-xs leading-tight block">🎨 Creative Product Designer</span>
                              <span className="text-[9.5px] text-slate-400 block mt-0.5">High Imagination & Fluid Benchmark</span>
                            </div>
                            <span className="text-pink-600 font-sans font-bold text-xs">{percent}% fit</span>
                          </div>
                          <div className="space-y-1">
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
                              <div className="h-full bg-pink-500 rounded-full transition-all duration-300" style={{ width: `${percent}%` }} />
                            </div>
                            <span className="text-[9px] text-slate-400 block">Matches closely with visual, divergent, and human-centric styles.</span>
                          </div>
                        </div>
                      );
                    })()}

                  </div>
                </div>
              </div>

              {/* Buttons Footer */}
              <div className="flex gap-3 justify-end pt-2 font-sans">
                <button 
                  onClick={() => setActiveDemo(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Close Demo
                </button>
                <button 
                  onClick={() => { setActiveDemo(null); setView('auth'); }}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#8A2BE2] to-[#9979f4] text-white rounded-full text-xs font-semibold uppercase tracking-wider shadow-md hover:brightness-105 transition-all cursor-pointer"
                >
                  Start Assessment Mapped Path
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeDemo === 'map' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.95 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#161234]/75 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] border border-purple-100 shadow-2xl p-6 sm:p-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto relative space-y-6 text-slate-800 font-sans"
            >
              <button 
                onClick={() => setActiveDemo(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors pointer-events-auto font-mono text-sm border border-slate-200 cursor-pointer"
              >
                ×
              </button>

              <div className="space-y-1.5 text-left font-sans">
                <span className="text-[10px] font-mono tracking-widest text-[#8A2BE2] font-bold uppercase block">
                  COORDINATE DIMENSION MAPPING
                </span>
                <h2 className="text-3xl font-serif italic text-[#1e1a42] tracking-tight font-normal">
                  How is your Growth Map Generated?
                </h2>
                <p className="text-xs text-slate-500 font-sans leading-relaxed">
                  We translate your answers directly into a friendly visual coordinates point. You'll instantly see standard paths on where you stand and how you can naturally expand.
                </p>
              </div>

              {/* Sliders sandbox */}
              <div className="bg-[#FAF9FE] border border-purple-100 rounded-3xl p-5 space-y-4 text-left font-sans">
                <h3 className="text-xs font-bold text-[#1e1a42] uppercase tracking-wider font-sans">
                  📐 Try Moving the Mapping Sandbox Sliders
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 py-1 font-sans">
                  <div className="space-y-1 font-sans">
                    <div className="flex justify-between text-[11px] font-bold text-pink-700">
                      <span>Divergent Creativity Rating</span>
                      <span className="font-mono text-pink-600">{guestProjCreativity}%</span>
                    </div>
                    <input 
                      type="range" min="10" max="100" value={guestProjCreativity} 
                      onChange={(e) => setGuestProjCreativity(Number(e.target.value))}
                      className="w-full accent-pink-500 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1 font-sans">
                    <div className="flex justify-between text-[11px] font-bold text-indigo-700">
                      <span>Logical / Analytical Power</span>
                      <span className="font-mono text-indigo-600">{guestProjLogic}%</span>
                    </div>
                    <input 
                      type="range" min="10" max="100" value={guestProjLogic} 
                      onChange={(e) => setGuestProjLogic(Number(e.target.value))}
                      className="w-full accent-indigo-505 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Plot calculations */}
                {(() => {
                  const xCoord = Math.round(5 + (guestProjCreativity * 0.88));
                  const yCoord = Math.round(5 + (guestProjLogic * 0.88));
                  return (
                    <div className="space-y-3.5 font-sans">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-normal font-sans">
                        <div className="p-3 bg-pink-50/70 border border-pink-100 rounded-xl text-left font-sans">
                          <span className="font-bold text-pink-805 block text-[11px]">Horizontal Position (Creative Value):</span>
                          <p className="mt-1 font-semibold text-pink-700">{xCoord}% width mapping</p>
                        </div>
                        <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-left font-sans">
                          <span className="font-bold text-indigo-805 block text-[11px]">Vertical Position (Logical Value):</span>
                          <p className="mt-1 font-semibold text-indigo-700">{yCoord}% height mapping</p>
                        </div>
                      </div>

                      {/* Canvas map plotting */}
                      <div className="relative h-44 w-full bg-[#14102e] border border-white/5 rounded-2xl overflow-hidden flex items-center justify-center shadow-inner font-sans">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px))] bg-[size:14px_14px]" />
                        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px))] bg-[size:14px_14px]" />
                        <div className="absolute inset-x-0 h-[1.5px] bg-white/5 top-1/2" />
                        <div className="absolute inset-y-0 w-[1.5px] bg-white/5 left-1/2" />

                        <span className="absolute left-3.5 top-2 text-[8px] font-sans tracking-wider text-slate-400">ANALYTICAL SPECTRA ▲</span>
                        <span className="absolute right-3.5 bottom-2 text-[8px] font-sans tracking-wider text-slate-400">CREATIVE VARIANCE ▶</span>

                        {/* Normalized Plot position */}
                        <motion.div 
                          animate={{ 
                            left: `${xCoord}%`, 
                            bottom: `${yCoord}%` 
                          }}
                          className="absolute w-5 h-5 rounded-full bg-[#8A2BE2] border-2 border-white flex items-center justify-center -translate-x-1/2 translate-y-1/2 shadow-lg shadow-purple-500/50"
                        >
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        </motion.div>

                        <div className="absolute bottom-2.5 left-2.5 bg-[#14102e]/90 border border-white/10 px-2.5 py-1 rounded-lg text-[9px] font-sans text-purple-200">
                          Your Map Position: [Creative: {xCoord}%, Logical: {yCoord}%]
                        </div>
                      </div>
                    </div>
                  );
                })()}

              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-2 font-sans">
                <button 
                  onClick={() => setActiveDemo(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Close Demo
                </button>
                <button 
                  onClick={() => { setActiveDemo(null); setView('auth'); }}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#8A2BE2] to-[#9979f4] text-white rounded-full text-xs font-semibold uppercase tracking-wider shadow-md hover:brightness-105 transition-all cursor-pointer"
                >
                  Start Assessment Mapped Path
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER SECTION: SHARED BY BOTH INTERFACES PIXEL MATCHED */}
      <footer className="w-full relative z-10 bottom-0 select-none px-6 text-[#7c779e]">
        {/* Simple elegant thin line above footer matching Image 7 and 8 */}
        <div className="max-w-6xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-[#bfaad4]/40 to-transparent" />
        
        <div className="max-w-6xl mx-auto py-8 flex items-center justify-center text-xs font-sans">
          <ul className="flex items-center gap-4 uppercase font-medium tracking-widest text-[10px] flex-wrap justify-center text-center">
            <li className="cursor-pointer hover:text-[#1e1a42] transition-colors" onClick={() => onShowAbout ? onShowAbout() : alert("Cognitive Twin is a state-of-the-art mental mapping tool designed to reflect your cognitive parameters securely.")}>About</li>
            <li className="text-purple-300">|</li>
            <li className="cursor-pointer hover:text-[#1e1a42] transition-colors" onClick={() => onShowPrivacy ? onShowPrivacy() : alert("Your privacy is absolute. All brain profiles and interaction telemetry are stored client-side securely.")}>Privacy</li>
            <li className="text-purple-300">|</li>
            <li className="cursor-pointer hover:text-[#1e1a42] transition-colors" onClick={() => onShowContact ? onShowContact() : alert("Contact support at researcher@cognitivetwin.ai for lab verification.")}>Contact</li>
            <li className="text-purple-300">|</li>
            <li className="cursor-pointer hover:text-[#1e1a42] transition-colors" onClick={() => onShowApiConfig ? onShowApiConfig() : alert("API configuration interface and telemetry triggers.")}>API Settings</li>
          </ul>
        </div>
      </footer>
    </div>
  );
};
