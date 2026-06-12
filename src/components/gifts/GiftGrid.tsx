"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGiftStore } from "@/store/gift-store";
import { CategoryFilters } from "@/components/filters/CategoryFilters";
import { GiftCard } from "./GiftCard";

export function GiftGrid() {
  const gifts = useGiftStore((s) => s.gifts);
  const activeCategory = useGiftStore((s) => s.activeCategory);

  const filtered = gifts.filter((g) => {
    if (activeCategory === "todos") return true;
    if (activeCategory === "importantes") return g.priority;
    return g.category === activeCategory;
  });

  return (
    <section id="presentes" className="py-16 md:py-24" style={{ background: "#FAFAF7" }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px max-w-[40px] flex-shrink-0" style={{ background: "#C9A96E", width: "40px" }} />
            <span
              className="text-xs font-medium tracking-widest uppercase"
              style={{ color: "#C9A96E" }}
            >
              Lista completa
            </span>
          </div>
          <h2
            className="font-display text-3xl md:text-4xl mb-8"
            style={{ color: "#3D3530" }}
          >
            Presentes para o Ravi
          </h2>

          {/* Filtros */}
          <CategoryFilters />
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {filtered.map((gift, index) => (
                <GiftCard key={gift.id} gift={gift} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center"
            >
              <div className="text-5xl mb-4">🎁</div>
              <p style={{ color: "#9A8880" }}>
                Nenhum presente nessa categoria ainda.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
