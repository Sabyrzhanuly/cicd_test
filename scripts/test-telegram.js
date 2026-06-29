/**
 * Локальная проверка Telegram-бота (группа SBS DEV).
 * Использование: node scripts/test-telegram.js
 *
 * Читает TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID из .env
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnv() {
  const path = join(root, ".env");
  const content = readFileSync(path, "utf8");
  const env = {};

  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }

  return env;
}

const env = loadEnv();
const token = env.TELEGRAM_BOT_TOKEN;
const chatId = env.TELEGRAM_CHAT_ID;

if (!token || !chatId) {
  console.error("Заполните TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в .env");
  process.exit(1);
}

const text = [
  "🧪 cicd-sandbox — тест уведомления",
  "",
  "Группа: SBS DEV",
  "Если видите это сообщение — бот и chat_id настроены верно.",
  "",
  new Date().toISOString(),
].join("\n");

const url = `https://api.telegram.org/bot${token}/sendMessage`;
const body = {
  chat_id: chatId,
  text,
  disable_web_page_preview: true,
};

const response = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

const data = await response.json();

if (!data.ok) {
  console.error("Telegram API error:", data.description || data);
  process.exit(1);
}

console.log("OK: сообщение отправлено в SBS DEV (message_id:", data.result.message_id + ")");
