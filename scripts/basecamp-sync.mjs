#!/usr/bin/env node
/**
 * Basecamp Sync Script
 *
 * Pushes the canonical machine-readable backlog (`data/backlog.json`) into the
 * Basecamp "DesiSaga" project as to-do lists (Epics) + to-dos (stories).
 *
 * Usage:
 *   export $(grep -v '^#' .env | xargs) && npm run sync:basecamp
 *   npm run sync:basecamp -- --dry-run     # preview only
 *   npm run sync:basecamp -- --force       # recreate duplicates
 *
 * Basecamp 3 API (works with Basecamp 4/5):
 *   Project dock → todoset → todolists → todos, all under /buckets/{project_id}.
 */

import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env if present (simple parser, no dependency)
function loadEnv() {
  const envPath = join(__dirname, "..", ".env");
  if (!existsSync(envPath)) return;
  const lines = readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}
loadEnv();

const ACCOUNT_ID = process.env.BASECAMP_ACCOUNT_ID;
const ACCESS_TOKEN = process.env.BASECAMP_ACCESS_TOKEN;
const PROJECT_NAME = process.env.BASECAMP_PROJECT_NAME || "DesiSaga";
const BASE_URL = `https://3.basecampapi.com/${ACCOUNT_ID}`;

const DRY_RUN = process.argv.includes("--dry-run");
const SKIP_EXISTING = !process.argv.includes("--force");

function log(...args) {
  console.log("[basecamp-sync]", ...args);
}

function logError(...args) {
  console.error("[basecamp-sync]", ...args);
}

async function api(path, options = {}) {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "User-Agent": "DesiSaga Backlog Sync (dilipm1@gmail.com)",
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Basecamp API error ${res.status} ${res.statusText}: ${body}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadBacklog() {
  const path = join(__dirname, "..", "data", "backlog.json");
  const raw = readFileSync(path, "utf-8");
  return JSON.parse(raw);
}

async function findProject() {
  const projects = await api("/projects.json");
  const project = projects.find((p) => p.name === PROJECT_NAME);
  if (!project) {
    throw new Error(
      `Basecamp project "${PROJECT_NAME}" not found. Available: ${projects
        .map((p) => p.name)
        .join(", ")}`
    );
  }
  return project;
}

/** Extract the todoset (To-dos tool) from the project dock. */
async function getTodoset(projectId) {
  const project = await api(`/projects/${projectId}.json`);
  const todoset = (project.dock || []).find((d) => d.name === "todoset");
  if (!todoset) {
    throw new Error("No To-dos (todoset) tool found in the project dock.");
  }
  return todoset;
}

async function getTodoLists(projectId, todosetId) {
  return await api(
    `/buckets/${projectId}/todosets/${todosetId}/todolists.json`
  );
}

async function getTodos(projectId, todoListId) {
  return await api(
    `/buckets/${projectId}/todolists/${todoListId}/todos.json`
  );
}

function buildTodoDescription(story) {
  const lines = [
    `<p><strong>Story:</strong> ${escapeHtml(story.story)}</p>`,
    `<p><strong>Priority:</strong> ${story.priority}</p>`,
    `<p><strong>Graph nodes:</strong> ${story.graph_nodes}</p>`,
  ];
  if (story.human_gate) {
    lines.push(`<p><strong>Human gate:</strong> ${story.human_gate}</p>`);
  }
  lines.push("<p><strong>Acceptance criteria:</strong></p>", "<ul>");
  for (const ac of story.acceptance_criteria) {
    lines.push(`<li>${escapeHtml(ac)}</li>`);
  }
  lines.push("</ul>");
  lines.push(
    `<p><em>Source: <code>data/backlog.json</code> · ID: ${story.id}</em></p>`
  );
  return lines.join("\n");
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function syncEpic(project, todoset, existingLists, epic) {
  const listName = `${epic.id}: ${epic.title}`;
  // NOTE: to-do lists expose `title`, to-dos expose `content`
  let list = existingLists.find((l) => l.title === listName);

  if (!list) {
    if (DRY_RUN) {
      log(`[dry-run] would create to-do list: "${listName}"`);
      list = { id: null, title: listName };
    } else {
      list = await api(
        `/buckets/${project.id}/todosets/${todoset.id}/todolists.json`,
        {
          method: "POST",
          body: JSON.stringify({
            name: listName,
            description: `<p><strong>Graph:</strong> ${escapeHtml(
              epic.graph
            )}</p><p>${escapeHtml(epic.description || "")}</p>`,
          }),
        }
      );
      log(`created to-do list: "${listName}" (id=${list.id})`);
      await sleep(250);
    }
  } else {
    log(`found existing to-do list: "${listName}" (id=${list.id})`);
  }

  const existingTodos = list.id ? await getTodos(project.id, list.id) : [];

  for (const story of epic.stories) {
    const todoTitle = `${story.id}: ${story.title}`;
    const exists = existingTodos.some((t) =>
      (t.content || "").startsWith(`${story.id}:`)
    );

    if (exists && SKIP_EXISTING) {
      log(`  skipped existing to-do: ${todoTitle}`);
      continue;
    }

    if (DRY_RUN) {
      log(`[dry-run] would create to-do: "${todoTitle}"`);
      continue;
    }

    await api(`/buckets/${project.id}/todolists/${list.id}/todos.json`, {
      method: "POST",
      body: JSON.stringify({
        content: todoTitle,
        description: buildTodoDescription(story),
      }),
    });
    log(`  created to-do: ${todoTitle}`);
    await sleep(250);
  }
}

async function main() {
  if (!ACCOUNT_ID || !ACCESS_TOKEN) {
    logError("Missing BASECAMP_ACCOUNT_ID or BASECAMP_ACCESS_TOKEN env vars.");
    logError("Copy .env.example → .env and fill in credentials.");
    logError("See okf/basecamp-guide.md for setup instructions.");
    process.exit(1);
  }

  const backlog = loadBacklog();
  log(`loaded backlog: ${backlog.epics.length} epics`);

  const project = await findProject();
  log(`found Basecamp project: ${project.name} (id=${project.id})`);

  const todoset = await getTodoset(project.id);
  log(`found To-dos tool (todoset id=${todoset.id}, enabled=${todoset.enabled})`);

  const existingLists = await getTodoLists(project.id, todoset.id);
  log(`found ${existingLists.length} existing to-do lists`);

  for (const epic of backlog.epics) {
    await syncEpic(project, todoset, existingLists, epic);
  }

  log("sync complete.");
}

main().catch((err) => {
  logError(err.message);
  process.exit(1);
});
