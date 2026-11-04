export function createUpdateController(
  updater,
  { version, supported, publish },
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
  updater.on("error", () =>
    set({
      status: "error",
      message:
        "Não foi possível atualizar agora. Confira sua conexão e tente novamente.",
    }),
  );
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
      } catch {
        set({
          status: "error",
          message:
            "Não foi possível consultar as atualizações. Tente novamente mais tarde.",
        });
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
      } catch {
        set({
          status: "error",
          message: "O download não foi concluído. Tente novamente.",
        });
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
