import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { notesApi } from '../services/api';
import NoteCard from '../components/NoteCard';
import EditNoteModal from '../components/EditNoteModal';
import { HiOutlineHeart } from 'react-icons/hi';

export default function Favorites() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);

  const fetchNotes = useCallback(async () => {
    try {
      const { data } = await notesApi.getAll({ favorite: true, sort: '-updatedAt', limit: 50 });
      setNotes(data.notes);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const handleToggleFavorite = async (id) => {
    try {
      await notesApi.toggleFavorite(id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleToggleArchive = async (id) => {
    try {
      await notesApi.toggleArchive(id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      toast.success('Note archived');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notesApi.delete(id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      toast.success('Note deleted');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleTogglePin = async (id) => {
    try {
      const { data } = await notesApi.togglePin(id);
      setNotes((prev) => prev.map((n) => (n._id === id ? data.note : n)));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUpdateNote = async (id, data) => {
    try {
      const res = await notesApi.update(id, data);
      setNotes((prev) => prev.map((n) => (n._id === id ? res.data.note : n)));
      setEditingNote(null);
      toast.success('Note updated!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <HiOutlineHeart className="w-6 h-6" style={{ color: '#ec4899' }} />
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Favorites</h1>
        </div>
        <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>Your most-loved notes, all in one place.</p>
      </motion.div>

      {loading ? (
        <div className="note-grid">
          {[1, 2, 3].map((i) => <div key={i} className="glass-card p-5 h-48 skeleton" />)}
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-20">
          <HiOutlineHeart className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No favorites yet</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Click the heart icon on any note to add it to favorites.</p>
        </div>
      ) : (
        <div className="note-grid">
          {notes.map((note, i) => (
            <motion.div key={note._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <NoteCard
                note={note}
                onEdit={() => setEditingNote(note)}
                onDelete={() => handleDelete(note._id)}
                onArchive={() => handleToggleArchive(note._id)}
                onFavorite={() => handleToggleFavorite(note._id)}
                onPin={handleTogglePin}
              />
            </motion.div>
          ))}
        </div>
      )}

      {editingNote && (
        <EditNoteModal note={editingNote} onClose={() => setEditingNote(null)} onUpdate={handleUpdateNote} />
      )}
    </div>
  );
}
