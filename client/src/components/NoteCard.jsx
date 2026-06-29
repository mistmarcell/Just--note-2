import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineArchive,
  HiOutlineHeart,
  HiOutlineBookmarkAlt,
} from 'react-icons/hi';

const NOTE_THEMES = [
  { bg: 'from-slate-800 to-slate-700', border: 'border-slate-600/30' },
  { bg: 'from-red-900/30 to-red-800/20', border: 'border-red-500/20' },
  { bg: 'from-blue-900/30 to-blue-800/20', border: 'border-blue-500/20' },
  { bg: 'from-green-900/30 to-green-800/20', border: 'border-green-500/20' },
  { bg: 'from-yellow-900/30 to-yellow-800/20', border: 'border-yellow-500/20' },
  { bg: 'from-purple-900/30 to-purple-800/20', border: 'border-purple-500/20' },
  { bg: 'from-pink-900/30 to-pink-800/20', border: 'border-pink-500/20' },
  { bg: 'from-indigo-900/30 to-indigo-800/20', border: 'border-indigo-500/20' },
];

const LIGHT_NOTE_THEMES = [
  { bg: 'from-gray-100 to-gray-50', border: 'border-gray-200' },
  { bg: 'from-red-50 to-red-100/50', border: 'border-red-200' },
  { bg: 'from-blue-50 to-blue-100/50', border: 'border-blue-200' },
  { bg: 'from-green-50 to-green-100/50', border: 'border-green-200' },
  { bg: 'from-yellow-50 to-yellow-100/50', border: 'border-yellow-200' },
  { bg: 'from-purple-50 to-purple-100/50', border: 'border-purple-200' },
  { bg: 'from-pink-50 to-pink-100/50', border: 'border-pink-200' },
  { bg: 'from-indigo-50 to-indigo-100/50', border: 'border-indigo-200' },
];

export default function NoteCard({ note, onEdit, onDelete, onArchive, onFavorite, onPin }) {
  const navigate = useNavigate();
  const [showActions, setShowActions] = useState(false);

  const colorIndex = note.color ? parseInt(note.color.replace('#', ''), 16) % NOTE_THEMES.length : 0;
  const isLight = document.documentElement.classList.contains('light');
  const theme = isLight ? LIGHT_NOTE_THEMES[colorIndex] : NOTE_THEMES[colorIndex];

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`glass-card overflow-hidden cursor-pointer group relative bg-gradient-to-br ${theme.bg} ${theme.border}`}
      onClick={() => navigate(`/notes/${note._id}`)}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Pin indicator */}
      {note.pinned && (
        <div className="absolute top-3 right-3">
          <HiOutlineBookmarkAlt className="w-4 h-4" style={{ color: 'var(--accent)' }} />
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 line-clamp-1" style={{ color: 'var(--text-primary)' }}>
          {note.title}
        </h3>
        {note.content && (
          <p className="text-sm line-clamp-3 mb-3" style={{ color: 'var(--text-secondary)' }}>
            {note.content}
          </p>
        )}

        {/* Tags */}
        {note.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {note.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md text-xs font-medium"
                style={{
                  background: 'var(--glass-bg)',
                  color: 'var(--accent)',
                  border: '1px solid var(--glass-border)',
                }}
              >
                #{tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>+{note.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Category & Date */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs font-medium px-2 py-1 rounded-lg" style={{ background: 'var(--glass-bg)', color: 'var(--text-secondary)' }}>
            {note.category}
          </span>
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{formatDate(note.updatedAt)}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div
        className={`absolute inset-x-0 bottom-0 p-2 flex justify-around glass transition-all duration-200 ${
          showActions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="p-2 rounded-lg hover:bg-white/5 transition-all" style={{ color: 'var(--text-secondary)' }}>
          <HiOutlinePencil className="w-4 h-4" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onPin(); }} className="p-2 rounded-lg hover:bg-white/5 transition-all" style={{ color: note.pinned ? 'var(--accent)' : 'var(--text-secondary)' }}>
          <HiOutlineBookmarkAlt className="w-4 h-4" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onFavorite(); }} className="p-2 rounded-lg hover:bg-white/5 transition-all" style={{ color: note.favorite ? '#ec4899' : 'var(--text-secondary)' }}>
          <HiOutlineHeart className="w-4 h-4" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onArchive(); }} className="p-2 rounded-lg hover:bg-white/5 transition-all" style={{ color: 'var(--text-secondary)' }}>
          <HiOutlineArchive className="w-4 h-4" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-2 rounded-lg hover:bg-red-500/10 transition-all" style={{ color: 'var(--text-secondary)' }}>
          <HiOutlineTrash className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
