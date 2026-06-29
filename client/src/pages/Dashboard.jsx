import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { notesApi } from '../services/api';
import NoteCard from '../components/NoteCard';
import CreateNoteModal from '../components/CreateNoteModal';
import EditNoteModal from '../components/EditNoteModal';
import { HiOutlineSearch, HiOutlinePlus, HiOutlineFilter, HiOutlineX } from 'react-icons/hi';
import { useSearchParams } from 'react-router-dom';

const DEFAULT_CATEGORIES = ['Personal', 'School', 'Work', 'Ideas', 'Projects', 'Shopping'];

export default function Dashboard() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState('-updatedAt');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [stats, setStats] = useState({ total: 0, archived: 0, favorite: 0, categories: [] });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const s = searchParams.get('search');
    const c = searchParams.get('category');
    if (s) setSearch(s);
    if (c) setCategory(c);
  }, [searchParams]);

  const fetchNotes = useCallback(async () => {
    try {
      const params = { sort, page: 1, limit: 50 };
      if (search) params.search = search;
      if (category) params.category = category;
      if (category === 'uncategorized') {
        delete params.category;
        params.category = '';
      }
      const { data } = await notesApi.getAll(params);
      setNotes(data.notes);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, category, sort]);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await notesApi.getStats();
      setStats(data.stats);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchNotes();
    fetchStats();
  }, [fetchNotes, fetchStats]);

  const handleCreateNote = async (noteData) => {
    try {
      const { data } = await notesApi.create(noteData);
      setNotes((prev) => [data.note, ...prev]);
      setShowCreateModal(false);
      fetchStats();
      toast.success('Note created!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUpdateNote = async (id, noteData) => {
    try {
      const { data } = await notesApi.update(id, noteData);
      setNotes((prev) => prev.map((n) => (n._id === id ? data.note : n)));
      setEditingNote(null);
      toast.success('Note updated!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await notesApi.delete(id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      fetchStats();
      toast.success('Note deleted');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleToggleArchive = async (id) => {
    try {
      const { data } = await notesApi.toggleArchive(id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      fetchStats();
      toast.success(data.note.archived ? 'Note archived' : 'Note restored');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      const { data } = await notesApi.toggleFavorite(id);
      setNotes((prev) => prev.map((n) => (n._id === id ? data.note : n)));
      fetchStats();
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

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setSort('-updatedAt');
    setShowFilters(false);
    setSearchParams({});
  };

  const hasFilters = search || category || sort !== '-updatedAt';

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome & Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Welcome back, {user?.name?.split(' ')[0] || 'User'}
        </h1>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>Here&apos;s what&apos;s happening with your notes</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Notes', value: stats.total },
            { label: 'Favorites', value: stats.favorite },
            { label: 'Archived', value: stats.archived },
            { label: 'Categories', value: stats.categories?.length || 0 },
          ].map(({ label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-4 text-center"
            >
              <p className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--accent)' }}>{value}</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Search notes by title, content, tags..."
            className="input-field pl-12"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2">
              <HiOutlineX className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3 rounded-xl glass transition-all duration-200 flex items-center gap-2 ${
            hasFilters ? 'border-primary-500/50' : ''
          }`}
          style={{ color: 'var(--text-primary)' }}
        >
          <HiOutlineFilter className="w-5 h-5" />
          <span className="hidden md:inline">Filters</span>
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass-card p-4 mb-6 flex flex-wrap items-center gap-4"
        >
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field py-2 pr-8"
              style={{ minWidth: '140px' }}
            >
              <option value="">All Categories</option>
              {[...DEFAULT_CATEGORIES, ...(stats.categories || [])].filter((v, i, a) => a.indexOf(v) === i).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Sort By</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input-field py-2 pr-8"
              style={{ minWidth: '140px' }}
            >
              <option value="-updatedAt">Recently Updated</option>
              <option value="-createdAt">Recently Created</option>
              <option value="title">Title A-Z</option>
              <option value="-title">Title Z-A</option>
            </select>
          </div>
          {hasFilters && (
            <button onClick={clearFilters} className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/5 transition-all" style={{ color: 'var(--text-secondary)' }}>
              Clear Filters
            </button>
          )}
        </motion.div>
      )}

      {/* Notes Grid */}
      {loading ? (
        <div className="note-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-card p-5 h-48 skeleton" />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="w-20 h-20 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
            <HiOutlinePlus className="w-10 h-10" style={{ color: 'var(--accent)' }} />
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No notes yet</h3>
          <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
            {hasFilters ? 'No notes match your filters.' : 'Create your first note to get started!'}
          </p>
          {!hasFilters && (
            <button onClick={() => setShowCreateModal(true)} className="btn-primary">
              Create Note
            </button>
          )}
        </motion.div>
      ) : (
        <div className="note-grid">
          {notes.map((note, i) => (
            <motion.div
              key={note._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (i % 20) * 0.03 }}
            >
              <NoteCard
                note={note}
                onEdit={() => setEditingNote(note)}
                onDelete={() => handleDeleteNote(note._id)}
                onArchive={() => handleToggleArchive(note._id)}
                onFavorite={() => handleToggleFavorite(note._id)}
                onPin={() => handleTogglePin(note._id)}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:scale-105 transition-all duration-200 z-20"
      >
        <HiOutlinePlus className="w-7 h-7" />
      </button>

      {/* Modals */}
      {showCreateModal && (
        <CreateNoteModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateNote}
        />
      )}
      {editingNote && (
        <EditNoteModal
          note={editingNote}
          onClose={() => setEditingNote(null)}
          onUpdate={handleUpdateNote}
        />
      )}
    </div>
  );
}
