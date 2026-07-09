# Telegram — уведомления после merge

> Группа sandbox: **SBS DEV**  
> В компании — своя группа (например «DEV Team» / «Deploys»).

---

## Для разработчика

### Как попасть в группу (подписаться на уведомления)

Уведомления приходят **в групповой чат**, не в личку боту.

1. Попросите **тимлида / DevOps** добавить вас в группу или пришлите **invite-link**.
2. Откройте группу в Telegram (sandbox: **SBS DEV**).
3. Включите уведомления для группы:
   - откройте группу → название сверху → **Notifications** → **Enable**
4. Отдельно «подписываться» на бота **не нужно** — бот только **пишет в группу** от имени CI.

Если сообщений нет — проверьте, что вы **в группе** и группа **не в mute**.

### Когда приходит сообщение

После **успешного merge PR** в защищённую ветку:

| Sandbox | Компания |
|---------|----------|
| `develop` | `develop` |
| `main` | `master` |
| — | `stage` *(когда подключим)* |

**Не приходит:** при открытии PR, при push в `dev/<имя>`, при закрытии PR без merge.

### Пример сообщения

```text
✅ cicd-sandbox — PR merged

📢 Группа: SBS DEV
📦 Repo: org/repo
🌿 Branch: develop (staging)
🔗 PR #10: docs: ...
👤 Merged by: ivan

Что сделать локально:
git fetch origin && git checkout develop && git pull origin develop

В feature-ветке:
git merge origin/develop

https://github.com/...
```

### Что сделать после уведомления

В **своей** ветке `dev/<имя>`:

```bash
git checkout dev/<ваше-имя>
git fetch origin

git merge origin/develop
# git merge origin/stage      # когда появится
git merge origin/master       # sandbox: origin/main

git push origin dev/<ваше-имя>   # если были локальные коммиты
```

Так вы не отстанете от команды и реже ловите конфликты в следующем PR.

---

## Для DevOps / тимлида (настройка один раз)

### 1. Создать бота

1. Telegram → [@BotFather](https://t.me/BotFather)
2. `/newbot` → имя и username (например `MyCompanyCIBot`)
3. Сохранить **token** → GitHub Secret `TELEGRAM_BOT_TOKEN`

### 2. Добавить бота в группу

1. Создать группу (или использовать существующую, sandbox: **SBS DEV**)
2. **Add members** → найти бота по username
3. Бот должен иметь право **отправлять сообщения** (для супергрупп обычно достаточно быть участником)

### 3. Узнать `chat_id` группы

**Способ A** — после добавления бота напишите что-нибудь в группе, затем:

```bash
curl "https://api.telegram.org/bot<TOKEN>/getUpdates"
```

Ищите `"chat":{"id":-100...` — для групп id **отрицательный**.

**Способ B** — переслать сообщение из группы боту [@userinfobot](https://t.me/userinfobot) или [@getidsbot](https://t.me/getidsbot).

Сохранить в GitHub Secret `TELEGRAM_CHAT_ID`.

Sandbox: `-1004353176409` (SBS DEV).

### 4. Secrets в GitHub

Repository → **Settings → Secrets and variables → Actions**:

| Secret | Значение |
|--------|----------|
| `TELEGRAM_BOT_TOKEN` | token от BotFather |
| `TELEGRAM_CHAT_ID` | id группы (например `-1004353176409`) |

### 5. Проверка

Локально (файл `.env`, не коммитить):

```bash
cp .env.example .env
# заполнить TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID
npm run test:telegram
```

В группе должно появиться тестовое сообщение.

На GitHub — смержите любой тестовый PR в `develop` и проверьте workflow **Telegram Merge Notify**.

### 6. Workflow

Файл: `.github/workflows/telegram-merge-notify.yml`

- Триггер: PR **merged** в `develop` / `main`
- При внедрении `stage` и переименовании `main` → `master` — добавить ветки в `on.pull_request.branches`

---

## Частые проблемы

| Проблема | Решение |
|----------|---------|
| Сообщений нет в группе | Вы в группе? Не mute? Secrets в GitHub? |
| `chat not found` | Неверный `TELEGRAM_CHAT_ID` или бот удалён из группы |
| `bot was blocked` | Добавьте бота в группу снова |
| Workflow skip | Secrets пустые — в логе «skipping notification» |
| Спецсимволы ломали текст | Используем plain text, без `parse_mode: Markdown` |

---

## Компания vs sandbox

| | Sandbox | Компания |
|--|---------|----------|
| Группа | SBS DEV | своя (указать в onboarding) |
| Ветки в notify | `develop`, `main` | `develop`, `stage`, `master` |
| Имя в сообщении | `cicd-sandbox` | имя проекта в workflow |

При переносе на корпоративный аккаунт: новая группа, новые secrets, обновить ветки в workflow.
