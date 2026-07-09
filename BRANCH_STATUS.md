# Статус веток: develop vs main

> Обновлено: 2026-07-09T06:03:52.141Z

| | |
|---|---|
| Статус | ⚠️ разошлись (diverged) |
| `develop` (staging) | `0a9458b` |
| `main` (production) | `bab75c7` |
| develop впереди main | **42** коммит(ов) |
| main впереди develop | **1** коммит(ов) |
| Общий предок | `095d921` |

[Compare на GitHub](https://github.com/Sabyrzhanuly/cicd_test/compare/main...develop)

## Только в `develop` (42)

- `0a9458b Merge pull request #13 from Sabyrzhanuly/dev/nurlan`
- `1a18242 docs: fix missed plan line for optional PR review`
- `a65f6dc Merge pull request #12 from Sabyrzhanuly/dev/nurlan`
- `15aec94 docs: sync plan/process with 0 approvals policy`
- `21d2075 docs: optional CODEOWNERS, self-merge with 0 approvals`
- `aa170c9 Merge pull request #11 from Sabyrzhanuly/dev/nurlan`
- `8b495b2 docs: add TELEGRAM.md — notifications and how to join group`
- `917f5d0 docs: fix remaining main refs in MERGE_RULES`
- `423dce3 docs: company branches develop, stage, master`
- `c5bb35a Merge pull request #10 from Sabyrzhanuly/dev/nurlan`
- `4585f76 docs: forbid develop→main, dev/* PRs to both branches`
- `e7f8cb6 docs: add conflict resolution steps to CONTRIBUTING`
- `1d11cfd docs: simplify workflow — push only to dev/<name>`
- `188e922 Merge pull request #8 from Sabyrzhanuly/dev/nurlan`
- `4d26838 Merge branch 'develop' into dev/nurlan`
- _…и ещё 27_

## Только в `main` (1) — в staging нет!

- `bab75c7 docs: adopt dev/<name> branch strategy for large teams`

## Изменённые файлы

```
.github/CODEOWNERS                      |  10 +-
 .github/copilot-instructions.md         |   4 +-
 .github/pull_request_template.md        |  36 +----
 .github/workflows/branch-status.yml     |  91 ++++++++++++
 .github/workflows/ci.yml                |  14 --
 .gitignore                              |   4 +
 BRANCH_STATUS.md                        |  71 ++++++++++
 CONFLICT_TEST.md                        |  59 ++++++++
 CONFLICT_TEST_2.md                      |  55 ++++++++
 CONTRIBUTING.md                         | 128 ++++++++++++-----
 FINDINGS.md                             |   9 ++
 MERGE_RULES.md                          | 237 ++++++++++++++++++++++++++++++++
 PROJECT_CONFIG.yaml                     |   9 +-
 README.md                               |  65 ++++++---
 SETUP_GITHUB.md                         |  34 +++--
 TELEGRAM.md                             | 155 +++++++++++++++++++++
 e2e/github-pr.spec.js                   |  35 +++++
 e2e/local-ci.spec.js                    |  28 ++++
 e2e/ruleset-direct-push.spec.js         |  81 +++++++++++
 github-cursor-telegram-merge-process.md | 103 +++++++++-----
 package-lock.json                       |  64 +++++++++
 package.json                            |  12 +-
 plan-github-cursor-telegram-merge.md    | 153 +++++++++++++++------
 playwright.config.js                    |  14 ++
 scripts/branch-status.js                | 202 +++++++++++++++++++++++++++
 src/index.js                            |   5 +-
 tests/index.test.js                     |   2 +-
 27 files changed, 1480 insertions(+), 200 deletions(-)
```

> **Рекомендация:** merge `main` → `develop`

> **Напоминание:** в prod — только PR `dev/*` → `main`. **Не** `develop` → `main`.
