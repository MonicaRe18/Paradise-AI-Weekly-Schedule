import React, { useState } from 'react';
import { Info, MessageSquare, Edit2, Check, X } from 'lucide-react';
import { FooterNote } from '../types';

interface FooterNotesProps {
  notes: FooterNote[];
  onUpdateNotes: (updatedNotes: FooterNote[]) => void;
}

export const FooterNotes: React.FC<FooterNotesProps> = ({ notes, onUpdateNotes }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempText, setTempText] = useState<string>('');

  const handleStartEdit = (note: FooterNote) => {
    setEditingId(note.id);
    setTempText(note.text);
  };

  const handleSaveEdit = (noteId: string) => {
    const newNotes = notes.map((n) => (n.id === noteId ? { ...n, text: tempText } : n));
    onUpdateNotes(newNotes);
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="mt-6 space-y-3 print-container font-['Cairo']">
      {notes.map((note) => {
        const isEditing = editingId === note.id;
        const isWhatsapp = note.iconType === 'whatsapp';

        return (
          <div
            key={note.id}
            className={`relative group flex items-start sm:items-center justify-between gap-3 p-3.5 md:p-4 rounded-2xl border transition-all ${
              isWhatsapp
                ? 'bg-gradient-to-r from-emerald-950/40 via-slate-950 to-slate-900 border-emerald-500/30 text-emerald-100 shadow-lg shadow-emerald-950/20'
                : 'bg-gradient-to-r from-cyan-950/40 via-slate-950 to-slate-900 border-cyan-500/30 text-cyan-100 shadow-lg shadow-cyan-950/20'
            }`}
          >
            {/* Left Icon */}
            <div
              className={`p-2 rounded-xl shrink-0 flex items-center justify-center ${
                isWhatsapp ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
              }`}
            >
              {isWhatsapp ? (
                <MessageSquare className="w-5 h-5 animate-bounce" />
              ) : (
                <Info className="w-5 h-5" />
              )}
            </div>

            {/* Note Content / Text Editor */}
            <div className="flex-1 text-xs md:text-sm font-semibold leading-relaxed">
              {isEditing ? (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
                  <input
                    type="text"
                    value={tempText}
                    onChange={(e) => setTempText(e.target.value)}
                    className="flex-1 bg-slate-900 border border-cyan-400 rounded-lg px-3 py-1.5 text-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    autoFocus
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleSaveEdit(note.id)}
                      className="p-1.5 bg-emerald-500 text-slate-950 rounded-lg font-bold text-xs hover:bg-emerald-400 flex items-center gap-1 px-3"
                    >
                      <Check className="w-4 h-4" />
                      <span>حفظ</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-1.5 bg-slate-800 text-slate-300 rounded-lg font-bold text-xs hover:bg-slate-700 flex items-center gap-1 px-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <p>{note.text}</p>
              )}
            </div>

            {/* Edit Trigger Button */}
            {!isEditing && (
              <button
                onClick={() => handleStartEdit(note)}
                className="no-print opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg border border-slate-700 shrink-0"
                title="تعديل الملاحظة"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
