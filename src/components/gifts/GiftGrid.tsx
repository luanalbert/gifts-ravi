"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGiftStore } from "@/store/gift-store";
import { CategoryFilters } from "@/components/filters/CategoryFilters";
import { GiftCard } from "./GiftCard";

function FreeContributionCard() {
  const openFreeModal = useGiftStore((s) => s.openFreeModal);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center text-center py-16 px-6"
    >
      {/* Ícone */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-6"
        style={{ background: "#F0EBE1" }}
      >
        💛
      </div>

      {/* Texto */}
      <h3
        className="font-display text-2xl font-semibold mb-2"
        style={{ color: "#3D3530" }}
      >
        Lista de presentes temporariamente indisponível
      </h3>
      <p
        className="text-sm leading-relaxed mb-8 max-w-xs"
        style={{ color: "#9A8880" }}
      >
        Estamos com uma instabilidade no momento, mas a lista volta em
        breve. Enquanto isso, você já pode contribuir com o valor que
        preferir — será muito bem-vindo! 💛
      </p>

      {/* CTA */}
      <motion.button
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={openFreeModal}
        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-medium text-white"
        style={{
          background: "linear-gradient(135deg, #8FAF8A 0%, #6A9165 100%)",
          boxShadow: "0 4px 20px rgba(143,175,138,0.4)",
        }}
      >
        Contribuir com qualquer valor 💛
      </motion.button>
    </motion.div>
  );
}

export function GiftGrid() {
  const gifts = useGiftStore((s) => s.gifts);
  const activeCategory = useGiftStore((s) => s.activeCategory);

  const filtered = gifts.filter((g) => {
    if (activeCategory === "todos") return true;
    if (activeCategory === "importantes") return g.priority;
    return g.category === activeCategory;
  });

  // Lista ainda não carregada
  const isLoading = gifts.length === 0;

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
            <div
              className="h-px flex-shrink-0"
              style={{ background: "#C9A96E", width: "40px" }}
            />
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

          {/* Filtros — só exibe se houver presentes */}
          {!isLoading && <CategoryFilters />}
        </motion.div>

        {/* Conteúdo */}
        <AnimatePresence mode="wait">
          {/* Empty state — lista ainda não carregou */}
          {isLoading ? (
            <FreeContributionCard key="free" />
          ) : filtered.length > 0 ? (
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
            /* Categoria sem itens */
            <motion.div
              key="empty-category"
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