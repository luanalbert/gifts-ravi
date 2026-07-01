"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useGiftStore } from "@/store/gift-store";
import { generatePixPayload } from "@/lib/pix";
import { PIX_CONFIG } from "@/lib/pix-config";
import { formatCurrency } from "@/lib/utils";
import { QRCode } from "@/components/ui/QRCode";

const QUICK_VALUES = [50, 100, 150, 200];

export function ContributionModal() {
  const {
    isModalOpen,
    selectedGift,
    isFreeModal,
    closeModal,
    contributionAmount,
    setContributionAmount,
  } = useGiftStore();

  const [inputValue, setInputValue] = useState("");
  const [pixPayload, setPixPayload] = useState("");
  const [copied, setCopied] = useState(false);

  // Sincronizar input com store ao abrir o modal
  useEffect(() => {
    if (isModalOpen) {
      const initial = selectedGift ? selectedGift.suggestedPrice : 50;
      setInputValue(String(initial));
      setContributionAmount(initial);
      setCopied(false);
      setPixPayload("");
    }
  }, [isModalOpen, selectedGift, setContributionAmount]);

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
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  return (
    <AnimatePresence>
      {isModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 z-40"
            style={{
              background: "rgba(61,53,48,0.5)",
              backdropFilter: "blur(4px)",
            }}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed z-50 overflow-y-auto rounded-3xl"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "calc(100% - 2rem)",
              maxWidth: "32rem",
              maxHeight: "90vh",
              background: "#FAFAF7",
              boxShadow: "0 24px 80px rgba(61,53,48,0.2)",
            }}
          >
            {/* Botão fechar */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity"
              style={{ background: "#F0EBE1", color: "#6B5E57" }}
              aria-label="Fechar"
            >
              ✕
            </button>

            <div className="p-5 md:p-6">
              {/* ── Cabeçalho: modo livre ── */}
              {isFreeModal && (
                <div
                  className="flex items-center gap-4 mb-6 pb-5"
                  style={{ borderBottom: "1px solid #F0EBE1" }}
                >
                  <div
                    className="w-16 h-16 flex-shrink-0 rounded-2xl flex items-center justify-center text-3xl"
                    style={{ background: "#F0EBE1" }}
                  >
                    💛
                  </div>
                  <div>
                    <h3
                      className="font-display font-semibold text-lg leading-tight"
                      style={{ color: "#3D3530" }}
                    >
                      Contribuição para o Ravi
                    </h3>
                    <p className="text-sm mt-0.5" style={{ color: "#9A8880" }}>
                      Escolha o valor que preferir contribuir.
                    </p>
                  </div>
                </div>
              )}

              {/* ── Cabeçalho: modo presente ── */}
              {!isFreeModal && selectedGift && (
                <div
                  className="flex gap-4 mb-6 pb-5"
                  style={{ borderBottom: "1px solid #F0EBE1" }}
                >
                  <div
                    className="relative w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden"
                    style={{ background: "#F0EBE1" }}
                  >
                    {selectedGift.image ? (
                      <Image
                        src={selectedGift.image}
                        alt={selectedGift.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        🎁
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-display font-semibold text-lg leading-tight mb-1"
                      style={{ color: "#3D3530" }}
                    >
                      {selectedGift.name}
                    </h3>
                    <p
                      className="text-sm line-clamp-2"
                      style={{ color: "#9A8880" }}
                    >
                      {selectedGift.description}
                    </p>
                    <p
                      className="text-sm font-semibold mt-1.5"
                      style={{ color: "#8FAF8A" }}
                    >
                      Sugerido: {formatCurrency(selectedGift.suggestedPrice)}
                    </p>
                  </div>
                </div>
              )}

              {/* ── Campo de valor ── */}
              <div className="mb-5">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#6B5E57" }}
                >
                  Quanto deseja contribuir?
                </label>

                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                  style={{
                    background: "#F0EBE1",
                    border: "2px solid transparent",
                  }}
                >
                  <span
                    className="font-medium text-lg"
                    style={{ color: "#9A8880" }}
                  >
                    R$
                  </span>
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
                <div className="flex flex-wrap gap-2 mt-3">
                  {/* No modo livre mostra R$50, R$100, R$150, R$200 */}
                  {/* No modo presente mostra R$50, R$100 + valor sugerido */}
                  {isFreeModal ? (
                    QUICK_VALUES.map((v) => (
                      <button
                        key={v}
                        onClick={() => handleQuickValue(v)}
                        className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all"
                        style={{
                          background:
                            contributionAmount === v ? "#8FAF8A" : "#F0EBE1",
                          color:
                            contributionAmount === v ? "#fff" : "#6B5E57",
                        }}
                      >
                        R$ {v}
                      </button>
                    ))
                  ) : (
                    <>
                      {[50, 100].map((v) => (
                        <button
                          key={v}
                          onClick={() => handleQuickValue(v)}
                          className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all"
                          style={{
                            background:
                              contributionAmount === v ? "#8FAF8A" : "#F0EBE1",
                            color:
                              contributionAmount === v ? "#fff" : "#6B5E57",
                          }}
                        >
                          R$ {v}
                        </button>
                      ))}
                      {selectedGift && (
                        <button
                          onClick={() =>
                            handleQuickValue(selectedGift.suggestedPrice)
                          }
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
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* ── QR Code + Copiar ── */}
              {pixPayload && (
                <div
                  className="flex gap-3 mb-4 p-4 rounded-2xl"
                  style={{ background: "#F0EBE1" }}
                >
                  {/* QR Code */}
                  <div
                    className="flex-shrink-0 p-2 rounded-xl"
                    style={{ background: "#fff" }}
                  >
                    <QRCode value={pixPayload} size={100} />
                  </div>

                  {/* Instrução + botão copiar */}
                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      <p
                        className="text-sm font-medium mb-0.5"
                        style={{ color: "#3D3530" }}
                      >
                        Pague via Pix
                      </p>
                      <p
                        className="text-xs leading-relaxed"
                        style={{ color: "#9A8880" }}
                      >
                        Escaneie o QR Code ou copie o código no app do seu
                        banco.
                      </p>
                    </div>

                    <button
                      onClick={handleCopy}
                      className="mt-3 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-medium text-sm transition-all w-full"
                      style={{
                        background: copied ? "#8FAF8A" : "#fff",
                        color: copied ? "#fff" : "#3D3530",
                        border: copied ? "none" : "1px solid #E8DFD3",
                      }}
                    >
                      {copied ? (
                        <>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Copiado!
                        </>
                      ) : (
                        <>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          Copiar código Pix
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* ── Mensagem ── */}
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