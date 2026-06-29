import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { notesApi } from '../services/api';
import EditNoteModal from '../components/EditNoteModal';
import {
  HiOutlineArrowLeft,
  HiOutlineTrash,
  HiOutlineArchive,
  HiOutlineHeart,
  HiOutlineBookmarkAlt,
  HiOutlineClock,
  HiOutlineTag,
  HiOutlineFolder,
} from 'react-icons/hi';

export default function NoteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const fetchNote = useCallback(async () => {
    try {
      const { data } = await notesApi.getOne(id);
      setNote(data.note);
    } catch (err) {
      toast.error(err.message);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchNote();
  }, [fetchNote]);

  const handleToggleArchive = async () => {
    try {
      const { data } = await notesApi.toggleArchive(id);
      setNote(data.note);
      toast.success(data.note.archived ? 'Note archived' : 'Note restored');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const { data } = await notesApi.toggleFavorite(id);
      setNote(data.note);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleTogglePin = async () => {
    try {
      const { data } = await notesApi.togglePin(id);
      setNote(data.note);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await notesApi.delete(id);
      toast.success('Note deleted');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUpdate = async (noteId, data) => {
    try {
      const res = await notesApi.update(noteId, data);
      setNote(res.data.note);
      setEditing(false);
      toast.success('Note updated!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="glass-card p-8 skeleton h-96" />
      </div>
    );
  }

  if (!note) return null;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 px-4 py-2 rounded-xl glass hover:border-primary-500/30 transition-all" style={{ color: 'var(--text-primary)' }}>
            <HiOutlineArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex gap-2">
            <button onClick={handleTogglePin} className="p-2.5 rounded-xl glass hover:border-primary-500/30 transition-all" style={{ color: note.pinned ? 'var(--accent)' : 'var(--text-secondary)' }}>
              <HiOutlineBookmarkAlt className="w-5 h-5" />
            </button>
            <button onClick={handleToggleArchive} className="p-2.5 rounded-xl glass hover:border-primary-500/30 transition-all" style={{ color: 'var(--text-secondary)' }}>
              <HiOutlineArchive className="w-5 h-5" />
            </button>
            <button onClick={handleToggleFavorite} className="p-2.5 rounded-xl glass hover:border-primary-500/30 transition-all" style={{ color: note.favorite ? '#ec4899' : 'var(--text-secondary)' }}>
              <HiOutlineHeart className="w-5 h-5" />
            </button>
            <button onClick={() => setEditing(true)} className="btn-primary px-4 py-2.5 text-sm">
              Edit
            </button>
            <button onClick={handleDelete} className="p-2.5 rounded-xl glass hover:border-red-500/30 hover:text-red-400 transition-all" style={{ color: 'var(--text-secondary)' }}>
              <HiOutlineTrash className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Note content */}
        <div
          className="glass-card p-8"
          style={{
            background: `linear-gradient(135deg, ${note.color}22, ${note.color}11)`,
            borderColor: `${note.color}44`,
          }}
        >
          <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            {note.title}
          </h1>

          {note.content && (
            <div className="text-base leading-relaxed whitespace-pre-wrap mb-8" style={{ color: 'var(--text-secondary)' }}>
              {note.content}
            </div>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 pt-6 border-t" style={{ borderColor: 'var(--glass-border)' }}>
            <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <HiOutlineFolder className="w-4 h-4" />
              {note.category}
            </div>
            {note.tags?.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <HiOutlineTag className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                {note.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-0.5 rounded-md text-xs font-medium" style={{ background: 'var(--glass-bg)', color: 'var(--accent)', border: '1px solid var(--glass-border)' }}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-1.5 text-sm ml-auto" style={{ color: 'var(--text-secondary)' }}>
              <HiOutlineClock className="w-4 h-4" />
              Updated {formatDate(note.updatedAt)}
            </div>
          </div>
        </div>
      </motion.div>

      {editing && (
        <EditNoteModal note={note} onClose={() => setEditing(false)} onUpdate={handleUpdate} />
      )}
    </div>
  );
}
