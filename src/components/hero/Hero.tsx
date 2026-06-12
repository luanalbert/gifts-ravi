"use client";

import { motion } from "framer-motion";

export function Hero() {
  const scrollToGifts = () => {
    document.getElementById("presentes")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background decorativo */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(160deg, #FAFAF7 0%, #F0EBE1 50%, #E8DFD3 100%)" }}
      />

      {/* Círculo decorativo grande */}
      <div
        className="absolute top-[-10%] right-[-15%] w-[500px] h-[500px] rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #C9A96E 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-[-5%] left-[-10%] w-[350px] h-[350px] rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, #8FAF8A 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 mb-8"
        >
          <div className="h-px w-8" style={{ background: "#C9A96E" }} />
          <span
            className="text-xs font-medium tracking-[0.2em] uppercase"
            style={{ color: "#C9A96E" }}
          >
            Lista de presentes
          </span>
          <div className="h-px w-8" style={{ background: "#C9A96E" }} />
        </motion.div>

        {/* Título principal */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-display text-5xl md:text-7xl leading-[1.1] mb-6"
          style={{ color: "#3D3530" }}
        >
          O Ravi está
          <br />
          <span style={{ color: "#8FAF8A", fontStyle: "italic" }}>chegando</span>
          <span className="ml-2">💛</span>
        </motion.h1>

        {/* Subtexto */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-lg md:text-xl leading-relaxed mb-12 max-w-xl mx-auto"
          style={{ color: "#6B5E57" }}
        >
          Cada presente é um carinho que vai fazer parte
          da chegada do nosso menino. Contribua com o que
          o coração mandar — tudo é muito bem-vindo.
        </motion.p>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={scrollToGifts}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-medium text-white transition-shadow"
          style={{
            background: "linear-gradient(135deg, #8FAF8A 0%, #6A9165 100%)",
            boxShadow: "0 4px 24px rgba(143, 175, 138, 0.4)",
          }}
        >
          Ver presentes
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.button>

        {/* Detalhe visual de scroll */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="w-px h-8"
            style={{ background: "linear-gradient(to bottom, #C9A96E, transparent)" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
