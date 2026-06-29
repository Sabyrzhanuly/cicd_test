# Contributing — cicd-sandbox

## Процесс

1. Все изменения — через **Pull Request**
2. Direct push в `develop` и `main` **запрещён** (Rulesets)
3. Перед PR: `npm run ci`
4. Copilot / human review — просмотреть замечания перед merge
5. После merge — дождаться Telegram и сделать `git pull`

## Именование веток

```text
feature/TASK-123-short-description
bugfix/TASK-456-fix-login
hotfix/TASK-789-critical-patch
```

Не используйте личные ветки (`dev-ivan`, `work-in-progress`).

## PR в develop

- Base: `develop`
- 1 approval
- CI: lint, test, build
- Merge через Merge Queue (или merge commit если Free plan)

## PR в main (release)

- Base: `main`
- Source: `develop` (или `hotfix/*` для hotfix)
- 1–2 approvals
- CODEOWNERS review для infra-изменений
- Deploy production — **только manual** через Actions → Deploy Production

## Hotfix

1. `hotfix/TASK-name` → PR → `main`
2. После merge: PR `main` → `develop` (синхронизация)

## Локальные команды

```bash
npm run lint    # eslint
npm run test    # node:test
npm run build   # artifact в dist/
npm run ci      # всё вместе
```

## CODEOWNERS

Изменения в `.github/workflows/`, `.cursor/` требуют review от `@your-org/devops`.  
Замените placeholder teams в `.github/CODEOWNERS` на реальные.
