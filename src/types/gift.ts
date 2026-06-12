export interface Gift {
  id: number;
  name: string;
  suggestedPrice: number;
  category: GiftCategory;
  priority: boolean;
  image: string;
  description: string;
}

export type GiftSheetRow = {
  id: string;
  name: string;
  suggestedPrice: string;
  category: string;
  priority: string;
  image: string;
  description: string;
};

export type GiftCategory =
  | "quartinho"
  | "banho"
  | "alimentacao"
  | "roupinhas"
  | "mimos"
  | "outros";

export const CATEGORY_LABELS: Record<string, string> = {
  todos: "Todos",
  importantes: "⭐ Importantes",
  fraldas: "🚼 Fraldas",
  quartinho: "🛏️ Quartinho",
  banho: "🛁 Banho",
  alimentacao: "🍼 Alimentação",
  roupinhas: "👕 Roupinhas",
  mimos: "🎀 Mimos",
  outros: "Outros",
};

export const CATEGORY_KEYS = Object.keys(CATEGORY_LABELS);

