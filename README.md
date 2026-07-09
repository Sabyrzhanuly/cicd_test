# cicd-sandbox

Тестовый sandbox: **каждый пушит в свою `dev/<имя>`**, в `develop` и `main` — только PR.

## Как работать (3 шага)

```bash
git checkout dev/<ваше-имя>
git merge origin/develop          # 1. подтянуть staging
# ... код ...
git push origin dev/<ваше-имя>    # 2. пушить только в свою ветку
```

3. Готово → **PR `dev/<ваше-имя>` → `develop`**

| Ветка | Push | PR |
|-------|------|-----|
| `dev/<имя>` | ✅ свободно | → `develop` |
| `develop` | ❌ ruleset | → `main` (release) |
| `main` | ❌ ruleset | — |

Подробнее: [CONTRIBUTING.md](./CONTRIBUTING.md)

## develop vs main (для release)

[![develop ahead](https://img.shields.io/github/commits-ahead/Sabyrzhanuly/cicd_test/develop?base=main&label=develop+ahead)](https://github.com/Sabyrzhanuly/cicd_test/compare/main...develop)
[![main ahead](https://img.shields.io/github/commits-ahead/Sabyrzhanuly/cicd_test/main?base=develop&label=main+ahead&color=red)](https://github.com/Sabyrzhanuly/cicd_test/compare/develop...main)

Отчёт: [Issue #9](https://github.com/Sabyrzhanuly/cicd_test/issues/9) · [BRANCH_STATUS.md](./BRANCH_STATUS.md)

## Статус sandbox

- [x] CI (`lint` + `build`)
- [x] Rulesets `develop` / `main`
- [x] Telegram (SBS DEV)
- [x] Модель `dev/<имя>` + PR #8

## Быстрый старт

```bash
npm install
npm run build       # или npm run ci (то же самое)
```

## Структура

```text
.github/workflows/
  ci.yml                      # build only (+ merge_group)
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

`dev/<имя>` — твоя постоянная. `develop` — staging. `main` — production.

## Локально

```bash
npm install && npm run ci
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
