import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation, createSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { notesApi } from '../services/api';
import {
  HiOutlineViewGrid,
  HiOutlineHeart,
  HiOutlineArchive,
  HiOutlineCog,
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineDocumentText,
  HiOutlineStar,
  HiOutlineArchive as HiOutlineArchiveBox,
} from 'react-icons/hi';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: HiOutlineViewGrid },
  { to: '/favorites', label: 'Favorites', icon: HiOutlineHeart },
  { to: '/archive', label: 'Archive', icon: HiOutlineArchive },
  { to: '/profile', label: 'Profile', icon: HiOutlineUser },
  { to: '/settings', label: 'Settings', icon: HiOutlineCog },
];

const DEFAULT_CATEGORIES = ['Personal', 'School', 'Work', 'Ideas', 'Projects', 'Shopping'];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [stats, setStats] = useState({ total: 0, archived: 0, favorite: 0, categories: [] });
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    notesApi.getStats().then(({ data }) => setStats(data.stats)).catch(() => {});
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (sidebarSearch.trim()) {
      navigate({
        pathname: '/dashboard',
        search: `?search=${encodeURIComponent(sidebarSearch.trim())}`,
      });
      setSidebarSearch('');
    }
  };

  const goToCategory = (cat) => {
    navigate({
      pathname: '/dashboard',
      search: `?category=${encodeURIComponent(cat)}`,
    });
  };

  const goToDashboard = () => navigate('/dashboard');

  const allCategories = [...new Set([...DEFAULT_CATEGORIES, ...(stats.categories || [])])];

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-72 glass border-r flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
        style={{ borderColor: 'var(--glass-border)' }}
      >
        {/* Logo + close */}
        <div className="flex items-center justify-between p-5 border-b shrink-0" style={{ borderColor: 'var(--glass-border)' }}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold truncate logo-text" style={{ color: 'var(--text-primary)' }}>JUSTNOTE</h1>
              <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/5 shrink-0 ml-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        {/* Dashboard quick actions */}
        <div className="p-3 border-b shrink-0" style={{ borderColor: 'var(--glass-border)' }}>
          <button
            onClick={goToDashboard}
            className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-purple-600 text-white font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200 active:scale-[0.98]"
          >
            <HiOutlinePlus className="w-5 h-5" />
            New Note
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-1 p-3 border-b shrink-0" style={{ borderColor: 'var(--glass-border)' }}>
          {[
            { icon: HiOutlineDocumentText, value: stats.total, label: 'Total', onClick: goToDashboard },
            { icon: HiOutlineHeart, value: stats.favorite, label: 'Liked', onClick: () => navigate('/favorites') },
            { icon: HiOutlineArchiveBox, value: stats.archived, label: 'Archived', onClick: () => navigate('/archive') },
          ].map(({ icon: Icon, value, label, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className="flex flex-col items-center gap-0.5 py-2 rounded-lg hover:bg-white/5 transition-all"
            >
              <Icon className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{value}</span>
              <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{label}</span>
            </button>
          ))}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto scrollbar-hide">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <NavLink
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary-500/10'
                    : 'hover:bg-white/5'
                }`}
                style={{
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                }}
              >
                <div className={`w-5 h-5 flex items-center justify-center transition-transform duration-200 ${isActive ? '' : 'group-hover:scale-110'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>{label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ background: 'var(--accent)' }}
                  />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Categories quick filter */}
        <div className="px-3 py-2 border-t shrink-0" style={{ borderColor: 'var(--glass-border)' }}>
          <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5 px-1" style={{ color: 'var(--text-secondary)' }}>Categories</p>
          <div className="flex flex-wrap gap-1">
            {allCategories.slice(0, 8).map((cat) => (
              <button
                key={cat}
                onClick={() => goToCategory(cat)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium hover:bg-primary-500/10 hover:text-primary-400 transition-all"
                style={{
                  background: 'var(--glass-bg)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--glass-border)',
                }}
              >
                {cat}
              </button>
            ))}
            {allCategories.length > 8 && (
              <span className="text-xs px-1 self-center" style={{ color: 'var(--text-secondary)' }}>+{allCategories.length - 8}</span>
            )}
          </div>
        </div>

        {/* Made by Just */}
        <div className="px-4 py-2 border-t shrink-0 text-center" style={{ borderColor: 'var(--glass-border)' }}>
          <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Made by Just</p>
        </div>

        {/* Bottom actions */}
        <div className="p-3 border-t space-y-0.5 shrink-0" style={{ borderColor: 'var(--glass-border)' }}>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl w-full transition-all duration-200 hover:bg-white/5 group"
            style={{ color: 'var(--text-secondary)' }}
          >
            <div className="w-5 h-5 flex items-center justify-center transition-transform duration-200 group-hover:rotate-12">
              {darkMode ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
            </div>
            <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl w-full transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 group"
            style={{ color: 'var(--text-secondary)' }}
          >
            <HiOutlineLogout className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-72">
        {/* Top bar for mobile */}
        <header className="lg:hidden glass border-b shrink-0" style={{ borderColor: 'var(--glass-border)' }}>
          <div className="px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-white/5 active:scale-95 transition-all"
              style={{ color: 'var(--text-primary)' }}
            >
              <HiOutlineMenu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold logo-text" style={{ color: 'var(--text-primary)' }}>JUSTNOTE</span>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-white/5 active:scale-95 transition-all"
              style={{ color: 'var(--text-primary)' }}
            >
              {darkMode ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
            </button>
          </div>
          <div className="px-4 pb-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                <input
                  type="text"
                  placeholder="Search notes..."
                  className="w-full py-2 pl-10 pr-3 rounded-xl text-sm bg-white/5 border border-transparent focus:border-primary-500/30 outline-none transition-all"
                  style={{ color: 'var(--text-primary)' }}
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                />
              </div>
            </form>
          </div>
        </header>

        {/* Top navbar (desktop) */}
        <header className="hidden lg:flex glass px-6 py-3 items-center gap-4 border-b shrink-0 justify-end" style={{ borderColor: 'var(--glass-border)' }}>
          <div className="max-w-sm">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                <input
                  type="text"
                  placeholder="Search notes..."
                  className="w-full py-2 pl-10 pr-3 rounded-xl text-sm bg-white/5 border border-transparent focus:border-primary-500/30 outline-none transition-all"
                  style={{ color: 'var(--text-primary)' }}
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                />
              </div>
            </form>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-white/5 transition-all"
              style={{ color: 'var(--text-secondary)' }}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="relative group"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary-500/60 shadow-[0_0_10px_rgba(99,102,241,0.3)]">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
