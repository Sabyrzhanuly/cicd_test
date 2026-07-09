# Contributing

## Одно правило

**Пушишь только в свою ветку `dev/<имя>`.** Всё остальное — через PR.

## Ветки

### Компания (целевая схема)

| Ветка | Назначение | PR из | Push |
|-------|------------|-------|------|
| `dev/<имя>` | твоя рабочая | — | ✅ только ты |
| `develop` | integration | `dev/*` | ❌ |
| `stage` | pre-prod / QA *(скоро)* | `dev/*` | ❌ |
| `master` | production | `dev/*` | ❌ |

```text
dev/ivan ──push──► dev/ivan
           ├──PR──► develop
           ├──PR──► stage      (когда появится)
           └──PR──► master
```

**Запрещено:** цепочки между защищёнными ветками (`develop → stage`, `develop → master`, `stage → master` и т.д.).  
Каждая среда — **отдельный PR** из `dev/<имя>`.

### Sandbox (этот репо, пока тест)

| Компания | Sandbox | Примечание |
|----------|---------|------------|
| `master` | `main` | то же самое, другое имя |
| `develop` | `develop` | |
| `stage` | — | добавим при внедрении |

Полные правила: [MERGE_RULES.md](./MERGE_RULES.md) · конфиг: `PROJECT_CONFIG.yaml`

## Старт (один раз)

```bash
git checkout develop && git pull
git checkout -b dev/<ваше-имя>
git push -u origin dev/<ваше-имя>
```

## Каждый день

```bash
git checkout dev/<ваше-имя>
git fetch origin
git merge origin/develop
# когда появится stage:
# git merge origin/stage
git merge origin/master    # sandbox: origin/main

git push origin dev/<ваше-имя>
```

## PR по готовности

| Куда | Когда |
|------|-------|
| `develop` | порция готова к integration |
| `stage` | готова к QA / pre-prod *(скоро)* |
| `master` | готова к production |

Отдельный PR на каждую цель. Типичный порядок: `develop` → `stage` → `master` (три PR, не merge веток между собой).

## Конфликты

Решать в `dev/<имя>`, не на GitHub в целевой ветке.

```bash
git merge origin/<целевая-ветка>   # develop | stage | master (main)
# убрать <<<<<<< ======= >>>>>>>
git add . && git commit -m "merge: resolve conflict with develop"
npm run ci && git push
```

**Профилактика:** sync со **всеми** средами, куда ходят PR, каждый день.

## Перед PR

```bash
npm run ci
```

Checks: `lint`, `build`.

## Заголовок PR

```text
[TASK-123] кратко что сделано
```

## Hotfix

`hotfix/<кратко>` от `master` → PR в `master` → sync в `develop` и `stage`.
