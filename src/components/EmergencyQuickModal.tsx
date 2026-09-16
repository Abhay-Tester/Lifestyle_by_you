import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  ShieldAlert, 
  User, 
  Phone, 
  CheckCircle2,
  FileText
} from 'lucide-react';
import { EmergencyNote, EmergencyNoteCategory, Priority } from '../types';

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
  const [clientName, setClientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [priority, setPriority] = useState<Priority>('high');
  const [category, setCategory] = useState<EmergencyNoteCategory>('client_request');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    onAddNote({
      title: title.trim() || (clientName ? `Client Call: ${clientName}` : 'Urgent Client Note'),
      content: content.trim(),
      clientName: clientName.trim() || undefined,
      phoneNumber: phoneNumber.trim() || undefined,
      category,
      priority,
      isCompleted: false,
    });

    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      setTitle('');
      setContent('');
      setClientName('');
      setPhoneNumber('');
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      
      {/* Modal Container */}
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-rose-400 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        role="dialog"
      >
        
        {/* Header with emergency alert styling */}
        <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-lg shadow-inner">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base leading-tight flex items-center gap-1.5">
                Client Emergency Note
              </h3>
              <p className="text-[11px] text-rose-100 font-medium">
                Instant note capture for urgent calls & client requests
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Feedback Banner */}
        {showSuccessToast && (
          <div className="bg-emerald-500 text-white p-3 text-center text-xs font-bold flex items-center justify-center gap-2 animate-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>Emergency note saved & synced!</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Note Title */}
          <div>
            <label className="block font-bold text-slate-800 mb-1 text-xs">
              Subject / Request Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Client requested database export before 4 PM"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50/50"
              autoFocus
              required
            />
          </div>

          {/* Client Name & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 text-[11px]">
                Client / Caller Name
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Client Name"
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 text-[11px]">
                Contact Number
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Category & Priority selector */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 text-[11px]">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EmergencyNoteCategory)}
                className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-rose-500"
              >
                <option value="client_request">📞 Client Call</option>
                <option value="emergency_todo">🚨 Urgent Task</option>
                <option value="meeting_note">📝 Meeting</option>
                <option value="quick_thought">💡 Idea</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 text-[11px]">
                Urgency
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-rose-500 font-bold"
              >
                <option value="high">🔴 High Emergency</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Normal</option>
              </select>
            </div>
          </div>

          {/* Note content / instructions */}
          <div>
            <label className="block font-bold text-slate-800 mb-1 text-xs">
              Instructions & Emergency Details *
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type urgent instructions, deliverables, or notes from the conversation..."
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50/50"
              required
            />
          </div>

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-[10px] text-slate-400 font-medium">
              Saved instantly to your secure lifestyle cloud
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
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
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
