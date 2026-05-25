import { Search } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

export default function SearchBar({ value, onChange, placeholder = 'Search...', children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
      
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60 text-muted dark:text-mutedDark" size={18} />
        <motion.input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="
            w-full pl-10 pr-3 py-2 rounded-xl border border-muted/30 dark:border-mutedDark/50
            bg-white dark:bg-cardDark text-foreground dark:text-foregroundDark
            placeholder:text-muted dark:placeholder:text-mutedDark
            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
            transition-all duration-200
          "
          whileFocus={{ scale: 1.01 }}
        />
      </div>

      {/* Action Buttons / Children */}
      {children && (
        <div className="flex gap-2 flex-wrap">
          {React.Children.map(children, (child, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block transition-all duration-200"
            >
              {child}
            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
}
