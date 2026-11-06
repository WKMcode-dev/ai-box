import test from "node:test";
import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { createUpdateController } from "../src/update-controller.mjs";

function setup(supported = true) {
  const updater = new EventEmitter();
  let checks = 0,
    downloads = 0,
    installs = 0;
  updater.checkForUpdates = async () => {
    checks++;
    updater.emit("update-available", { version: "1.2.0" });
  };
  updater.downloadUpdate = async () => {
    downloads++;
    updater.emit("download-progress", { percent: 52.4 });
    updater.emit("update-downloaded");
  };
  updater.quitAndInstall = (silent, restart) => {
    assert.equal(silent, true);
    assert.equal(restart, true);
    installs++;
  };
  const states = [];
  const controller = createUpdateController(updater, {
    version: "1.1.0",
    supported,
    publish: (state) => states.push(state),
  });
  return {
    updater,
    controller,
    states,
    calls: () => ({ checks, downloads, installs }),
  };
}
test("somente baixa após confirmação e somente instala quando pronto", async () => {
  const { controller, updater, calls, states } = setup();
  controller.install();
  await controller.download();
  assert.deepEqual(calls(), { checks: 0, downloads: 0, installs: 0 });
  await controller.check();
  assert.equal(controller.getState().status, "available");
  assert.equal(updater.autoDownload, false);
  assert.equal(updater.autoInstallOnAppQuit, false);
  await controller.check();
  assert.equal(calls().checks, 1);
  await controller.download();
  assert.equal(states.find((s) => s.progress === 52).status, "downloading");
  assert.equal(controller.getState().status, "ready");
  controller.install();
  controller.install();
  assert.equal(calls().installs, 1);
});
test("falha de conexão permite nova consulta sem repetição automática", async () => {
  const { updater, controller, calls } = setup();
  updater.checkForUpdates = async () => {
    throw new Error("offline");
  };
  await controller.check();
  assert.equal(controller.getState().status, "error");
  updater.checkForUpdates = async () => updater.emit("update-not-available");
  await controller.check();
  assert.equal(controller.getState().status, "current");
  assert.equal(calls().downloads, 0);
});
test("edição portátil e desenvolvimento não tentam instalar", async () => {
  const { controller, calls } = setup(false);
  await controller.check();
  await controller.download();
  controller.install();
  assert.equal(controller.getState().status, "unsupported");
  assert.deepEqual(calls(), { checks: 0, downloads: 0, installs: 0 });
});
test("falha no download permite consultar e baixar novamente", async () => {
  const { updater, controller } = setup();
  await controller.check();
  updater.downloadUpdate = async () => {
    throw new Error("offline");
  };
  await controller.download();
  assert.equal(controller.getState().status, "error");
  await controller.check();
  assert.equal(controller.getState().status, "available");
});

test("falha de manifesto mostra diagnóstico e permite consultar novamente", async () => {
  const { updater } = setup();
  const diagnostics = [];
  const controller = createUpdateController(updater, {
    version: "1.2.0",
    supported: true,
    publish: () => {},
    reportError: (error) => diagnostics.push(error),
  });
  updater.checkForUpdates = async () => {
    const error = new Error("404 latest.yml");
    error.code = "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND";
    throw error;
  };
  await controller.check();
  assert.match(controller.getState().message, /publicação/);
  assert.match(
    controller.getState().message,
    /ERR_UPDATER_CHANNEL_FILE_NOT_FOUND/,
  );
  assert.equal(diagnostics[0].action, "check");
  updater.checkForUpdates = async () => updater.emit("update-not-available");
  await controller.check();
  assert.equal(controller.getState().status, "current");
  assert.equal(controller.getState().message, undefined);
});
