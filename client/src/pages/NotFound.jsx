import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-primary)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="text-8xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-purple-500 bg-clip-text text-transparent">
          404
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Page not found
        </h1>
        <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link to="/dashboard" className="btn-primary inline-block">
          Go to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}
