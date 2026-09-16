import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Calendar,
  Clock,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { EmergencyNote } from '../types';
import { getTodayDateString, getCurrentTimeString } from '../utils/date';

interface EmergencyQuickModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNote: (note: Omit<EmergencyNote, 'id' | 'createdAt'>) => void;
}

export const EmergencyQuickModal: React.FC<EmergencyQuickModalProps> = ({
  isOpen,
  onClose,
  onAddNote,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [noteDate, setNoteDate] = useState(getTodayDateString());
  const [noteTime, setNoteTime] = useState(getCurrentTimeString());
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNoteDate(getTodayDateString());
      setNoteTime(getCurrentTimeString());
      setTitle('');
      setContent('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    onAddNote({
      title: title.trim() || 'Untitled Note',
      content: content.trim(),
      date: noteDate || getTodayDateString(),
      time: noteTime || getCurrentTimeString(),
      isCompleted: false,
    });

    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      setTitle('');
      setContent('');
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      
      {/* Modal Container */}
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        role="dialog"
      >
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-inner">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                Add Note
              </h3>
              <p className="text-[11px] text-slate-300">
                Save a note with custom or current date and time
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Feedback Banner */}
        {showSuccessToast && (
          <div className="bg-emerald-600 text-white p-2.5 text-center text-xs font-bold flex items-center justify-center gap-2 animate-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>Note saved successfully!</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Note Title */}
          <div>
            <label className="block font-bold text-slate-800 mb-1 text-xs">
              Note Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Key decision, meeting note, idea..."
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
              autoFocus
              required
            />
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 text-[11px] flex items-center gap-1">
                <Calendar className="w-3 h-3 text-indigo-600" />
                <span>Date</span>
              </label>
              <input
                type="date"
                value={noteDate}
                onChange={(e) => setNoteDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 text-[11px] flex items-center gap-1">
                <Clock className="w-3 h-3 text-indigo-600" />
                <span>Time</span>
              </label>
              <input
                type="time"
                value={noteTime}
                onChange={(e) => setNoteTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                required
              />
            </div>
          </div>

          {/* Note content */}
          <div>
            <label className="block font-bold text-slate-800 mb-1 text-xs">
              Note Text *
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note details here..."
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 leading-relaxed"
              required
            />
          </div>

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <span className="text-[11px] text-slate-400 font-medium">
              Saved automatically with timestamp
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Save Note</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
