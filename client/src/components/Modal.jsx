import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({ open, onClose, title, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="
              bg-card dark:bg-cardDark text-foreground dark:text-foregroundDark
              rounded-2xl shadow-elevated w-[95vw] max-w-xl p-6 relative
              transition-colors duration-300
            "
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary dark:text-primary.light">{title}</h3>
              <button
                onClick={onClose}
                className="
                  px-3 py-1 rounded-lg bg-muted/20 dark:bg-mutedDark/30
                  hover:bg-muted/30 dark:hover:bg-mutedDark/50
                  text-muted dark:text-mutedDark
                  transition-all duration-200
                "
              >
                Esc
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
