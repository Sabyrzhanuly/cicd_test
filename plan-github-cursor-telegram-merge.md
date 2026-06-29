# План внедрения: GitHub + Cursor Bugbot + Telegram (универсальный)

> Универсальный чеклист для **любого** GitHub-репозитория или набора репозиториев.  
> Регламент и шаблоны workflow: `github-cursor-telegram-merge-process.md`.

Перед стартом заполните **§0 Конфигурация проекта** — остальные разделы одинаковы для всех.

---

## 0. Конфигурация проекта (заполнить один раз)

Скопируйте блок ниже в начало своего проекта / wiki / issue и заполните.

```yaml
# --- PROJECT CONFIG ---

project_name: "<название проекта>"

# Сколько репозиториев?
repo_mode: single          # single | monorepo | multi

repositories:
  - name: "<org>/<repo>"
    role: full               # full | backend | frontend | infra | ...
    default_branch: main     # main | master
    staging_branch: develop  # develop | staging | ...
    stack: "<стек>"          # напр. django+vue, node, go, ...

# Имена веток (если отличаются от стандартных)
branches:
  production: main           # main | master
  staging: develop           # develop | staging
  feature_prefix: feature    # feature/TASK-123-name

# CI job names (должны совпадать с required checks в Ruleset)
ci_jobs:
  - lint
  - test
  - build
  # добавить свои: migrations-check, e2e, security-scan, ...

# GitHub
github_org: "<org>"
github_plan: team            # free | team | enterprise — для Merge Queue

# Cursor
cursor_bugbot_mode: advisory # advisory | required

# Telegram
telegram_bot_token_secret: TELEGRAM_BOT_TOKEN
telegram_chat_id_secret: TELEGRAM_CHAT_ID

# Deploy
deploy_dev_trigger: push     # push | workflow_dispatch | none
deploy_prod_trigger: manual  # manual | push — рекомендуется manual для prod
deploy_prod_environment: production

# CODEOWNERS (GitHub users или teams)
owners:
  backend: "@org/backend"
  frontend: "@org/frontend"
  devops: "@org/devops"
  tech_lead: "@org/tech-leads"

# Связанные PR (для multi-repo)
cross_repo_pr_policy: "указывать номер PR в соседнем репо в описании"
```

### Режимы репозитория

| `repo_mode` | Когда использовать | Что повторять |
|-------------|-------------------|---------------|
| `single` | Один репо, fullstack или любой стек | Всё один раз |
| `monorepo` | Backend + frontend в одном репо | CI jobs по путям, один ruleset |
| `multi` | Несколько репо (backend, frontend, …) | Rulesets, CI, Telegram, Bugbot — **в каждом репо** |

---

## 1. Цель

Внедрить воспроизводимый процесс:

1. Запрет direct push в `<staging>` и `<production>`.
2. Все изменения через Pull Request.
3. CI перед merge (+ `merge_group` для Merge Queue).
4. Cursor Bugbot — AI review, человек принимает решение.
5. Telegram после merge с командой `git pull`.
6. Merge Queue — безопасная очередь merge.
7. Deploy с concurrency; production — с manual approval.

---

## 2. Аудит текущего состояния

Заполнить для **каждого** репозитория из `repositories`:

| Вопрос | Значение |
|--------|----------|
| URL репозитория | |
| Production-ветка (`main` / `master`) | |
| Staging-ветка (`develop`) — есть? | |
| Рабочие ветки команды (feature/* или личные?) | |
| CI workflow — есть? | |
| Required checks в GitHub — настроены? | |
| Branch protection / Rulesets | |
| Deploy — auto / manual / нет | |
| Cursor Bugbot подключён | |
| Telegram merge notify | |
| CODEOWNERS / PR template | |

**Что уже можно не трогать:**

- `environment: production` + required reviewers
- `concurrency` в deploy workflows
- Существующий backup-бот → те же `TELEGRAM_*` secrets

---

## 3. Целевая схема веток

```text
<production>     → production (main или master)
<staging>        → dev/staging (develop)
feature/<TASK>-short-name
bugfix/<TASK>-short-name
hotfix/<TASK>-short-name
```

**Не использовать** постоянные личные ветки (`dev-ivan`, `dev-team`) — только task-based.

### Поток в staging

```text
feature/* → PR → <staging>
  → Bugbot
  → CI
  → human approval
  → Merge Queue
  → <staging>
  → (опционально) deploy dev
  → Telegram
```

### Поток в production

```text
<staging> → PR → <production>
  → CI
  → human approval (1–2)
  → Merge Queue
  → <production>
  → Telegram
  → deploy prod (manual или auto — по политике)
```

### Hotfix

```text
hotfix/* → PR → <production>
  → затем обязательно PR: <production> → <staging>
```

---

## 4. Предварительные требования

| Требование | Проверка |
|------------|----------|
| GitHub: Merge Queue для private repo | Team / Enterprise |
| Cursor: подписка с Bugbot | Dashboard → Bugbot |
| GitHub App: Cursor ↔ GitHub | Integrations |
| Telegram: bot token + chat id | Secrets в репо |
| CI: команды известны и работают локально | lint, test, build |
| Команда согласна с новыми правилами веток | соз созвон / сообщение |

---

## 5. Этапы внедрения

### Этап 0. Согласование (0.5 дня)

- [ ] Объявить команде формат веток: `feature/<TASK>-name`.
- [ ] Зафиксировать имена `<staging>` и `<production>`.
- [ ] Назначить ответственных: rulesets, secrets, Bugbot.
- [ ] Для `multi`: договориться про связанные PR между репо.

---

### Этап 1. Staging-ветка (0.5 дня)

**Если `<staging>` ещё нет** — в каждом репо:

```bash
git checkout <production>
git pull origin <production>
git checkout -b <staging>
git push -u origin <staging>
```

- [ ] `<staging>` создана во всех репо из конфига.
- [ ] README / CONTRIBUTING обновлён.

**Если `<staging>` уже есть** — пропустить создание, проверить синхронизацию с `<production>`.

---

### Этап 2. CI (1–2 дня)

Создать `.github/workflows/ci.yml` в **каждом** репо (или один workflow с matrix для monorepo).

**Обязательные triggers:**

```yaml
on:
  pull_request:
    branches: [<staging>, <production>]
  merge_group:
    branches: [<staging>, <production>]
```

**Jobs** — имена **точно** как в `ci_jobs` из §0:

| Job (пример) | Типичное содержание | Когда нужен |
|--------------|---------------------|-------------|
| `lint` | ruff/eslint/golangci-lint | почти всегда |
| `test` | pytest/jest/go test | если есть тесты |
| `build` | npm run build / docker build | frontend, artifacts |
| `migrations-check` | makemigrations --check | ORM-проекты |
| `e2e` | playwright/cypress | по желанию |

- [ ] `ci.yml` создан.
- [ ] Jobs проходят локально.
- [ ] Тестовый PR → зелёные checks в GitHub.

**Monorepo:** использовать `paths` / `paths-filter` чтобы не гонять лишнее:

```yaml
# пример: backend jobs только при изменениях в backend/
paths:
  - 'backend/**'
  - '.github/workflows/ci.yml'
```

---

### Этап 3. GitHub Rulesets (0.5 дня)

Settings → Rules → Rulesets — **в каждом репо**.

#### Ruleset: `<staging>`

| Правило | Значение |
|---------|----------|
| Target branches | `<staging>` |
| Require pull request | ✓ |
| Required approvals | 1 |
| Required status checks | все из `ci_jobs` |
| Require branches up to date | ✓ |
| Require conversation resolution | ✓ |
| Require merge queue | ✓ (если план позволяет) |
| Block force pushes | ✓ |
| Restrict direct pushes | ✓ |
| Allow bypass | **никому** |

#### Ruleset: `<production>`

То же + по желанию:

- Required approvals: **2**
- CODEOWNERS review required
- Stricter check set

- [ ] Ruleset для `<staging>`.
- [ ] Ruleset для `<production>`.
- [ ] Direct push отклоняется (проверить тестом).

**Нет Merge Queue (Free plan):** оставить «Require up to date» + merge по одному PR вручную. Зафиксировать в README как осознанное ограничение.

---

### Этап 4. Telegram (0.5 дня)

#### Secrets (каждый репо)

Repository → Settings → Secrets → Actions:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

#### Workflow

Файл: `.github/workflows/telegram-merge-notify.yml`

Шаблон — в `github-cursor-telegram-merge-process.md` (§20).

**Адаптировать под конфиг:**

1. `branches: [<staging>, <production>]` вместо hardcoded `develop`/`main`.
2. В тексте сообщения — `project_name` и имя репо (`github.repository`).
3. Блок «что сделать локально» — под ваши имена веток.

- [ ] Secrets добавлены.
- [ ] Workflow добавлен.
- [ ] Тестовый merge PR → сообщение в Telegram.

**Multi-repo:** одно сообщение на merge в каждом репо (или общий бот с префиксом `[backend]` / `[frontend]`).

---

### Этап 5. Cursor Bugbot (0.5–1 день)

1. Cursor Dashboard → Integrations → GitHub.
2. Выбрать org и репозитории.
3. Bugbot → Enable для каждого репо.

#### `.cursor/BUGBOT.md`

Создать в **корне каждого репо**. Базовый шаблон — §13 регламента. Добавить секции под свой стек:

```markdown
## Backend (<stack>)
- ...

## Frontend (<stack>)
- ...

## Database
- ...

## Security
- ...
```

- [ ] GitHub integration.
- [ ] Bugbot enabled.
- [ ] `BUGBOT.md` в репо(ах).
- [ ] Тестовый PR → комментарии Bugbot.

**Режим:** начать с `advisory` (`cursor_bugbot_mode`). Required check — только после 2–4 недель стабильной работы.

---

### Этап 6. PR template + CODEOWNERS (0.5 дня)

| Файл | Назначение |
|------|------------|
| `.github/pull_request_template.md` | §16 регламента |
| `.github/CODEOWNERS` | §15 регламента — пути под **вашу** структуру |

**CODEOWNERS — примеры путей (подставить свои):**

```text
# Backend
/src/                    @org/backend
/api/                    @org/backend
**/migrations/           @org/backend

# Frontend
/web/                    @org/frontend
/apps/ui/                @org/frontend

# Infra (всегда review)
/.github/workflows/      @org/devops
/Dockerfile              @org/devops
/deploy/                 @org/devops
docker-compose*.yml      @org/devops
```

- [ ] PR template.
- [ ] CODEOWNERS с реальными `@org/team`.

---

### Этап 7. Merge Queue (0.5 дня)

Только после стабильного CI с `merge_group`:

- [ ] Merge Queue включён для `<staging>`.
- [ ] Протестировано: 2 PR → очередь → второй пересобирается поверх первого.
- [ ] Merge Queue для `<production>`.

---

### Этап 8. Deploy (опционально)

| Окружение | Рекомендация | Trigger |
|-----------|--------------|---------|
| Dev/staging | auto или manual | `push` на `<staging>` или `workflow_dispatch` |
| Production | **manual + approval** | `workflow_dispatch` + `environment: production` |

```yaml
concurrency:
  group: deploy-<env>-<repo>
  cancel-in-progress: false
```

- [ ] Решена политика deploy (auto dev / manual prod).
- [ ] Workflows не конфликтуют с Telegram (notify только на `pull_request.merged`).

---

### Этап 9. Миграция команды (1–2 недели)

Для каждой старой рабочей ветки:

```bash
git fetch origin
git checkout <old-branch>
git checkout -b feature/<TASK>-current-work
git push -u origin feature/<TASK>-current-work
# PR → <staging>
```

- [ ] Все активные задачи перенесены в `feature/*`.
- [ ] Старые ветки удалены с remote.
- [ ] Команда получила шпаргалку (§11).

---

## 6. Файлы (универсальный список)

| Файл | single | monorepo | multi |
|------|:------:|:--------:|:-----:|
| `.github/workflows/ci.yml` | ✓ | ✓ (paths/matrix) | ✓ × N репо |
| `.github/workflows/telegram-merge-notify.yml` | ✓ | ✓ | ✓ × N |
| `.github/pull_request_template.md` | ✓ | ✓ | ✓ × N |
| `.github/CODEOWNERS` | ✓ | ✓ | ✓ × N |
| `.cursor/BUGBOT.md` | ✓ | ✓ | ✓ × N |
| `.github/workflows/deploy-dev.yml` | опц. | опц. | опц. |
| `.github/workflows/deploy-prod.yml` | опц. | опц. | опц. |

Готовые тексты workflow и BUGBOT — в `github-cursor-telegram-merge-process.md`.

---

## 7. GitHub Secrets (универсально)

| Secret | Обязательность | Назначение |
|--------|----------------|------------|
| `TELEGRAM_BOT_TOKEN` | для notify | Telegram Bot API |
| `TELEGRAM_CHAT_ID` | для notify | ID группы/канала |
| Deploy secrets | по инфраструктуре | SSH, webhook HMAC, cloud keys |

---

## 8. Шпаргалка для разработчиков

```bash
# Новая задача
git checkout <staging>
git pull origin <staging>
git checkout -b feature/<TASK>-short-name

# После работы
git push origin feature/<TASK>-short-name
# → Pull Request в <staging>

# После Telegram «<staging> обновлён»
git fetch origin
git checkout <staging>
git pull origin <staging>

# В своей feature-ветке
git checkout feature/<TASK>-short-name
git merge origin/<staging>
```

---

## 9. Риски

| Риск | Митигация |
|------|-----------|
| Merge Queue недоступен | Up-to-date + ручная очередь merge |
| CI flaky | Минимальный CI сначала, стабилизировать |
| Bugbot шумит | Advisory + tune BUGBOT.md |
| Multi-repo рассинхрон | Связанные PR в описании |
| Обход rulesets | Пустой bypass list |
| Случайный auto-deploy prod | Только manual + environment approval |

---

## 10. Критерии завершения

- [ ] `<staging>` есть, rulesets активны во всех репо.
- [ ] CI зелёный на PR и `merge_group`.
- [ ] Merge Queue работает (или задокументирован отказ).
- [ ] Telegram после merge.
- [ ] Bugbot комментирует PR.
- [ ] PR template + CODEOWNERS на месте.
- [ ] Команда на `feature/*`, личные ветки закрыты.
- [ ] README/CONTRIBUTING обновлён.

---

## 11. Оценка сроков

| Этап | Срок |
|------|------|
| 0–1. Согласование + ветки | 1 день |
| 2. CI | 1–2 дня |
| 3–4. Rulesets + Telegram | 1 день |
| 5–6. Bugbot + templates | 1 день |
| 7–8. Merge Queue + deploy | 0.5–1 день |
| 9. Миграция команды | 1–2 недели |

**Техника:** ~4–6 дней на репо (multi × N — параллелить настройку).  
**Адаптация команды:** ~2–3 недели.

---

## 12. Быстрый старт (минимум)

Если нужно внедрить за 1–2 дня без Merge Queue:

1. Создать `<staging>`.
2. Добавить `ci.yml` (хотя бы `build` или `test`).
3. Ruleset: PR required + 1 approval + required checks.
4. Telegram notify.
5. Bugbot advisory.

Merge Queue, CODEOWNERS, auto-deploy — второй итерацией.

---

## 13. Связанные документы

- `github-cursor-telegram-merge-process.md` — полный регламент, YAML-шаблоны, BUGBOT.md, PR template.
- `SETUP_GITHUB.md` — пошаговая настройка GitHub для sandbox.
- `FINDINGS.md` — журнал изъянов при тестировании (обновлять план по результатам).
- [GitHub Merge Queue](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue)
- [Cursor Bugbot](https://cursor.com/docs/bugbot)
- [Cursor GitHub integration](https://cursor.com/docs/integrations/github)

---

## 14. Пример заполненного конфига (образец)

```yaml
project_name: "MyApp"
repo_mode: single
repositories:
  - name: "acme/myapp"
    role: full
    default_branch: main
    staging_branch: develop
    stack: "node+react"
ci_jobs: [lint, test, build]
github_org: acme
github_plan: team
cursor_bugbot_mode: advisory
deploy_dev_trigger: push
deploy_prod_trigger: manual
```

Для двух репо — `repo_mode: multi`, два элемента в `repositories`, все этапы ×2.
