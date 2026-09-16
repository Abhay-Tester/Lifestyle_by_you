import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Phone, 
  User, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Copy,
  ExternalLink,
  Edit2,
  Check,
  X,
  Sparkles,
  ShieldAlert,
  PhoneCall
} from 'lucide-react';
import { EmergencyNote, EmergencyNoteCategory, Priority } from '../types';

interface EmergencyNotesSectionProps {
  notes: EmergencyNote[];
  onAddNote: (note: Omit<EmergencyNote, 'id' | 'createdAt'>) => void;
  onUpdateNote: (id: string, partial: Partial<EmergencyNote>) => void;
  onDeleteNote: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export const EmergencyNotesSection: React.FC<EmergencyNotesSectionProps> = ({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onToggleComplete,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Note Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [clientName, setClientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [category, setCategory] = useState<EmergencyNoteCategory>('client_request');
  const [priority, setPriority] = useState<Priority>('high');

  // Editing Note State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editClientName, setEditClientName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editPriority, setEditPriority] = useState<Priority>('high');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    onAddNote({
      title: title.trim() || (clientName ? `Call / Request from ${clientName}` : 'Emergency Client Note'),
      content: content.trim(),
      clientName: clientName.trim() || undefined,
      phoneNumber: phoneNumber.trim() || undefined,
      category,
      priority,
      isCompleted: false,
    });

    setTitle('');
    setContent('');
    setClientName('');
    setPhoneNumber('');
    setShowAddForm(false);
  };

  const handleStartEdit = (note: EmergencyNote) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditClientName(note.clientName || '');
    setEditPhone(note.phoneNumber || '');
    setEditPriority(note.priority);
  };

  const handleSaveEdit = (id: string) => {
    onUpdateNote(id, {
      title: editTitle,
      content: editContent,
      clientName: editClientName || undefined,
      phoneNumber: editPhone || undefined,
      priority: editPriority,
      updatedAt: new Date().toISOString(),
    });
    setEditingId(null);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Filter notes
  const filteredNotes = notes.filter((n) => {
    const matchesSearch = 
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.clientName && n.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (n.phoneNumber && n.phoneNumber.includes(searchTerm));
    const matchesCategory = filterCategory === 'all' || n.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || n.priority === filterPriority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const pendingNotesCount = notes.filter((n) => !n.isCompleted).length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Quick Actions */}
      <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border border-amber-200/80 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-amber-500 text-white rounded-xl shadow-xs shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              Emergency & Client Notes
              {pendingNotesCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-xs font-black animate-pulse">
                  {pendingNotesCount} Active
                </span>
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-xl">
              Quickly capture incoming client emergencies, phone requests, critical action items, and spontaneous thoughts without interrupting your main routine.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full sm:w-auto px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{showAddForm ? 'Close Form' : 'Add Emergency Note'}</span>
        </button>
      </div>

      {/* Add New Emergency Note Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white border-2 border-rose-300 rounded-2xl p-4 sm:p-6 shadow-md space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-600" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Instant Note / Client Call Record
              </h3>
            </div>
            <span className="text-xs text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-bold">
              Instant Save
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Note / Topic Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Urgent Bug Fix for Client X / Payment Reminder"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50/50"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Client / Person Name (Optional)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Mr. Sharma / Project Lead"
                  className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50/50"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EmergencyNoteCategory)}
                className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50/50"
              >
                <option value="client_request">📞 Client Request / Call</option>
                <option value="emergency_todo">🚨 Emergency Urgent Task</option>
                <option value="meeting_note">📝 Meeting / Discussion</option>
                <option value="quick_thought">💡 Spontaneous Idea / Thought</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Urgency Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50/50"
              >
                <option value="high">🔴 High / Urgent Emergency</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="low">🟢 Normal / Low Priority</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Note Details & Instructions *
            </label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type detailed note: what did client request, what are the next steps, deadlines, or deliverables..."
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50/50"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              Save Emergency Note
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
        {/* Search Field */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notes, clients, numbers..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
          >
            <option value="all">All Categories</option>
            <option value="client_request">📞 Client Calls</option>
            <option value="emergency_todo">🚨 Emergency Todo</option>
            <option value="meeting_note">📝 Meeting Notes</option>
            <option value="quick_thought">💡 Ideas / Thoughts</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
          >
            <option value="all">All Priorities</option>
            <option value="high">🔴 High Urgency</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Normal</option>
          </select>
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No emergency notes found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchTerm || filterCategory !== 'all' || filterPriority !== 'all'
              ? 'No notes match your filter criteria.'
              : 'You have zero pending emergency notes. Click "Add Emergency Note" to write down client requirements.'}
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Write First Emergency Note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map((note) => {
            const isEditing = editingId === note.id;

            return (
              <div
                key={note.id}
                className={`bg-white rounded-2xl border transition-all shadow-xs flex flex-col justify-between ${
                  note.isCompleted 
                    ? 'border-slate-200 opacity-60 bg-slate-50/60' 
                    : note.priority === 'high'
                    ? 'border-rose-300 ring-1 ring-rose-400/20 shadow-rose-100/50'
                    : 'border-slate-200 hover:border-indigo-300'
                }`}
              >
                {/* Card Header */}
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Category Badge */}
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        note.category === 'client_request'
                          ? 'bg-amber-100 text-amber-800'
                          : note.category === 'emergency_todo'
                          ? 'bg-rose-100 text-rose-800'
                          : note.category === 'meeting_note'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {note.category.replace('_', ' ')}
                      </span>

                      {/* Priority Tag */}
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        note.priority === 'high'
                          ? 'bg-rose-600 text-white'
                          : note.priority === 'medium'
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {note.priority}
                      </span>

                      {note.isCompleted && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Resolved / Done
                        </span>
                      )}
                    </div>

                    {/* Quick Resolve Checkbox */}
                    <button
                      onClick={() => onToggleComplete(note.id)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        note.isCompleted
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'border-slate-300 hover:bg-slate-100 text-slate-400 hover:text-slate-700'
                      }`}
                      title={note.isCompleted ? 'Mark unresolved' : 'Mark resolved/done'}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Title & Body */}
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full text-sm font-bold p-2 border rounded-lg bg-slate-50"
                        placeholder="Note Title"
                      />
                      <textarea
                        rows={3}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full text-xs p-2 border rounded-lg bg-slate-50"
                        placeholder="Note Content"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={editClientName}
                          onChange={(e) => setEditClientName(e.target.value)}
                          placeholder="Client Name"
                          className="text-xs p-2 border rounded-lg"
                        />
                        <input
                          type="tel"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          placeholder="Phone Number"
                          className="text-xs p-2 border rounded-lg"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className={`text-sm sm:text-base font-bold text-slate-900 ${
                        note.isCompleted ? 'line-through text-slate-400' : ''
                      }`}>
                        {note.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-700 mt-1 whitespace-pre-wrap leading-relaxed">
                        {note.content}
                      </p>
                    </div>
                  )}

                  {/* Client & Phone metadata if present */}
                  {(note.clientName || note.phoneNumber) && !isEditing && (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 truncate">
                        {note.clientName && (
                          <div className="flex items-center gap-1 font-semibold text-slate-800 truncate">
                            <User className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            <span className="truncate">{note.clientName}</span>
                          </div>
                        )}
                        {note.phoneNumber && (
                          <div className="flex items-center gap-1 text-slate-600">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <a 
                              href={`tel:${note.phoneNumber}`}
                              className="text-indigo-600 hover:underline font-mono"
                            >
                              {note.phoneNumber}
                            </a>
                          </div>
                        )}
                      </div>

                      {note.phoneNumber && (
                        <a
                          href={`tel:${note.phoneNumber}`}
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center gap-1 font-bold shrink-0 transition-colors"
                          title="Call Client"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span className="hidden xs:inline">Call</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Toolbar */}
                <div className="p-3 px-4 sm:px-5 bg-slate-50/80 border-t border-slate-100 rounded-b-2xl flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{note.createdAt}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1.5 text-slate-500 hover:bg-slate-200 rounded-lg"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleSaveEdit(note.id)}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Save
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleCopy(`${note.title}\n${note.content}${note.clientName ? `\nClient: ${note.clientName}` : ''}${note.phoneNumber ? `\nPhone: ${note.phoneNumber}` : ''}`, note.id)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-200/70 rounded-lg transition-colors"
                          title="Copy Note Text"
                        >
                          {copiedId === note.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => handleStartEdit(note)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-200/70 rounded-lg transition-colors"
                          title="Edit Note"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm('Delete this emergency note?')) {
                              onDeleteNote(note.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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
