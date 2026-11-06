export function createUpdateController(
  updater,
  { version, supported, publish, reportError = () => {} },
) {
  let state = {
    status: supported ? "idle" : "unsupported",
    currentVersion: version,
  };
  let checking = false;
  const set = (patch) => {
    state = { ...state, ...patch };
    publish(state);
  };
  updater.autoDownload = false;
  updater.autoInstallOnAppQuit = false;
  updater.allowPrerelease = false;
  updater.allowDowngrade = false;
  updater.on("update-available", (info) =>
    set({ status: "available", version: info.version, progress: 0 }),
  );
  updater.on("update-not-available", () => set({ status: "current" }));
  updater.on("download-progress", (info) =>
    set({ status: "downloading", progress: Math.round(info.percent) }),
  );
  updater.on("update-downloaded", () =>
    set({ status: "ready", progress: 100 }),
  );
  const fail = (error, action) => {
    const code = String(error?.code || "UNKNOWN");
    reportError({ action, code, message: String(error?.message || error) });
    const missing = /404|CHANNEL_FILE_NOT_FOUND|LATEST_VERSION_NOT_FOUND/.test(
      code + " " + error?.message,
    );
    const message = missing
      ? "A publicação da atualização ainda não está disponível. Você pode baixar o instalador pela página de versões."
      : "Não foi possível acessar a atualização. Confira sua conexão ou baixe o instalador pela página de versões.";
    set({ status: "error", message: `${message} Código: ${code}.` });
  };
  updater.on("error", (error) => fail(error, "updater"));
  return {
    getState: () => state,
    async check() {
      if (
        !supported ||
        checking ||
        ["available", "downloading", "ready", "installing"].includes(
          state.status,
        )
      )
        return state;
      checking = true;
      set({ status: "checking", message: undefined });
      try {
        await updater.checkForUpdates();
      } catch (error) {
        fail(error, "check");
      } finally {
        checking = false;
      }
      return state;
    },
    async download() {
      if (!supported || state.status !== "available") return state;
      set({ status: "downloading", progress: 0 });
      try {
        await updater.downloadUpdate();
      } catch (error) {
        fail(error, "download");
      }
      return state;
    },
    install() {
      if (supported && state.status === "ready") {
        set({ status: "installing" });
        updater.quitAndInstall(true, true);
      }
      return state;
    },
  };
}
