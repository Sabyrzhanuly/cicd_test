# Журнал находок при тестировании

> Заполняйте по мере прогона sandbox. Переносите исправления в `plan-github-cursor-telegram-merge.md`.

## Формат записи

```markdown
### [дата] Краткий заголовок

- **Этап плана:** (напр. Этап 4 — Telegram)
- **Ожидание:** ...
- **Факт:** ...
- **Исправление:** ... (файл / раздел плана)
- **Статус:** open | fixed
```

---

## Записи

### [2026-06-29] Sandbox создан локально

- **Этап плана:** подготовка
- **Ожидание:** все файлы из §6 плана на месте
- **Факт:** созданы ci, telegram, deploy, CODEOWNERS, PR template, BUGBOT.md, регламент, SETUP_GITHUB.md
- **Исправление:** —
- **Статус:** open (ожидает push на GitHub и прогон §9 SETUP_GITHUB)

### [2026-06-29] Регламент отсутствовал в репо

- **Этап плана:** §13 связанные документы
- **Ожидание:** `github-cursor-telegram-merge-process.md` уже есть
- **Факт:** в workspace был только plan
- **Исправление:** создан полный регламент с §11–§20
- **Статус:** fixed

### [2026-06-29] Copilot Free вместо Cursor Bugbot

- **Этап плана:** Этап 5 — AI review
- **Ожидание:** Bugbot комментирует каждый PR
- **Факт:** Copilot Free не включает code review в PR (только Pro+); Free = IDE + copilot-instructions.md
- **Исправление:** provider `github_copilot`, human review в PR; Bugbot отложен; добавить в план вариант A/B
- **Статус:** fixed в sandbox, open в plan-github-cursor-telegram-merge.md

### [2026-06-29] feature/TASK-* неудобен для большой команды

- **Этап плана:** §3 схема веток
- **Ожидание:** одна ветка на задачу
- **Факт:** много разработчиков и задач — branch explosion, TASK в имени ветки неудобен
- **Исправление:** `branch_strategy: dev_per_developer`, TASK-ID в PR/commit; §3, §8, §9, CONTRIBUTING
- **Статус:** fixed

### [2026-06-29] Telegram Markdown ломается на спецсимволах

- **Этап плана:** Этап 4 — Telegram
- **Ожидание:** сообщение с parse_mode Markdown всегда доставляется
- **Факт:** ошибка `can't parse entities` при `_` в timestamp; PR title с `_*` тоже сломает Markdown
- **Исправление:** убрать parse_mode в workflow и test-telegram.js; plain text + jq для JSON
- **Статус:** fixed
