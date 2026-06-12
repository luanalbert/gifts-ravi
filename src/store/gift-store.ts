import { create } from "zustand";
import type { Gift } from "@/types/gift";

interface GiftStore {
  // Lista de presentes carregada
  gifts: Gift[];
  setGifts: (gifts: Gift[]) => void;

  // Filtro de categoria ativo
  activeCategory: string;
  setActiveCategory: (category: string) => void;

  // Modal
  selectedGift: Gift | null;
  isModalOpen: boolean;
  openModal: (gift: Gift) => void;
  closeModal: () => void;

  // Valor de contribuição no modal
  contributionAmount: number;
  setContributionAmount: (amount: number) => void;
}

export const useGiftStore = create<GiftStore>((set) => ({
  gifts: [],
  setGifts: (gifts) => set({ gifts }),

  activeCategory: "todos",
  setActiveCategory: (category) => set({ activeCategory: category }),

  selectedGift: null,
  isModalOpen: false,
  openModal: (gift) =>
    set({
      selectedGift: gift,
      isModalOpen: true,
      contributionAmount: gift.suggestedPrice,
    }),
  closeModal: () =>
    set({
      isModalOpen: false,
      selectedGift: null,
    }),

  contributionAmount: 0,
  setContributionAmount: (amount) => set({ contributionAmount: amount }),
}));
