# Тест: конфликт PR — раунд 2 (несколько разработчиков)

## Ветки

| Ветка | Роль | Конфликт с develop после maria |
|-------|------|-------------------------------|
| `dev/maria` | мержит **первой** | — |
| `dev/aliya` | PR #2 | ✓ `src/index.js`, `tests/` |
| `dev/sanzhar` | PR #3 | ✓ `src/index.js`, `tests/` |
| `dev/dana` | PR #4 | ✗ только `add()` — **без конфликта** |

## Порядок теста

### 1. Merge maria первой

[dev/maria → develop](https://github.com/Sabyrzhanuly/cicd_test/compare/develop...dev/maria?expand=1)

→ Merge (approvals = 0)

### 2. PR aliya и sanzhar — будут конфликты

- [dev/aliya → develop](https://github.com/Sabyrzhanuly/cicd_test/compare/develop...dev/aliya?expand=1)
- [dev/sanzhar → develop](https://github.com/Sabyrzhanuly/cicd_test/compare/develop...dev/sanzhar?expand=1)

### 3. PR dana — без конфликта (другой файл/функция)

[dev/dana → develop](https://github.com/Sabyrzhanuly/cicd_test/compare/develop...dev/dana?expand=1)

### 4. Resolve aliya (пример)

```bash
git checkout dev/aliya
git fetch origin
git merge origin/develop
# resolve src/index.js → например: "team maria & aliya"
git add . && git commit -m "merge: resolve conflict with develop"
npm run ci && git push origin dev/aliya
```

### 5. После merge aliya — sanzhar снова out-of-date

```bash
git checkout dev/sanzhar
git merge origin/develop   # конфликт с maria + aliya
# resolve → push → merge PR
```

## Итоговая очередь merge

```text
maria → develop
aliya → develop (resolve conflict)
sanzhar → develop (resolve conflict, после aliya)
dana → develop (без конфликта, можно параллельно с aliya)
```
