const { spawn } = require("node:child_process");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { app, BrowserWindow, dialog } = require("electron");

const BACKEND_URL = "http://127.0.0.1:8000/api/v1/health";
const BACKEND_START_TIMEOUT_MS = 15_000;
const LOG_RETENTION_DAYS = 30;

let backendProcess = null;

app.setName("AlphaMind");

const createWindow = async () => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 640,
    title: "AlphaMind OS",
    backgroundColor: "#09090b",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  if (devServerUrl) {
    await mainWindow.loadURL(devServerUrl);
    return;
  }

  await mainWindow.loadFile(
    path.join(__dirname, "..", "dist", "index.html"),
  );
};

const removeExpiredLogs = (logsDirectory) => {
  const cutoff = Date.now() - LOG_RETENTION_DAYS * 24 * 60 * 60 * 1000;
  for (const entry of fs.readdirSync(logsDirectory, {
    withFileTypes: true,
  })) {
    if (!entry.isFile()) {
      continue;
    }
    const filePath = path.join(logsDirectory, entry.name);
    if (fs.statSync(filePath).mtimeMs < cutoff) {
      fs.rmSync(filePath);
    }
  }
};

const openBackendLog = (logsDirectory) => {
  const date = new Date().toISOString().slice(0, 10);
  return fs.openSync(path.join(logsDirectory, `backend-${date}.log`), "a");
};

const isBackendReady = () =>
  new Promise((resolve) => {
    const request = http.get(BACKEND_URL, (response) => {
      response.resume();
      resolve(response.statusCode === 200);
    });
    request.setTimeout(500, () => request.destroy());
    request.on("error", () => resolve(false));
  });

const waitForBackend = async () => {
  const deadline = Date.now() + BACKEND_START_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (await isBackendReady()) {
      return;
    }
    if (backendProcess?.exitCode !== null) {
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Backend failed to start.");
};

const startBackend = async () => {
  const dataDirectory = app.getPath("userData");
  const logsDirectory = path.join(dataDirectory, "logs");
  fs.mkdirSync(logsDirectory, { recursive: true });
  removeExpiredLogs(logsDirectory);

  const executable = path.join(
    process.resourcesPath,
    "backend",
    "alphamind-backend",
  );
  if (!fs.existsSync(executable)) {
    throw new Error("Packaged backend is missing.");
  }

  const logFile = openBackendLog(logsDirectory);
  backendProcess = spawn(executable, [], {
    env: {
      ...process.env,
      ALPHAMIND_DATA_DIR: dataDirectory,
    },
    stdio: ["ignore", logFile, logFile],
  });
  fs.closeSync(logFile);
  await waitForBackend();
};

const stopBackend = () => {
  if (backendProcess && backendProcess.exitCode === null) {
    backendProcess.kill("SIGTERM");
  }
  backendProcess = null;
};

app.whenReady().then(async () => {
  try {
    if (!process.env.VITE_DEV_SERVER_URL) {
      await startBackend();
    }
    await createWindow();
  } catch (error) {
    dialog.showErrorBox(
      "AlphaMind could not start",
      error instanceof Error ? error.message : "Unknown startup error.",
    );
    app.quit();
    return;
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      void createWindow();
    }
  });
});

app.on("before-quit", stopBackend);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
