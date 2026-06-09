import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, X, Send, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';

export const FeedbackModal = ({ 
  isOpen, 
  onClose, 
  rating, 
  setRating, 
  text, 
  setText, 
  onSubmit, 
  isSubmitting 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  rating: number, 
  setRating: (r: number) => void, 
  text: string, 
  setText: (t: string) => void, 
  onSubmit: () => void, 
  isSubmitting: boolean 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-surface border border-subtle rounded-3xl p-12 shadow-2xl space-y-12"
          >
            <button onClick={onClose} className="absolute top-8 right-8 text-muted hover:text-primary transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="text-center space-y-4">
              <h3 className="micro-label">Research Feedback</h3>
              <h2 className="text-3xl font-serif italic text-primary">Analysis Accuracy</h2>
              <p className="text-xs text-muted leading-relaxed italic">"How precise was the neural mapping of your cognitive landscape?"</p>
            </div>
            
            <div className="flex justify-center gap-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-all hover:scale-110"
                >
                  <Star className={cn("w-8 h-8", rating >= star ? "text-accent-blue fill-accent-blue" : "text-muted opacity-30")} />
                </button>
              ))}
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Technical observations or suggestions..."
              className="w-full h-32 bg-surface/50 border border-subtle rounded-2xl p-4 text-xs text-primary placeholder:text-muted/30 focus:outline-none focus:border-accent-blue/40 transition-all resize-none font-mono"
            />

            <button 
              onClick={onSubmit}
              disabled={rating === 0 || isSubmitting}
              className="btn-primary w-full flex items-center justify-center gap-3"
            >
              {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Transmit Feedback
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
