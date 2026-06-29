# GitHub Copilot — инструкции для репозитория cicd-sandbox

> Используем **GitHub Copilot Free** вместо Cursor Bugbot на первом этапе.  
> Cursor Bugbot — опционально позже (см. `.cursor/BUGBOT.md`).

## Общие правила

- Не добавлять секреты, токены, пароли в код и workflow
- Не отключать CI checks без явной причины в PR
- Минимальный diff — не рефакторить несвязанный код в том же PR
- Все изменения через PR, без direct push в `develop` и `main`
- Перед PR: `npm run ci`

## Backend (Node.js)

- ES modules (`import`/`export`)
- Node.js >= 20
- Ошибки валидации — `throw new Error` с понятным сообщением
- Тесты: `node:test` + `node:assert/strict`
- Не добавлять лишние зависимости без обоснования

## CI / GitHub Actions

- Имена jobs в `ci.yml`: `lint`, `test`, `build` — совпадают с Ruleset
- Triggers: `pull_request` и `merge_group`
- Secrets — только через `secrets.*`
- Deploy prod — только `workflow_dispatch` + environment approval

## Security

- Не логировать `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
- Внешние URL — только HTTPS

## Что можно не трогать в review

- Только markdown в `plan-*.md`, `FINDINGS.md`
- `package-lock.json` без изменения логики
