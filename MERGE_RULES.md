# Правила merge и профилактика конфликтов

> Для внедрения на **корпоративном GitHub** (Team/Enterprise).  
> Проверено в sandbox [cicd_test](https://github.com/Sabyrzhanuly/cicd_test).

---

## 1. Модель веток

**Личная ветка → PR в `develop` и в `main`.** PR `develop → main` **запрещён**.

```text
dev/ivan  ──push──► dev/ivan ──PR──► develop   (staging)
                      └────PR────► main        (production)
dev/maria ──push──► dev/maria ──PR──► develop
                      └────PR────► main
```

| Ветка | Push | Откуда PR |
|-------|------|-----------|
| `dev/<имя>` | только владелец | — |
| `develop` | ❌ | `dev/*` |
| `main` | ❌ | только `dev/*` |

### Почему ветки независимы

- Staging и production — **разные PR** из одной `dev/<имя>`
- Drift между ветками нормален — смотреть [BRANCH_STATUS.md](./BRANCH_STATUS.md)
- **PR `develop → main` — запрещён**

**Одна постоянная ветка на человека.** TASK-ID — в PR и commit.

---

## 2. Merge Queue — на **обе** ветки

Merge Queue нужен **везде, куда несколько человек одновременно открывают PR**.

| Ruleset | Merge Queue | Почему |
|---------|-------------|--------|
| `protect-develop` | ✅ **on** | много `dev/* → develop` параллельно |
| `protect-main` | ✅ **on** | много `dev/* → main` параллельно |

В sandbox конфликты ловили на `develop` — там была вся нагрузка. На `main` будет то же, если туда идут параллельные PR из личных веток.

**Правило:** Merge Queue включается в ruleset **каждой** защищённой ветки, куда команда шлёт PR.

---

## 3. Пять правил без конфликтов

### Правило 1 — Sync с целевой веткой

Перед работой и перед PR — подтянуть **ту ветку, куда пойдёт PR**:

```bash
git checkout dev/<ваше-имя>
git fetch origin

# PR в develop:
git merge origin/develop

# PR в main (перед открытием / обновлением):
git merge origin/main
```

Идеально — **оба** merge раз в день, если ведёте PR в обе цели:

```bash
git merge origin/develop
git merge origin/main
```

### Правило 2 — Маленькие PR

| ✅ Хорошо | ❌ Плохо |
|----------|---------|
| 1 тема, 1–3 дня | неделя накопленного |
| один модуль | полрепозитория |

Конфликт = два PR в **одну** ветку (`develop` или `main`) трогают один файл.

### Правило 3 — Один merge в общий файл за раз

Два PR в `develop` (или два в `main`) на один файл:

1. Merge первого
2. Автор второго: `git merge origin/develop` (или `origin/main`)
3. Resolve → push → merge второго

Merge Queue делает шаг 2–3 автоматически для PR в очереди.

### Правило 4 — Sync после чужого merge

После merge **в develop** или **в main** (Telegram):

```bash
git fetch origin
git merge origin/develop
git merge origin/main
```

Подтянуть обе, даже если ваш PR только в одну.

### Правило 5 — Перед открытием PR

```bash
git merge origin/<target>    # develop или main
npm run ci
git push origin dev/<ваше-имя>
```

На GitHub: **Able to merge**, CI зелёный.

---

## 4. Как мержить

### Разработчик

1. Sync с `develop` и/или `main`
2. Commit → push в `dev/<имя>`
3. PR → `develop` (staging) **и/или** PR → `main` (prod) — отдельные PR
4. CI + review → merge

Типичный порядок: сначала PR → `develop`, потом тот же `dev/<имя>` → PR → `main`.

### Ревьюер

- CI зелёный
- Нет конфликта с target-веткой
- Approve → Merge (или Merge Queue)

### После merge в `main`

- Deploy production — manual (Actions)
- Если hotfix только в `main` — обязательно PR/sync в `develop`

---

## 5. Конфликт

Решать **в `dev/<имя>`**, не на GitHub в `develop`/`main`.

```bash
git checkout dev/<ваше-имя>
git fetch origin
git merge origin/develop    # или origin/main — смотря какой PR конфликтует
# убрать <<<<<<< ======= >>>>>>>
git add .
git commit -m "merge: resolve conflict with develop"   # или with main
npm run ci
git push origin dev/<ваше-имя>
```

---

## 6. Rulesets (корпоративный аккаунт)

### `protect-develop` и `protect-main` — одинаковый каркас

| Параметр | `develop` | `main` |
|----------|-----------|--------|
| Require PR | on | on |
| Allowed sources | `dev/*`, `hotfix/*` | `dev/*`, `hotfix/*` |
| Required checks | `lint`, `build` | `lint`, `build` |
| Required approvals | 1 | **2** |
| Block force push | on | on |
| **Merge Queue** | **on** | **on** |
| CODEOWNERS | по желанию | **on** (рекомендуется) |

### `dev/*` — без ruleset

Direct push разрешён.

---

## Запрещено

- **PR `develop → main`** — в production только `dev/* → main`
- Direct push в `develop` и `main`
- Merge PR с конфликтом
- Force push в чужую `dev/<имя>` и защищённые ветки
- Долго не sync с target-веткой (> 2–3 дней)
- Hotfix в `main` без переноса в `develop`

---

## 8. Чеклист внедрения

- [ ] Rulesets: `develop` + `main`, **Merge Queue на обеих**
- [ ] PR только из `dev/*` (не `develop → main`)
- [ ] CI job names = required checks
- [ ] Каждому: `dev/<имя>`
- [ ] CONTRIBUTING + этот файл в onboarding
- [ ] Notify после merge в `develop` и `main`
- [ ] Environment `production` + manual deploy

---

## 9. Памятка (Slack)

```text
Push:     только dev/<имя>
PR:       dev/<имя> → develop (staging)
          dev/<имя> → main (production)
Sync:     git merge origin/develop && git merge origin/main
Конфликт: решать в dev/<имя>
Queue:    Merge Queue на develop И на main
```
