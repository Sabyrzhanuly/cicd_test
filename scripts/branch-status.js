/**
 * Показывает расхождение staging (develop) и production (main).
 *
 * npm run branch:status
 * npm run branch:status:md > BRANCH_STATUS.md
 * node scripts/branch-status.js --markdown --file BRANCH_STATUS.md
 */
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const REPO = "Sabyrzhanuly/cicd_test";
const STAGING = "develop";
const PRODUCTION = "main";

const args = process.argv.slice(2);
const markdown = args.includes("--markdown");
const fileIdx = args.indexOf("--file");
const outFile = fileIdx >= 0 ? args[fileIdx + 1] : null;

function git(cmd) {
  return execSync(cmd, { encoding: "utf8", stdio: "pipe" }).trim();
}

function tryGit(cmd, fallback = "") {
  try {
    return git(cmd);
  } catch {
    return fallback;
  }
}

tryGit("git fetch origin --quiet");

const counts = tryGit(
  `git rev-list --left-right --count origin/${PRODUCTION}...origin/${STAGING}`,
  "0\t0"
);
const [mainAhead, developAhead] = counts.split(/\s+/).map(Number);

const onlyDevelop = tryGit(
  `git log --oneline origin/${PRODUCTION}..origin/${STAGING}`,
  ""
)
  .split("\n")
  .filter(Boolean);

const onlyMain = tryGit(
  `git log --oneline origin/${STAGING}..origin/${PRODUCTION}`,
  ""
)
  .split("\n")
  .filter(Boolean);

const diffStat = tryGit(
  `git diff --stat origin/${PRODUCTION}...origin/${STAGING}`,
  ""
);

const mergeBase = tryGit(
  `git merge-base origin/${PRODUCTION} origin/${STAGING}`,
  "unknown"
);

const stagingSha = tryGit(`git rev-parse --short origin/${STAGING}`, "?");
const prodSha = tryGit(`git rev-parse --short origin/${PRODUCTION}`, "?");
const updatedAt = new Date().toISOString();

let status;
let statusEmoji;
if (mainAhead > 0 && developAhead > 0) {
  status = "разошлись (diverged)";
  statusEmoji = "⚠️";
} else if (mainAhead > 0) {
  status = "main впереди develop — нужен sync в staging";
  statusEmoji = "🔴";
} else if (developAhead > 0) {
  status = "develop впереди main — можно release PR";
  statusEmoji = "🟡";
} else {
  status = "синхронны";
  statusEmoji = "✅";
}

const compareUrl = `https://github.com/${REPO}/compare/${PRODUCTION}...${STAGING}`;

function buildMarkdown() {
  const lines = [
    `# Статус веток: ${STAGING} vs ${PRODUCTION}`,
    "",
    `> Обновлено: ${updatedAt}`,
    "",
    "| | |",
    "|---|---|",
    `| Статус | ${statusEmoji} ${status} |`,
    `| \`${STAGING}\` (staging) | \`${stagingSha}\` |`,
    `| \`${PRODUCTION}\` (production) | \`${prodSha}\` |`,
    `| develop впереди main | **${developAhead}** коммит(ов) |`,
    `| main впереди develop | **${mainAhead}** коммит(ов) |`,
    `| Общий предок | \`${mergeBase.slice(0, 7)}\` |`,
    "",
    `[Compare на GitHub](${compareUrl})`,
    "",
  ];

  if (onlyDevelop.length) {
    lines.push(`## Только в \`${STAGING}\` (${onlyDevelop.length})`, "");
    for (const c of onlyDevelop.slice(0, 15)) {
      lines.push(`- \`${c}\``);
    }
    if (onlyDevelop.length > 15) {
      lines.push(`- _…и ещё ${onlyDevelop.length - 15}_`);
    }
    lines.push("");
  }

  if (onlyMain.length) {
    lines.push(
      `## Только в \`${PRODUCTION}\` (${onlyMain.length}) — в staging нет!`,
      ""
    );
    for (const c of onlyMain) {
      lines.push(`- \`${c}\``);
    }
    lines.push("");
  }

  if (diffStat) {
    lines.push("## Изменённые файлы", "", "```", diffStat, "```");
  }

  if (mainAhead > 0) {
    lines.push("", "> **Рекомендация:** merge `main` → `develop`");
  }
  if (developAhead > 0) {
    lines.push("", `> **Рекомендация:** PR \`${STAGING}\` → \`${PRODUCTION}\``);
  }

  return `${lines.join("\n")}\n`;
}

function printTerminal() {
  console.log("");
  console.log("══════════════════════════════════════════════════");
  console.log(`  ${statusEmoji}  ${STAGING} (staging)  vs  ${PRODUCTION} (production)`);
  console.log("══════════════════════════════════════════════════");
  console.log("");
  console.log(`  Статус:              ${status}`);
  console.log(`  develop (${stagingSha}):  +${developAhead} впереди main`);
  console.log(`  main    (${prodSha}):  +${mainAhead} впереди develop`);
  console.log(`  Общий предок:        ${mergeBase.slice(0, 7)}`);
  console.log("");
  console.log(`  Compare: ${compareUrl}`);
  console.log("");

  if (onlyDevelop.length) {
    console.log(`── Только в ${STAGING} (${onlyDevelop.length}) ──`);
    for (const c of onlyDevelop.slice(0, 10)) {
      console.log(`  ${c}`);
    }
    if (onlyDevelop.length > 10) {
      console.log(`  … и ещё ${onlyDevelop.length - 10}`);
    }
    console.log("");
  }

  if (onlyMain.length) {
    console.log(`── Только в ${PRODUCTION} (${onlyMain.length}) — НЕТ в staging! ──`);
    for (const c of onlyMain) {
      console.log(`  ${c}`);
    }
    console.log("");
  }

  if (diffStat) {
    console.log("── Файлы ──");
    console.log(diffStat.split("\n").map((l) => `  ${l}`).join("\n"));
    console.log("");
  }

  if (mainAhead > 0) {
    console.log("  → Рекомендация: merge main → develop (синхронизировать staging)");
  }
  if (developAhead > 0) {
    console.log(`  → Рекомендация: PR ${STAGING} → ${PRODUCTION} (release)`);
  }
  console.log("");
}

if (markdown) {
  const content = buildMarkdown();
  if (outFile) {
    writeFileSync(outFile, content, "utf8");
    console.log(`OK: ${outFile}`);
  } else {
    process.stdout.write(content);
  }
} else {
  printTerminal();
}
