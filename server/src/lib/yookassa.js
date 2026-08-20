import crypto from 'node:crypto';

const API_URL = 'https://api.yookassa.ru/v3';

export function isYookassaConfigured() {
  return Boolean(process.env.YOOKASSA_SHOP_ID && process.env.YOOKASSA_SECRET_KEY);
}

function authHeader() {
  const credentials = Buffer.from(`${process.env.YOOKASSA_SHOP_ID}:${process.env.YOOKASSA_SECRET_KEY}`).toString(
    'base64'
  );
  return `Basic ${credentials}`;
}

// amountRub is a whole-ruble integer (matches how prices are stored elsewhere in this app).
export async function createYookassaPayment({ orderId, amountRub, description, returnUrl }) {
  const response = await fetch(`${API_URL}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader(),
      'Idempotence-Key': crypto.randomUUID(),
    },
    body: JSON.stringify({
      amount: { value: amountRub.toFixed(2), currency: 'RUB' },
      capture: true,
      confirmation: { type: 'redirect', return_url: returnUrl },
      description,
      metadata: { orderId: String(orderId) },
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`YooKassa payment creation failed (${response.status}): ${body}`);
  }

  return response.json();
}

export async function fetchYookassaPayment(paymentId) {
  const response = await fetch(`${API_URL}/payments/${paymentId}`, {
    headers: { Authorization: authHeader() },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`YooKassa payment lookup failed (${response.status}): ${body}`);
  }

  return response.json();
}
