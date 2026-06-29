import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineX } from 'react-icons/hi';
import toast from 'react-hot-toast';

const COLORS = [
  '#1e293b', '#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#ec4899', '#6366f1',
];

const DEFAULT_CATEGORIES = ['Personal', 'School', 'Work', 'Ideas', 'Projects', 'Shopping'];

export default function EditNoteModal({ note, onClose, onUpdate }) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content || '');
  const [color, setColor] = useState(note.color || '#1e293b');
  const [category, setCategory] = useState(note.category || 'Personal');
  const [customCategory, setCustomCategory] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(note.tags || []);
  const [loading, setLoading] = useState(false);

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput('');
  };

  const removeTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    setLoading(true);
    await onUpdate(note._id, {
      title: title.trim(),
      content: content.trim(),
      color,
      category: customCategory || category,
      tags,
    });
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg glass-card p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Edit Note</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5">
            <HiOutlineX className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" className="input-field text-lg font-semibold" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
          <textarea className="input-field min-h-[120px] resize-y" value={content} onChange={(e) => setContent(e.target.value)} />

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Color</label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-lg transition-all duration-200 ${color === c ? 'ring-2 ring-offset-2 ring-primary-500 scale-110' : ''}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Category</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {DEFAULT_CATEGORIES.map((cat) => (
                <button key={cat} type="button" onClick={() => { setCategory(cat); setCustomCategory(''); }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${(category === cat && !customCategory) ? 'bg-primary-500/20 text-primary-500' : 'glass'}`}
                  style={{ color: (category === cat && !customCategory) ? 'var(--accent)' : 'var(--text-secondary)' }}
                >
                  {cat}
                </button>
              ))}
            </div>
            <input type="text" placeholder="Or custom category..." className="input-field" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Tags</label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 px-3 py-1 rounded-lg text-sm" style={{ background: 'var(--glass-bg)', color: 'var(--accent)', border: '1px solid var(--glass-border)' }}>
                  #{tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-400"><HiOutlineX className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" placeholder="Add a tag..." className="input-field flex-1" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} />
              <button type="button" onClick={addTag} className="px-4 py-2 rounded-lg glass font-medium" style={{ color: 'var(--text-primary)' }}>Add</button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
