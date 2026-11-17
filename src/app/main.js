import { CASES, filterCases, findCaseById } from "../data/cases.js";
import { CASE_001_EVIDENCE } from "../data/evidence/case-001.js";
import { escapeHtml, formatCount } from "../core/format.js";
import { sha256Hex } from "../core/hash.js";
import {
  filterEvidence,
  findEvidenceById,
  formatBytes,
  getEvidenceForCase,
  getEvidenceSizeBytes
} from "../domain/evidence.js";
import { resolveRoute } from "./router.js";

const app = document.querySelector("#app");
if (!app) throw new Error("NEXUS application root was not found.");

const state = {
  terminalOpen: false,
  terminalExpanded: false,
  sidebarOpen: false,
  caseSearch: "",
  evidenceSearch: "",
  selectedEvidenceId: "EVD-001",
  hashRequestId: 0,
  hashStatus: null,
  hashResult: null
};

const ICONS = {
  shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
  dashboard: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M3 10h18"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a8 8 0 0 0 0-6l1.4-1.1-1.4-2.4-1.7.6a8 8 0 0 0-3.4-2L14 2h-4l-.3 2.1a8 8 0 0 0-3.4 2l-1.7-.6-1.4 2.4L4.6 9a8 8 0 0 0 0 6l-1.4 1.1 1.4 2.4 1.7-.6a8 8 0 0 0 3.4 2L10 22h4l.3-2.1a8 8 0 0 0 3.4-2l1.7.6 1.4-2.4Z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
  terminal: '<path d="m4 17 6-6-6-6"/><path d="M12 19h8"/>',
  activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  fileCheck: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  arrowRight: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  arrow: '<path d="M7 17 17 7"/><path d="M7 7h10v10"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  close: '<path d="m18 6-12 12M6 6l12 12"/>',
  searchFolder: '<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v4"/><circle cx="16" cy="17" r="3"/><path d="m18.2 19.2 2 2"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  fileText: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
  hash: '<path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>'
};

function icon(name) {
  const paths = ICONS[name] ?? ICONS.info;
  return '<span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24">' + paths + "</svg></span>";
}

function navLink(path, label, iconName, active) {
  return '<a class="sidebar-link" href="#' + path + '"' + (active ? ' aria-current="page"' : "") + ">" +
    icon(iconName) + '<span class="nav-label">' + label + "</span></a>";
}

function getMetrics() {
  return {
    available: CASES.filter((item) => item.status === "available").length,
    active: 0,
    analyzed: 0,
    completed: 0
  };
}

function renderSidebar(route) {
  const activeMain = route.name === "dashboard" ? "dashboard" :
    route.name === "cases" || route.name === "case-overview" ? "cases" : route.name;

  return '<aside class="sidebar' + (state.sidebarOpen ? " is-open" : "") + '" aria-label="Main navigation">' +
    '<a class="brand" href="#/dashboard" aria-label="NEXUS home"><span class="brand-mark">' + icon("shield") +
    '</span><span class="brand-copy"><span class="brand-name">NEXUS</span><span class="brand-caption">FORENSICS WORKBENCH</span></span></a>' +
    '<section class="sidebar-section"><span class="sidebar-label">Main</span><nav class="sidebar-nav">' +
    navLink("/dashboard", "Dashboard", "dashboard", activeMain === "dashboard") +
    navLink("/cases", "Case Library", "folder", activeMain === "cases") +
    "</nav></section>" +
    '<section class="sidebar-section"><span class="sidebar-label">Preferences</span><nav class="sidebar-nav">' +
    navLink("/settings", "Settings", "settings", route.name === "settings") +
    "</nav></section>" +
    '<div class="sidebar-footer"><div class="system-status"><span class="status-dot" aria-hidden="true"></span>' +
    '<span class="system-status-copy"><strong class="meta-value">Application ready</strong><br><span class="subtle" style="font-size:10px">Foundation preview · v0.1.0</span></span></div></div></aside>';
}

function renderTopbar() {
  return '<header class="topbar"><div class="topbar-context">' +
    '<button class="icon-button mobile-menu-button" type="button" data-action="toggle-sidebar" aria-label="Toggle navigation">' + icon("menu") + "</button>" +
    '<span class="topbar-product-label muted">NEXUS / Digital Forensics</span></div><div class="topbar-actions">' +
    '<form class="search-control" id="global-search" role="search">' + icon("search") +
    '<input id="global-search-input" type="search" name="q" aria-label="Search cases" placeholder="Search cases…" autocomplete="off"></form>' +
    '<button class="icon-button" type="button" data-action="terminal" aria-label="Toggle terminal panel" aria-expanded="' + String(state.terminalOpen) + '">' + icon("terminal") + "</button>" +
    '<button class="icon-button" type="button" aria-label="Notifications" title="No new notifications">' + icon("bell") + "</button></div></header>";
}

function renderMetric(label, value, note, iconName) {
  return '<article class="metric-card"><div class="metric-topline"><span>' + label + "</span>" + icon(iconName) + "</div>" +
    '<strong class="metric-value">' + formatCount(value) + "</strong><p class=\"metric-note\">" + note + "</p></article>";
}

function renderCaseCard(item, compact = false) {
  const tags = item.topics.slice(0, compact ? 2 : 4).map((topic) => '<span class="tag">' + escapeHtml(topic) + "</span>").join("");
  return '<article class="panel case-card"><div class="case-card-top"><div class="case-identity"><span class="case-symbol">' + icon("folder") +
    '</span><div><h3 class="case-title">' + escapeHtml(item.title) + '</h3><p class="case-id">' + escapeHtml(item.id) + "</p></div></div>" +
    '<span class="status status-available">Available</span></div><p class="case-description">' + escapeHtml(item.description) +
    '</p><div class="tag-list">' + tags + '</div><div class="case-card-footer"><div class="case-card-meta">' +
    '<div class="meta-item"><span class="meta-label">Difficulty</span><span class="meta-value">' + escapeHtml(item.difficulty) +
    '</span></div><div class="meta-item"><span class="meta-label">Estimated time</span><span class="meta-value">' +
    escapeHtml(item.estimatedDuration) + "</span></div></div><a class=\"button button-primary\" href=\"#/cases/" +
    encodeURIComponent(item.id) + '">' + (compact ? "View case" : "View details") + icon("arrowRight") + "</a></div></article>";
}

function renderDashboard() {
  const metrics = getMetrics();
  const featured = CASES[0];

  return '<main class="main-area" id="main-content" tabindex="-1"><div class="page-container">' +
    '<section class="page-heading"><div><p class="eyebrow">Overview / Workspace</p><h1 class="page-title">Good day. Ready to investigate?</h1>' +
    '<p class="page-description">Your digital investigation workspace at a glance.</p></div><a class="button button-secondary" href="#/cases">' +
    icon("folder") + "Browse cases</a></section><section class=\"metrics-grid\" aria-label=\"Investigation metrics\">" +
    renderMetric("Available cases", metrics.available, "Scenarios in the local catalog", "folder") +
    renderMetric("Active investigations", metrics.active, "No investigations started", "activity") +
    renderMetric("Evidence analyzed", metrics.analyzed, "Analysis engine not yet enabled", "fileCheck") +
    renderMetric("Completed cases", metrics.completed, "No completed investigations", "clock") +
    "</section><div class=\"dashboard-grid\"><section class=\"panel\"><div class=\"panel-header\"><div><h2 class=\"section-title\">Continue investigating</h2>" +
    '<p class="section-caption">Start with the available training scenario.</p></div><a class="button button-ghost" href="#/cases">All cases ' + icon("arrowRight") +
    "</a></div><div class=\"panel-body\">" + renderCaseCard(featured, true) + "</div></section>" +
    '<section class="panel"><div class="panel-header"><div><h2 class="section-title">Recent activity</h2><p class="section-caption">Updates from your investigations.</p></div>' +
    icon("activity") + '</div><div class="activity-empty">' + icon("clock") + "<strong>No activity yet</strong>" +
    "<p>Investigation events will appear here after you start working on a case.</p></div></section></div>" +
    '<section class="panel" style="margin-top:16px"><div class="panel-header"><div><h2 class="section-title">Workspace status</h2>' +
    '<p class="section-caption">Foundation milestone capabilities.</p></div><span class="status status-available">Operational</span></div>' +
    '<div class="panel-body"><div class="case-list-item"><div class="case-identity">' + icon("shield") +
    '<div><strong class="meta-value">Application shell</strong><div class="section-caption">Navigation and design tokens are active.</div></div></div>' +
    '<span class="status status-available">Ready</span></div><div class=\"case-list-item\" style=\"margin-top:8px\"><div class=\"case-identity\">' +
    icon("terminal") + '<div><strong class="meta-value">Investigation terminal</strong><div class="section-caption">Command engine is planned for a later milestone.</div></div></div>' +
    '<span class="status status-planned">Planned</span></div></div></section></div></main>';
}

function renderCaseLibrary() {
  const matches = filterCases(CASES, state.caseSearch);

  return '<main class="main-area" id="main-content" tabindex="-1"><div class="page-container"><section class="page-heading">' +
    '<div><p class="eyebrow">Main / Investigations</p><h1 class="page-title">Case Library</h1>' +
    '<p class="page-description">Explore the available synthetic investigation scenarios.</p></div></section>' +
    '<section class="metrics-grid" aria-label="Case statistics">' +
    renderMetric("Total cases", CASES.length, "Scenarios in the catalog", "folder") +
    renderMetric("Available", CASES.filter((item) => item.status === "available").length, "Ready to explore", "fileCheck") +
    renderMetric("In progress", 0, "No saved investigations yet", "activity") +
    renderMetric("Completed", 0, "No completed cases yet", "clock") +
    '</section><section class="panel"><div class="panel-header"><div><h2 class="section-title">Available investigations</h2>' +
    '<p class="section-caption">' + formatCount(matches.length) + ' matching scenario(s)</p></div></div><div class="panel-body"><div class="case-list">' +
    (matches.length ? matches.map((item) => renderCaseCard(item, false)).join("") :
    '<div class="activity-empty">' + icon("searchFolder") + "<strong>No cases found</strong><p>Try another case ID, title, or keyword.</p></div>") +
    "</div></div></section></div></main>";
}

function renderEvidenceListItem(record, selected) {
  return '<button type="button" class="evidence-list-button' + (selected ? " is-selected" : "") +
    '" data-action="select-evidence" data-evidence-id="' + escapeHtml(record.id) +
    '" aria-pressed="' + String(selected) + '"><span class="evidence-list-icon">' + icon("fileText") +
    '</span><span class="evidence-list-copy"><strong>' + escapeHtml(record.name) +
    '</strong><span>' + escapeHtml(record.id) + " · " + escapeHtml(record.type) +
    '</span></span><span class="evidence-list-arrow">' + icon("arrowRight") + "</span></button>";
}

function renderEvidenceWorkspace(caseId) {
  const records = getEvidenceForCase(CASE_001_EVIDENCE, caseId);
  const visibleRecords = filterEvidence(records, state.evidenceSearch);
  const selectedRecord = findEvidenceById(records, state.selectedEvidenceId) ?? records[0] ?? null;

  if (!selectedRecord) {
    return '<section class="panel"><div class="panel-body"><div class="activity-empty">' +
      icon("info") + "<strong>No evidence dataset is available</strong>" +
      "<p>This training case does not currently include evidence records.</p></div></div></section>";
  }

  const isHashing = state.hashStatus?.evidenceId === selectedRecord.id &&
    state.hashStatus.status === "calculating";
  const hashError = state.hashStatus?.evidenceId === selectedRecord.id &&
    state.hashStatus.status === "error";
  const hashResult = state.hashResult?.evidenceId === selectedRecord.id
    ? state.hashResult.digest
    : null;

  const hashPanel = hashResult
    ? '<div class="hash-result"><div class="hash-result-heading">' + icon("check") +
      "<strong>SHA-256 calculated</strong></div><code>" + escapeHtml(hashResult) +
      "</code></div>"
    : hashError
      ? '<p class="inline-error" role="alert">Unable to calculate a digest in this browser context.</p>'
      : '<p class="section-caption">The digest is calculated locally in your browser from the displayed synthetic content.</p>';

  return '<section class="evidence-workspace" aria-label="Evidence explorer">' +
    '<aside class="panel evidence-browser"><div class="panel-header"><div><h2 class="section-title">Evidence</h2>' +
    '<p class="section-caption">' + formatCount(records.length) + ' synthetic records</p></div>' +
    '<span class="status status-available">Read only</span></div><div class="panel-body">' +
    '<form class="evidence-search" id="evidence-search" role="search">' + icon("search") +
    '<input id="evidence-search-input" type="search" name="q" placeholder="Filter evidence…" aria-label="Filter evidence" autocomplete="off">' +
    '</form><div class="evidence-list" aria-label="Evidence records">' +
    (visibleRecords.length
      ? visibleRecords.map((record) => renderEvidenceListItem(record, record.id === selectedRecord.id)).join("")
      : '<div class="evidence-empty">No matching evidence records.</div>') +
    '</div></div></aside><section class="panel evidence-detail"><div class="panel-header">' +
    '<div><p class="eyebrow">Selected evidence</p><h2 class="section-title">' + escapeHtml(selectedRecord.name) +
    '</h2><p class="section-caption mono">' + escapeHtml(selectedRecord.id) + '</p></div>' +
    '<span class="tag">' + escapeHtml(selectedRecord.type) + '</span></div><div class="panel-body">' +
    '<p class="case-description">' + escapeHtml(selectedRecord.description) + '</p>' +
    '<dl class="evidence-metadata"><div><dt>Source</dt><dd>' + escapeHtml(selectedRecord.source) +
    '</dd></div><div><dt>Collected (UTC)</dt><dd>' + escapeHtml(selectedRecord.collectedAt) +
    '</dd></div><div><dt>Content size</dt><dd>' + formatBytes(getEvidenceSizeBytes(selectedRecord)) +
    '</dd></div></dl><div class="evidence-content-heading"><h3>Original content</h3><span class="section-caption">Read-only preview</span></div>' +
    '<pre class="evidence-content" tabindex="0"><code>' + escapeHtml(selectedRecord.content) + '</code></pre>' +
    '<div class="integrity-panel"><div class="integrity-copy"><h3>Content integrity</h3>' +
    '<p>Calculate a SHA-256 digest to identify changes to this exact content.</p></div>' +
    '<button class="button button-secondary" type="button" data-action="hash-evidence" data-evidence-id="' +
    escapeHtml(selectedRecord.id) + '"' + (isHashing ? " disabled" : "") + '>' +
    icon("hash") + (isHashing ? "Calculating…" : "Calculate SHA-256") + "</button></div>" +
    hashPanel + '<p class="integrity-disclaimer">A matching digest can show that content is unchanged relative to a known digest. It does not prove who created the content, where it came from, or that it is authentic.</p>' +
    '</div></section></section><p class="synthetic-notice">' + icon("info") +
    '<span>Training simulation: all records in this case are synthetic. No real accounts, devices, or user files are involved.</span></p>';
}

function renderCaseOverview(caseId) {
  const item = findCaseById(caseId);
  if (!item) return renderNotFound("This case is not available in the current catalog.");

  const records = getEvidenceForCase(CASE_001_EVIDENCE, caseId);
  if (!records.some((record) => record.id === state.selectedEvidenceId)) {
    state.selectedEvidenceId = records[0]?.id ?? null;
    state.hashResult = null;
    state.hashStatus = null;
  }

  return '<main class="main-area" id="main-content" tabindex="-1"><div class="page-container"><p class="eyebrow"><a href="#/cases">Case Library</a> / ' +
    escapeHtml(item.id) + "</p><section class=\"page-heading\"><div><span class=\"status status-available\">Training case</span>" +
    '<h1 class="page-title" style="margin-top:12px">' + escapeHtml(item.title) + '</h1><p class="page-description">' +
    escapeHtml(item.category) + " · " + formatCount(records.length) + " synthetic evidence records</p></div>" +
    '<a class="button button-secondary" href="#/cases">Back to library</a></section>' +
    '<section class="panel case-background"><div class="panel-header"><h2 class="section-title">Investigation brief</h2>' +
    '<span class="mono subtle">' + escapeHtml(item.id) + '</span></div><div class="panel-body"><p class="case-description">' +
    escapeHtml(item.description) + '</p><div class="tag-list case-topic-list">' +
    item.topics.map((topic) => '<span class="tag">' + escapeHtml(topic) + "</span>").join("") +
    '</div></div></section>' + renderEvidenceWorkspace(caseId) + '</div></main>';
}

function renderSettings() {
  return '<main class="main-area" id="main-content" tabindex="-1"><div class="page-container"><section class="page-heading">' +
    '<div><p class="eyebrow">Preferences</p><h1 class="page-title">Settings</h1><p class="page-description">Application preferences will be added as the foundation develops.</p></div>' +
    '</section><section class="panel"><div class="panel-body"><div class="terminal-notice">' + icon("info") +
    "<p>Settings are not part of the current implementation milestone.</p></div></div></section></div></main>";
}

function renderNotFound(message = "The requested page could not be found.") {
  return '<main class="main-area" id="main-content" tabindex="-1"><div class="page-container not-found">' + icon("searchFolder") +
    '<h1 class="page-title">Page not found</h1><p class="page-description">' + escapeHtml(message) +
    '</p><a class="button button-primary" href="#/dashboard">Return to dashboard</a></div></main>';
}

function renderTerminal() {
  if (!state.terminalOpen) return "";
  return '<section class="terminal-panel' + (state.terminalExpanded ? " is-expanded" : "") + '" aria-label="Terminal panel">' +
    '<header class="terminal-panel-header"><div class="case-identity">' + icon("terminal") +
    '<strong class="meta-value">NEXUS Terminal</strong><span class="status status-planned">Engine planned</span></div>' +
    '<div class="topbar-actions"><button class="icon-button" type="button" data-action="expand-terminal" aria-label="' +
    (state.terminalExpanded ? "Restore terminal" : "Expand terminal") + '">' + icon(state.terminalExpanded ? "close" : "arrow") +
    '</button><button class="icon-button" type="button" data-action="terminal" aria-label="Close terminal">' + icon("close") +
    "</button></div></header><div class=\"terminal-panel-body\"><div class=\"mono\" style=\"color:var(--color-accent)\">NEXUS / SIMULATED ENVIRONMENT</div>" +
    "<p>The terminal interface is reserved for the custom NEXUS command engine. It is not connected to the host operating system.</p>" +
    '<p class="subtle">Command parsing and virtual filesystem support will be implemented in a later milestone.</p></div></section>';
}

function render() {
  const route = resolveRoute(window.location.hash);
  let content;

  switch (route.name) {
    case "dashboard": content = renderDashboard(); break;
    case "cases": content = renderCaseLibrary(); break;
    case "case-overview": content = renderCaseOverview(route.caseId); break;
    case "settings": content = renderSettings(); break;
    default: content = renderNotFound();
  }

  app.innerHTML = '<div class="app-shell">' + renderSidebar(route) + renderTopbar() + content + "</div>" + renderTerminal();
  const searchInput = document.querySelector("#global-search-input");
  if (searchInput) searchInput.value = state.caseSearch;

  const evidenceSearchInput = document.querySelector("#evidence-search-input");
  if (evidenceSearchInput) evidenceSearchInput.value = state.evidenceSearch;
}

app.addEventListener("submit", (event) => {
  if (event.target.id === "evidence-search") {
    event.preventDefault();
    const input = document.querySelector("#evidence-search-input");
    state.evidenceSearch = input?.value ?? "";
    render();
    return;
  }

  if (event.target.id !== "global-search") return;
  event.preventDefault();
  const input = document.querySelector("#global-search-input");
  state.caseSearch = input?.value ?? "";
  state.sidebarOpen = false;

  // Hash changes do not fire when the current route is already /cases.
  // Render directly in that case so repeated searches always refresh results.
  if (resolveRoute(window.location.hash).name === "cases") {
    render();
  } else {
    window.location.hash = "/cases";
  }
});

async function calculateEvidenceHash(evidenceId) {
  const record = findEvidenceById(CASE_001_EVIDENCE, evidenceId);
  if (!record) return;

  const requestId = ++state.hashRequestId;
  state.hashStatus = { evidenceId, status: "calculating" };
  state.hashResult = null;
  render();

  try {
    const digest = await sha256Hex(record.content);
    if (requestId !== state.hashRequestId) return;

    state.hashStatus = null;
    state.hashResult = { evidenceId, digest };
  } catch {
    if (requestId !== state.hashRequestId) return;
    state.hashStatus = { evidenceId, status: "error" };
  }

  render();
}

app.addEventListener("click", (event) => {
  const control = event.target.closest("[data-action]");
  if (!control) return;

  if (control.dataset.action === "select-evidence") {
    const evidenceId = control.dataset.evidenceId;
    if (!findEvidenceById(CASE_001_EVIDENCE, evidenceId)) return;

    state.selectedEvidenceId = evidenceId;
    state.hashRequestId += 1;
    state.hashStatus = null;
    state.hashResult = null;
    render();
  } else if (control.dataset.action === "hash-evidence") {
    void calculateEvidenceHash(control.dataset.evidenceId);
  } else if (control.dataset.action === "terminal") {
    state.terminalOpen = !state.terminalOpen;
    if (!state.terminalOpen) state.terminalExpanded = false;
    render();
  } else if (control.dataset.action === "expand-terminal") {
    state.terminalExpanded = !state.terminalExpanded;
    render();
  } else if (control.dataset.action === "toggle-sidebar") {
    state.sidebarOpen = !state.sidebarOpen;
    render();
  }
});

app.addEventListener("click", (event) => {
  if (event.target.closest(".sidebar-link, .brand, .button")) state.sidebarOpen = false;
});

window.addEventListener("hashchange", () => {
  state.sidebarOpen = false;
  render();
});

render();
