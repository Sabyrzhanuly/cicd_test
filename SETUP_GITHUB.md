# Пошаговая настройка GitHub — cicd-sandbox

> Выполняйте после `git init` и первого push.  
> Замените `your-org/cicd-sandbox` на ваш реальный org/repo.

---

## Шаг 1. Создать репозиторий на GitHub

1. GitHub → New repository → `cicd-sandbox`
2. **Не** добавлять README/license (уже есть локально)
3. Visibility: private (для Merge Queue нужен Team plan на private)

```bash
git init
git add .
git commit -m "chore: initial sandbox for CI/CD process testing"
git branch -M main
git remote add origin https://github.com/Sabyrzhanuly/cicd_test.git
git push -u origin main
```

---

## Шаг 2. Создать ветку develop

```bash
git checkout -b develop
git push -u origin develop
git checkout main
```

Или через GitHub UI: Branches → create `develop` from `main`.

---

## Шаг 3. GitHub Secrets

Repository → **Settings → Secrets and variables → Actions → New repository secret**

| Name | Value |
|------|-------|
| `TELEGRAM_BOT_TOKEN` | токен от @BotFather |
| `TELEGRAM_CHAT_ID` | `-1004353176409` (группа **SBS DEV**) |

Локальная проверка (без GitHub):

```bash
cp .env.example .env   # заполнить значениями
npm run test:telegram
```

Подробно для разработчиков и DevOps: **[TELEGRAM.md](./TELEGRAM.md)** (вступление в группу, что приходит после merge).

**Проверка chat_id:**

```bash
curl "https://api.telegram.org/bot<TOKEN>/getUpdates"
```

---

## Шаг 4. GitHub Environments

Settings → **Environments**

### development

- Deployment branches: `develop` (или All)
- Secrets deploy — по необходимости

### production

- **Required reviewers:** 1–2 человека
- Deployment branches: `main` only
- Secrets deploy — по необходимости

---

## Шаг 5. Rulesets

Settings → **Rules → Rulesets → New ruleset**

### Ruleset «Protect develop»

| Параметр | Значение |
|----------|----------|
| Enforcement | Active |
| Target | Branch `develop` |
| Restrict creations | off |
| Restrict updates | on |
| Restrict deletions | on |
| Require pull request | on, 1 approval |
| Require status checks | `build` (только build; lint/test убраны) |
| Require conversation resolution | on |
| Require merge queue | on (если Team plan) |
| Block force pushes | on |

**Bypass list:** пусто.

### Ruleset «Protect main»

То же +:

- Required approvals: **2** (рекомендуется)
- Require review from CODEOWNERS: on

---

## Шаг 6. Merge Queue (Team plan)

В каждом Ruleset → **Require merge queue** → Enable.

Проверка:

1. Создать 2 feature PR в develop
2. Merge первый через queue
3. Второй автоматически пересобирается в merge_group

---

## Шаг 7. GitHub Copilot (Free)

> Вместо Cursor Bugbot на первом этапе.  
> Документация: [About Copilot code review](https://docs.github.com/en/copilot/concepts/agents/code-review)

### 7.1 Включить Copilot Free

1. GitHub → аватар → **Settings** → **Copilot** → **Start using Copilot Free**
2. Или [github.com/settings/copilot](https://github.com/settings/copilot)

Free включает: автодополнение в IDE, ограниченный chat.  
**Не включает:** автоматический [Copilot code review](https://docs.github.com/en/copilot/concepts/agents/code-review) в PR (нужен Pro/Pro+).

### 7.2 Инструкции для репозитория

Файл `.github/copilot-instructions.md` уже в репо — Copilot учитывает его при работе с кодом.

### 7.3 AI-помощь при разработке (Free)

- VS Code / Cursor / JetBrains — расширение **GitHub Copilot**
- Перед PR: `npm run ci`
- Ревью PR — **человек** (approval в Ruleset)

### 7.4 Copilot code review в PR (опционально, Pro)

Когда появится Copilot Pro:

1. Repo → **Settings** → **Copilot** → **Code review**
2. Включить automatic review или в PR: **Reviewers** → **Copilot**
3. CLI: `gh pr edit <N> --add-reviewer copilot`

### 7.5 Cursor Bugbot (позже, опционально)

1. [cursor.com/dashboard](https://cursor.com/dashboard) → Integrations → GitHub
2. Bugbot → Enable
3. Правила: `.cursor/BUGBOT.md`

---

## Шаг 8. CODEOWNERS teams

Заменить в `.github/CODEOWNERS`:

```text
@your-org/backend  → @real-org/real-team
@your-org/devops   → @real-org/devops-team
```

Teams должны существовать в GitHub org и иметь доступ к репо.

---

## Шаг 9. Тестовый прогон

### 9.1 Feature PR → develop

```bash
git checkout develop
git pull origin develop
git checkout -b feature/TEST-001-hello-ci
# изменить src/index.js или добавить тест
npm run ci
git add .
git commit -m "feat: test CI pipeline"
git push -u origin feature/TEST-001-hello-ci
```

1. Создать PR → base: `develop`
2. Дождаться CI (`build`)
3. Human approval + merge
4. Проверить Telegram сообщение
5. Проверить deploy-dev workflow (push на develop)

### 9.2 Production PR из личной ветки

```bash
# PR: dev/<имя> → main (не develop → main!)
```

1. Sync: `git merge origin/main` в `dev/<имя>`
2. CI зелёный (`lint`, `build`)
3. 2 approvals (если настроено)
4. Merge
5. Telegram в канал
6. Actions → Deploy Production → input `deploy` → approve environment

### 9.3 Negative tests

- [ ] Direct push в develop → отклонён
- [ ] Direct push в main → отклонён
- [ ] Merge без CI → заблокирован
- [ ] Deploy prod без input `deploy` → fail

---

## Шаг 10. Обновить PROJECT_CONFIG.yaml

После создания реального репо обновить:

```yaml
repositories:
  - name: "real-org/cicd-sandbox"
github_org: "real-org"
owners:
  backend: "@real-org/backend-team"
  # ...
```

---

## Чеклист готовности

- [ ] main и develop на remote
- [ ] Secrets настроены
- [ ] Environments созданы
- [ ] Rulesets активны
- [ ] Merge Queue работает (или задокументирован отказ)
- [ ] Copilot Free активен (или Pro + code review)
- [ ] Bugbot комментирует PR (опционально)
- [ ] Telegram приходит после merge
- [ ] deploy-dev срабатывает на develop
- [ ] deploy-prod требует manual approval

---

## Найденные изъяны (заполнять при тестировании)

| # | Что | Ожидание | Факт | Исправление |
|---|-----|----------|------|-------------|
| 1 | | | | |
| 2 | | | | |

Копируйте строки в issue или обновляйте `plan-github-cursor-telegram-merge.md`.
