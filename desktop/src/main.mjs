import { app, BrowserWindow, protocol } from "electron";
import { registerContentProtocol } from "./protocol.mjs";
import { createWindow } from "./window.mjs";
protocol.registerSchemesAsPrivileged([
  {
    scheme: "aibox",
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
    },
  },
]);
app.setAppUserModelId("dev.wkmcode.aibox");
if (!app.requestSingleInstanceLock()) app.quit();
else {
  app.on("second-instance", () => {
    const window = BrowserWindow.getAllWindows()[0];
    if (window) {
      if (window.isMinimized()) window.restore();
      window.focus();
    }
  });
  app.whenReady().then(() => {
    registerContentProtocol();
    createWindow();
    app.on("activate", () => {
      if (!BrowserWindow.getAllWindows().length) createWindow();
    });
  });
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
}
