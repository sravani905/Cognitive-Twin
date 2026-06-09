import React, { useState, useEffect, useRef, Fragment } from 'react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { Bot, User, Trash2, X, Sparkle, Send, MessageCircle, RefreshCw, Activity, Plus, GripVertical } from 'lucide-react';
import Markdown from 'react-markdown';
import { chatWithTwinStream, getHeuristicChatReply } from '../services/geminiService';
import { cn } from '../lib/utils';

export const ChatBot = ({ profile, showCounsellor, setShowCounsellor }: { profile: any, showCounsellor: boolean, setShowCounsellor: (v: boolean) => void }) => {
  const [user] = useState(() => {
    const saved = localStorage.getItem('COGNITIVE_TWIN_USER');
    return saved ? JSON.parse(saved) : null;
  });
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', content: string, timestamp?: number }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const streamingTextRef = useRef('');
  const lastUpdateRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  const MAX_CHARS = 1000;

  const suggestedQuestions = [
    "Identify primary cognitive strengths.",
    "Optimization strategies for focus.",
    "Career trajectory alignment.",
    "Archetype technical breakdown.",
    "Learning architecture tips."
  ];

  useEffect(() => {
    if (user && isOpen) {
      const savedMessages = JSON.parse(localStorage.getItem(`chats_${user.uid}`) || '[]');
      setMessages(savedMessages);
    }
  }, [user, isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingMessage]);

  const clearChat = () => {
    if (!user) return;
    localStorage.removeItem(`chats_${user.uid}`);
    setMessages([]);
  };

  const handleSend = async (text?: string) => {
    const userMsg = text || input;
    if (!userMsg.trim() || userMsg.length > MAX_CHARS || !user) return;
    
    setInput('');
    setIsTyping(true);
    setStreamingMessage('');
    streamingTextRef.current = '';

    try {
      const currentMessages = [...messages];
      const newUserMsg = {
        role: 'user' as const,
        content: userMsg,
        timestamp: Date.now()
      };
      
      const updatedMessagesWithUser = [...currentMessages, newUserMsg];
      setMessages(updatedMessagesWithUser);

      if (!navigator.onLine) {
        setIsTyping(false);
        const offlineReply = {
          role: 'model' as const,
          content: "Neural link disrupted. I am currently operating in limited offline mode. Predictive analysis and deep reasoning require an active synchronization with the cloud. Please restore connectivity for full insights.",
          timestamp: Date.now()
        };
        const finalMessages = [...updatedMessagesWithUser, offlineReply];
        setMessages(finalMessages);
        localStorage.setItem(`chats_${user.uid}`, JSON.stringify(finalMessages));
        return;
      }

      const context = showCounsellor 
        ? "You are a professional Career Counsellor. Provide expert, strategic advice based on this cognitive profile. Be more formal and analytical than the standard assistant."
        : "You are a Research Assistant for Cognitive Twin. Provide technical, precise, and insightful analysis of the user's cognitive data.";

      const stream = await chatWithTwinStream(updatedMessagesWithUser, profile, context);
      
      for await (const chunk of stream) {
        const chunkText = chunk.text || '';
        streamingTextRef.current += chunkText;
        
        const now = Date.now();
        if (now - lastUpdateRef.current > 32) {
          setStreamingMessage(streamingTextRef.current);
          lastUpdateRef.current = now;
        }
      }
      
      setStreamingMessage(streamingTextRef.current);
      
      const newModelMsg = {
        role: 'model' as const,
        content: streamingTextRef.current,
        timestamp: Date.now()
      };
      
      const finalMessages = [...updatedMessagesWithUser, newModelMsg];
      setMessages(finalMessages);
      localStorage.setItem(`chats_${user.uid}`, JSON.stringify(finalMessages));
      
      setStreamingMessage('');
      streamingTextRef.current = '';
    } catch (e) {
      console.error("Chat error:", e);
      const fallbackContent = getHeuristicChatReply(userMsg, profile);
      const errorMessage = `SYSTEM NOTICE: Neural Link unstable. Reverting to local heuristic protocols.\n\n${fallbackContent}`;
      
      const errorMsg = {
        role: 'model' as const,
        content: errorMessage,
        timestamp: Date.now()
      };
      
      const finalMsgWithError = [...messages, { role: 'user' as const, content: userMsg, timestamp: Date.now() }, errorMsg];
      setMessages(finalMsgWithError);
      if (user) {
        localStorage.setItem(`chats_${user.uid}`, JSON.stringify(finalMsgWithError));
      }
    } finally {
      setIsTyping(false);
    }
  };

  const isInputInvalid = input.length > MAX_CHARS;

  return (
    <motion.div 
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex flex-col items-end gap-4 md:gap-6"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[calc(100vw-2rem)] sm:w-[450px] h-[70vh] sm:h-[700px] bg-main border border-primary/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
          >
            <div 
              onPointerDown={(e) => dragControls.start(e)}
              className="p-6 border-b border-primary/10 flex justify-between items-center bg-primary/[0.02] technical-grid cursor-grab active:cursor-grabbing"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-10 h-10 border border-primary/10 flex items-center justify-center">
                    {showCounsellor ? <User className="w-5 h-5 text-primary" /> : <Bot className="w-5 h-5 text-muted" />}
                  </div>
                  {isTyping && (
                    <motion.div 
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute -top-1 -right-1 w-2 h-2 bg-accent-blue shadow-[0_0_5px_var(--accent-blue)]"
                    />
                  )}
                </div>
                <div>
                  <span className="micro-label text-primary block">
                    {showCounsellor ? "Career Strategist" : "Research Assistant"}
                  </span>
                  <span className="text-[8px] text-muted uppercase tracking-widest font-mono">Neural Link Established</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={clearChat}
                  className="flex items-center gap-2 micro-label hover:text-primary transition-colors border-r border-primary/10 pr-4"
                >
                  <Plus className="w-3 h-3" /> New Chat
                </button>
                <button 
                  onClick={() => setShowCounsellor(!showCounsellor)}
                  className="micro-label hover:text-primary transition-colors"
                >
                  {showCounsellor ? "Switch to Assistant" : "Consult Strategist"}
                </button>
                <button onClick={() => setIsOpen(false)} className="text-muted hover:text-primary transition-colors pl-2">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
              {messages.length === 0 && !streamingMessage && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-10 px-8">
                  <div className="w-16 h-16 border border-primary/5 flex items-center justify-center">
                    <Activity className="w-8 h-8 text-muted/30" />
                  </div>
                  <div className="space-y-4">
                    <p className="text-lg font-serif italic text-primary">"Awaiting technical inquiries."</p>
                    <p className="micro-label">Query the cognitive database for analysis.</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3 pt-4">
                    {suggestedQuestions.map((q, i) => (
                      <button 
                        key={i}
                        onClick={() => handleSend(q)}
                        className="micro-label px-4 py-2 border border-primary/5 hover:bg-primary/5 hover:text-primary transition-all"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {messages.map((m, i) => (
                <div key={i} className={cn("flex flex-col", m.role === 'user' ? "items-end" : "items-start")}>
                  <div className={cn(
                    "max-w-[90%] p-5 rounded-2xl text-xs leading-relaxed",
                    m.role === 'user' ? "bg-primary text-main rounded-tr-none" : "bg-primary/[0.03] text-secondary border border-primary/5 rounded-tl-none"
                  )}>
                    <div className="markdown-body">
                      <Markdown>{m.content}</Markdown>
                    </div>
                  </div>
                  <span className="micro-label mt-3 px-1 text-[8px] text-muted">
                    {m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
              ))}

              {streamingMessage && (
                <div className="flex flex-col items-start">
                  <div className="max-w-[90%] p-5 rounded-2xl rounded-tl-none text-xs leading-relaxed bg-primary/[0.03] text-secondary border border-primary/5">
                    <div className="markdown-body">
                      <Markdown>{streamingMessage}</Markdown>
                    </div>
                  </div>
                </div>
              )}

              {isTyping && !streamingMessage && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-3 text-muted micro-label">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Processing Query...
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 border-t border-primary/5 bg-primary/[0.01] space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Enter research query..."
                  className={cn(
                    "w-full bg-transparent border-b py-4 pr-12 text-xs text-primary placeholder:text-muted/30 focus:outline-none transition-all font-mono",
                    isInputInvalid ? "border-red-500/50" : "border-primary/10 focus:border-primary/30"
                  )}
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping || isInputInvalid}
                  className={cn("absolute right-0 top-1/2 -translate-y-1/2 p-2 transition-colors", (input.trim() && !isInputInvalid) ? "text-primary" : "text-muted/30")}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <p className="micro-label text-muted/30">Neural Engine: Gemini 3.1 Flash Lite</p>
                <span className={cn(
                  "text-[8px] font-mono uppercase tracking-widest",
                   isInputInvalid ? "text-red-500" : "text-muted/30"
                )}>
                  {input.length} / {MAX_CHARS}
                </span>
              </div>
              {isInputInvalid && (
                <p className="text-[8px] text-red-500 uppercase tracking-widest text-center animate-pulse">
                  Query exceeds maximum character threshold
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        onPointerDown={(e) => !isOpen && dragControls.start(e)}
        className={cn(
          "w-16 h-16 border border-primary/10 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 group relative overflow-hidden",
          isOpen ? "bg-primary text-main cursor-default" : "bg-main text-primary hover:bg-primary/5 cursor-grab active:cursor-grabbing"
        )}
      >
        {!isOpen && <GripVertical className="absolute top-1 left-1 w-3 h-3 text-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />}
        <MessageCircle className="w-7 h-7" />
      </button>
    </motion.div>
  );
};
