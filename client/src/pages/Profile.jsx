import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineCalendar,
  HiOutlineCamera,
  HiOutlineX,
} from 'react-icons/hi';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [showPictureModal, setShowPictureModal] = useState(false);
  const [profileUrl, setProfileUrl] = useState(user?.profilePicture || '');
  const [savingPicture, setSavingPicture] = useState(false);
  const fileInputRef = useRef(null);

  const handleSaveName = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    setSaving(true);
    try {
      const { data } = await authApi.updateProfile({ name: name.trim() });
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setProfileUrl(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handlePictureSave = async () => {
    setSavingPicture(true);
    try {
      const { data } = await authApi.updateProfile({ profilePicture: profileUrl });
      updateUser(data.user);
      setShowPictureModal(false);
      toast.success('Profile picture updated!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingPicture(false);
    }
  };

  const handlePictureRemove = async () => {
    setSavingPicture(true);
    try {
      const { data } = await authApi.updateProfile({ profilePicture: '' });
      updateUser(data.user);
      setProfileUrl('');
      setShowPictureModal(false);
      toast.success('Profile picture removed');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingPicture(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>Profile</h1>

        {/* Avatar */}
        <div className="glass-card p-8 mb-6 text-center">
          <button
            onClick={() => { setProfileUrl(user?.profilePicture || ''); setShowPictureModal(true); }}
            className="relative group mx-auto mb-4 block"
          >
            <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-primary-500/60 shadow-[0_0_14px_rgba(99,102,241,0.4)]">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <HiOutlineCamera className="w-6 h-6 text-white" />
            </div>
          </button>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{user?.name}</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{user?.email}</p>
          <p className="text-xs mt-2 flex items-center justify-center gap-1" style={{ color: 'var(--text-secondary)' }}>
            <HiOutlineCalendar className="w-3.5 h-3.5" />
            Joined {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Edit name */}
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <HiOutlineUser className="w-5 h-5" />
            Edit Profile
          </h3>
          <form onSubmit={handleSaveName} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Name</label>
              <input type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Email</label>
              <input type="email" className="input-field" value={user?.email || ''} disabled style={{ opacity: 0.6 }} />
            </div>
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </motion.div>

      {/* Profile picture modal */}
      {showPictureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowPictureModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm glass-card p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Profile Picture</h2>
              <button onClick={() => setShowPictureModal(false)} className="p-1.5 rounded-lg hover:bg-white/5">
                <HiOutlineX className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>

            <div className="flex justify-center mb-5">
              <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-primary-500/60 shadow-[0_0_14px_rgba(99,102,241,0.4)]">
                {profileUrl ? (
                  <img src={profileUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Paste image URL..."
                className="input-field text-sm"
                value={profileUrl}
                onChange={(e) => setProfileUrl(e.target.value)}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-2.5 rounded-xl glass text-sm font-medium transition-all hover:border-primary-500/30"
                style={{ color: 'var(--text-primary)' }}
              >
                Upload from device
              </button>
              <div className="flex gap-2">
                {user?.profilePicture && (
                  <button
                    onClick={handlePictureRemove}
                    disabled={savingPicture}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                  >
                    Remove
                  </button>
                )}
                <button
                  onClick={handlePictureSave}
                  disabled={savingPicture}
                  className="flex-1 btn-primary py-2.5 text-sm disabled:opacity-50"
                >
                  {savingPicture ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
