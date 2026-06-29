# Тест: конфликт PR (dev/nurlan vs dev/ivan)

> Сценарий уже подготовлен в репо. Проходите шаги по порядку.

## Что уже сделано автоматически

1. **dev/ivan** — изменил `greet()` → `— team ivan` и **уже в develop**
2. **dev/nurlan** — изменил `greet()` → `— team nurlan` (от старой базы, **конфликт**)

## Ваши шаги

### 1. Создайте PR (если ещё нет)

[dev/nurlan → develop](https://github.com/Sabyrzhanuly/cicd_test/compare/develop...dev/nurlan?expand=1)

GitHub покажет: **conflicts** или **This branch has conflicts**.

### 2. Локально — resolve

```bash
git checkout dev/nurlan
git fetch origin
git merge origin/develop
```

Откройте `src/index.js` и `tests/index.test.js` — будут маркеры `<<<<<<<`.

**Выберите итог**, например объединённый вариант:

```javascript
return `Hello, ${name}! — team nurlan & ivan`;
```

```javascript
assert.equal(greet("World"), "Hello, World! — team nurlan & ivan");
```

```bash
git add src/index.js tests/index.test.js
git commit -m "merge: resolve conflict with develop (ivan merged first)"
npm run ci
git push origin dev/nurlan
```

### 3. На GitHub

- CI зелёный → Approve → Merge
- Telegram в SBS DEV

## Ожидаемый результат

| Шаг | Статус |
|-----|--------|
| PR с конфликтом | ✓ |
| merge develop локально | вы делаете |
| push → CI | вы делаете |
| merge PR | вы делаете |

После теста можно удалить `dev/ivan` и этот файл.
