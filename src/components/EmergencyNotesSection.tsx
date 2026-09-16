import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Trash2, 
  Clock, 
  Calendar,
  Copy, 
  Edit2, 
  Check, 
  X, 
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { EmergencyNote } from '../types';
import { getTodayDateString, formatDateFriendly, getCurrentTimeString, formatTimeFriendly } from '../utils/date';

interface EmergencyNotesSectionProps {
  notes: EmergencyNote[];
  onAddNote: (note: Omit<EmergencyNote, 'id' | 'createdAt'>) => void;
  onUpdateNote: (id: string, partial: Partial<EmergencyNote>) => void;
  onDeleteNote: (id: string) => void;
  onToggleComplete?: (id: string) => void;
}

export const EmergencyNotesSection: React.FC<EmergencyNotesSectionProps> = ({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}) => {
  const today = getTodayDateString();
  const currentTime = getCurrentTimeString();

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Note Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [noteDate, setNoteDate] = useState(today);
  const [noteTime, setNoteTime] = useState(currentTime);

  // Editing Note State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');

  const resetAddForm = () => {
    setTitle('');
    setContent('');
    setNoteDate(getTodayDateString());
    setNoteTime(getCurrentTimeString());
    setShowAddForm(false);
  };

  const setFormToNow = () => {
    setNoteDate(getTodayDateString());
    setNoteTime(getCurrentTimeString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    onAddNote({
      title: title.trim() || 'Untitled Note',
      content: content.trim(),
      date: noteDate || today,
      time: noteTime || getCurrentTimeString(),
      isCompleted: false,
    });

    resetAddForm();
  };

  const handleStartEdit = (note: EmergencyNote) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditDate(note.date || note.createdAt || today);
    setEditTime(note.time || '12:00');
  };

  const handleSaveEdit = (id: string) => {
    onUpdateNote(id, {
      title: editTitle.trim() || 'Untitled Note',
      content: editContent.trim(),
      date: editDate || today,
      time: editTime || '12:00',
      updatedAt: new Date().toISOString(),
    });
    setEditingId(null);
  };

  const handleCopy = (note: EmergencyNote) => {
    const dateFormatted = note.date ? formatDateFriendly(note.date) : note.createdAt;
    const timeFormatted = note.time ? formatTimeFriendly(note.time) : '';
    const dateLine = [dateFormatted, timeFormatted].filter(Boolean).join(' • ');
    const textToCopy = `${note.title}\n${dateLine ? `[${dateLine}]\n` : ''}${note.content}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Filter notes by search
  const filteredNotes = notes.filter((n) => {
    const matchesSearch = 
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.date && n.date.includes(searchTerm));
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Quick Actions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-xs shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Notes
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                {notes.length} {notes.length === 1 ? 'Note' : 'Notes'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Add personal notes, thoughts, and reflections saved with date and time.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (!showAddForm) {
              setFormToNow();
            }
            setShowAddForm(!showAddForm);
          }}
          className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{showAddForm ? 'Close Form' : 'Add Note'}</span>
        </button>
      </div>

      {/* Add New Note Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white border-2 border-indigo-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Create Note
              </h3>
            </div>
            <button
              type="button"
              onClick={setFormToNow}
              className="text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Set to current date and time"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Set to Now</span>
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Daily thoughts, Meeting takeaway, Ideas..."
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
              autoFocus
            />
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                <span>Date</span>
              </label>
              <input
                type="date"
                value={noteDate}
                onChange={(e) => setNoteDate(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 cursor-pointer"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Time</span>
              </label>
              <input
                type="time"
                value={noteTime}
                onChange={(e) => setNoteTime(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 cursor-pointer"
                required
              />
            </div>
          </div>

          {/* Note Content */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Note Text *
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here..."
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 leading-relaxed"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={resetAddForm}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              Save Note
            </button>
          </div>
        </form>
      )}

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notes by keyword or date..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/40"
          />
        </div>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-xs text-slate-500 hover:text-slate-800 self-end sm:self-auto cursor-pointer"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No notes found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchTerm
              ? 'No notes match your search keywords.'
              : 'You have not added any notes yet. Click "Add Note" to write one with date and time.'}
          </p>
          <button
            onClick={() => {
              setFormToNow();
              setShowAddForm(true);
            }}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Write First Note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map((note) => {
            const isEditing = editingId === note.id;
            const displayDate = note.date || note.createdAt;
            const displayTime = note.time || '';

            return (
              <div
                key={note.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all shadow-xs flex flex-col justify-between"
              >
                {/* Card Header & Body */}
                <div className="p-4 sm:p-5 space-y-3">
                  
                  {/* Date and Time Header Chip */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <div className="flex items-center gap-1 text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md font-bold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDateFriendly(displayDate)}</span>
                      </div>
                      {displayTime && (
                        <div className="flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{formatTimeFriendly(displayTime)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title & Body content */}
                  {isEditing ? (
                    <div className="space-y-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full text-sm font-bold p-2 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Note Title"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Date
                          </label>
                          <input
                            type="date"
                            value={editDate}
                            onChange={(e) => setEditDate(e.target.value)}
                            className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Time
                          </label>
                          <input
                            type="time"
                            value={editTime}
                            onChange={(e) => setEditTime(e.target.value)}
                            className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Note Content
                        </label>
                        <textarea
                          rows={4}
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                          placeholder="Note Content"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {note.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-700 mt-2 whitespace-pre-wrap leading-relaxed">
                        {note.content}
                      </p>
                    </div>
                  )}

                </div>

                {/* Footer Toolbar */}
                <div className="p-2.5 px-4 sm:px-5 bg-slate-50/80 border-t border-slate-100 rounded-b-2xl flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Saved: {displayDate} {displayTime ? `at ${formatTimeFriendly(displayTime)}` : ''}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1.5 text-slate-500 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                          title="Cancel Edit"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleSaveEdit(note.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1 text-xs cursor-pointer shadow-xs transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Save
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleCopy(note)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
                          title="Copy Note Text"
                        >
                          {copiedId === note.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => handleStartEdit(note)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
                          title="Edit Note"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm('Delete this note?')) {
                              onDeleteNote(note.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
