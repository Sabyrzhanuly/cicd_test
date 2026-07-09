# Contributing

## Одно правило

**Пушишь только в свою ветку `dev/<имя>`.** Всё остальное — через PR.

```text
dev/nurlan  ──push──►  dev/nurlan     ✅ всегда можно
dev/ivan    ──push──►  dev/ivan       ✅ всегда можно
dev/*       ──PR────►  develop        🔒 staging
dev/*       ──PR────►  main           🔒 production
```

**Не делаем PR `develop → main`.** В prod — только `dev/<имя>` → `main`.

Полные правила: [MERGE_RULES.md](./MERGE_RULES.md)

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
git merge origin/develop      # подтянуть чужие merge
# ... код, commit ...
git push origin dev/<ваше-имя>  # только сюда!
```

Готова к staging — **PR `dev/<ваше-имя>` → `develop`**.  
Готова к production — **PR `dev/<ваше-имя>` → `main`** (отдельный PR, не через merge develop).

После merge в Telegram — sync обе ветки:

```bash
git merge origin/develop
git merge origin/main
```

## Конфликты

GitHub: **«This branch has conflicts»** — решаешь в `dev/<имя>`.

```bash
git merge origin/develop    # если PR в develop
# или
git merge origin/main       # если PR в main
```

1. Убрать маркеры `<<<<<<<` / `=======` / `>>>>>>>`
2. `git add .` → `git commit -m "merge: resolve conflict with develop"` (или `main`)
3. `npm run ci` → `git push`

**Профилактика:** sync с **обеими** ветками каждый день.

## Перед PR

```bash
npm run ci
```

Checks в GitHub: `lint`, `build`.

## Заголовок PR

```text
[TASK-123] кратко что сделано
```

TASK-ID — в PR и commit, **не** в имени ветки.

## Hotfix (редко)

`hotfix/<кратко>` от `main` → PR в `main` → sync в `develop`.

---

**Полные правила merge и анти-конфликт для компании:** [MERGE_RULES.md](./MERGE_RULES.md)
