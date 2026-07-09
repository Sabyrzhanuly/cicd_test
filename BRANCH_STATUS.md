# Статус веток: develop vs main

> Обновлено: 2026-07-09T04:38:10.440Z

| | |
|---|---|
| Статус | ⚠️ разошлись (diverged) |
| `develop` (staging) | `9c963b3` |
| `main` (production) | `bab75c7` |
| develop впереди main | **21** коммит(ов) |
| main впереди develop | **1** коммит(ов) |
| Общий предок | `095d921` |

[Compare на GitHub](https://github.com/Sabyrzhanuly/cicd_test/compare/main...develop)

## Только в `develop` (21)

- `9c963b3 Merge pull request #7 from Sabyrzhanuly/dev/dana`
- `c8158e7 Merge branch 'develop' into dev/dana`
- `673ec30 Merge pull request #6 from Sabyrzhanuly/dev/sanzhar`
- `540871e merge: resolve conflict with develop (maria & aliya merged)`
- `17cc2bf Merge pull request #5 from Sabyrzhanuly/dev/aliya`
- `2d3ce52 merge: resolve conflict with develop (maria merged first)`
- `7f3e313 Merge pull request #4 from Sabyrzhanuly/dev/maria`
- `b7327cc refactor: dana add() style (no greet conflict)`
- `cf095d1 feat: sanzhar greeting (conflict test round 2)`
- `d1e1c64 feat: aliya greeting (conflict test round 2)`
- `b7753d9 feat: maria greeting (conflict test round 2 - merges first)`
- `c51ab94 Merge pull request #3 from Sabyrzhanuly/dev/nurlan`
- `43c6bc0 merge: resolve conflict with develop (ivan merged first)`
- `80200d3 feat: nurlan greeting change (conflict test part 2)`
- `29ec887 feat: ivan greeting change (conflict test part 1)`
- _…и ещё 6_

## Только в `main` (1) — в staging нет!

- `bab75c7 docs: adopt dev/<name> branch strategy for large teams`

## Изменённые файлы

```
.github/copilot-instructions.md         |   2 +
 .github/pull_request_template.md        |  15 ++--
 CONFLICT_TEST.md                        |  59 +++++++++++++++
 CONFLICT_TEST_2.md                      |  55 ++++++++++++++
 CONTRIBUTING.md                         |  88 +++++++++++++++-------
 FINDINGS.md                             |   9 +++
 PROJECT_CONFIG.yaml                     |   3 +
 README.md                               |  20 ++++-
 github-cursor-telegram-merge-process.md |  80 ++++++++++++--------
 package.json                            |   2 +-
 plan-github-cursor-telegram-merge.md    | 125 ++++++++++++++++++++++++--------
 src/index.js                            |   5 +-
 tests/index.test.js                     |   2 +-
 13 files changed, 365 insertions(+), 100 deletions(-)
```

> **Рекомендация:** merge `main` → `develop`

> **Рекомендация:** PR `develop` → `main`
