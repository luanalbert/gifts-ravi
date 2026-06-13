"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useGiftStore } from "@/store/gift-store";
import { generatePixPayload } from "@/lib/pix";
import { PIX_CONFIG } from "@/lib/pix-config";
import { formatCurrency } from "@/lib/utils";
import { QRCode } from "@/components/ui/QRCode";

const QUICK_VALUES = [50, 100];

export function ContributionModal() {
  const { isModalOpen, selectedGift, closeModal, contributionAmount, setContributionAmount } =
    useGiftStore();

  const [inputValue, setInputValue] = useState("");
  const [pixPayload, setPixPayload] = useState("");
  const [copied, setCopied] = useState(false);

  // Sincronizar input com store
  useEffect(() => {
    if (selectedGift) {
      setInputValue(String(selectedGift.suggestedPrice));
      setContributionAmount(selectedGift.suggestedPrice);
    }
  }, [selectedGift, setContributionAmount]);

  // Gerar payload Pix quando o valor mudar
  useEffect(() => {
    if (contributionAmount > 0 && selectedGift) {
      const payload = generatePixPayload({
        ...PIX_CONFIG,
        amount: contributionAmount,
        txid: "***",
      });
      setPixPayload(payload);
    }
  }, [contributionAmount, selectedGift]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, "");
      setInputValue(raw);
      const num = parseInt(raw, 10);
      if (!isNaN(num) && num > 0) {
        setContributionAmount(num);
      }
    },
    [setContributionAmount]
  );

  const handleQuickValue = useCallback(
    (value: number) => {
      setInputValue(String(value));
      setContributionAmount(value);
    },
    [setContributionAmount]
  );

  const handleCopy = useCallback(async () => {
    if (!pixPayload) return;
    try {
      await navigator.clipboard.writeText(pixPayload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback para devices antigos
      const el = document.createElement("textarea");
      el.value = pixPayload;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [pixPayload]);

  // Fechar com ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeModal]);

  // Prevenir scroll do body quando modal aberto
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isModalOpen]);

  return (
    <AnimatePresence>
      {isModalOpen && selectedGift && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(61,53,48,0.5)", backdropFilter: "blur(4px)" }}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 bottom-0 md:inset-auto md:top-1/4 md:right-0 md:-translate-x-1/2 md:-translate-y-1/2 z-50 rounded-t-3xl md:rounded-3xl overflow-hidden max-h-[92vh] md:max-h-[90vh] overflow-y-auto md:w-full md:max-w-lg md:mr-4"
            style={{
              background: "#FAFAF7",
              boxShadow: "0 24px 80px rgba(61,53,48,0.2)",
            }}
          >
            {/* Drag indicator (mobile) */}
            <div className="flex justify-center pt-3 pb-1 md:hidden">
              <div className="w-10 h-1 rounded-full" style={{ background: "#E8DFD3" }} />
            </div>

            {/* Botão fechar */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:opacity-70"
              style={{ background: "#F0EBE1", color: "#6B5E57" }}
              aria-label="Fechar"
            >
              ✕
            </button>

            {/* Conteúdo */}
            <div className="p-5 md:p-6">
              {/* Info do presente */}
              <div className="flex gap-4 mb-6 pb-5" style={{ borderBottom: "1px solid #F0EBE1" }}>
                <div className="relative w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden"
                  style={{ background: "#F0EBE1" }}>
                  {selectedGift.image ? (
                    <Image
                      src={selectedGift.image}
                      alt={selectedGift.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">🎁</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-display font-semibold text-lg leading-tight mb-1"
                    style={{ color: "#3D3530" }}
                  >
                    {selectedGift.name}
                  </h3>
                  <p className="text-sm line-clamp-2" style={{ color: "#9A8880" }}>
                    {selectedGift.description}
                  </p>
                  <p className="text-sm font-semibold mt-1.5" style={{ color: "#8FAF8A" }}>
                    Sugerido: {formatCurrency(selectedGift.suggestedPrice)}
                  </p>
                </div>
              </div>

              {/* Campo de valor */}
              <div className="mb-5">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#6B5E57" }}
                >
                  Quanto deseja contribuir?
                </label>

                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                  style={{ background: "#F0EBE1", border: "2px solid transparent" }}
                >
                  <span className="font-medium text-lg" style={{ color: "#9A8880" }}>R$</span>
                  <input
                    type="number"
                    min="1"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="flex-1 bg-transparent text-xl font-semibold outline-none"
                    style={{ color: "#3D3530" }}
                    placeholder="0"
                  />
                </div>

                {/* Quick values */}
                <div className="flex gap-2 mt-3">
                  {QUICK_VALUES.map((v) => (
                    <button
                      key={v}
                      onClick={() => handleQuickValue(v)}
                      className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all"
                      style={{
                        background: contributionAmount === v ? "#8FAF8A" : "#F0EBE1",
                        color: contributionAmount === v ? "#fff" : "#6B5E57",
                      }}
                    >
                      R$ {v}
                    </button>
                  ))}
                  <button
                    onClick={() => handleQuickValue(selectedGift.suggestedPrice)}
                    className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background:
                        contributionAmount === selectedGift.suggestedPrice
                          ? "#8FAF8A"
                          : "#F0EBE1",
                      color:
                        contributionAmount === selectedGift.suggestedPrice
                          ? "#fff"
                          : "#6B5E57",
                    }}
                  >
                    Valor sugerido
                  </button>
                </div>
              </div>

              {/* QR Code */}
              {pixPayload && (
                <div className="flex flex-col items-center gap-4 mb-5">
                  <div
                    className="p-4 rounded-3xl"
                    style={{ background: "#fff", border: "1px solid #F0EBE1" }}
                  >
                    <QRCode value={pixPayload} size={180} />
                  </div>
                  <p className="text-xs text-center" style={{ color: "#9A8880" }}>
                    Escaneie o QR Code com o aplicativo do seu banco
                  </p>
                </div>
              )}

              {/* Pix copia e cola */}
              {pixPayload && (
                <button
                  onClick={handleCopy}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-medium text-sm transition-all mb-4"
                  style={{
                    background: copied ? "#8FAF8A" : "#F0EBE1",
                    color: copied ? "#fff" : "#3D3530",
                  }}
                >
                  {copied ? (
                    <>✓ Copiado!</>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      Pix Copia e Cola
                    </>
                  )}
                </button>
              )}

              {/* Mensagem */}
              <p
                className="text-center text-xs leading-relaxed py-3 px-4 rounded-2xl"
                style={{ background: "#F0EBE1", color: "#9A8880" }}
              >
                Não precisa enviar comprovante 💛 Sua contribuição será
                identificada diretamente em nossa conta.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}