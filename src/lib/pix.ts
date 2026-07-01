// pix.ts
// Gerador de payload Pix (EMV/BR Code)

export interface PixConfig {
  key: string;
  receiverName: string;
  city: string;
  txid?: string;
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

function tlv(
  id: string,
  value: string
): string {
  // tamanho em bytes UTF-8
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
    .replace(
      /[^A-Za-z0-9 ]/g,
      ""
    )
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

  const cleanName =
    sanitizeText(
      receiverName,
      25
    );

  const cleanCity =
    sanitizeText(
      city,
      15
    );

  const cleanTxid =
    txid
      .replace(
        /[^A-Za-z0-9*]/g,
        ""
      )
      .substring(0, 25) || "***";

  // Merchant Account Information (26)
  const merchantAccountInfo =
    tlv(
      "26",
      tlv(
        "00",
        "BR.GOV.BCB.PIX"
      ) +
        tlv(
          "01",
          key
            .trim()
            .toLowerCase()
        )
    );

  let payload = "";

  // Payload Format Indicator
  payload += tlv(
    "00",
    "01"
  );

  // Point of Initiation Method
  // 11 = static
  payload += tlv(
    "01",
    "11"
  );

  // Merchant Account Information
  payload +=
    merchantAccountInfo;

  // Merchant Category Code
  payload += tlv(
    "52",
    "0000"
  );

  // Currency (986 = BRL)
  payload += tlv(
    "53",
    "986"
  );

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
  payload += tlv(
    "58",
    "BR"
  );

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

  // Additional Data Field Template
  payload += tlv(
    "62",
    tlv(
      "05",
      cleanTxid
    )
  );

  // CRC placeholder
  payload += "6304";

  const crc =
    crc16(payload);

  const finalPayload =
    payload + crc;

  // DEBUG
  console.log(
    "PIX DEBUG"
  );

  console.log({
    key,
    cleanName,
    cleanCity,
    cleanTxid,
    amount,
    merchantAccountInfo,
    payloadBeforeCRC:
      payload,
    crc,
    finalPayload,
  });

  return finalPayload;
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