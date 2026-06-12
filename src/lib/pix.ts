// Gerador de payload Pix (EMV/BR Code) - sem backend
// Spec: Banco Central do Brasil - Manual de Padrões para Iniciação do Pix

export interface PixConfig {
  key: string;          // chave pix (cpf, telefone, email, chave aleatória)
  receiverName: string; // nome do recebedor (max 25 chars)
  city: string;         // cidade do recebedor (max 15 chars)
  txid?: string;        // identificador da transação (max 25 chars)
  description?: string; // descrição (max 50 chars, será truncada)
  amount?: number;      // valor (opcional; se omitido, pessoa digita)
}

// Referência: https://www.bcb.gov.br/content/estabilidadefinanceira/pix/Regulamento_Pix/II_ManualdePadroesparaIniciacaodoPix-versao3-1.pdf

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
  const len = String(value.length).padStart(2, "0");
  return `${id}${len}${value}`;
}

export function generatePixPayload(config: PixConfig): string {
  const {
    key,
    receiverName,
    city,
    txid = "***",
    description,
    amount,
  } = config;

  // Limpar e truncar strings
  const cleanName = receiverName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .substring(0, 25)
    .trim();

  const cleanCity = city
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .substring(0, 15)
    .trim();

  const cleanTxid = txid.replace(/[^a-zA-Z0-9*]/g, "").substring(0, 25);

  // Merchant Account Information (MAI) - ID 26
  let maiContent = tlv("00", "BR.GOV.BCB.PIX");
  maiContent += tlv("01", key);

  if (description) {
    const cleanDesc = description
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .substring(0, 50);
    maiContent += tlv("02", cleanDesc);
  }

  const mai = tlv("26", maiContent);

  // Payload format indicator
  let payload = tlv("00", "01");

  // Point of initiation method: 11 = static, 12 = dynamic (dinâmico permite editar valor)
  payload += tlv("01", "12");

  // Merchant Account Information
  payload += mai;

  // Merchant Category Code
  payload += tlv("52", "0000");

  // Transaction Currency (986 = BRL)
  payload += tlv("53", "986");

  // Transaction Amount (opcional)
  if (amount && amount > 0) {
    payload += tlv("54", amount.toFixed(2));
  }

  // Country Code
  payload += tlv("58", "BR");

  // Merchant Name
  payload += tlv("59", cleanName);

  // Merchant City
  payload += tlv("60", cleanCity);

  // Additional Data Field Template (TXID)
  const adf = tlv("05", cleanTxid);
  payload += tlv("62", adf);

  // CRC placeholder (será calculado)
  payload += "6304";

  const crc = crc16(payload);
  return payload + crc;
}

export function formatPixAmount(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
