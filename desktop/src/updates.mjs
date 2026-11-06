import { appendFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { app, BrowserWindow, ipcMain } from "electron";
import updaterPackage from "electron-updater";
import { createUpdateController } from "./update-controller.mjs";

export function initializeUpdates() {
  const { autoUpdater } = updaterPackage;
  autoUpdater.disableDifferentialDownload = true;
  const controller = createUpdateController(autoUpdater, {
    version: app.getVersion(),
    reportError: (detail) => {
      try {
        const folder = join(app.getPath("userData"), "logs");
        mkdirSync(folder, { recursive: true });
        appendFileSync(
          join(folder, "updates.log"),
          JSON.stringify({
            at: new Date().toISOString(),
            version: app.getVersion(),
            ...detail,
          }) + "\n",
        );
      } catch (error) {
        console.error(
          "Não foi possível gravar diagnóstico de atualização",
          error,
        );
      }
    },
    supported:
      app.isPackaged &&
      process.platform === "win32" &&
      !process.env.PORTABLE_EXECUTABLE_DIR,
    publish: (state) => {
      for (const window of BrowserWindow.getAllWindows())
        if (!window.isDestroyed())
          window.webContents.send("updates:state", state);
    },
  });
  function trusted(event) {
    if (
      !event.senderFrame ||
      event.senderFrame !== event.sender.mainFrame ||
      !event.senderFrame.url.startsWith("aibox://box/")
    )
      throw new Error("Origem não autorizada");
  }
  for (const [channel, action] of Object.entries({
    state: controller.getState,
    check: controller.check,
    download: controller.download,
    install: controller.install,
  }))
    ipcMain.handle(`updates:${channel}`, (event) => {
      trusted(event);
      return action();
    });
  const first = setTimeout(() => void controller.check(), 10_000);
  const interval = setInterval(
    () => void controller.check(),
    4 * 60 * 60 * 1000,
  );
  app.once("before-quit", () => {
    clearTimeout(first);
    clearInterval(interval);
  });
}
