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

export function generatePixPayload(
  config: PixConfig
): string {
  const {
    key,
    receiverName,
    city,
    txid = "***",
    amount,
  } = config;

  if (!key?.trim()) {
    throw new Error(
      "Chave Pix é obrigatória"
    );
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

  // Merchant Account Information (ID 26)
  const gui = tlv(
    "00",
    "BR.GOV.BCB.PIX"
  );

  // IMPORTANTE:
  // usa a chave exatamente como cadastrada
  const pixKey = tlv(
    "01",
    key.trim().toLowerCase()
  );

  const merchantAccountInfo =
    tlv(
      "26",
      gui + pixKey
    );

  let payload = "";

  // Payload Format Indicator
  payload += tlv("00", "01");

  // Point of Initiation Method
  // 11 = static QR
  payload += tlv("01", "11");

  // Merchant Account Information
  payload += merchantAccountInfo;

  // Merchant Category Code
  payload += tlv("52", "0000");

  // Transaction Currency
  // 986 = BRL
  payload += tlv("53", "986");

  // Transaction Amount (opcional)
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
    cleanName
  );

  // Merchant City
  payload += tlv(
    "60",
    cleanCity
  );

  // Additional Data Field Template (TXID)
  payload += tlv(
    "62",
    tlv("05", cleanTxid)
  );

  // CRC placeholder
  payload += "6304";

  // CRC final
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