"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useGiftStore } from "@/store/gift-store";
import { formatCurrency } from "@/lib/utils";
import { CATEGORY_LABELS } from "@/types/gift";
import type { Gift } from "@/types/gift";

interface GiftCardProps {
  gift: Gift;
  index: number;
}

export function GiftCard({ gift, index }: GiftCardProps) {
  const openModal = useGiftStore((s) => s.openModal);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.07 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={() => openModal(gift)}
      className="cursor-pointer rounded-3xl overflow-hidden flex flex-col group"
      style={{
        background: "#FAFAF7",
        boxShadow: "0 2px 16px rgba(61,53,48,0.06), 0 1px 4px rgba(61,53,48,0.04)",
        border: "1px solid rgba(232,223,211,0.8)",
      }}
    >
      {/* Imagem */}
      <div className="relative h-48 overflow-hidden" style={{ background: "#F0EBE1" }}>
        {gift.image ? (
          <Image
            src={gift.image}
            alt={gift.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl opacity-40">
            🎁
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {gift.priority && (
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ background: "#C9A96E", color: "#fff" }}
            >
              ⭐ Importante
            </span>
          )}
          <span
            className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ background: "rgba(250,250,247,0.9)", color: "#6B5E57" }}
          >
            {CATEGORY_LABELS[gift.category] || gift.category}
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-5 flex flex-col flex-1">
        <h3
          className="font-display font-semibold text-lg leading-snug mb-1.5"
          style={{ color: "#3D3530" }}
        >
          {gift.name}
        </h3>
        <p className="text-sm leading-relaxed mb-4 flex-1 line-clamp-2"
          style={{ color: "#9A8880" }}>
          {gift.description}
        </p>

        {/* Footer do card */}
        <div className="flex items-center justify-between pt-3"
          style={{ borderTop: "1px solid #F0EBE1" }}>
          <span className="font-semibold text-base" style={{ color: "#8FAF8A" }}>
            {formatCurrency(gift.suggestedPrice)}
          </span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white"
            style={{
              background: "linear-gradient(135deg, #8FAF8A 0%, #6A9165 100%)",
              boxShadow: "0 2px 10px rgba(143,175,138,0.3)",
            }}
          >
            Contribuir 💛
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
