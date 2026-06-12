"use client";

import { useEffect } from "react";
import { Hero } from "@/components/hero/Hero";
import { PrioritySection } from "@/components/gifts/PrioritySection";
import { GiftGrid } from "@/components/gifts/GiftGrid";
import { ContributionModal } from "@/components/modal/ContributionModal";
import { Footer } from "@/components/ui/Footer";
import { useGiftStore } from "@/store/gift-store";
import type { Gift, GiftCategory } from "@/types/gift";

type GiftSheetRow = {
  id: string;
  name: string;
  suggestedPrice: string;
  category: string;
  priority: string;
  image: string;
  description: string;
};

function formatImageUrl(url: string): string {
  // Se for link compartilhado do Google Drive
  const match = url.match(/\/d\/([^/]+)/);

  if (match) {
    const fileId = match[1];
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }

  // Se for imagem local
  if (!url.startsWith("http")) {
    return url.startsWith("/") ? url : `/${url}`;
  }

  return url;
}

export default function Home() {
  const setGifts = useGiftStore((s) => s.setGifts);

  useEffect(() => {
    async function loadGifts() {
      try {
        const response = await fetch(
          "https://opensheet.elk.sh/15Eqj04SUsx5jU_tP8no8b01vRHua5d1TxIcdyyjzmT4/presentes"
        );

        const data: GiftSheetRow[] = await response.json();

        const gifts: Gift[] = data.map((item) => ({
          id: Number(item.id),
          name: item.name,
          suggestedPrice: Number(
            item.suggestedPrice.replace(",", ".")
          ),
          category: item.category as GiftCategory,
          priority: item.priority.toUpperCase() === "TRUE",
          image: formatImageUrl(item.image),
          description: item.description,
        }));

        setGifts(gifts);
      } catch (error) {
        console.error("Erro ao carregar lista de presentes:", error);
      }
    }

    loadGifts();
  }, [setGifts]);

  return (
    <main>
      <Hero />
      <PrioritySection />
      <GiftGrid />
      <Footer />
      <ContributionModal />
    </main>
  );
}