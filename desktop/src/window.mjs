import { fileURLToPath } from "node:url";
import { BrowserWindow, shell, ipcMain } from "electron";
export function createWindow() {
  const window = new BrowserWindow({
    width: 1360,
    height: 900,
    minWidth: 390,
    minHeight: 640,
    title: "A.I BOX",
    frame: false,
    titleBarStyle: "hidden",
    icon: fileURLToPath(new URL("../build/icon.png", import.meta.url)),
    backgroundColor: "#111310",
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: fileURLToPath(new URL("./preload.cjs", import.meta.url)),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });
  const windowActions = {
    "window:minimize": () => window.minimize(),
    "window:maximize": () => window.isMaximized() ? window.unmaximize() : window.maximize(),
    "window:close": () => window.close(),
  };
  for (const [channel, action] of Object.entries(windowActions)) {
    const handler = (event) => { if (event.sender === window.webContents) action(); };
    ipcMain.on(channel, handler);
    window.once("closed", () => ipcMain.removeListener(channel, handler));
  }
  const openOfficial = (value) => {
    try {
      const url = new URL(value);
      if (url.protocol === "https:" && !url.username && !url.password)
        void shell.openExternal(url.href).catch(console.error);
    } catch {}
  };
  window.webContents.setWindowOpenHandler(({ url }) => {
    openOfficial(url);
    return { action: "deny" };
  });
  window.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith("aibox://box/")) {
      event.preventDefault();
      openOfficial(url);
    }
  });
  window.webContents.session.setPermissionRequestHandler(
    (_contents, _permission, callback) => callback(false),
  );
  window.webContents.session.setPermissionCheckHandler(() => false);
  window.once("ready-to-show", () => window.show());
  window.on("page-title-updated", (event) => event.preventDefault());
  void window.loadURL("aibox://box/index.html");
  return window;
}
