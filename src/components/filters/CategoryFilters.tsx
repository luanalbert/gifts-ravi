"use client";

import { motion } from "framer-motion";
import { useGiftStore } from "@/store/gift-store";
import { CATEGORY_LABELS } from "@/types/gift";

export function CategoryFilters() {
  const activeCategory = useGiftStore((s) => s.activeCategory);
  const setActiveCategory = useGiftStore((s) => s.setActiveCategory);

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
      style={{ scrollbarWidth: "none" }}>
      {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
        const isActive = activeCategory === key;
        return (
          <motion.button
            key={key}
            onClick={() => setActiveCategory(key)}
            whileTap={{ scale: 0.96 }}
            className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
            style={{
              background: isActive ? "#8FAF8A" : "#F0EBE1",
              color: isActive ? "#fff" : "#6B5E57",
              boxShadow: isActive ? "0 2px 12px rgba(143,175,138,0.35)" : "none",
              border: isActive ? "none" : "1px solid #E8DFD3",
            }}
          >
            {label}
          </motion.button>
        );
      })}
    </div>
  );
}
