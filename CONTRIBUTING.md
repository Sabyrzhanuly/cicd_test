# Contributing — cicd-sandbox

## Процесс

1. Работаете в **своей** ветке `dev/<имя>` (постоянная)
2. В **`develop`** и **`main`** — только через **Pull Request** (Rulesets)
3. Перед PR (опционально): `npm run build`
4. Copilot / human review — просмотреть замечания перед merge
5. После merge — Telegram → `git merge origin/develop` в своей ветке

## Ветки

| Ветка | Кто | Назначение |
|-------|-----|------------|
| `main` | все | production — только PR из `develop` |
| `develop` | все | staging — только PR из `dev/*` |
| `dev/<имя>` | вы | постоянная рабочая (`dev/nurlan`, …) |
| `hotfix/<кратко>` | по необходимости | срочный фикс → PR в `main` |

**TASK-ID** (TASK-123, …) — в **описании PR** и **commit message**, не обязательно в имени ветки.

## Первый запуск (новый разработчик)

```bash
git checkout develop
git pull origin develop
git checkout -b dev/<ваше-имя>
git push -u origin dev/<ваше-имя>
```

Дальше работаете только в `dev/<ваше-имя>`.

## Ежедневная работа

```bash
git checkout dev/<ваше-имя>
git fetch origin
git merge origin/develop    # минимум раз в день!

# ... код, commit ...
npm run ci                # перед PR обязательно
git push origin dev/<ваше-имя>
```

## PR в develop

- **Source:** `dev/<ваше-имя>`
- **Target:** `develop`
- **Когда:** готова **порция** (1–3 дня или одна тема), не «всё накопленное»
- **Описание:** список TASK-ID + что именно в этом PR
- **Checks:** `build` (lint/test отключены на первом этапе)
- **Approval:** 1

Пример заголовка PR:

```text
[TASK-123][TASK-128] auth timeout + filter by date
```

## PR в main (release)

- **Source:** `develop`
- **Target:** `main`
- 1–2 approvals
- Deploy production — **только manual** (Actions → Deploy Production)

## Hotfix

1. `hotfix/<кратко>` от `main` → PR → `main`
2. После merge: PR `main` → `develop`

## Commit message

```text
feat(module): TASK-123 краткое описание
fix(api): TASK-456 исправлен timeout
```

## Локальные команды

```bash
npm run lint
npm run test
npm run build
npm run ci      # всё вместе
```

## Альтернатива: feature-ветки

Для малой команды допустимо `feature/short-name` вместо `dev/<имя>`.  
Для большой команды — только `dev/<имя>` (см. `plan-github-cursor-telegram-merge.md` §3).
