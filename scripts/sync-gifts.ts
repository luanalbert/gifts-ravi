/**
 * sync-gifts.ts
 * Converte Excel ou CSV → /public/data/gifts.json
 *
 * Uso: npm run sync-gifts
 *
 * O arquivo de entrada deve se chamar "presentes.xlsx" ou "presentes.csv"
 * e estar na pasta /data/ na raiz do projeto.
 *
 * Colunas esperadas no Excel/CSV:
 * id | nome | valor_sugerido | categoria | prioridade | imagem | descricao
 */

import * as fs from "fs";
import * as path from "path";
import * as XLSX from "xlsx";
import type { Gift } from "../src/types/gift";

const DATA_DIR = path.join(process.cwd(), "data");
const OUTPUT_PATH = path.join(process.cwd(), "public", "data", "gifts.json");

// Aceita boolean em vários formatos
function parseBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const lower = value.toLowerCase().trim();
    return lower === "true" || lower === "1" || lower === "sim" || lower === "yes";
  }
  return false;
}

function findInputFile(): string {
  const extensions = [".xlsx", ".xls", ".csv"];
  const names = ["presentes", "gifts", "lista"];

  for (const name of names) {
    for (const ext of extensions) {
      const filePath = path.join(DATA_DIR, `${name}${ext}`);
      if (fs.existsSync(filePath)) {
        return filePath;
      }
    }
  }

  throw new Error(
    `Arquivo de entrada não encontrado em /data/\n` +
    `Esperado: presentes.xlsx, presentes.csv, gifts.xlsx, etc.`
  );
}

function processRow(row: Record<string, unknown>, index: number): Gift {
  const id = Number(row["id"] ?? row["ID"] ?? index + 1);
  const name = String(row["nome"] ?? row["name"] ?? "").trim();
  const suggestedPrice = Number(row["valor_sugerido"] ?? row["suggestedPrice"] ?? row["preco"] ?? 0);
  const category = String(row["categoria"] ?? row["category"] ?? "outros").trim().toLowerCase();
  const priority = parseBoolean(row["prioridade"] ?? row["priority"] ?? false);
  const imageRaw = String(row["imagem"] ?? row["image"] ?? "").trim();
  const description = String(row["descricao"] ?? row["description"] ?? "").trim();

  // Normalizar caminho da imagem
  let image = "";
  if (imageRaw) {
    image = imageRaw.startsWith("/") ? imageRaw : `/images/${imageRaw}`;
  }

  if (!name) {
    console.warn(`⚠️  Linha ${index + 2}: item sem nome, pulando.`);
  }

  return { id, name, suggestedPrice, category: category as Gift["category"], priority, image, description };
}

async function main() {
  console.log("🔄 Sincronizando presentes...\n");

  // Garantir que a pasta de output existe
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Encontrar arquivo de entrada
  const inputPath = findInputFile();
  console.log(`📂 Arquivo encontrado: ${inputPath}`);

  // Ler com xlsx (suporta .xlsx, .xls, .csv)
  const workbook = XLSX.readFile(inputPath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
    raw: false,
  });

  console.log(`📊 ${rows.length} itens encontrados na planilha`);

  const gifts: Gift[] = rows
    .map((row, i) => processRow(row, i))
    .filter((g) => g.name); // Remover itens sem nome

  // Salvar JSON
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(gifts, null, 2), "utf-8");

  console.log(`\n✅ ${gifts.length} presentes exportados para:\n   ${OUTPUT_PATH}`);
  console.log("\n📋 Resumo:");
  console.log(`   • Total: ${gifts.length}`);
  console.log(`   • Prioritários: ${gifts.filter((g) => g.priority).length}`);
  const categories = [...new Set(gifts.map((g) => g.category))];
  console.log(`   • Categorias: ${categories.join(", ")}`);
}

main().catch((err) => {
  console.error("\n❌ Erro:", err.message);
  process.exit(1);
});
