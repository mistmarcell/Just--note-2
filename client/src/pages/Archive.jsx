import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { notesApi } from '../services/api';
import NoteCard from '../components/NoteCard';
import EditNoteModal from '../components/EditNoteModal';
import { HiOutlineArchive, HiOutlineRefresh } from 'react-icons/hi';

export default function Archive() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);

  const fetchNotes = useCallback(async () => {
    try {
      const { data } = await notesApi.getAll({ archived: true, sort: '-updatedAt', limit: 50 });
      setNotes(data.notes);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const handleRestore = async (id) => {
    try {
      await notesApi.toggleArchive(id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      toast.success('Note restored');
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
          <HiOutlineArchive className="w-6 h-6" style={{ color: 'var(--accent)' }} />
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Archive</h1>
        </div>
        <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>Notes you&apos;ve archived. Restore them anytime.</p>
      </motion.div>

      {loading ? (
        <div className="note-grid">
          {[1, 2, 3].map((i) => <div key={i} className="glass-card p-5 h-48 skeleton" />)}
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-20">
          <HiOutlineArchive className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No archived notes</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Archive notes to keep them out of sight but not deleted.</p>
        </div>
      ) : (
        <div className="note-grid">
          {notes.map((note, i) => (
            <motion.div key={note._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <NoteCard
                note={note}
                onEdit={() => setEditingNote(note)}
                onDelete={() => handleDelete(note._id)}
                onArchive={() => handleRestore(note._id)}
                onFavorite={() => {}}
                onPin={() => {}}
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
