# Регламент: GitHub + Cursor Bugbot + Telegram Merge Process

> Полный регламент и шаблоны для проекта **cicd-sandbox**.  
> Чеклист внедрения: `plan-github-cursor-telegram-merge.md`.

Конфигурация проекта: `PROJECT_CONFIG.yaml`.

---

## 1. Область применения

Процесс для репозитория с ветками:

- `main` — production
- `develop` — staging
- `dev/<имя>` — постоянная ветка разработчика (основная модель)
- `hotfix/<кратко>` — срочные правки в production
- `feature/*` — альтернатива для малых команд

---

## 2. Роли

| Роль | Ответственность |
|------|-----------------|
| Developer | ветка `dev/<имя>`, PR порциями, локальный CI |
| Reviewer | code review, approval |
| Tech Lead | rulesets, BUGBOT.md, политики |
| DevOps | workflows, secrets, deploy |

---

## 3. Поток изменений

### В develop (staging) — модель dev/<имя>

```text
dev/nurlan (ежедневная работа)
  → PR dev/nurlan → develop  (порция готова)
  → CI (lint, test, build)
  → human approval (1)
  → develop
  → deploy dev (auto on push)
  → Telegram notify
```

TASK-ID — в PR и commit, не в имени ветки.

### В main (production)

```text
develop → PR → main
  → CI
  → human approval (1–2)
  → Merge Queue
  → main
  → Telegram notify
  → deploy prod (manual workflow_dispatch)
```

### Hotfix

```text
hotfix/<кратко> → PR → main
  → затем PR: main → develop (обязательно)
```

---

## 4. Запрещено

- Direct push в `develop` и `main`
- Force push в защищённые ветки
- Merge без зелёного CI
- Секреты в коде, логах, workflow plain text
- Auto-deploy production без manual approval

---

## 5. CI — требования

### Triggers (обязательно)

```yaml
on:
  pull_request:
    branches: [develop, main]
  merge_group:
    branches: [develop, main]
```

### Required jobs

Имена jobs **должны совпадать** с Ruleset и `ci_jobs` в `PROJECT_CONFIG.yaml`:

| Job | Команда локально |
|-----|------------------|
| `lint` | `npm run lint` |
| `test` | `npm run test` |
| `build` | `npm run build` |

Локальная проверка всего CI:

```bash
npm run ci
```

---

## 6. GitHub Rulesets

Settings → Rules → Rulesets (создать вручную в GitHub UI).

### Ruleset: `develop`

| Правило | Значение |
|---------|----------|
| Target branches | `develop` |
| Require pull request | ✓ |
| Required approvals | 1 |
| Required status checks | `lint`, `test`, `build` |
| Require branches up to date | ✓ |
| Require conversation resolution | ✓ |
| Require merge queue | ✓ (Team plan) |
| Block force pushes | ✓ |
| Restrict direct pushes | ✓ |
| Allow bypass | никому |

### Ruleset: `main`

То же + рекомендуется:

- Required approvals: **2**
- Require review from CODEOWNERS

---

## 7. Merge Queue

1. Включить в Ruleset для `develop` и `main`
2. Убедиться, что CI имеет trigger `merge_group`
3. Тест: создать 2 PR → merge первый → второй пересобирается в очереди

**Free plan:** Merge Queue недоступен — использовать «Require up to date» + merge по одному PR.

---

## 8. AI review — GitHub Copilot (Free) или Cursor Bugbot

### Вариант A: GitHub Copilot Free (текущий для cicd_test)

1. [GitHub Copilot settings](https://github.com/settings/copilot) → включить **Copilot Free**
2. IDE: расширение GitHub Copilot (VS Code / Cursor / JetBrains)
3. Инструкции репозитория: `.github/copilot-instructions.md`

**Free plan:** автодополнение и chat в IDE.  
**Не входит:** [Copilot code review](https://docs.github.com/en/copilot/concepts/agents/code-review) в PR — нужен Pro/Pro+.

Ревью PR на Free: **человек** (approval в Ruleset) + локально `npm run ci`.

### Вариант B: Copilot code review (Pro)

1. Repo → Settings → Copilot → Code review → Enable
2. В PR: Reviewers → **Copilot**, или automatic review в rules

### Вариант C: Cursor Bugbot (опционально, позже)

1. [Cursor Dashboard](https://cursor.com/dashboard) → Integrations → GitHub
2. Bugbot → Enable
3. Правила: `.cursor/BUGBOT.md`

Режим **advisory** — AI комментирует, человек решает.

---

## 9. Telegram

### Secrets (Repository → Settings → Secrets → Actions)

| Secret | Описание |
|--------|----------|
| `TELEGRAM_BOT_TOKEN` | Токен от @BotFather |
| `TELEGRAM_CHAT_ID` | ID группы/канала |

### Получение chat_id

1. Добавить бота в группу
2. Отправить сообщение в группу
3. `https://api.telegram.org/bot<TOKEN>/getUpdates` → найти `chat.id`

### Workflow

Файл: `.github/workflows/telegram-merge-notify.yml`  
Триггер: `pull_request` closed + merged → ветки `develop`, `main`.

Если secrets не настроены — workflow завершается успешно с сообщением «skipping».

---

## 10. Deploy

| Окружение | Workflow | Trigger |
|-----------|----------|---------|
| development | `deploy-dev.yml` | push на `develop`, workflow_dispatch |
| production | `deploy-prod.yml` | workflow_dispatch + input `deploy` |

Production использует GitHub Environment `production` с required reviewers.

```yaml
concurrency:
  group: deploy-<env>-<repo>
  cancel-in-progress: false
```

---

## 11. Шпаргалка для разработчиков

### dev/<имя> (большая команда)

```bash
# Первый раз
git checkout develop && git pull
git checkout -b dev/nurlan
git push -u origin dev/nurlan

# Каждый день
git checkout dev/nurlan
git fetch origin && git merge origin/develop

# Commit + push — сколько угодно
git commit -m "feat(auth): TASK-123 fix timeout"
git push origin dev/nurlan

# Готова порция → PR: dev/nurlan → develop
# В PR: TASK-123, TASK-128, что вошло в этот merge

# После Telegram
git merge origin/develop
```

### feature/* (альтернатива, малая команда)

```bash
git checkout develop && git pull
git checkout -b feature/short-name
git push -u origin feature/short-name
# → PR в develop
```

---

## 12. Environments в GitHub

Создать в Settings → Environments:

### `development`

- Без required reviewers (или по желанию)
- Secrets deploy при необходимости

### `production`

- Required reviewers: 1–2 человека
- Deployment branches: только `main`

---

## 13. Шаблон BUGBOT.md

См. `.cursor/BUGBOT.md` в репозитории. Базовая структура:

```markdown
# Bugbot Review Guidelines

## Общие правила
- ...

## Backend (<stack>)
- ...

## Frontend (<stack>)
- ...

## CI / GitHub Actions
- ...

## Security
- ...

## Database
- ...
```

---

## 14. Миграция со старых веток

**Из `nurlan`, `dev-ivan` → `dev/<имя>`:**

```bash
git fetch origin
git checkout nurlan
git branch -m dev/nurlan
git push -u origin dev/nurlan
git push origin --delete nurlan
# PR dev/nurlan → develop порциями
```

**Из произвольной ветки → `feature/*` (альтернатива):**

```bash
git fetch origin
git checkout old-branch
git checkout -b feature/short-name
git push -u origin feature/short-name
# PR → develop
```

---

## 15. CODEOWNERS — шаблон

```text
/src/                    @org/backend
/.github/workflows/      @org/devops
/.cursor/                @org/devops
```

См. `.github/CODEOWNERS`.

---

## 16. PR template — шаблон

См. `.github/pull_request_template.md`.

---

## 17. Secrets — полный список

| Secret | Обязательность | Назначение |
|--------|----------------|------------|
| `TELEGRAM_BOT_TOKEN` | для notify | Telegram Bot API |
| `TELEGRAM_CHAT_ID` | для notify | ID чата |
| Deploy secrets | по инфраструктуре | SSH keys, webhooks |

---

## 18. Multi-repo (справка)

При `repo_mode: multi` — все файлы и настройки **в каждом репо отдельно**.  
В описании PR указывать связанный PR: `Related: org/frontend#42`.

---

## 19. Troubleshooting

| Проблема | Решение |
|----------|---------|
| CI не запускается на merge_group | Добавить `merge_group` trigger в ci.yml |
| Required check не находится | Имя job = имя в Ruleset (регистр!) |
| Telegram молчит | Проверить secrets, бот в группе, chat_id |
| Bugbot не комментирует | Cursor integration + Bugbot enabled для repo |
| Merge Queue серый | Нужен GitHub Team plan |
| Deploy prod без approval | Environment `production` + required reviewers |

---

## 20. Telegram workflow — полный шаблон

```yaml
name: Telegram Merge Notify

on:
  pull_request:
    types: [closed]
    branches: [develop, main]

jobs:
  notify:
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-latest
    steps:
      - name: Send Telegram notification
        env:
          TELEGRAM_BOT_TOKEN: ${{ secrets.TELEGRAM_BOT_TOKEN }}
          TELEGRAM_CHAT_ID: ${{ secrets.TELEGRAM_CHAT_ID }}
          PROJECT_NAME: cicd-sandbox
          REPO: ${{ github.repository }}
          BRANCH: ${{ github.event.pull_request.base.ref }}
          PR_NUMBER: ${{ github.event.pull_request.number }}
          PR_TITLE: ${{ github.event.pull_request.title }}
          PR_URL: ${{ github.event.pull_request.html_url }}
          MERGED_BY: ${{ github.event.pull_request.merged_by.login }}
        run: |
          if [ -z "$TELEGRAM_BOT_TOKEN" ] || [ -z "$TELEGRAM_CHAT_ID" ]; then
            echo "Telegram secrets not configured — skipping"
            exit 0
          fi
          # ... см. .github/workflows/telegram-merge-notify.yml
```

---

## 21. Чеклист первого запуска

- [ ] Репозиторий создан на GitHub
- [ ] `main` запушен
- [ ] Ветка `develop` создана от `main`
- [ ] Secrets: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
- [ ] Environments: `development`, `production`
- [ ] Rulesets для `develop` и `main`
- [ ] Cursor Bugbot подключён
- [ ] Тестовый PR → CI зелёный → merge → Telegram

Подробная пошаговая инструкция: `SETUP_GITHUB.md`.

---

## 22. Связанные документы

- `plan-github-cursor-telegram-merge.md` — план внедрения
- `PROJECT_CONFIG.yaml` — конфигурация проекта
- `SETUP_GITHUB.md` — пошаговая настройка GitHub
- [GitHub Merge Queue](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue)
- [Cursor Bugbot](https://cursor.com/docs/bugbot)
