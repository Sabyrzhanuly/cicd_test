# Статус веток: develop vs main

> Обновлено: 2026-07-09T05:35:27.956Z

| | |
|---|---|
| Статус | ⚠️ разошлись (diverged) |
| `develop` (staging) | `188e922` |
| `main` (production) | `bab75c7` |
| develop впереди main | **29** коммит(ов) |
| main впереди develop | **1** коммит(ов) |
| Общий предок | `095d921` |

[Compare на GitHub](https://github.com/Sabyrzhanuly/cicd_test/compare/main...develop)

## Только в `develop` (29)

- `188e922 Merge pull request #8 from Sabyrzhanuly/dev/nurlan`
- `4d26838 Merge branch 'develop' into dev/nurlan`
- `349746d feat: branch status workflow and develop vs main visibility`
- `fbe8f39 test: add test:e2e:ruleset script and fix assertions`
- `b05e037 test: Playwright ruleset direct push checks`
- `b523ea0 test: add Playwright E2E for local CI and GitHub PR page`
- `9f1bcdf fix: restore lint job to match ruleset (lint + build)`
- `ed99656 chore: drop lint and test from CI, keep build only`
- `9c963b3 Merge pull request #7 from Sabyrzhanuly/dev/dana`
- `c8158e7 Merge branch 'develop' into dev/dana`
- `673ec30 Merge pull request #6 from Sabyrzhanuly/dev/sanzhar`
- `540871e merge: resolve conflict with develop (maria & aliya merged)`
- `17cc2bf Merge pull request #5 from Sabyrzhanuly/dev/aliya`
- `2d3ce52 merge: resolve conflict with develop (maria merged first)`
- `7f3e313 Merge pull request #4 from Sabyrzhanuly/dev/maria`
- _…и ещё 14_

## Только в `main` (1) — в staging нет!

- `bab75c7 docs: adopt dev/<name> branch strategy for large teams`

## Изменённые файлы

```
.github/copilot-instructions.md         |   4 +-
 .github/pull_request_template.md        |  15 ++-
 .github/workflows/branch-status.yml     |  91 +++++++++++++++
 .github/workflows/ci.yml                |  14 ---
 .gitignore                              |   4 +
 BRANCH_STATUS.md                        |  60 ++++++++++
 CONFLICT_TEST.md                        |  59 ++++++++++
 CONFLICT_TEST_2.md                      |  55 +++++++++
 CONTRIBUTING.md                         |  90 ++++++++++-----
 FINDINGS.md                             |   9 ++
 PROJECT_CONFIG.yaml                     |   4 +-
 README.md                               |  38 +++++-
 SETUP_GITHUB.md                         |   4 +-
 e2e/github-pr.spec.js                   |  35 ++++++
 e2e/local-ci.spec.js                    |  28 +++++
 e2e/ruleset-direct-push.spec.js         |  81 +++++++++++++
 github-cursor-telegram-merge-process.md |  80 ++++++++-----
 package-lock.json                       |  64 ++++++++++
 package.json                            |  12 +-
 plan-github-cursor-telegram-merge.md    | 125 +++++++++++++++-----
 playwright.config.js                    |  14 +++
 scripts/branch-status.js                | 199 ++++++++++++++++++++++++++++++++
 src/index.js                            |   5 +-
 tests/index.test.js                     |   2 +-
 24 files changed, 969 insertions(+), 123 deletions(-)
```

> **Рекомендация:** merge `main` → `develop`

> **Напоминание:** в prod — только PR `dev/*` → `main`. **Не** `develop` → `main`.
