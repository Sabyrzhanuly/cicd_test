# Bugbot Review Guidelines — cicd-sandbox

> **Статус: отложено.** Сейчас используем GitHub Copilot Free (см. `.github/copilot-instructions.md`).  
> Подключить Bugbot позже, когда понадобится AI-review прямо в PR.

## Общие правила

- Не добавлять секреты, токены, пароли в код и workflow
- Не отключать CI checks без явной причины в PR
- Минимальный diff — не рефакторить несвязанный код в том же PR
- Все изменения через PR, без direct push в `develop` и `main`

## Backend (Node.js)

- Использовать ES modules (`import`/`export`)
- Node.js >= 20
- Ошибки валидации — через `throw new Error` с понятным сообщением
- Тесты: `node:test` + `node:assert/strict`
- Не добавлять лишние зависимости без обоснования

## CI / GitHub Actions

- Имена jobs в `ci.yml` должны совпадать с required checks в Ruleset: `lint`, `test`, `build`
- Workflow должен триггериться на `pull_request` и `merge_group`
- Secrets — только через `secrets.*`, никогда в plain text
- Deploy prod — только `workflow_dispatch` + environment approval

## Security

- Не логировать `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` и другие secrets
- Внешние URL — только HTTPS
- `curl` в workflow — без `-k` (insecure TLS)

## Database

- Не применимо для текущего sandbox (нет БД)
- При добавлении PostgreSQL: миграции через отдельный job `migrations-check`

## Что Bugbot может игнорировать

- Изменения только в `plan-*.md` и `github-cursor-telegram-merge-process.md`
- Обновление версий в `package-lock.json` без изменения логики
