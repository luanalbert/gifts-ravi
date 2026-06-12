// Gerador de payload Pix (EMV/BR Code)
// Compatível com BR Code do Banco Central

export interface PixConfig {
  key: string;          // chave pix
  receiverName: string; // nome do recebedor (máx 25)
  city: string;         // cidade (máx 15)
  txid?: string;        // identificador (máx 25)
  description?: string; // descrição (máx 50)
  amount?: number;      // valor opcional
}

function crc16(payload: string): string {
  let crc = 0xffff;
  const bytes = new TextEncoder().encode(payload);

  for (const byte of bytes) {
    crc ^= byte << 8;

    for (let i = 0; i < 8; i++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }

      crc &= 0xffff;
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function tlv(id: string, value: string): string {
  const len = value.length.toString().padStart(2, "0");
  return `${id}${len}${value}`;
}

function sanitizeText(
  text: string,
  maxLength: number
): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-zA-Z0-9 ]/g, "") // remove caracteres inválidos
    .trim()
    .substring(0, maxLength)
    .toUpperCase();
}

export function generatePixPayload(
  config: PixConfig
): string {
  const {
    key,
    receiverName,
    city,
    txid = "***",
    description,
    amount,
  } = config;

  if (!key?.trim()) {
    throw new Error("Chave Pix é obrigatória");
  }

  const cleanName = sanitizeText(
    receiverName,
    25
  );

  const cleanCity = sanitizeText(
    city,
    15
  );

  const cleanTxid =
    txid
      .replace(/[^a-zA-Z0-9*]/g, "")
      .substring(0, 25) || "***";

  // Merchant Account Information (26)
  let maiContent = tlv(
    "00",
    "BR.GOV.BCB.PIX"
  );

  // chave pix
  maiContent += tlv("01", key.trim());

  // descrição opcional
  if (description?.trim()) {
    const cleanDescription = sanitizeText(
      description,
      50
    );

    maiContent += tlv(
      "02",
      cleanDescription
    );
  }

  const mai = tlv("26", maiContent);

  // Payload Format Indicator
  let payload = tlv("00", "01");

  // Point of Initiation Method
  // 11 = estático
  payload += tlv("01", "11");

  // Merchant Account Info
  payload += mai;

  // Merchant Category Code
  payload += tlv("52", "0000");

  // Currency (986 = BRL)
  payload += tlv("53", "986");

  // Valor (opcional)
  if (
    amount !== undefined &&
    amount !== null &&
    amount > 0
  ) {
    payload += tlv(
      "54",
      amount.toFixed(2)
    );
  }

  // Country
  payload += tlv("58", "BR");

  // Merchant Name
  payload += tlv("59", cleanName);

  // Merchant City
  payload += tlv("60", cleanCity);

  // Additional Data Field Template
  const additionalData = tlv(
    "05",
    cleanTxid
  );

  payload += tlv(
    "62",
    additionalData
  );

  // CRC16
  payload += "6304";

  const crc = crc16(payload);

  return payload + crc;
}

export function formatPixAmount(
  value: number
): string {
  return value.toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );
}