# cicd-sandbox

Тестовый проект для отработки CI/CD процесса:

**GitHub (PR + Rulesets) → Copilot Free → Telegram → Deploy**

## Статус настройки

- [x] CI (lint, test, build)
- [x] Rulesets для `develop` / `main`
- [x] Telegram secrets (SBS DEV)
- [ ] Первый тестовый PR → merge → уведомление в Telegram

## Быстрый старт

```bash
npm install
npm run ci          # lint + test + build
```

## Структура

```text
.github/workflows/
  ci.yml                      # lint, test, build (+ merge_group)
  telegram-merge-notify.yml   # уведомление после merge
  deploy-dev.yml              # auto deploy на develop
  deploy-prod.yml             # manual deploy на main
.github/copilot-instructions.md  # правила для GitHub Copilot
.cursor/BUGBOT.md                # Cursor Bugbot (отложено)
PROJECT_CONFIG.yaml           # конфигурация процесса
plan-github-cursor-telegram-merge.md      # план внедрения
github-cursor-telegram-merge-process.md   # регламент
SETUP_GITHUB.md               # пошаговая настройка GitHub
```

## Ветки

| Ветка | Назначение |
|-------|------------|
| `main` | production |
| `develop` | staging |
| `feature/TASK-name` | задачи |

## Локальная разработка

```bash
git checkout develop
git pull origin develop
git checkout -b feature/TASK-001-my-change
# ... работа ...
npm run ci
git push -u origin feature/TASK-001-my-change
# → Pull Request в develop
```

## Настройка GitHub

См. **[SETUP_GITHUB.md](./SETUP_GITHUB.md)** — пошаговая инструкция:

1. Создать репозиторий
2. Push `main` + создать `develop`
3. Secrets (Telegram)
4. Environments (development, production)
5. Rulesets
6. GitHub Copilot Free (см. SETUP_GITHUB §7)
7. Тестовый PR

## Документация процесса

- [План внедрения](./plan-github-cursor-telegram-merge.md)
- [Регламент](./github-cursor-telegram-merge-process.md)
- [Contributing](./CONTRIBUTING.md)

## Заметки для доработки плана

При тестировании фиксируйте найденные изъяны в issue или в комментариях к `plan-github-cursor-telegram-merge.md`:

- что не сработало из коробки
- что лишнее для минимального старта
- что нужно добавить в шаблоны
