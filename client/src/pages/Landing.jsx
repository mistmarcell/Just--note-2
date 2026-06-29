import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlinePencilAlt, HiOutlineShieldCheck, HiOutlineCloud, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { useState } from 'react';

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Nav */}
      <nav className="glass px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b sticky top-0 z-50" style={{ borderColor: 'var(--glass-border)' }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl sm:text-3xl font-bold logo-text" style={{ color: 'var(--text-primary)' }}>JUSTNOTE</span>
        </div>

        {/* Desktop nav links */}
        <div className="hidden sm:flex items-center gap-3">
          <Link to="/login" className="px-5 py-2.5 rounded-xl font-medium transition-all duration-200 hover:bg-white/5" style={{ color: 'var(--text-primary)' }}>Sign In</Link>
          <Link to="/register" className="btn-primary">Get Started</Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden p-2 rounded-lg hover:bg-white/5"
          style={{ color: 'var(--text-primary)' }}
        >
          {mobileMenuOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
        </button>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 glass border-b flex flex-col p-4 gap-3 sm:hidden"
            style={{ borderColor: 'var(--glass-border)' }}
          >
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full px-4 py-3 rounded-xl font-medium text-center hover:bg-white/5 transition-all"
              style={{ color: 'var(--text-primary)' }}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary w-full text-center"
            >
              Get Started
            </Link>
          </motion.div>
        )}
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-32 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8" style={{ borderColor: 'var(--glass-border)' }}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Your notes, anywhere, anytime</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{ color: 'var(--text-primary)' }}>
            Write, Organize, and
            <br />
            <span className="bg-gradient-to-r from-primary-400 to-purple-500 bg-clip-text text-transparent">Never Forget</span>
          </h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            A beautiful, modern note-taking app with powerful features. Capture your thoughts, organize them with tags and categories, and access them from anywhere.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="btn-primary text-lg px-8 py-3">Start Writing Free</Link>
            <Link to="/login" className="px-8 py-3 rounded-xl font-medium glass transition-all duration-200 hover:border-primary-500/50" style={{ color: 'var(--text-primary)' }}>Sign In</Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-32">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: HiOutlinePencilAlt, title: 'Rich Notes', desc: 'Create beautiful notes with titles, content, colors, tags, and categories. Pin, favorite, and archive them.' },
            { icon: HiOutlineShieldCheck, title: 'Secure & Private', desc: 'Your data is encrypted and protected with JWT authentication. Only you can see your notes.' },
            { icon: HiOutlineCloud, title: 'Cloud Sync', desc: 'Access your notes from any device. MongoDB Atlas keeps everything in sync in real-time.' },
          ].map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="glass-card p-8 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-5">
                <Icon className="w-7 h-7" style={{ color: 'var(--accent)' }} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{title}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="glass border-t py-8 text-center" style={{ borderColor: 'var(--glass-border)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>&copy; 2026 JUSTNOTE. Built with React, Node.js & MongoDB.</p>
      </footer>
    </div>
  );
}
