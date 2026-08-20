export function isTelegramConfigured() {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
}

// Never throws — same fire-and-forget contract as sendEmail.
export async function sendTelegramMessage(text) {
  if (!isTelegramConfigured()) {
    console.log(`[telegram:mock] ${text.replace(/\n/g, ' | ')}`);
    return;
  }

  try {
    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'HTML',
      }),
    });
    if (!response.ok) {
      console.error('Telegram notification failed:', response.status, await response.text().catch(() => ''));
    }
  } catch (error) {
    console.error('Failed to send Telegram message:', error.message);
  }
}
