import { Icon } from "../../components/ui/Icon";
import { useEffect, useState } from "react";
import type { UpdateState } from "./desktopUpdates";
import "./updates.css";

export function UpdateNotice({ compact = false }: { compact?: boolean }) {
  const [state, setState] = useState<UpdateState>();
  const [requested, setRequested] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    const api = window.desktopUpdates;
    if (!api) return;
    let active = true;
    const accept = (next: UpdateState) => {
      if (active) {
        setState(next);
        setDismissed(false);
      }
    };
    const unsubscribe = api.subscribe(accept);
    void api
      .getState()
      .then(accept)
      .catch(() => {});
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);
  if (!state) return null;
  const api = window.desktopUpdates!;
  const act = (action: () => Promise<UpdateState>) => {
    void action()
      .then(setState)
      .catch(() =>
        setState({
          ...state,
          status: "error",
          message: "Não foi possível atualizar agora. Tente novamente.",
        }),
      );
  };
  const visible =
    !dismissed &&
    (!["current", "unsupported"].includes(state.status) || requested) &&
    [
      "available",
      "downloading",
      "ready",
      "installing",
      "error",
      "unsupported",
      "current",
    ].includes(state.status);
  return (
    <>
      <button
        className={
          compact ? "update-check update-check-compact" : "update-check"
        }
        aria-label="Verificar atualizações"
        title={`A.I BOX ${state.currentVersion} · ${state.status === "current" ? "Atualizado" : "Verificar atualizações"}`}
        onClick={() => {
          setRequested(true);
          setDismissed(false);
          act(api.check);
        }}
        disabled={["checking", "downloading", "installing"].includes(
          state.status,
        )}
      >
        {compact && <Icon name="refresh" size={16} />}
        <span>
          {state.status === "checking"
            ? "Verificando atualizações…"
            : state.status === "current"
              ? `Versão ${state.currentVersion} atualizada ✓`
              : `Versão ${state.currentVersion} · Atualizações`}
        </span>
      </button>
      {!compact && state.status === "unsupported" && (
        <small className="update-portable">
          Atualização automática disponível na edição instalada para Windows.
        </small>
      )}
      {visible && (
        <aside className="update-notice" aria-label="Atualização do A.I BOX">
          <div role="status" aria-live="polite">
            <strong>
              {state.status === "available"
                ? "Uma nova versão está disponível"
                : state.status === "ready"
                  ? "Tudo pronto para atualizar"
                  : state.status === "downloading"
                    ? "Baixando atualização…"
                    : state.status === "installing"
                      ? "Reiniciando para atualizar…"
                      : state.status === "current"
                        ? "Você está na versão mais recente"
                        : state.status === "unsupported"
                          ? "Edição portátil"
                          : "Atualização indisponível"}
            </strong>
            <p>
              {state.status === "unsupported"
                ? "A edição portátil é atualizada pelo download manual. Use o instalador para receber atualizações pelo aplicativo."
                : state.status === "current"
                  ? `A.I BOX ${state.currentVersion} está atualizado.`
                  : state.status === "error"
                    ? state.message
                    : state.status === "ready"
                      ? "O A.I BOX será fechado, atualizado e aberto novamente."
                      : `A.I BOX ${state.version ?? state.currentVersion} · Melhorias e catálogo atualizado.`}
            </p>
            {state.status === "downloading" && (
              <progress
                aria-label="Download da atualização"
                max={100}
                value={state.progress ?? 0}
              />
            )}
          </div>
          <div className="update-actions">
            {["error", "unsupported"].includes(state.status) && (
              <a
                className="update-manual"
                href="https://github.com/WKMcode-dev/ai-box/releases/latest"
                target="_blank"
                rel="noreferrer"
              >
                Baixar instalador
              </a>
            )}
            {state.status === "available" && (
              <button onClick={() => act(api.download)}>Atualizar</button>
            )}
            {state.status === "ready" && (
              <button onClick={() => act(api.install)}>
                Reiniciar e instalar
              </button>
            )}
            {state.status === "error" && (
              <button onClick={() => act(api.check)}>Tentar novamente</button>
            )}
            {!["downloading", "installing"].includes(state.status) && (
              <button
                className="update-later"
                onClick={() => setDismissed(true)}
              >
                Agora não
              </button>
            )}
          </div>
        </aside>
      )}
    </>
  );
}
