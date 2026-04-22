const STORAGE_KEY = "minimal-kanban-tasks-v1";
const VIEW_STORAGE_KEY = "minimal-kanban-view-v1";
const TASK_FORM_SECTIONS_STORAGE_KEY = "minimal-kanban-task-form-sections-v1";
const THEME_STORAGE_KEY = "minimal-kanban-theme-v1";
const DUE_HIGHLIGHT_REFRESH_MS = 60 * 1000;
const DUE_DATE_STEP_MINUTES = 15;
const DUE_DATE_STEP_MS = DUE_DATE_STEP_MINUTES * 60 * 1000;
const TASK_IMAGE_MAX_DIMENSION = 1600;
const TASK_IMAGE_OUTPUT_QUALITY = 0.82;

const STATUS_LABEL = {
  backlog: "Open",
  todo: "Focus",
  done: "Done",
};

const PRIORITY_LABEL = {
  high: "Hoch",
  medium: "Mittel",
  low: "Niedrig",
};

const PRIORITY_ORDER = {
  high: 0,
  medium: 1,
  low: 2,
};

const state = {
  tasks: [],
  archiveTasks: [],
  trashTasks: [],
  draggingTaskId: null,
  view: "kanban",
  filterType: "none",
  dateFrom: "",
  dateTo: "",
  searchQuery: "",
  listSort: "created-desc",
  listStatusFilter: {
    backlog: true,
    todo: true,
    done: true,
  },
};

const dialog = document.getElementById("taskDialog");
const wipeDialog = document.getElementById("wipeDialog");
const taskForm = document.getElementById("taskForm");
const newTaskBtn = document.getElementById("newTaskBtn");
const settingsToggleBtn = document.getElementById("settingsToggleBtn");
const settingsMenuPanel = document.getElementById("settingsMenuPanel");
const themeToggle = document.getElementById("themeToggle");
const themeToggleIcon = document.getElementById("themeToggleIcon");
const themeToggleLabel = document.getElementById("themeToggleLabel");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const wipeAllBtn = document.getElementById("wipeAllBtn");
const emptyTrashBtn = document.getElementById("emptyTrashBtn");
const importFileInput = document.getElementById("importFileInput");
const cancelBtn = document.getElementById("cancelBtn");
const wipeCancelBtn = document.getElementById("wipeCancelBtn");
const wipeConfirmBtn = document.getElementById("wipeConfirmBtn");
const wipeDialogTitle = document.getElementById("wipeDialogTitle");
const wipeDialogText = document.getElementById("wipeDialogText");
const dialogTitle = document.getElementById("dialogTitle");
const taskTemplate = document.getElementById("taskCardTemplate");

const dashboardView = document.getElementById("dashboardView");
const dashboardViewBtn = document.getElementById("dashboardViewBtn");
const dashboardTodayList = document.getElementById("dashboardTodayList");
const dashboardOverdueList = document.getElementById("dashboardOverdueList");
const dashboardWeekList = document.getElementById("dashboardWeekList");
const dashboardDoneList = document.getElementById("dashboardDoneList");
const dashboardTodayCount = document.getElementById("dashboardTodayCount");
const dashboardOverdueCount = document.getElementById("dashboardOverdueCount");
const dashboardWeekCount = document.getElementById("dashboardWeekCount");
const dashboardDoneCount = document.getElementById("dashboardDoneCount");

const kanbanView = document.getElementById("kanbanView");
const listView = document.getElementById("listView");
const archiveView = document.getElementById("archiveView");
const trashView = document.getElementById("trashView");
const kanbanViewBtn = document.getElementById("kanbanViewBtn");
const listViewBtn = document.getElementById("listViewBtn");
const archiveViewBtn = document.getElementById("archiveViewBtn");
const trashViewBtn = document.getElementById("trashViewBtn");
const listTableBody = document.getElementById("listTableBody");
const archiveTableBody = document.getElementById("archiveTableBody");
const trashTableBody = document.getElementById("trashTableBody");
const listTitleHeader = document.getElementById("listTitleHeader");
const listStatusHeader = document.getElementById("listStatusHeader");
const listDueHeader = document.getElementById("listDueHeader");
const listCreatedHeader = document.getElementById("listCreatedHeader");
const sortTitleBtn = document.getElementById("sortTitleBtn");
const statusFilterBtn = document.getElementById("statusFilterBtn");
const statusFilterMenu = document.getElementById("statusFilterMenu");
const statusFilterCheckboxes = Array.from(document.querySelectorAll(".status-filter-checkbox"));
const sortDueBtn = document.getElementById("sortDueBtn");
const sortCreatedBtn = document.getElementById("sortCreatedBtn");

const dateFilterTypeSelect = document.getElementById("dateFilterType");
const dateFromInput = document.getElementById("dateFrom");
const dateToInput = document.getElementById("dateTo");
const viewPanelToggleBtn = document.getElementById("viewPanelToggleBtn");
const filterPanelToggleBtn = document.getElementById("filterPanelToggleBtn");
const searchPanelToggleBtn = document.getElementById("searchPanelToggleBtn");
const toolbarPanelStage = document.getElementById("toolbarPanelStage");
const viewPanel = document.getElementById("viewPanel");
const filterPanel = document.getElementById("filterPanel");
const searchPanel = document.getElementById("searchPanel");
const taskSearchInput = document.getElementById("taskSearchInput");
const clearFilterBtn = document.getElementById("clearFilterBtn");
const titleCollator = new Intl.Collator("de-CH", { sensitivity: "base", numeric: true });

const taskIdInput = document.getElementById("taskId");
const taskTitleInput = document.getElementById("taskTitle");
const taskDescriptionInput = document.getElementById("taskDescription");
const taskPriorityInput = document.getElementById("taskPriority");
const taskTagsInput = document.getElementById("taskTags");
const taskDueDateInput = document.getElementById("taskDueDate");
const taskDueDateDateInput = document.getElementById("taskDueDateDate");
const taskDueDateHourInput = document.getElementById("taskDueDateHour");
const taskDueDateMinuteInput = document.getElementById("taskDueDateMinute");
const taskDueDatePreview = document.getElementById("taskDueDatePreview");
const taskStatusInput = document.getElementById("taskStatus");
const taskRecurringFrequencyInput = document.getElementById("taskRecurringFrequency");
const taskRecurringIntervalInput = document.getElementById("taskRecurringInterval");
const taskRecurringPreview = document.getElementById("taskRecurringPreview");
const taskImageInput = document.getElementById("taskImage");
const taskImageRemoveInput = document.getElementById("taskImageRemove");
const taskImagePreviewWrap = document.getElementById("taskImagePreviewWrap");
const taskImagePreview = document.getElementById("taskImagePreview");
const taskImageCropControls = document.getElementById("taskImageCropControls");
const taskImageAdjustments = document.getElementById("taskImageAdjustments");
const taskImagePosXInput = document.getElementById("taskImagePosX");
const taskImagePosYInput = document.getElementById("taskImagePosY");
const dueQuickButtons = Array.from(document.querySelectorAll(".due-quick-btn"));
const addChecklistItemBtn = document.getElementById("addChecklistItemBtn");
const checklistQuickInput = document.getElementById("checklistQuickInput");
const checklistEditorList = document.getElementById("checklistEditorList");
const taskFormSections = Array.from(document.querySelectorAll(".task-form-section"));
const sectionToggleButtons = Array.from(document.querySelectorAll(".section-toggle"));

const dropzones = {
  backlog: document.querySelector('[data-dropzone="backlog"]'),
  todo: document.querySelector('[data-dropzone="todo"]'),
  done: document.querySelector('[data-dropzone="done"]'),
};

let taskImageValue = "";
let taskImageBaseline = "";
let taskImagePosX = 50;
let taskImagePosY = 50;
let taskImageBaselinePosX = 50;
let taskImageBaselinePosY = 50;
let imageProcessingPromise = null;
let pendingWipeAction = null;
let draftChecklist = [];
let checklistEditingItemId = null;
let checklistDraggingItemId = null;
let taskFormSectionState = {};

const RECURRING_LABEL = {
  daily: "Täglich",
  weekly: "Wöchentlich",
  monthly: "Monatlich",
  "after-completion": "Nach Erledigung",
};

function normalizeChecklistItem(item) {
  if (!item || typeof item !== "object") return null;
  const text = typeof item.text === "string" ? item.text.trim() : "";
  if (!text) return null;
  return {
    id: typeof item.id === "string" && item.id ? item.id : crypto.randomUUID(),
    text,
    done: Boolean(item.done),
  };
}

function normalizeChecklist(list) {
  if (!Array.isArray(list)) return [];
  return list.map(normalizeChecklistItem).filter(Boolean);
}

function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return tags
      .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
      .filter(Boolean)
      .filter((tag, index, list) => list.findIndex((entry) => entry.toLocaleLowerCase("de-CH") === tag.toLocaleLowerCase("de-CH")) === index);
  }

  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .filter((tag, index, list) => list.findIndex((entry) => entry.toLocaleLowerCase("de-CH") === tag.toLocaleLowerCase("de-CH")) === index);
  }

  return [];
}

function normalizeRecurring(recurring) {
  if (!recurring || typeof recurring !== "object") return null;
  const frequency = typeof recurring.frequency === "string" ? recurring.frequency : "";
  if (!RECURRING_LABEL[frequency]) return null;
  const interval =
    Number.isFinite(recurring.interval) && recurring.interval > 0 ? Math.floor(recurring.interval) : 1;
  return { frequency, interval };
}

function normalizeTask(task) {
  const status = STATUS_LABEL[task.status] ? task.status : "backlog";
  const priority = PRIORITY_LABEL[task.priority] ? task.priority : "medium";
  const createdAt = Number.isFinite(task.createdAt) ? task.createdAt : Date.now();
  const imagePosX = Number.isFinite(task.imagePosX) ? Math.min(100, Math.max(0, task.imagePosX)) : 50;
  const imagePosY = Number.isFinite(task.imagePosY) ? Math.min(100, Math.max(0, task.imagePosY)) : 50;
  const recurring = normalizeRecurring(task.recurring);

  let completedAt = null;
  if (status === "done") {
    completedAt = Number.isFinite(task.completedAt) ? task.completedAt : createdAt;
  }

  return {
    id: task.id || crypto.randomUUID(),
    title: typeof task.title === "string" ? task.title : "",
    description: typeof task.description === "string" ? task.description : "",
    priority,
    tags: normalizeTags(task.tags),
    dueDate: typeof task.dueDate === "string" ? task.dueDate : "",
    image: typeof task.image === "string" ? task.image : "",
    imagePosX,
    imagePosY,
    checklist: normalizeChecklist(task.checklist),
    status,
    createdAt,
    completedAt,
    recurring,
    reminderAt: typeof task.reminderAt === "string" ? task.reminderAt : "",
    reminderDismissedAt: Number.isFinite(task.reminderDismissedAt) ? task.reminderDismissedAt : null,
  };
}

function normalizeArchiveTask(task) {
  const normalized = normalizeTask(task);
  return {
    ...normalized,
    archivedAt: Number.isFinite(task.archivedAt) ? task.archivedAt : Date.now(),
  };
}

function normalizeTrashTask(task) {
  const normalized = normalizeTask(task);
  return {
    ...normalized,
    deletedAt: Number.isFinite(task.deletedAt) ? task.deletedAt : Date.now(),
  };
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { tasks: [], archiveTasks: [], trashTasks: [] };
    }

    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      return { tasks: parsed.map(normalizeTask), archiveTasks: [], trashTasks: [] };
    }

    const tasks = Array.isArray(parsed.tasks) ? parsed.tasks.map(normalizeTask) : [];
    const archiveTasks = Array.isArray(parsed.archiveTasks)
      ? parsed.archiveTasks.map(normalizeArchiveTask)
      : [];
    const trashTasks = Array.isArray(parsed.trashTasks)
      ? parsed.trashTasks.map(normalizeTrashTask)
      : [];

    return { tasks, archiveTasks, trashTasks };
  } catch {
    return { tasks: [], archiveTasks: [], trashTasks: [] };
  }
}

function saveData() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      tasks: state.tasks,
      archiveTasks: state.archiveTasks,
      trashTasks: state.trashTasks,
    })
  );
}

function loadViewPreference() {
  const view = localStorage.getItem(VIEW_STORAGE_KEY);
  if (view === "dashboard" || view === "list" || view === "archive" || view === "trash") return view;
  return "kanban";
}

function saveViewPreference() {
  localStorage.setItem(VIEW_STORAGE_KEY, state.view);
}

function loadThemePreference() {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "dark" ? "dark" : "light";
}

function saveThemePreference(theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === "dark";
  themeToggle.setAttribute("aria-pressed", isDark ? "true" : "false");
  themeToggle.setAttribute("aria-label", isDark ? "Light-Modus aktivieren" : "Dark-Modus aktivieren");
  themeToggle.setAttribute("title", isDark ? "Light-Modus aktivieren" : "Dark-Modus aktivieren");
  if (themeToggleIcon) {
    themeToggleIcon.textContent = isDark ? "☀" : "☾";
  }
  if (themeToggleLabel) {
    themeToggleLabel.textContent = isDark ? "Light" : "Dark";
  }
  themeToggle.classList.toggle("is-moon", !isDark);
}

function onThemeToggleClick() {
  const currentTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  saveThemePreference(nextTheme);
}

function toggleSettingsMenu(forceOpen) {
  const shouldOpen =
    typeof forceOpen === "boolean" ? forceOpen : settingsMenuPanel.classList.contains("hidden");
  settingsMenuPanel.classList.toggle("hidden", !shouldOpen);
  settingsToggleBtn.classList.toggle("is-active", shouldOpen);
  settingsToggleBtn.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
}

function loadTaskFormSectionState() {
  try {
    const raw = localStorage.getItem(TASK_FORM_SECTIONS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveTaskFormSectionState() {
  localStorage.setItem(TASK_FORM_SECTIONS_STORAGE_KEY, JSON.stringify(taskFormSectionState));
}

function applyTaskFormSectionState() {
  taskFormSections.forEach((section) => {
    const toggleButton = section.querySelector(".section-toggle");
    if (!toggleButton) return;
    const key = section.dataset.section;
    if (!key) return;
    const collapsed = Boolean(taskFormSectionState[key]);
    section.classList.toggle("is-collapsed", collapsed);
    toggleButton.setAttribute("aria-expanded", collapsed ? "false" : "true");
  });
}

function onTaskFormSectionToggle(event) {
  const button = event.currentTarget;
  if (!(button instanceof HTMLElement)) return;
  const key = button.dataset.sectionToggle;
  if (!key) return;
  taskFormSectionState[key] = !Boolean(taskFormSectionState[key]);
  saveTaskFormSectionState();
  applyTaskFormSectionState();
}

function setupTaskFormSections() {
  taskFormSectionState = loadTaskFormSectionState();
  applyTaskFormSectionState();
  sectionToggleButtons.forEach((button) => {
    button.addEventListener("click", onTaskFormSectionToggle);
  });
}

function toJsonExportPayload() {
  return {
    schemaVersion: 3,
    exportedAt: new Date().toISOString(),
    tasks: state.tasks,
    archiveTasks: state.archiveTasks,
    trashTasks: state.trashTasks,
    view: state.view,
  };
}

function downloadTextFile(filename, text, mimeType) {
  const blob = new Blob([text], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function getExportFilename() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  return `kanban-export-${year}${month}${day}-${hour}${minute}.json`;
}

function onExportData() {
  const payload = toJsonExportPayload();
  const json = JSON.stringify(payload, null, 2);
  downloadTextFile(getExportFilename(), json, "application/json");
}

function parseImportedData(text) {
  const parsed = JSON.parse(text);
  if (Array.isArray(parsed)) {
    return {
      tasks: parsed.map(normalizeTask),
      archiveTasks: [],
      trashTasks: [],
      view: "kanban",
    };
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Ungültiges Dateiformat.");
  }

  const tasks = Array.isArray(parsed.tasks) ? parsed.tasks.map(normalizeTask) : [];
  const archiveTasks = Array.isArray(parsed.archiveTasks) ? parsed.archiveTasks.map(normalizeArchiveTask) : [];
  const trashTasks = Array.isArray(parsed.trashTasks) ? parsed.trashTasks.map(normalizeTrashTask) : [];
  const view =
    parsed.view === "dashboard" || parsed.view === "list" || parsed.view === "archive" || parsed.view === "trash"
      ? parsed.view
      : "kanban";

  return { tasks, archiveTasks, trashTasks, view };
}

function applyImportedData(imported) {
  state.tasks = imported.tasks;
  state.archiveTasks = imported.archiveTasks;
  state.trashTasks = imported.trashTasks;
  state.view = imported.view;
  saveData();
  saveViewPreference();
  renderApp();
}

async function onImportFileChange(event) {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) return;
  const [file] = input.files || [];
  input.value = "";
  if (!file) return;

  try {
    const text = await file.text();
    const imported = parseImportedData(text);
    applyImportedData(imported);
  } catch {
    alert("Import fehlgeschlagen: Bitte eine gültige Export-JSON auswählen.");
  }
}

function onImportData() {
  importFileInput.click();
}

function onWipeAllData() {
  pendingWipeAction = "all";
  wipeDialogTitle.textContent = "Alles endgültig löschen?";
  wipeDialogText.textContent =
    "Wirklich alle Aufgaben, Archiv-Inhalte, Papierkorb-Inhalte und Bilder endgültig löschen? Wichtig, wenn kein Export erstellt wurde vor dem Löschen sind anschliessend sämtliche Aufgaben unwiederbringlich gelöscht.";
  wipeDialog.showModal();
}

function onWipeTrashData() {
  pendingWipeAction = "trash";
  wipeDialogTitle.textContent = "Papierkorb endgültig leeren?";
  wipeDialogText.textContent =
    "Wirklich sämtliche Inhalte aus dem Papierkorb endgültig löschen? Wichtig, wenn kein Export erstellt wurde vor dem Löschen sind anschliessend sämtliche Einträge unwiederbringlich gelöscht.";
  wipeDialog.showModal();
}

function confirmWipeAllData() {
  if (!pendingWipeAction) {
    wipeDialog.close();
    return;
  }

  if (pendingWipeAction === "all") {
    state.tasks = [];
    state.archiveTasks = [];
    state.trashTasks = [];
  } else if (pendingWipeAction === "trash") {
    state.trashTasks = [];
  }

  pendingWipeAction = null;
  saveData();
  renderApp();
  wipeDialog.close();
}

function sortTasks(tasks, key = "createdAt") {
  return [...tasks].sort((a, b) => (b[key] || 0) - (a[key] || 0));
}

function getPriorityRank(priority) {
  return Number.isFinite(PRIORITY_ORDER[priority]) ? PRIORITY_ORDER[priority] : PRIORITY_ORDER.medium;
}

function createPriorityBadge(priority) {
  const badge = document.createElement("span");
  badge.className = "priority-badge";
  badge.dataset.priority = PRIORITY_LABEL[priority] ? priority : "medium";
  badge.textContent = PRIORITY_LABEL[badge.dataset.priority];
  return badge;
}

function renderTagList(container, tags = []) {
  container.innerHTML = "";
  tags.forEach((tag) => {
    const tagEl = document.createElement("span");
    tagEl.className = "task-tag";
    tagEl.textContent = tag;
    container.appendChild(tagEl);
  });
}

function getChecklistProgress(task) {
  const items = Array.isArray(task.checklist) ? task.checklist : [];
  const total = items.length;
  const completed = items.filter((item) => item.done).length;
  return { total, completed };
}

function formatChecklistProgress(task) {
  const { total, completed } = getChecklistProgress(task);
  if (total === 0) return "Keine Unteraufgaben";
  return `${completed}/${total} erledigt`;
}

function parseDueTimestamp(value) {
  if (!value || typeof value !== "string") return null;

  const germanDateMatch = value.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (germanDateMatch) {
    const [, dayRaw, monthRaw, yearRaw] = germanDateMatch;
    const day = dayRaw.padStart(2, "0");
    const month = monthRaw.padStart(2, "0");
    const normalized = `${yearRaw}-${month}-${day}T00:00`;
    const timestamp = new Date(normalized).getTime();
    return Number.isNaN(timestamp) ? null : timestamp;
  }

  const normalized = value.includes("T") ? value : `${value}T00:00`;
  const timestamp = new Date(normalized).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
}

function isSameCalendarDay(left, right) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function getDueUrgency(task, nowTs = Date.now()) {
  const dueTs = parseDueTimestamp(task.dueDate);
  if (dueTs === null) return "none";

  if (dueTs < nowTs) return "overdue";

  const dueDate = new Date(dueTs);
  const now = new Date(nowTs);
  if (isSameCalendarDay(dueDate, now)) return "today";

  const diff = dueTs - nowTs;
  if (diff > 0 && diff < 24 * 60 * 60 * 1000) return "soon";
  return "none";
}

function formatDueValue(value) {
  const dueTs = parseDueTimestamp(value);
  if (dueTs === null) return null;
  const dueDate = new Date(dueTs);
  if (value.includes("T")) {
    const datePart = dueDate.toLocaleDateString("de-CH", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const timePart = dueDate.toLocaleTimeString("de-CH", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `${datePart}, ${timePart} Uhr`;
  }
  return dueDate.toLocaleDateString("de-CH");
}

function updateDueDatePreview() {
  if (!taskDueDatePreview) return;
  const formatted = formatDueValue(taskDueDateInput.value);
  taskDueDatePreview.textContent = formatted ? `Auswahl: ${formatted}` : "Format: 16.02.2026, 18:00 Uhr (15-Minuten-Schritte)";
}

function readRecurringFormValue() {
  if (!taskRecurringFrequencyInput || !taskRecurringIntervalInput) return null;
  const frequency = taskRecurringFrequencyInput.value;
  if (frequency === "none") return null;
  const intervalRaw = Number(taskRecurringIntervalInput.value);
  const interval = Number.isFinite(intervalRaw) && intervalRaw > 0 ? Math.floor(intervalRaw) : 1;
  return normalizeRecurring({ frequency, interval });
}

function formatRecurringPreview(recurring) {
  if (!recurring) return "Keine Wiederholung aktiv.";
  if (recurring.frequency === "after-completion") {
    return `Neue Aufgabe ${recurring.interval} Tag${recurring.interval === 1 ? "" : "e"} nach Erledigung.`;
  }
  return `${RECURRING_LABEL[recurring.frequency]} im Intervall ${recurring.interval}.`;
}

function updateRecurringPreview() {
  if (!taskRecurringPreview) return;
  taskRecurringPreview.textContent = formatRecurringPreview(readRecurringFormValue());
}

function applyRecurringFormValue(recurring) {
  const normalized = normalizeRecurring(recurring);
  if (!normalized) {
    taskRecurringFrequencyInput.value = "none";
    taskRecurringIntervalInput.value = "1";
    taskRecurringIntervalInput.disabled = true;
    updateRecurringPreview();
    return;
  }

  taskRecurringFrequencyInput.value = normalized.frequency;
  taskRecurringIntervalInput.value = String(normalized.interval);
  taskRecurringIntervalInput.disabled = false;
  updateRecurringPreview();
}

function onRecurringInputChange() {
  const frequency = taskRecurringFrequencyInput.value;
  taskRecurringIntervalInput.disabled = frequency === "none";
  if (taskRecurringIntervalInput.disabled) {
    taskRecurringIntervalInput.value = "1";
  } else if (!taskRecurringIntervalInput.value || Number(taskRecurringIntervalInput.value) < 1) {
    taskRecurringIntervalInput.value = "1";
  }
  updateRecurringPreview();
}

function updateTaskImagePreview() {
  const hasImage = Boolean(taskImageValue);
  taskImagePreviewWrap.classList.toggle("hidden", !hasImage);
  if (taskImageAdjustments) {
    taskImageAdjustments.classList.toggle("hidden", !hasImage);
    if (!hasImage) {
      taskImageAdjustments.open = false;
    }
  }
  if (hasImage) {
    taskImagePreview.src = taskImageValue;
    taskImagePreview.style.objectPosition = `${taskImagePosX}% ${taskImagePosY}%`;
  } else {
    taskImagePreview.removeAttribute("src");
    taskImagePreview.style.objectPosition = "50% 50%";
  }
}

function applyTaskImageValue(value) {
  taskImageValue = value || "";
  updateTaskImagePreview();
}

function applyTaskImagePosition(posX, posY) {
  taskImagePosX = Number.isFinite(posX) ? Math.min(100, Math.max(0, posX)) : 50;
  taskImagePosY = Number.isFinite(posY) ? Math.min(100, Math.max(0, posY)) : 50;
  taskImagePosXInput.value = String(Math.round(taskImagePosX));
  taskImagePosYInput.value = String(Math.round(taskImagePosY));
  updateTaskImagePreview();
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("Datei konnte nicht gelesen werden."));
    reader.readAsDataURL(file);
  });
}

function loadImageElement(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Bild konnte nicht geladen werden."));
    image.src = dataUrl;
  });
}

async function createTaskImageDataUrl(file) {
  const sourceDataUrl = await readFileAsDataUrl(file);
  if (!sourceDataUrl) return "";

  const image = await loadImageElement(sourceDataUrl);
  const largestSide = Math.max(image.width, image.height);
  const scale = largestSide > TASK_IMAGE_MAX_DIMENSION ? TASK_IMAGE_MAX_DIMENSION / largestSide : 1;
  const outputWidth = Math.max(1, Math.round(image.width * scale));
  const outputHeight = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;
  const context = canvas.getContext("2d");
  if (!context) return sourceDataUrl;

  context.drawImage(image, 0, 0, outputWidth, outputHeight);

  return canvas.toDataURL("image/jpeg", TASK_IMAGE_OUTPUT_QUALITY);
}

function toLocalDateTimeInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return year + "-" + month + "-" + day + "T" + hours + ":" + minutes;
}

function toDateTimeInputValue(value) {
  const dueTs = parseDueTimestamp(value);
  if (dueTs === null) return "";

  return toLocalDateTimeInputValue(new Date(dueTs));
}

function normalizeDueDateToStep(value) {
  if (!value) return "";
  const dueTs = parseDueTimestamp(value);
  if (dueTs === null) return value;
  const roundedTs = Math.round(dueTs / DUE_DATE_STEP_MS) * DUE_DATE_STEP_MS;
  return toLocalDateTimeInputValue(new Date(roundedTs));
}

function getNextQuarterHourValue(nowTs = Date.now()) {
  const nextStepTs = Math.ceil(nowTs / DUE_DATE_STEP_MS) * DUE_DATE_STEP_MS;
  return toLocalDateTimeInputValue(new Date(nextStepTs));
}

function initializeDueTimeOptions() {
  if (!taskDueDateHourInput) return;
  if (taskDueDateHourInput.options.length > 1) return;

  for (let hour = 0; hour < 24; hour += 1) {
    const value = String(hour).padStart(2, "0");
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    taskDueDateHourInput.appendChild(option);
  }
}

function syncDueDateInputFromControls() {
  const dateValue = taskDueDateDateInput.value;
  const hourValue = taskDueDateHourInput.value;
  const minuteValue = taskDueDateMinuteInput.value;

  if (!dateValue || !hourValue || !minuteValue) {
    taskDueDateInput.value = "";
    updateDueDatePreview();
    return;
  }

  taskDueDateInput.value = normalizeDueDateToStep(`${dateValue}T${hourValue}:${minuteValue}`);
  updateDueDatePreview();
}

function setDueDateControlsFromValue(value) {
  const normalized = normalizeDueDateToStep(value);
  if (!normalized) {
    taskDueDateDateInput.value = "";
    taskDueDateHourInput.value = "";
    taskDueDateMinuteInput.value = "00";
    taskDueDateInput.value = "";
    updateDueDatePreview();
    return;
  }

  const [datePart, timePart] = normalized.split("T");
  const [hourPart, minutePart] = (timePart || "").split(":");
  taskDueDateDateInput.value = datePart || "";
  taskDueDateHourInput.value = hourPart || "";
  taskDueDateMinuteInput.value = minutePart || "";
  taskDueDateInput.value = normalized;
  updateDueDatePreview();
}

function onDueDateControlChange(event) {
  syncDueDateInputFromControls();
  if (event && event.target === taskDueDateMinuteInput && taskDueDateMinuteInput.value) {
    taskDueDateMinuteInput.blur();
    taskStatusInput.focus();
  }
}

function setDueDateQuickValue(mode) {
  if (mode === "clear") {
    setDueDateControlsFromValue("");
    return;
  }

  const date = new Date();
  if (mode === "tomorrow") {
    date.setDate(date.getDate() + 1);
  } else if (mode === "next-week") {
    date.setDate(date.getDate() + 7);
  }

  const nextStepValue = getNextQuarterHourValue(date.getTime());
  setDueDateControlsFromValue(nextStepValue);
}

function onDueQuickButtonClick(event) {
  const button = event.currentTarget;
  if (!(button instanceof HTMLElement)) return;
  const mode = button.dataset.dueQuick;
  if (!mode) return;
  setDueDateQuickValue(mode);
}

function onTaskImageRemoveChange() {
  if (taskImageRemoveInput.checked) {
    applyTaskImageValue("");
    applyTaskImagePosition(50, 50);
    return;
  }

  applyTaskImagePosition(taskImageBaselinePosX, taskImageBaselinePosY);
  applyTaskImageValue(taskImageBaseline);
}

async function onTaskImageChange(event) {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) return;
  const [file] = input.files || [];
  if (!file) return;

  taskImageRemoveInput.checked = false;
  imageProcessingPromise = createTaskImageDataUrl(file)
    .then((dataUrl) => {
      taskImageBaseline = dataUrl;
      taskImageBaselinePosX = 50;
      taskImageBaselinePosY = 50;
      applyTaskImagePosition(50, 50);
      applyTaskImageValue(dataUrl);
    })
    .catch(() => {
      taskImageBaseline = "";
      applyTaskImageValue("");
      alert("Bild konnte nicht verarbeitet werden.");
    });

  await imageProcessingPromise;
  imageProcessingPromise = null;
}

function onTaskImagePositionChange() {
  applyTaskImagePosition(Number(taskImagePosXInput.value), Number(taskImagePosYInput.value));
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function addMonths(date, months) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function formatRecurringDueDate(task, dueDate) {
  if (!task.dueDate || task.dueDate.includes("T")) {
    return toLocalDateTimeInputValue(dueDate);
  }
  return toDateInputValueFromDate(dueDate);
}

function getNextRecurringDueDate(task, completedAt = Date.now()) {
  const recurring = normalizeRecurring(task.recurring);
  if (!recurring) return "";

  const hasDueDate = typeof task.dueDate === "string" && task.dueDate;
  const dueTs = hasDueDate ? parseDueTimestamp(task.dueDate) : null;
  const baseDate = new Date(dueTs ?? completedAt);
  let nextDate = new Date(baseDate);

  if (recurring.frequency === "daily") {
    nextDate = addDays(baseDate, recurring.interval);
  } else if (recurring.frequency === "weekly") {
    nextDate = addDays(baseDate, recurring.interval * 7);
  } else if (recurring.frequency === "monthly") {
    nextDate = addMonths(baseDate, recurring.interval);
  } else if (recurring.frequency === "after-completion") {
    nextDate = addDays(new Date(completedAt), recurring.interval);
  }

  return formatRecurringDueDate(task, nextDate);
}

function createRecurringFollowUpTask(task, completedAt = Date.now()) {
  const recurring = normalizeRecurring(task.recurring);
  if (!recurring) return null;

  const dueDate = getNextRecurringDueDate(task, completedAt);
  return {
    id: crypto.randomUUID(),
    title: task.title,
    description: task.description,
    priority: task.priority,
    tags: normalizeTags(task.tags),
    dueDate,
    image: task.image,
    imagePosX: task.imagePosX,
    imagePosY: task.imagePosY,
    checklist: normalizeChecklist(task.checklist).map((item) => ({ ...item, done: false })),
    status: "backlog",
    createdAt: Date.now(),
    completedAt: null,
    recurring,
    reminderAt: "",
    reminderDismissedAt: null,
  };
}

function handleRecurringCompletion(task, previousStatus, nextStatus) {
  const completedAt = syncCompletedAt(task, nextStatus);
  const shouldCreateFollowUp = previousStatus !== "done" && nextStatus === "done";
  return {
    completedAt,
    followUpTask: shouldCreateFollowUp ? createRecurringFollowUpTask(task, completedAt || Date.now()) : null,
  };
}

function createEmptyChecklistItem() {
  return {
    id: crypto.randomUUID(),
    text: "",
    done: false,
  };
}

function moveChecklistItem(sourceId, targetId, placeAfter = false) {
  const fromIndex = draftChecklist.findIndex((item) => item.id === sourceId);
  const targetIndex = draftChecklist.findIndex((item) => item.id === targetId);
  if (fromIndex === -1 || targetIndex === -1 || fromIndex === targetIndex) return;

  const [movedItem] = draftChecklist.splice(fromIndex, 1);
  let insertAt = targetIndex;
  if (fromIndex < targetIndex) {
    insertAt -= 1;
  }
  if (placeAfter) {
    insertAt += 1;
  }
  draftChecklist.splice(insertAt, 0, movedItem);
}

function clearChecklistDragState() {
  checklistEditorList.querySelectorAll(".checklist-editor-item").forEach((item) => {
    item.classList.remove("is-dragging");
    item.classList.remove("is-drop-target");
  });
}

function onChecklistItemDrop(event, targetItemId) {
  event.preventDefault();
  const sourceId = checklistDraggingItemId || event.dataTransfer?.getData("text/plain");
  if (!sourceId || sourceId === targetItemId) return;

  const targetElement = event.currentTarget;
  let placeAfter = false;
  if (targetElement instanceof HTMLElement) {
    const rect = targetElement.getBoundingClientRect();
    placeAfter = event.clientY > rect.top + rect.height / 2;
  }

  moveChecklistItem(sourceId, targetItemId, placeAfter);
  clearChecklistDragState();
  checklistDraggingItemId = null;
  renderChecklistEditor();
}

function finalizeChecklistItem(itemId, value) {
  const index = draftChecklist.findIndex((item) => item.id === itemId);
  if (index === -1) return;
  const text = value.trim();
  if (!text) {
    draftChecklist.splice(index, 1);
    if (checklistEditingItemId === itemId) {
      checklistEditingItemId = null;
    }
    renderChecklistEditor();
    return;
  }

  draftChecklist[index].text = text;
  if (checklistEditingItemId === itemId) {
    checklistEditingItemId = null;
  }
  renderChecklistEditor();
}

function renderChecklistEditor() {
  checklistEditorList.innerHTML = "";

  if (draftChecklist.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "checklist-editor-empty";
    emptyItem.textContent = "Keine Unteraufgaben erfasst.";
    checklistEditorList.appendChild(emptyItem);
    return;
  }

  draftChecklist.forEach((item) => {
    const li = document.createElement("li");
    li.className = "checklist-editor-item";
    li.dataset.itemId = item.id;
    li.draggable = false;
    li.addEventListener("dragover", (event) => {
      event.preventDefault();
      if (checklistDraggingItemId === item.id) return;
      li.classList.add("is-drop-target");
    });
    li.addEventListener("dragleave", () => {
      li.classList.remove("is-drop-target");
    });
    li.addEventListener("drop", (event) => onChecklistItemDrop(event, item.id));

    const handle = document.createElement("button");
    handle.type = "button";
    handle.className = "checklist-drag-handle";
    handle.setAttribute("aria-label", "Eintrag verschieben");
    handle.title = "Eintrag verschieben";
    handle.textContent = "⋮⋮";
    handle.draggable = true;
    handle.addEventListener("dragstart", (event) => {
      checklistDraggingItemId = item.id;
      li.classList.add("is-dragging");
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", item.id);
      }
    });
    handle.addEventListener("dragend", () => {
      checklistDraggingItemId = null;
      clearChecklistDragState();
    });

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.done;
    checkbox.addEventListener("change", () => {
      item.done = checkbox.checked;
    });

    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.maxLength = 160;
    textInput.value = item.text;
    textInput.addEventListener("input", () => {
      item.text = textInput.value;
    });
    textInput.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      finalizeChecklistItem(item.id, textInput.value);
    });
    textInput.addEventListener("blur", () => {
      if (checklistEditingItemId !== item.id) return;
      finalizeChecklistItem(item.id, textInput.value);
    });

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "checklist-remove-btn";
    removeButton.textContent = "x";
    removeButton.setAttribute("aria-label", "Eintrag entfernen");
    removeButton.title = "Eintrag entfernen";
    removeButton.addEventListener("click", () => {
      draftChecklist = draftChecklist.filter((entry) => entry.id !== item.id);
      if (checklistEditingItemId === item.id) {
        checklistEditingItemId = null;
      }
      renderChecklistEditor();
    });

    li.appendChild(handle);
    li.appendChild(checkbox);
    li.appendChild(textInput);
    li.appendChild(removeButton);
    checklistEditorList.appendChild(li);

    if (checklistEditingItemId === item.id) {
      requestAnimationFrame(() => {
        textInput.focus();
        const length = textInput.value.length;
        textInput.setSelectionRange(length, length);
      });
    }
  });
}

function addChecklistItem(initialText = "") {
  const newItem = createEmptyChecklistItem();
  newItem.text = initialText.trim();
  draftChecklist.push(newItem);
  checklistEditingItemId = newItem.id;
  renderChecklistEditor();
}

function onChecklistQuickAdd() {
  if (!(checklistQuickInput instanceof HTMLInputElement)) return;
  const value = checklistQuickInput.value.trim();
  if (!value) {
    addChecklistItem();
    return;
  }

  addChecklistItem(value);
  checklistQuickInput.value = "";
}

function getDraftChecklistForSave() {
  const items = draftChecklist.map((item) => ({
    id: item.id,
    text: typeof item.text === "string" ? item.text.trim() : "",
    done: Boolean(item.done),
  }));
  return items.filter((item) => item.text);
}

function resetDueDateControls() {
  setDueDateControlsFromValue(getNextQuarterHourValue());
}


function sortListTasks(tasks) {
  const items = [...tasks];
  const compareDue = (a, b, descending) => {
    const aDue = parseDueTimestamp(a.dueDate);
    const bDue = parseDueTimestamp(b.dueDate);
    if (aDue === null && bDue === null) return 0;
    if (aDue === null) return 1;
    if (bDue === null) return -1;
    return descending ? bDue - aDue : aDue - bDue;
  };

  switch (state.listSort) {
    case "title-asc":
      return items.sort(
        (a, b) =>
          titleCollator.compare(a.title || "", b.title || "") || (b.createdAt || 0) - (a.createdAt || 0)
      );
    case "title-desc":
      return items.sort(
        (a, b) =>
          titleCollator.compare(b.title || "", a.title || "") || (b.createdAt || 0) - (a.createdAt || 0)
      );
    case "created-asc":
      return items.sort(
        (a, b) => (a.createdAt || 0) - (b.createdAt || 0) || titleCollator.compare(a.title || "", b.title || "")
      );
    case "due-asc":
      return items.sort(
        (a, b) => compareDue(a, b, false) || (b.createdAt || 0) - (a.createdAt || 0)
      );
    case "due-desc":
      return items.sort(
        (a, b) => compareDue(a, b, true) || (b.createdAt || 0) - (a.createdAt || 0)
      );
    case "created-desc":
    default:
      return items.sort((a, b) => {
        const createdDiff = (b.createdAt || 0) - (a.createdAt || 0);
        if (createdDiff !== 0) return createdDiff;
        const priorityDiff = getPriorityRank(a.priority) - getPriorityRank(b.priority);
        if (priorityDiff !== 0) return priorityDiff;
        return titleCollator.compare(a.title || "", b.title || "");
      });
  }
}

function updateListSortUI() {
  const titleDirection = state.listSort === "title-asc" ? "asc" : state.listSort === "title-desc" ? "desc" : "none";
  const dueDirection = state.listSort === "due-asc" ? "asc" : state.listSort === "due-desc" ? "desc" : "none";
  const createdDirection =
    state.listSort === "created-asc" ? "asc" : state.listSort === "created-desc" ? "desc" : "none";

  sortTitleBtn.dataset.sort = titleDirection;
  sortDueBtn.dataset.sort = dueDirection;
  sortCreatedBtn.dataset.sort = createdDirection;

  listTitleHeader.setAttribute("aria-sort", titleDirection === "asc" ? "ascending" : titleDirection === "desc" ? "descending" : "none");
  listDueHeader.setAttribute("aria-sort", dueDirection === "asc" ? "ascending" : dueDirection === "desc" ? "descending" : "none");
  listCreatedHeader.setAttribute(
    "aria-sort",
    createdDirection === "asc" ? "ascending" : createdDirection === "desc" ? "descending" : "none"
  );
}

function updateStatusFilterUI() {
  const selectedCount = Object.values(state.listStatusFilter).filter(Boolean).length;
  const allSelected = selectedCount === Object.keys(state.listStatusFilter).length;
  statusFilterBtn.classList.toggle("is-active", !allSelected);

  statusFilterCheckboxes.forEach((checkbox) => {
    const status = checkbox.dataset.status;
    checkbox.checked = Boolean(status && state.listStatusFilter[status]);
  });
}

function toggleStatusFilterMenu(forceOpen) {
  const shouldOpen = typeof forceOpen === "boolean" ? forceOpen : statusFilterMenu.classList.contains("hidden");
  statusFilterMenu.classList.toggle("hidden", !shouldOpen);
  statusFilterBtn.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
}

function getListStatusFilteredTasks(tasks) {
  return tasks.filter((task) => state.listStatusFilter[task.status] !== false);
}

function formatDueDate(value) {
  const formatted = formatDueValue(value);
  return formatted ? `Bis: ${formatted}` : "Bis: offen";
}

function formatDateOnly(value) {
  return formatDueValue(value) || "-";
}

function formatTimestamp(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("de-CH");
}

function toStartOfDay(value) {
  if (!value) return null;
  const date = new Date(value + "T00:00:00");
  if (Number.isNaN(date.getTime())) return null;
  return date.getTime();
}

function toEndOfDay(value) {
  if (!value) return null;
  const date = new Date(value + "T23:59:59.999");
  if (Number.isNaN(date.getTime())) return null;
  return date.getTime();
}

function getTodayDateInputValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getStartOfLocalDay(timestamp) {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function toDateInputValueFromDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getNextWeekRange() {
  const now = new Date();
  const currentDay = now.getDay();
  const daysUntilNextMonday = ((8 - currentDay) % 7) || 7;
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() + daysUntilNextMonday);
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  return {
    from: toDateInputValueFromDate(monday),
    to: toDateInputValueFromDate(sunday),
  };
}

function getFilteredTasks() {
  if (state.filterType === "today-due") {
    const todayStart = getStartOfLocalDay(Date.now());
    const tomorrowStart = todayStart + 24 * 60 * 60 * 1000;
    return state.tasks.filter((task) => {
      if (task.status === "done") return false;
      const dueTs = parseDueTimestamp(task.dueDate);
      if (dueTs === null) return false;
      return dueTs >= todayStart && dueTs < tomorrowStart;
    });
  }

  if (state.filterType === "tomorrow") {
    const todayStart = getStartOfLocalDay(Date.now());
    const tomorrowStart = todayStart + 24 * 60 * 60 * 1000;
    const dayAfterTomorrowStart = tomorrowStart + 24 * 60 * 60 * 1000;
    return state.tasks.filter((task) => {
      if (task.status === "done") return false;
      const dueTs = parseDueTimestamp(task.dueDate);
      if (dueTs === null) return false;
      return dueTs >= tomorrowStart && dueTs < dayAfterTomorrowStart;
    });
  }

  if (state.filterType === "next-week") {
    const now = new Date();
    const currentDay = now.getDay();
    const daysUntilNextMonday = ((8 - currentDay) % 7) || 7;
    const nextWeekStart = new Date(now);
    nextWeekStart.setHours(0, 0, 0, 0);
    nextWeekStart.setDate(nextWeekStart.getDate() + daysUntilNextMonday);
    const nextWeekStartTs = nextWeekStart.getTime();
    const weekAfterStartTs = nextWeekStartTs + 7 * 24 * 60 * 60 * 1000;

    return state.tasks.filter((task) => {
      if (task.status === "done") return false;
      const dueTs = parseDueTimestamp(task.dueDate);
      if (dueTs === null) return false;
      return dueTs >= nextWeekStartTs && dueTs < weekAfterStartTs;
    });
  }

  if (state.filterType === "overdue") {
    const nowTs = Date.now();
    return state.tasks.filter((task) => {
      if (task.status === "done") return false;
      const dueTs = parseDueTimestamp(task.dueDate);
      if (dueTs === null) return false;
      return dueTs < nowTs;
    });
  }

  const hasDateRange = Boolean(state.dateFrom || state.dateTo);
  if (state.filterType === "none" || !hasDateRange) {
    return state.tasks;
  }

  const from = toStartOfDay(state.dateFrom);
  const to = toEndOfDay(state.dateTo);

  return state.tasks.filter((task) => {
    let referenceDate = null;
    if (state.filterType === "created") {
      referenceDate = task.createdAt;
    } else if (state.filterType === "due") {
      referenceDate = parseDueTimestamp(task.dueDate);
    } else if (state.filterType === "completed") {
      referenceDate = task.completedAt;
    }

    if (!referenceDate) return false;
    if (from && referenceDate < from) return false;
    if (to && referenceDate > to) return false;
    return true;
  });
}

function taskMatchesSearch(task, query) {
  if (!query) return true;
  const title = typeof task.title === "string" ? task.title : "";
  const description = typeof task.description === "string" ? task.description : "";
  const tagText = Array.isArray(task.tags) ? task.tags.join(" ") : "";
  const checklistText = Array.isArray(task.checklist)
    ? task.checklist
        .map((item) => (item && typeof item.text === "string" ? item.text : ""))
        .join(" ")
    : "";
  const haystack = `${title} ${description} ${tagText} ${checklistText}`.toLocaleLowerCase("de-CH");
  return haystack.includes(query);
}

function applySearchFilter(tasks) {
  const query = state.searchQuery.trim().toLocaleLowerCase("de-CH");
  if (!query) return tasks;
  return tasks.filter((task) => taskMatchesSearch(task, query));
}

function clearDragHighlights() {
  Object.values(dropzones).forEach((zone) => zone.classList.remove("drag-over"));
}

function syncCompletedAt(task, nextStatus) {
  if (nextStatus === "done") {
    return task.completedAt || Date.now();
  }
  return null;
}

function createTaskCard(task) {
  const card = taskTemplate.content.firstElementChild.cloneNode(true);
  card.dataset.taskId = task.id;
  const dueUrgency = getDueUrgency(task);
  const isDone = task.status === "done";
  card.classList.toggle("done-task", isDone);
  card.classList.toggle("due-overdue", !isDone && dueUrgency === "overdue");
  card.classList.toggle("due-soon", !isDone && dueUrgency === "soon");
  card.classList.toggle("due-today", !isDone && dueUrgency === "today");

  const imageWrap = card.querySelector(".task-image-wrap");
  const imageEl = card.querySelector(".task-image");
  const hasImage = Boolean(task.image);
  imageWrap.classList.toggle("hidden", !hasImage);
  if (hasImage) {
    imageEl.src = task.image;
    imageEl.style.objectPosition = `${task.imagePosX}% ${task.imagePosY}%`;
  } else {
    imageEl.removeAttribute("src");
    imageEl.style.objectPosition = "50% 50%";
  }

  const priorityBadge = card.querySelector(".task-priority-badge");
  priorityBadge.replaceWith(createPriorityBadge(task.priority));

  const tagList = card.querySelector(".task-tag-list");
  renderTagList(tagList, task.tags);

  card.querySelector(".task-title").textContent = task.title;
  card.querySelector(".task-description").textContent = task.description || "Keine Beschreibung";
  card.querySelector(".task-checklist-progress").textContent = formatChecklistProgress(task);
  const checklistList = card.querySelector(".task-checklist");
  checklistList.innerHTML = "";
  (task.checklist || []).forEach((item) => {
    const li = document.createElement("li");
    li.className = "task-checklist-item";
    li.classList.toggle("is-done", item.done);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = Boolean(item.done);
    checkbox.addEventListener("change", () => {
      const currentTask = state.tasks.find((entry) => entry.id === task.id);
      if (!currentTask || !Array.isArray(currentTask.checklist)) return;
      const checklistItem = currentTask.checklist.find((entry) => entry.id === item.id);
      if (!checklistItem) return;
      checklistItem.done = checkbox.checked;
      saveData();
      renderApp();
    });

    const text = document.createElement("span");
    text.textContent = item.text;

    li.appendChild(checkbox);
    li.appendChild(text);
    checklistList.appendChild(li);
  });

  card.querySelector(".task-due-date").textContent = formatDueDate(task.dueDate);

  card.querySelector(".edit-btn").addEventListener("click", () => openEditDialog(task.id));
  card.querySelector(".duplicate-btn").addEventListener("click", () => duplicateTask(task.id));
  card.querySelector(".archive-btn").addEventListener("click", () => archiveTask(task.id));
  card.querySelector(".delete-btn").addEventListener("click", () => moveTaskToTrash(task.id));

  card.addEventListener("dblclick", (event) => {
    const target = event.target;
    if (target instanceof Element && target.closest("button")) return;
    openEditDialog(task.id);
  });

  card.addEventListener("dragstart", () => {
    state.draggingTaskId = task.id;
    card.classList.add("dragging");
  });

  card.addEventListener("dragend", () => {
    state.draggingTaskId = null;
    card.classList.remove("dragging");
    clearDragHighlights();
  });

  return card;
}

function renderColumn(status, sourceTasks) {
  const zone = dropzones[status];
  zone.innerHTML = "";

  const tasks = sortTasks(sourceTasks.filter((task) => task.status === status));

  if (tasks.length === 0) {
    const placeholder = document.createElement("div");
    placeholder.className = "empty-placeholder";
    placeholder.textContent = "Keine Aufgaben";
    zone.appendChild(placeholder);
  } else {
    tasks.forEach((task) => zone.appendChild(createTaskCard(task)));
  }

  const countEl = document.getElementById(`count-${status}`);
  countEl.textContent = String(tasks.length);
}

function renderBoard(sourceTasks) {
  renderColumn("backlog", sourceTasks);
  renderColumn("todo", sourceTasks);
  renderColumn("done", sourceTasks);
}

function renderDashboardSection(container, countEl, tasks, emptyText) {
  container.innerHTML = "";
  countEl.textContent = String(tasks.length);
  const displayTasks = tasks.slice(0, 6);

  if (displayTasks.length === 0) {
    const placeholder = document.createElement("div");
    placeholder.className = "empty-placeholder";
    placeholder.textContent = emptyText;
    container.appendChild(placeholder);
    return;
  }

  displayTasks.forEach((task) => {
    container.appendChild(createTaskCard(task));
  });
}

function renderDashboard() {
  const nowTs = Date.now();
  const todayStart = getStartOfLocalDay(nowTs);
  const tomorrowStart = todayStart + 24 * 60 * 60 * 1000;
  const weekEndExclusive = tomorrowStart + 7 * 24 * 60 * 60 * 1000;

  const activeTasks = state.tasks.filter((task) => task.status !== "done");
  const todayTasks = activeTasks
    .filter((task) => {
      const dueTs = parseDueTimestamp(task.dueDate);
      return dueTs !== null && dueTs >= todayStart && dueTs < tomorrowStart;
    })
    .sort((a, b) => getPriorityRank(a.priority) - getPriorityRank(b.priority) || (parseDueTimestamp(a.dueDate) || 0) - (parseDueTimestamp(b.dueDate) || 0));
  const overdueTasks = activeTasks
    .filter((task) => {
      const dueTs = parseDueTimestamp(task.dueDate);
      return dueTs !== null && dueTs < nowTs;
    })
    .sort((a, b) => (parseDueTimestamp(a.dueDate) || 0) - (parseDueTimestamp(b.dueDate) || 0));
  const weekTasks = activeTasks
    .filter((task) => {
      const dueTs = parseDueTimestamp(task.dueDate);
      return dueTs !== null && dueTs >= tomorrowStart && dueTs < weekEndExclusive;
    })
    .sort((a, b) => (parseDueTimestamp(a.dueDate) || 0) - (parseDueTimestamp(b.dueDate) || 0));
  const doneTasks = [...state.tasks]
    .filter((task) => task.status === "done" && task.completedAt)
    .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));

  renderDashboardSection(dashboardTodayList, dashboardTodayCount, applySearchFilter(todayTasks), "Heute steht nichts an.");
  renderDashboardSection(dashboardOverdueList, dashboardOverdueCount, applySearchFilter(overdueTasks), "Nichts ist überfällig.");
  renderDashboardSection(dashboardWeekList, dashboardWeekCount, applySearchFilter(weekTasks), "Für diese Woche ist nichts geplant.");
  renderDashboardSection(dashboardDoneList, dashboardDoneCount, applySearchFilter(doneTasks), "Noch nichts erledigt.");
}

function renderList(sourceTasks) {
  const tasks = sortListTasks(getListStatusFilteredTasks(sourceTasks));
  updateListSortUI();
  updateStatusFilterUI();
  listTableBody.innerHTML = "";

  if (tasks.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 10;
    cell.className = "list-empty";
    cell.textContent = "Keine Aufgaben für den aktuellen Filter.";
    row.appendChild(cell);
    listTableBody.appendChild(row);
    return;
  }

  tasks.forEach((task) => {
    const row = document.createElement("tr");
    const dueUrgency = getDueUrgency(task);
    const isDone = task.status === "done";
    row.classList.toggle("done-row", isDone);
    row.classList.toggle("due-overdue-row", !isDone && dueUrgency === "overdue");
    row.classList.toggle("due-soon-row", !isDone && dueUrgency === "soon");
    row.classList.toggle("due-today-row", !isDone && dueUrgency === "today");
    row.addEventListener("dblclick", (event) => {
      const target = event.target;
      if (target instanceof Element && target.closest("button")) return;
      openEditDialog(task.id);
    });

    const titleCell = document.createElement("td");
    titleCell.className = "list-title-cell";
    const titleMain = document.createElement("div");
    titleMain.className = "list-title-main";
    titleMain.textContent = task.title;
    const metaRow = document.createElement("div");
    metaRow.className = "list-meta-row";
    metaRow.appendChild(createPriorityBadge(task.priority));
    renderTagList(metaRow, task.tags);
    titleCell.appendChild(titleMain);
    titleCell.appendChild(metaRow);
    row.appendChild(titleCell);

    const priorityCell = document.createElement("td");
    priorityCell.textContent = PRIORITY_LABEL[task.priority] || PRIORITY_LABEL.medium;
    row.appendChild(priorityCell);

    const tagsCell = document.createElement("td");
    tagsCell.textContent = Array.isArray(task.tags) && task.tags.length > 0 ? task.tags.join(", ") : "-";
    row.appendChild(tagsCell);

    const descriptionCell = document.createElement("td");
    descriptionCell.textContent = task.description || "-";
    row.appendChild(descriptionCell);

    const statusCell = document.createElement("td");
    statusCell.textContent = STATUS_LABEL[task.status] || task.status;
    row.appendChild(statusCell);

    const dueCell = document.createElement("td");
    dueCell.textContent = formatDateOnly(task.dueDate);
    row.appendChild(dueCell);

    const createdCell = document.createElement("td");
    createdCell.textContent = formatTimestamp(task.createdAt);
    row.appendChild(createdCell);

    const completedCell = document.createElement("td");
    completedCell.textContent = formatTimestamp(task.completedAt);
    row.appendChild(completedCell);

    const progressCell = document.createElement("td");
    progressCell.className = "list-progress-cell";
    progressCell.textContent = formatChecklistProgress(task);
    row.appendChild(progressCell);

    const actionsCell = document.createElement("td");
    const actions = document.createElement("div");
    actions.className = "row-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "edit-btn";
    editButton.dataset.taskId = task.id;
    editButton.textContent = "Bearbeiten";

    const duplicateButton = document.createElement("button");
    duplicateButton.type = "button";
    duplicateButton.className = "duplicate-btn";
    duplicateButton.dataset.taskId = task.id;
    duplicateButton.textContent = "Duplizieren";

    const archiveButton = document.createElement("button");
    archiveButton.type = "button";
    archiveButton.className = "archive-btn";
    archiveButton.dataset.taskId = task.id;
    archiveButton.textContent = "Archivieren";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn danger-btn";
    deleteButton.dataset.taskId = task.id;
    deleteButton.textContent = "Löschen";

    actions.appendChild(editButton);
    actions.appendChild(duplicateButton);
    actions.appendChild(archiveButton);
    actions.appendChild(deleteButton);
    actionsCell.appendChild(actions);
    row.appendChild(actionsCell);

    listTableBody.appendChild(row);
  });
}

function renderTrash() {
  const tasks = sortTasks(applySearchFilter(state.trashTasks), "deletedAt");
  trashTableBody.innerHTML = "";

  if (tasks.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 4;
    cell.className = "list-empty";
    cell.textContent = "Papierkorb ist leer.";
    row.appendChild(cell);
    trashTableBody.appendChild(row);
    return;
  }

  tasks.forEach((task) => {
    const row = document.createElement("tr");

    const titleCell = document.createElement("td");
    titleCell.textContent = task.title;
    row.appendChild(titleCell);

    const statusCell = document.createElement("td");
    statusCell.textContent = STATUS_LABEL[task.status] || task.status;
    row.appendChild(statusCell);

    const deletedCell = document.createElement("td");
    deletedCell.textContent = formatTimestamp(task.deletedAt);
    row.appendChild(deletedCell);

    const actionsCell = document.createElement("td");
    const actions = document.createElement("div");
    actions.className = "row-actions";

    const restoreButton = document.createElement("button");
    restoreButton.type = "button";
    restoreButton.className = "restore-btn";
    restoreButton.dataset.taskId = task.id;
    restoreButton.textContent = "Wiederherstellen";

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "destroy-btn danger-btn";
    removeButton.dataset.taskId = task.id;
    removeButton.textContent = "Endgültig löschen";

    actions.appendChild(restoreButton);
    actions.appendChild(removeButton);
    actionsCell.appendChild(actions);
    row.appendChild(actionsCell);

    trashTableBody.appendChild(row);
  });
}

function renderArchive() {
  const tasks = sortTasks(applySearchFilter(state.archiveTasks), "archivedAt");
  archiveTableBody.innerHTML = "";

  if (tasks.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 6;
    cell.className = "list-empty";
    cell.textContent = "Archiv ist leer.";
    row.appendChild(cell);
    archiveTableBody.appendChild(row);
    return;
  }

  tasks.forEach((task) => {
    const row = document.createElement("tr");

    const titleCell = document.createElement("td");
    titleCell.textContent = task.title;
    row.appendChild(titleCell);

    const priorityCell = document.createElement("td");
    priorityCell.textContent = PRIORITY_LABEL[task.priority] || PRIORITY_LABEL.medium;
    row.appendChild(priorityCell);

    const tagsCell = document.createElement("td");
    tagsCell.textContent = Array.isArray(task.tags) && task.tags.length > 0 ? task.tags.join(", ") : "-";
    row.appendChild(tagsCell);

    const statusCell = document.createElement("td");
    statusCell.textContent = STATUS_LABEL[task.status] || task.status;
    row.appendChild(statusCell);

    const archivedCell = document.createElement("td");
    archivedCell.textContent = formatTimestamp(task.archivedAt);
    row.appendChild(archivedCell);

    const actionsCell = document.createElement("td");
    const actions = document.createElement("div");
    actions.className = "row-actions";

    const restoreButton = document.createElement("button");
    restoreButton.type = "button";
    restoreButton.className = "restore-archive-btn";
    restoreButton.dataset.taskId = task.id;
    restoreButton.textContent = "Wiederherstellen";

    const trashButton = document.createElement("button");
    trashButton.type = "button";
    trashButton.className = "archive-delete-btn danger-btn";
    trashButton.dataset.taskId = task.id;
    trashButton.textContent = "In Papierkorb";

    actions.appendChild(restoreButton);
    actions.appendChild(trashButton);
    actionsCell.appendChild(actions);
    row.appendChild(actionsCell);

    archiveTableBody.appendChild(row);
  });
}

function renderApp() {
  const filteredTasks = applySearchFilter(getFilteredTasks());
  renderDashboard();
  renderBoard(filteredTasks);
  renderList(filteredTasks);
  renderArchive();
  renderTrash();
  updateViewUI();
}

function updateViewUI() {
  const isDashboard = state.view === "dashboard";
  const isKanban = state.view === "kanban";
  const isList = state.view === "list";
  const isArchive = state.view === "archive";
  const isTrash = state.view === "trash";

  dashboardView.classList.toggle("hidden", !isDashboard);
  kanbanView.classList.toggle("hidden", !isKanban);
  listView.classList.toggle("hidden", !isList);
  archiveView.classList.toggle("hidden", !isArchive);
  trashView.classList.toggle("hidden", !isTrash);

  dashboardViewBtn.classList.toggle("is-active", isDashboard);
  kanbanViewBtn.classList.toggle("is-active", isKanban);
  listViewBtn.classList.toggle("is-active", isList);
  archiveViewBtn.classList.toggle("is-active", isArchive);
  trashViewBtn.classList.toggle("is-active", isTrash);
}

function resetForm() {
  taskIdInput.value = "";
  taskTitleInput.value = "";
  taskDescriptionInput.value = "";
  taskPriorityInput.value = "medium";
  taskTagsInput.value = "";
  applyRecurringFormValue(null);
  resetDueDateControls();
  taskStatusInput.value = "backlog";
  taskImageInput.value = "";
  taskImageRemoveInput.checked = false;
  taskImageBaseline = "";
  taskImageBaselinePosX = 50;
  taskImageBaselinePosY = 50;
  applyTaskImagePosition(50, 50);
  applyTaskImageValue("");
  if (taskImageAdjustments) {
    taskImageAdjustments.open = false;
  }
  draftChecklist = [];
  checklistEditingItemId = null;
  if (checklistQuickInput) {
    checklistQuickInput.value = "";
  }
  renderChecklistEditor();
  updateDueDatePreview();
}

function openNewDialog() {
  resetForm();
  dialogTitle.textContent = "Aufgabe erfassen";
  dialog.showModal();
  requestAnimationFrame(() => taskTitleInput.focus());
}

function openEditDialog(taskId) {
  const task = state.tasks.find((entry) => entry.id === taskId);
  if (!task) return;

  taskIdInput.value = task.id;
  taskTitleInput.value = task.title;
  taskDescriptionInput.value = task.description || "";
  taskPriorityInput.value = task.priority || "medium";
  taskTagsInput.value = Array.isArray(task.tags) ? task.tags.join(", ") : "";
  applyRecurringFormValue(task.recurring);
  setDueDateControlsFromValue(toDateTimeInputValue(task.dueDate));
  taskStatusInput.value = task.status;
  taskImageInput.value = "";
  taskImageRemoveInput.checked = false;
  taskImageBaseline = task.image || "";
  taskImageBaselinePosX = Number.isFinite(task.imagePosX) ? task.imagePosX : 50;
  taskImageBaselinePosY = Number.isFinite(task.imagePosY) ? task.imagePosY : 50;
  applyTaskImagePosition(taskImageBaselinePosX, taskImageBaselinePosY);
  applyTaskImageValue(task.image || "");
  draftChecklist = normalizeChecklist(task.checklist);
  checklistEditingItemId = null;
  if (checklistQuickInput) {
    checklistQuickInput.value = "";
  }
  renderChecklistEditor();
  updateDueDatePreview();
  dialogTitle.textContent = "Aufgabe bearbeiten";
  dialog.showModal();
  requestAnimationFrame(() => taskTitleInput.focus());
}

function upsertTask(data) {
  if (data.id) {
    const index = state.tasks.findIndex((task) => task.id === data.id);
    if (index !== -1) {
      const current = state.tasks[index];
      const nextStatus = data.status;
      const transition = handleRecurringCompletion(current, current.status, nextStatus);

      state.tasks[index] = {
        ...current,
        ...data,
        createdAt: current.createdAt,
        completedAt: transition.completedAt,
      };
      if (transition.followUpTask) {
        state.tasks.push(transition.followUpTask);
      }
      return;
    }
  }

  const createdAt = Date.now();
  state.tasks.push({
    id: crypto.randomUUID(),
    title: data.title,
    description: data.description,
    priority: data.priority,
    tags: data.tags,
    dueDate: data.dueDate,
    image: data.image,
    imagePosX: data.imagePosX,
    imagePosY: data.imagePosY,
    checklist: data.checklist,
    status: data.status,
    createdAt,
    completedAt: data.status === "done" ? createdAt : null,
    archivedAt: null,
    recurring: data.recurring,
    reminderAt: "",
    reminderDismissedAt: null,
  });
}

function archiveTask(taskId) {
  const index = state.tasks.findIndex((task) => task.id === taskId);
  if (index === -1) return;

  const [task] = state.tasks.splice(index, 1);
  state.archiveTasks.push({
    ...task,
    archivedAt: Date.now(),
  });

  saveData();
  renderApp();
}

function moveTaskToTrash(taskId) {
  const index = state.tasks.findIndex((task) => task.id === taskId);
  if (index === -1) return;

  const [task] = state.tasks.splice(index, 1);
  state.trashTasks.push({
    ...task,
    deletedAt: Date.now(),
  });

  saveData();
  renderApp();
}

function moveArchivedTaskToTrash(taskId) {
  const index = state.archiveTasks.findIndex((task) => task.id === taskId);
  if (index === -1) return;

  const [task] = state.archiveTasks.splice(index, 1);
  const trashTask = { ...task };
  delete trashTask.archivedAt;
  state.trashTasks.push({
    ...trashTask,
    deletedAt: Date.now(),
  });

  saveData();
  renderApp();
}

function restoreTaskFromArchive(taskId) {
  const index = state.archiveTasks.findIndex((task) => task.id === taskId);
  if (index === -1) return;

  const [task] = state.archiveTasks.splice(index, 1);
  const restoredTask = { ...task };
  delete restoredTask.archivedAt;
  state.tasks.push(restoredTask);

  saveData();
  renderApp();
}

function restoreTaskFromTrash(taskId) {
  const index = state.trashTasks.findIndex((task) => task.id === taskId);
  if (index === -1) return;

  const [task] = state.trashTasks.splice(index, 1);
  const restoredTask = { ...task };
  delete restoredTask.deletedAt;
  state.tasks.push(restoredTask);

  saveData();
  renderApp();
}

function permanentlyDeleteTask(taskId) {
  state.trashTasks = state.trashTasks.filter((task) => task.id !== taskId);
  saveData();
  renderApp();
}

function duplicateTask(taskId) {
  const sourceTask = state.tasks.find((task) => task.id === taskId);
  if (!sourceTask) return;

  const timestamp = Date.now();
  state.tasks.push({
    id: crypto.randomUUID(),
    title: `${sourceTask.title} (Kopie)`,
    description: sourceTask.description,
    priority: sourceTask.priority,
    tags: normalizeTags(sourceTask.tags),
    dueDate: sourceTask.dueDate,
    image: sourceTask.image,
    imagePosX: sourceTask.imagePosX,
    imagePosY: sourceTask.imagePosY,
    checklist: normalizeChecklist(sourceTask.checklist),
    status: sourceTask.status,
    createdAt: timestamp,
    completedAt: sourceTask.status === "done" ? timestamp : null,
    archivedAt: null,
    recurring: normalizeRecurring(sourceTask.recurring),
    reminderAt: sourceTask.reminderAt || "",
    reminderDismissedAt: sourceTask.reminderDismissedAt || null,
  });

  saveData();
  renderApp();
}

async function onSubmitTask(event) {
  event.preventDefault();

  const title = taskTitleInput.value.trim();
  if (!title) {
    taskTitleInput.focus();
    return;
  }

  if (imageProcessingPromise) {
    await imageProcessingPromise;
  }

  upsertTask({
    id: taskIdInput.value || null,
    title,
    description: taskDescriptionInput.value.trim(),
    priority: taskPriorityInput.value,
    tags: normalizeTags(taskTagsInput.value),
    dueDate: taskDueDateInput.value,
    image: taskImageValue,
    imagePosX: taskImagePosX,
    imagePosY: taskImagePosY,
    checklist: getDraftChecklistForSave(),
    status: taskStatusInput.value,
    recurring: readRecurringFormValue(),
  });

  saveData();
  renderApp();
  dialog.close();
}

function onTaskFormKeydown(event) {
  if (event.key !== "Enter") return;
  if (!event.ctrlKey && !event.metaKey) return;
  event.preventDefault();
  taskForm.requestSubmit();
}

function setView(view) {
  state.view =
    view === "dashboard" || view === "list" || view === "archive" || view === "trash" ? view : "kanban";
  saveViewPreference();
  updateViewUI();
  closeToolbarPanelOnMobile();
}

function onFilterChange() {
  const selectedType = dateFilterTypeSelect.value;

  if (selectedType === "today-due") {
    const todayValue = getTodayDateInputValue();
    dateFromInput.value = todayValue;
    dateToInput.value = todayValue;
  } else if (selectedType === "tomorrow") {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowValue = toDateInputValueFromDate(tomorrow);
    dateFromInput.value = tomorrowValue;
    dateToInput.value = tomorrowValue;
  } else if (selectedType === "next-week") {
    const range = getNextWeekRange();
    dateFromInput.value = range.from;
    dateToInput.value = range.to;
  } else if (selectedType === "overdue") {
    dateFromInput.value = "";
    dateToInput.value = "";
  }

  if (dateFromInput.value && dateToInput.value && dateToInput.value < dateFromInput.value) {
    dateToInput.value = dateFromInput.value;
  }

  state.filterType = selectedType;
  state.dateFrom = dateFromInput.value;
  state.dateTo = dateToInput.value;
  renderApp();
  if (selectedType !== "due" && selectedType !== "created" && selectedType !== "completed") {
    closeToolbarPanelOnMobile();
  }
}

function closeToolbarPanelOnMobile() {
  if (typeof window === "undefined" || !window.matchMedia("(max-width: 640px)").matches) return;
  setToolbarPanel(null);
}

function setToolbarPanel(panelName) {
  const panels = [
    { name: "view", panel: viewPanel, button: viewPanelToggleBtn },
    { name: "filter", panel: filterPanel, button: filterPanelToggleBtn },
    { name: "search", panel: searchPanel, button: searchPanelToggleBtn },
  ];
  const hasActivePanel = panelName === "view" || panelName === "filter" || panelName === "search";
  toolbarPanelStage.classList.toggle("hidden", !hasActivePanel);

  panels.forEach(({ name, panel, button }) => {
    const isActive = hasActivePanel && name === panelName;
    panel.classList.toggle("hidden", !isActive);
    panel.classList.toggle("is-active", isActive);
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-expanded", isActive ? "true" : "false");
  });

  if (!hasActivePanel) {
    if (document.activeElement === taskSearchInput) {
      taskSearchInput.blur();
    }
    return;
  }

  if (panelName === "search") {
    taskSearchInput.focus();
    return;
  }

  if (document.activeElement === taskSearchInput) {
    taskSearchInput.blur();
  }
}

function onSearchInputChange(event) {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) return;
  state.searchQuery = input.value || "";
  renderApp();
}

function onToolbarPanelToggle(panelName) {
  const isAlreadyActive =
    (panelName === "view" && viewPanelToggleBtn.classList.contains("is-active")) ||
    (panelName === "filter" && filterPanelToggleBtn.classList.contains("is-active")) ||
    (panelName === "search" && searchPanelToggleBtn.classList.contains("is-active"));
  setToolbarPanel(isAlreadyActive ? null : panelName);
}

function onListSortChange() {
  state.listSort = state.listSort === "title-asc" ? "title-desc" : "title-asc";
  renderApp();
}

function onCreatedSortChange() {
  state.listSort = state.listSort === "created-desc" ? "created-asc" : "created-desc";
  renderApp();
}

function onDueSortChange() {
  state.listSort = state.listSort === "due-desc" ? "due-asc" : "due-desc";
  renderApp();
}

function onStatusFilterToggle(event) {
  event.stopPropagation();
  toggleStatusFilterMenu();
}

function onStatusFilterChange(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;

  const status = target.dataset.status;
  if (!status || !(status in state.listStatusFilter)) return;
  state.listStatusFilter[status] = target.checked;
  renderApp();
}

function onDocumentClick(event) {
  const target = event.target;
  if (!(target instanceof Node)) return;

  if (!statusFilterMenu.classList.contains("hidden") && !listStatusHeader.contains(target)) {
    toggleStatusFilterMenu(false);
  }

  if (
    !settingsMenuPanel.classList.contains("hidden") &&
    !settingsMenuPanel.contains(target) &&
    !settingsToggleBtn.contains(target)
  ) {
    toggleSettingsMenu(false);
  }
}

function clearFilter() {
  state.filterType = "none";
  state.dateFrom = "";
  state.dateTo = "";
  state.searchQuery = "";

  dateFilterTypeSelect.value = "none";
  dateFromInput.value = "";
  dateToInput.value = "";
  taskSearchInput.value = "";
  setToolbarPanel(null);

  renderApp();
}

function setupDropzones() {
  Object.entries(dropzones).forEach(([status, zone]) => {
    const column = zone.closest(".column");
    if (!column) return;

    column.addEventListener("dragover", (event) => {
      event.preventDefault();
      clearDragHighlights();
      zone.classList.add("drag-over");
    });

    column.addEventListener("dragleave", (event) => {
      const nextTarget = event.relatedTarget;
      if (nextTarget instanceof Node && column.contains(nextTarget)) return;
      zone.classList.remove("drag-over");
    });

    column.addEventListener("drop", (event) => {
      event.preventDefault();
      clearDragHighlights();

      const taskId = state.draggingTaskId;
      if (!taskId) return;

      const task = state.tasks.find((entry) => entry.id === taskId);
      if (!task || task.status === status) return;

      const transition = handleRecurringCompletion(task, task.status, status);
      task.status = status;
      task.completedAt = transition.completedAt;
      if (transition.followUpTask) {
        state.tasks.push(transition.followUpTask);
      }

      saveData();
      renderApp();
    });
  });
}

function setupListActions() {
  listTableBody.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const taskId = target.dataset.taskId;
    if (!taskId) return;

    if (target.classList.contains("edit-btn")) {
      openEditDialog(taskId);
      return;
    }

    if (target.classList.contains("duplicate-btn")) {
      duplicateTask(taskId);
      return;
    }

    if (target.classList.contains("archive-btn")) {
      archiveTask(taskId);
      return;
    }

    if (target.classList.contains("delete-btn")) {
      moveTaskToTrash(taskId);
    }
  });
}

function setupArchiveActions() {
  archiveTableBody.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const taskId = target.dataset.taskId;
    if (!taskId) return;

    if (target.classList.contains("restore-archive-btn")) {
      restoreTaskFromArchive(taskId);
      return;
    }

    if (target.classList.contains("archive-delete-btn")) {
      moveArchivedTaskToTrash(taskId);
    }
  });
}

function setupTrashActions() {
  trashTableBody.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const taskId = target.dataset.taskId;
    if (!taskId) return;

    if (target.classList.contains("restore-btn")) {
      restoreTaskFromTrash(taskId);
      return;
    }

    if (target.classList.contains("destroy-btn")) {
      permanentlyDeleteTask(taskId);
    }
  });
}

function init() {
  applyTheme(loadThemePreference());
  setupTaskFormSections();
  initializeDueTimeOptions();
  resetDueDateControls();

  const loaded = loadData();
  state.tasks = loaded.tasks;
  state.archiveTasks = loaded.archiveTasks;
  state.trashTasks = loaded.trashTasks;
  state.view = loadViewPreference();
  state.filterType = "none";
  state.dateFrom = "";
  state.dateTo = "";
  dateFilterTypeSelect.value = "none";
  dateFromInput.value = "";
  dateToInput.value = "";
  setToolbarPanel(null);

  renderApp();
  setupDropzones();
  setupListActions();
  setupArchiveActions();
  setupTrashActions();

  newTaskBtn.addEventListener("click", openNewDialog);
  settingsToggleBtn.addEventListener("click", () => toggleSettingsMenu());
  themeToggle.addEventListener("click", onThemeToggleClick);
  cancelBtn.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
  wipeDialog.addEventListener("click", (event) => {
    if (event.target === wipeDialog) {
      pendingWipeAction = null;
      wipeDialog.close();
    }
  });
  taskForm.addEventListener("submit", onSubmitTask);
  taskForm.addEventListener("keydown", onTaskFormKeydown);
  taskDueDateDateInput.addEventListener("change", onDueDateControlChange);
  taskDueDateHourInput.addEventListener("change", onDueDateControlChange);
  taskDueDateMinuteInput.addEventListener("change", onDueDateControlChange);
  taskRecurringFrequencyInput.addEventListener("change", onRecurringInputChange);
  taskRecurringIntervalInput.addEventListener("input", onRecurringInputChange);
  dueQuickButtons.forEach((button) => button.addEventListener("click", onDueQuickButtonClick));
  taskImageInput.addEventListener("change", onTaskImageChange);
  taskImageRemoveInput.addEventListener("change", onTaskImageRemoveChange);
  taskImagePosXInput.addEventListener("input", onTaskImagePositionChange);
  taskImagePosYInput.addEventListener("input", onTaskImagePositionChange);
  addChecklistItemBtn.addEventListener("click", onChecklistQuickAdd);
  if (checklistQuickInput) {
    checklistQuickInput.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      onChecklistQuickAdd();
    });
  }
  dialog.addEventListener("close", resetForm);

  dashboardViewBtn.addEventListener("click", () => setView("dashboard"));
  kanbanViewBtn.addEventListener("click", () => setView("kanban"));
  listViewBtn.addEventListener("click", () => setView("list"));
  archiveViewBtn.addEventListener("click", () => setView("archive"));
  trashViewBtn.addEventListener("click", () => setView("trash"));

  dateFilterTypeSelect.addEventListener("change", onFilterChange);
  sortTitleBtn.addEventListener("click", onListSortChange);
  statusFilterBtn.addEventListener("click", onStatusFilterToggle);
  statusFilterMenu.addEventListener("click", (event) => event.stopPropagation());
  statusFilterMenu.addEventListener("change", onStatusFilterChange);
  document.addEventListener("click", onDocumentClick);
  sortDueBtn.addEventListener("click", onDueSortChange);
  sortCreatedBtn.addEventListener("click", onCreatedSortChange);
  dateFromInput.addEventListener("change", onFilterChange);
  dateToInput.addEventListener("change", onFilterChange);
  clearFilterBtn.addEventListener("click", clearFilter);
  viewPanelToggleBtn.addEventListener("click", () => onToolbarPanelToggle("view"));
  filterPanelToggleBtn.addEventListener("click", () => onToolbarPanelToggle("filter"));
  searchPanelToggleBtn.addEventListener("click", () => onToolbarPanelToggle("search"));
  taskSearchInput.addEventListener("input", onSearchInputChange);
  taskSearchInput.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    setToolbarPanel(null);
  });
  exportBtn.addEventListener("click", onExportData);
  importBtn.addEventListener("click", onImportData);
  importFileInput.addEventListener("change", onImportFileChange);
  wipeAllBtn.addEventListener("click", onWipeAllData);
  settingsMenuPanel.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (!target.closest("button")) return;
    toggleSettingsMenu(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    toggleSettingsMenu(false);
  });
  emptyTrashBtn.addEventListener("click", onWipeTrashData);
  wipeCancelBtn.addEventListener("click", () => {
    pendingWipeAction = null;
    wipeDialog.close();
  });
  wipeConfirmBtn.addEventListener("click", confirmWipeAllData);
  setInterval(() => {
    renderApp();
  }, DUE_HIGHLIGHT_REFRESH_MS);

  updateDueDatePreview();
  updateRecurringPreview();
}

init();





