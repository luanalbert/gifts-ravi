// pix.ts

export interface PixConfig {
  key: string;
  receiverName: string;
  city: string;
  amount?: number;
}

function crc16(payload: string): string {
  let crc = 0xffff;

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;

    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
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
  // comprimento em bytes UTF-8
  const length = new TextEncoder()
    .encode(value)
    .length
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
    .replace(/[^A-Za-z0-9 ]/g, "")
    .trim()
    .substring(0, maxLength)
    .toUpperCase();
}

export function generatePixPayload({
  key,
  receiverName,
  city,
  amount,
}: PixConfig): string {
  const cleanName = sanitizeText(
    receiverName,
    25
  );

  const cleanCity = sanitizeText(
    city,
    15
  );

  // Merchant Account Information (26)
  const merchantAccountInfo = tlv(
    "26",
    tlv("00", "BR.GOV.BCB.PIX") +
      tlv(
        "01",
        key.trim().toLowerCase()
      )
  );

  let payload = "";

  // Payload Format Indicator
  payload += tlv("00", "01");

  // Static QR
  payload += tlv("01", "11");

  // Merchant Account Information
  payload += merchantAccountInfo;

  // Merchant Category Code
  payload += tlv("52", "0000");

  // Currency (BRL)
  payload += tlv("53", "986");

  // Amount
  if (
    amount !== undefined &&
    amount > 0
  ) {
    payload += tlv(
      "54",
      amount.toFixed(2)
    );
  }

  // Country
  payload += tlv("58", "BR");

  // Receiver Name
  payload += tlv(
    "59",
    cleanName
  );

  // City
  payload += tlv(
    "60",
    cleanCity
  );

  // TXID obrigatório
  payload += tlv(
    "62",
    tlv("05", "***")
  );

  // CRC placeholder
  payload += "6304";

  // CRC real
  payload += crc16(payload);

  return payload;
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