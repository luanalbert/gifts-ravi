// pix.ts
// Gerador de payload Pix (EMV/BR Code)
// Compatível com bancos brasileiros

export interface PixConfig {
  key: string;
  receiverName: string;
  city: string;
  txid?: string;
  amount?: number;
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

  return crc
    .toString(16)
    .toUpperCase()
    .padStart(4, "0");
}

function tlv(id: string, value: string): string {
  const length = value.length
    .toString()
    .padStart(2, "0");

  return `${id}${length}${value}`;
}

function sanitizeText(
  text: string,
  maxLength: number
): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .trim()
    .substring(0, maxLength)
    .toUpperCase();
}

function normalizePixKey(key: string): string {
  const trimmed = key.trim();

  // Email
  if (trimmed.includes("@")) {
    return trimmed.toLowerCase();
  }

  // Somente números
  const numbers = trimmed.replace(/\D/g, "");

  // CPF
  if (numbers.length === 11) {
    return numbers;
  }

  // CNPJ
  if (numbers.length === 14) {
    return numbers;
  }

  // Telefone BR
  if (
    numbers.length === 10 ||
    numbers.length === 11
  ) {
    return `+55${numbers}`;
  }

  // Chave aleatória ou outro formato
  return trimmed;
}

export function generatePixPayload(
  config: PixConfig
): string {
  const {
    key,
    receiverName,
    city,
    txid = "TX123",
    amount,
  } = config;

  if (!key?.trim()) {
    throw new Error(
      "Chave Pix é obrigatória"
    );
  }

  const normalizedKey =
    normalizePixKey(key);

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
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, 25) || "TX123";

  // Merchant Account Information (26)
  let merchantAccountInfo =
    tlv("00", "BR.GOV.BCB.PIX");

  merchantAccountInfo += tlv(
    "01",
    normalizedKey
  );

  const mai = tlv(
    "26",
    merchantAccountInfo
  );

  // Payload base
  let payload = "";

  // Payload Format Indicator
  payload += tlv("00", "01");

  // Point of Initiation Method
  // 11 = static
  payload += tlv("01", "11");

  // Merchant Account Information
  payload += mai;

  // Merchant Category Code
  payload += tlv("52", "0000");

  // Currency (986 = BRL)
  payload += tlv("53", "986");

  // Amount (opcional)
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

  // Country Code
  payload += tlv("58", "BR");

  // Merchant Name
  payload += tlv(
    "59",
    cleanName || "RECEBEDOR"
  );

  // Merchant City
  payload += tlv(
    "60",
    cleanCity || "SAOPAULO"
  );

  // Additional Data Field Template
  const additionalData = tlv(
    "05",
    cleanTxid
  );

  payload += tlv(
    "62",
    additionalData
  );

  // CRC placeholder
  payload += "6304";

  // CRC real
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