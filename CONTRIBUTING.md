# Contributing

## Одно правило

**Пушишь только в свою ветку `dev/<имя>`.** Всё остальное — через PR.

```text
dev/nurlan  ──push──►  dev/nurlan     ✅ всегда можно
dev/ivan    ──push──►  dev/ivan       ✅ всегда можно
dev/*       ──PR────►  develop        🔒 только PR
develop     ──PR────►  main           🔒 только PR (release)
```

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

Готова порция — **PR: `dev/<ваше-имя>` → `develop`**.

После merge в Telegram придёт напоминание — сделай `git merge origin/develop` в своей ветке.

## Конфликты

GitHub пишет **«This branch has conflicts»** — решаешь **локально в своей ветке**, не в `develop`.

```bash
git checkout dev/<ваше-имя>
git fetch origin
git merge origin/develop          # здесь появятся конфликты
```

1. Открой файлы с маркерами `<<<<<<<` / `=======` / `>>>>>>>`
2. Оставь нужный код (свой + чужое из develop, или оба)
3. Удали все маркеры конфликта

```bash
git add .                         # или конкретные файлы
git commit -m "merge: resolve conflict with develop"
npm run ci                        # обязательно
git push origin dev/<ваше-имя>
```

На GitHub PR станет **Able to merge** → merge как обычно.

**Профилактика:** чаще делай `git merge origin/develop` — конфликтов будет меньше.

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

## Release (делает тимлид)

PR `develop` → `main`, deploy — manual (Actions → Deploy Production).

## Hotfix (редко)

`hotfix/<кратко>` от `main` → PR в `main` → потом PR `main` → `develop`.
