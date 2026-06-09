import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Mail, 
  Send, 
  CheckCircle, 
  Smartphone, 
  Users, 
  GraduationCap, 
  MapPin, 
  Building2,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { SparkleBackground } from './SparkleBackground';

interface ContactViewProps {
  onClose: () => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'form' | 'team'>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Research Paper Query');
  const [message, setMessage] = useState('');
  const [sentStatus, setSentStatus] = useState<boolean>(false);

  // Prefilled gmail from context
  const targetGmail = 'cognitivetwinofficial@gmail.com';

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate high-fidelity message sent loading and show confirmation
    setSentStatus(true);

    // Format mailto link to targetGmail so the user can easily open real mail client
    const mailSubject = encodeURIComponent(`[Cognitive Twin Major Project] ${subject}`);
    const mailBody = encodeURIComponent(`Hello Research Authors,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nSent via Cognitive Twin Laboratory Hub.`);
    
    setTimeout(() => {
      // Open mailto link in a background-friendly way
      window.location.href = `mailto:${targetGmail}?subject=${mailSubject}&body=${mailBody}`;
    }, 1500);
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setSubject('Research Paper Query');
    setMessage('');
    setSentStatus(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] overflow-y-auto overflow-x-hidden bg-[#faf8fc]/90 backdrop-blur-3xl flex flex-col font-sans select-none pb-12"
    >
      <SparkleBackground intensity="normal" />

      {/* Premium Sticky Navigation Header */}
      <div className="sticky top-0 z-50 w-full bg-white/60 backdrop-blur-md border-b border-purple-100/40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#8161e1] to-[#9979f4] flex items-center justify-center text-white shadow-md shadow-indigo-600/10">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-serif italic font-bold text-[#322851]">Contact Hub</span>
            <span className="text-[9px] uppercase tracking-widest block font-bold text-[#8c78a5]">Major Project Laboratory Inquiries</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="hidden md:flex bg-white/70 border border-purple-100/65 rounded-full p-1 gap-1">
          {([
            { id: 'form', label: 'Send Message / feedback', icon: MessageSquare },
            { id: 'team', label: 'Project Researchers', icon: Users }
          ] as const).map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full font-sans transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-gradient-to-r from-[#8161e1] to-[#9979f4] text-white shadow-sm' 
                    : 'text-[#6a427f] hover:bg-white/90 hover:text-[#8161e1]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full border border-purple-100 bg-white hover:bg-rose-50 text-[#6a427f] hover:text-rose-600 flex items-center justify-center shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-4xl w-full mx-auto px-6 pt-8 flex-1 flex flex-col">
        
        {/* Mobile Tab Control Select bar */}
        <div className="flex md:hidden bg-white/80 border border-purple-100 rounded-2xl p-2 gap-1 mb-6 flex-wrap justify-center shadow-sm">
          {([
            { id: 'form', label: 'Message Desk', icon: MessageSquare },
            { id: 'team', label: 'Developers', icon: Users }
          ] as const).map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all ${
                  isSelected 
                    ? 'bg-gradient-to-r from-[#8161e1] to-[#9979f4] text-white shadow-sm' 
                    : 'text-[#6a427f] hover:bg-[#ebdff2]'
                }`}
              >
                <Icon className="w-3 h-3" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Contents Panels */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                <div className="text-center max-w-2xl mx-auto space-y-4 py-4">
                  <span className="text-[#8161e1] font-bold text-xs uppercase tracking-[0.3em] bg-[#8161e1]/8 border border-[#8161e1]/18 px-4.5 py-1.5 rounded-full inline-block">Direct Inbox</span>
                  <h1 className="text-4xl font-serif italic text-[#322851] tracking-tight">"Connect with the Research Desk"</h1>
                  <p className="text-[#6e5380] text-sm font-light leading-relaxed">
                    Have a question regarding psychometric coordinates, KNN distance models, JNTUH grading validation, or future sensory sanctuary modules? Drop us a prompt.
                  </p>
                </div>

                <div className="grid md:grid-cols-5 gap-8 max-w-3xl mx-auto items-start">
                  
                  {/* Left Column: Direct Info Badge Cards */}
                  <div className="md:col-span-2 space-y-4 font-sans text-left">
                    
                    {/* Lab Station address card */}
                    <div className="p-5 bg-white/70 border border-purple-100 rounded-3xl flex flex-col space-y-3 shadow-sm">
                      <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-[#8161e1]">
                        <Building2 className="w-4.5 h-4.5" />
                      </div>
                      <h4 className="text-xs font-bold text-[#322851] uppercase tracking-wider">Lab Station Address</h4>
                      <p className="text-[11px] text-slate-600 leading-normal font-light">
                        Department of CSE (Data Science)<br />
                        Sidevi Women's Engineering College<br />
                        Gandipet, Hyderabad, Telangana, India
                      </p>
                    </div>

                    {/* Email dispatcher card */}
                    <div className="p-5 bg-white/70 border border-purple-100 rounded-3xl flex flex-col space-y-3 shadow-sm">
                      <div className="w-9 h-9 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-500">
                        <Mail className="w-4.5 h-4.5" />
                      </div>
                      <h4 className="text-xs font-bold text-[#322851] uppercase tracking-wider">Primary Email Address</h4>
                      <a 
                        href={`mailto:${targetGmail}`}
                        className="text-[11px] text-[#8161e1] font-mono hover:underline flex items-center gap-1 leading-normal"
                      >
                        {targetGmail} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Right Column: Interaction Form */}
                  <div className="md:col-span-3 bg-white border border-purple-150 p-6 md:p-8 rounded-[2.5rem] shadow-xl shadow-[#8161e1]/5 text-left">
                    <AnimatePresence mode="wait">
                      {!sentStatus ? (
                        <motion.form 
                          key="form-fields"
                          onSubmit={handleSendMessage} 
                          className="space-y-4"
                        >
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 font-sans block">Your Name</label>
                            <input 
                              type="text" 
                              required
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Name/Scholar Name" 
                              className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-xs bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#8161e1] outline-none text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 font-sans block">Your Email</label>
                            <input 
                              type="email" 
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="you@university.edu" 
                              className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-xs bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#8161e1] outline-none text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 font-sans block">Subject Matter</label>
                            <select 
                              value={subject}
                              onChange={(e) => setSubject(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-xs bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#8161e1] outline-none text-slate-800"
                            >
                              <option value="Research Paper Query">Data Science Thesis Feedback</option>
                              <option value="Feedback on Psychometrics">Algorithmic Modeling Question</option>
                              <option value="Evaluation Panel Validation">Academic Sessional Verification</option>
                              <option value="Collaborate with Authors">General SINC Inquiry</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 font-sans block">Detailed Message</label>
                            <textarea 
                              required
                              rows={3}
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              placeholder="Type your thesis or testing inquiry here..."
                              className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-xs bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#8161e1] outline-none text-slate-800 resize-none"
                            ></textarea>
                          </div>

                          <button 
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-[#8161e1] to-[#9979f4] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                          >
                            <Send className="w-3.5 h-3.5" /> Dispatch to Laboratory Desk
                          </button>
                        </motion.form>
                      ) : (
                        <motion.div 
                          key="form-success"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="py-12 text-center space-y-4"
                        >
                          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto shadow-sm">
                            <CheckCircle className="w-6 h-6" />
                          </div>
                          <h3 className="text-lg font-bold text-[#322851]">Laboratory Mail Prefilled!</h3>
                          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                            We've prefilled a compliant academic request template! Opening your local email client to target <strong>{targetGmail}</strong>.
                          </p>
                          <button
                            onClick={resetForm}
                            className="px-4 py-2 border border-purple-100 rounded-full text-xs font-bold uppercase tracking-wider text-[#8161e1] hover:bg-slate-50 transition-all cursor-pointer"
                          >
                            Write Another Message
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </motion.div>
            )}

            {activeTab === 'team' && (
              <motion.div
                key="team"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                <div className="text-center max-w-2xl mx-auto space-y-4 py-4">
                  <span className="text-[#8161e1] font-bold text-xs uppercase tracking-[0.3em] bg-[#8161e1]/8 border border-[#8161e1]/18 px-4.5 py-1.5 rounded-full inline-block">The Creators</span>
                  <h2 className="text-3xl font-serif italic text-[#322851]">B.Tech Data Science Major Team</h2>
                  <p className="text-[#6e5380] text-xs font-light leading-relaxed">
                    Under the expert academic supervision of Dept of CSE-DS faculty of SWEC.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
                  {[
                    { 
                      name: "K. Laxmi Brunda", 
                      roll: "24D21A6730", 
                      initial: "K", 
                      title: "Lead Data Modeler", 
                      theme: "from-indigo-400 to-indigo-600",
                      responsibility: "Formulated the 12-vector model metrics & the KNN Distance maps."
                    },
                    { 
                      name: "G. Sravani", 
                      roll: "24D21A6722", 
                      initial: "G", 
                      title: "Integrations architect", 
                      theme: "from-pink-400 to-pink-600",
                      responsibility: "Wired up client-side fallback query modules & chronotype maps."
                    },
                    { 
                      name: "A. Shirisha", 
                      roll: "24D21A6702", 
                      initial: "A", 
                      title: "Design system engineer", 
                      theme: "from-emerald-400 to-emerald-600",
                      responsibility: "Created visual identity, custom sensory waveforms & layouts."
                    }
                  ].map((author, idx) => (
                    <div key={idx} className="bg-white border border-purple-100 p-5 rounded-3xl space-y-4 hover:shadow-lg transition-all flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${author.theme} text-white flex items-center justify-center font-bold font-serif text-sm`}>
                            {author.initial}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-[#322851]">{author.name}</h4>
                            <span className="text-[9px] font-mono uppercase text-slate-400 block tracking-wider mt-0.5">{author.title}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 font-light leading-relaxed">
                          {author.responsibility}
                        </p>
                      </div>

                      <div className="border-t border-purple-50 pt-2.5 text-[9px] font-mono text-slate-400 flex justify-between items-center">
                        <span>ROLL: {author.roll}</span>
                        <span className="text-[8px] bg-slate-50 px-2 py-0.5 border rounded uppercase font-bold text-slate-500">JNTUH Verified</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Faculty Guides card */}
                <div className="bg-gradient-to-r from-violet-50/50 via-[#9979f4]/5 to-transparent border border-[#8161e1]/20 p-6 rounded-3xl max-w-3xl mx-auto flex flex-col md:flex-row gap-5 items-center justify-between text-left">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-[#8161e1]/20 flex items-center justify-center text-[#8161e1] shadow-sm shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-[#322851]">Head Faculty Guide & Advisor</h4>
                      <p className="text-[11px] text-slate-600 leading-normal font-light">
                        <strong>Mrs. Hymavathi</strong> (<span className="text-[10px] font-mono">Asst. Professor</span>, Dept of CSE-DS)<br />
                        Recognized for standard-setting mentoring in high-dimensional mental profiling algorithms.
                      </p>
                    </div>
                  </div>
                  <div className="text-[10px] uppercase tracking-widest font-mono text-slate-400 bg-white border px-3.5 py-1.5 rounded-xl font-bold shrink-0 shadow-sm text-center">
                    SWEC Lab 4 Approved
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  );
};
