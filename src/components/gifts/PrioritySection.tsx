"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useGiftStore } from "@/store/gift-store";
import { formatCurrency } from "@/lib/utils";
import type { Gift } from "@/types/gift";

function PriorityCard({ gift, index }: { gift: Gift; index: number }) {
  const openModal = useGiftStore((s) => s.openModal);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      onClick={() => openModal(gift)}
      className="flex-shrink-0 w-64 md:w-72 cursor-pointer rounded-3xl overflow-hidden"
      style={{
        background: "#FAFAF7",
        boxShadow: "0 2px 20px rgba(61,53,48,0.08)",
        border: "1px solid rgba(201,169,110,0.2)",
      }}
    >
      {/* Imagem */}
      <div className="relative h-44 overflow-hidden bg-cream-200">
        {gift.image ? (
          <Image
            src={gift.image}
            alt={gift.name}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-5xl"
            style={{ background: "#F0EBE1" }}
          >
            🎁
          </div>
        )}
        {/* Badge importante */}
        <div
          className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{ background: "#C9A96E", color: "#fff" }}
        >
          ⭐ Importante
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4">
        <h3
          className="font-display font-semibold text-lg leading-tight mb-1"
          style={{ color: "#3D3530" }}
        >
          {gift.name}
        </h3>
        <p className="text-sm mb-4 line-clamp-2" style={{ color: "#9A8880" }}>
          {gift.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-base" style={{ color: "#8FAF8A" }}>
            {formatCurrency(gift.suggestedPrice)}
          </span>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: "#8FAF8A" }}
          >
            Contribuir 💛
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function PrioritySection() {
  const gifts = useGiftStore((s) => s.gifts);
  const priority = gifts.filter((g) => g.priority);

  if (priority.length === 0) return null;

  return (
    <section className="py-16 md:py-20" style={{ background: "#F0EBE1" }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 max-w-[40px]" style={{ background: "#C9A96E" }} />
            <span
              className="text-xs font-medium tracking-widest uppercase"
              style={{ color: "#C9A96E" }}
            >
              Com carinho especial
            </span>
          </div>
          <h2
            className="font-display text-3xl md:text-4xl"
            style={{ color: "#3D3530" }}
          >
            Mais importantes para o Ravi
          </h2>
        </motion.div>

        {/* Scroll horizontal */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {priority.map((gift, i) => (
            <div key={gift.id} className="snap-start">
              <PriorityCard gift={gift} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
