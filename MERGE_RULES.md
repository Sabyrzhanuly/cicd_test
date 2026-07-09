# Правила merge и профилактика конфликтов

> Для внедрения на **корпоративном GitHub** (Team/Enterprise).  
> Проверено в sandbox [cicd_test](https://github.com/Sabyrzhanuly/cicd_test).

---

## 1. Модель веток (компания)

| Ветка | Роль | PR из |
|-------|------|-------|
| `dev/<имя>` | рабочая | push напрямую |
| `develop` | integration | `dev/*` |
| `stage` | pre-prod / QA | `dev/*` *(скоро)* |
| `master` | production | `dev/*` |

```text
dev/ivan ──push──► dev/ivan
           ├──PR──► develop
           ├──PR──► stage
           └──PR──► master
```

**Запрещены PR между защищёнными ветками:**  
`develop → stage`, `develop → master`, `stage → master` и любые другие.

Каждая среда — **отдельный PR** из `dev/<имя>`.

> **Sandbox** (`cicd_test`): `main` вместо `master`, ветки `stage` пока нет.  
> Логика та же.

### Почему ветки независимы

- Три среды — три отдельных PR из одной `dev/<имя>`
- Drift нормален — мониторить (BRANCH_STATUS / compare)
- Цепочки merge между `develop` / `stage` / `master` — **нельзя**

**Одна постоянная ветка на человека.** TASK-ID — в PR и commit.

---

## 2. Merge Queue — на **каждую** защищённую ветку

| Ruleset | Merge Queue |
|---------|-------------|
| `protect-develop` | ✅ on |
| `protect-stage` | ✅ on *(когда появится)* |
| `protect-master` | ✅ on |

**Правило:** MQ на каждой ветке, куда параллельно идут PR из `dev/*`.

---

## 3. Пять правил без конфликтов

### Правило 1 — Sync с целевой веткой

Перед работой и перед PR — подтянуть **ту ветку, куда пойдёт PR**:

```bash
git checkout dev/<ваше-имя>
git fetch origin

# PR в develop:
git merge origin/develop

# PR в stage:
git merge origin/stage

# PR в master (sandbox: origin/main):
git merge origin/master
```

Идеально — **все** целевые ветки раз в день:

```bash
git merge origin/develop
git merge origin/stage      # когда появится
git merge origin/master     # sandbox: origin/main
```

### Правило 2 — Маленькие PR

| ✅ Хорошо | ❌ Плохо |
|----------|---------|
| 1 тема, 1–3 дня | неделя накопленного |
| один модуль | полрепозитория |

Конфликт = два PR в **одну** ветку (`develop`, `stage` или `master`) трогают один файл.

### Правило 3 — Один merge в общий файл за раз

Два PR в `develop` (или `stage`, или `master`) на один файл:

1. Merge первого
2. Автор второго: `git merge origin/<целевая-ветка>`
3. Resolve → push → merge второго

Merge Queue делает шаг 2–3 автоматически для PR в очереди.

### Правило 4 — Sync после чужого merge

После merge в **develop**, **stage** или **master** (Telegram):

```bash
git fetch origin
git merge origin/develop
git merge origin/stage
git merge origin/master    # sandbox: origin/main
```

Подтянуть обе, даже если ваш PR только в одну.

### Правило 5 — Перед открытием PR

```bash
git merge origin/<target>    # develop | stage | master
npm run ci
git push origin dev/<ваше-имя>
```

На GitHub: **Able to merge**, CI зелёный.

---

## 4. Как мержить

### Разработчик

1. Sync с `develop`, `stage`, `master`
2. Commit → push в `dev/<имя>`
3. Отдельные PR → `develop` | `stage` | `master`
4. CI + review → merge

Типичный порядок: `develop` → `stage` → `master` (три PR, не merge веток).

### Ревьюер

- CI зелёный, нет конфликта
- Review **опционален** — автор мержит сам (approvals = 0)
- Merge Queue — если включена

### После merge в `master`

- Deploy production — manual (Actions)
- Hotfix в `master` → sync в `develop` и `stage`

---

## 5. Конфликт

Решать **в `dev/<имя>`**, не на GitHub в целевой ветке.

```bash
git checkout dev/<ваше-имя>
git fetch origin
git merge origin/develop    # или origin/stage, origin/master
# убрать <<<<<<< ======= >>>>>>>
git add .
git commit -m "merge: resolve conflict with develop"   # или stage / master
npm run ci
git push origin dev/<ваше-имя>
```

---

## 6. Rulesets (корпоративный аккаунт)

### `protect-develop`, `protect-stage`, `protect-master`

Одинаковый каркас на каждую защищённую ветку:

| Параметр | `develop` | `stage` | `master` |
|----------|-----------|---------|----------|
| Require PR | on | on | on |
| Allowed sources | `dev/*`, `hotfix/*` | `dev/*` | `dev/*`, `hotfix/*` |
| Required checks | `lint`, `build` | `lint`, `build` | `lint`, `build` |
| Required approvals | **0** | **0** | **0** |
| Merge Queue | **on** | **on** | **on** |
| Require CODEOWNERS review | **off** | **off** | **off** |
| CODEOWNERS файл | опционально, advisory | опционально | опционально |

### Self-merge (каждый мержит свой PR)

- **Required approvals = 0** на `develop`, `stage`, `master`
- **Require review from CODEOWNERS = off** везде
- Автор PR мержит **сам**, когда CI зелёный и нет конфликтов
- Коллегу на review можно позвать **вручную** — не блокирует merge
- Файл `.github/CODEOWNERS` — подсказка «кто шарит за путь», не обязательный gate

> Sandbox: те же настройки на `main` (approvals = 0).

### `dev/*` — без ruleset

Direct push разрешён.

---

## 7. Запрещено

- **PR между защищёнными ветками** (`develop → stage`, `develop → master`, `stage → master`, …)
- Direct push в `develop`, `stage`, `master`
- Merge PR с конфликтом
- Force push в чужую `dev/<имя>`
- Hotfix в `master` без sync в `develop` и `stage`

---

## 8. Чеклист внедрения

- [ ] Rulesets: approvals **0**, CODEOWNERS review **off** на всех ветках
- [ ] PR только из `dev/*`
- [ ] CI triggers на `develop`, `stage`, `master`
- [ ] Каждому: `dev/<имя>`
- [ ] CONTRIBUTING + MERGE_RULES в onboarding
- [ ] Notify после merge
- [ ] Environment `production` + manual deploy

### Когда появится `stage`

1. `git checkout -b stage develop` (или от `master` — по политике)
2. Ruleset `protect-stage`
3. `ci.yml` → добавить `stage` в `pull_request` / `merge_group`
4. `deploy-stage.yml` (опционально)
5. В sync-скриптах: `git merge origin/stage`

---

## 9. Памятка (Slack)

```text
Push:     только dev/<имя>
PR:       dev/<имя> → develop | stage | master
Sync:     merge origin/develop, origin/stage, origin/master
Запрещено: develop→stage, develop→master, stage→master
Конфликт: решать в dev/<имя>
```
