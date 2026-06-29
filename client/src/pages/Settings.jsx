import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { authApi } from '../services/api';
import {
  HiOutlineCog,
  HiOutlineKey,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineTrash,
  HiOutlineUser,
  HiOutlineMail,
} from 'react-icons/hi';

export default function Settings() {
  const { user, updateUser, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Fill in all fields');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    setChangingPassword(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      toast.success('Password changed!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (confirmDelete !== 'DELETE') {
      toast.error('Type DELETE to confirm');
      return;
    }
    setDeleting(true);
    try {
      await authApi.deleteAccount();
      toast.success('Account deleted');
      logout();
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <HiOutlineCog className="w-6 h-6" style={{ color: 'var(--accent)' }} />
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Settings</h1>
        </div>

        {/* Profile Info */}
        <div className="glass-card p-6 mb-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <HiOutlineUser className="w-5 h-5" />
            Account Info
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <HiOutlineUser className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
              <span style={{ color: 'var(--text-primary)' }}>{user?.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <HiOutlineMail className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
              <span style={{ color: 'var(--text-primary)' }}>{user?.email}</span>
            </div>
          </div>
        </div>

        {/* Theme */}
        <div className="glass-card p-6 mb-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            {darkMode ? <HiOutlineMoon className="w-5 h-5" /> : <HiOutlineSun className="w-5 h-5" />}
            Appearance
          </h3>
          <button
            onClick={toggleTheme}
            className="flex items-center justify-between w-full px-4 py-3 rounded-xl glass hover:border-primary-500/30 transition-all"
            style={{ color: 'var(--text-primary)' }}
          >
            <span>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
            <div className={`w-12 h-6 rounded-full transition-colors duration-200 ${darkMode ? 'bg-primary-500' : 'bg-gray-300'}`}>
              <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-200 mt-0.5 ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </div>
          </button>
        </div>

        {/* Change Password */}
        <div className="glass-card p-6 mb-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <HiOutlineKey className="w-5 h-5" />
            Change Password
          </h3>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Current Password</label>
              <input type="password" className="input-field" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>New Password</label>
              <input type="password" className="input-field" placeholder="At least 6 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <button type="submit" disabled={changingPassword} className="btn-primary disabled:opacity-50">
              {changingPassword ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>

        {/* Delete Account */}
        <div className="glass-card p-6 border-red-500/20">
          <h3 className="font-semibold mb-4 flex items-center gap-2 text-red-400">
            <HiOutlineTrash className="w-5 h-5" />
            Delete Account
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            This action is permanent. All your notes and data will be deleted.
          </p>
          <form onSubmit={handleDeleteAccount} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                Type <span className="font-mono font-bold text-red-400">DELETE</span> to confirm
              </label>
              <input type="text" className="input-field border-red-500/30" placeholder="DELETE" value={confirmDelete} onChange={(e) => setConfirmDelete(e.target.value)} />
            </div>
            <button type="submit" disabled={deleting || confirmDelete !== 'DELETE'} className="px-6 py-2.5 rounded-xl font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all disabled:opacity-50">
              {deleting ? 'Deleting...' : 'Delete My Account'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
