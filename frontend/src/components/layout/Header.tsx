import { assetUrl } from "../../utils/assetUrl";
import { Icon } from "../ui/Icon";
import { UpdateNotice } from "../../features/updates/UpdateNotice";
export type DesktopWindow = {
  minimize: () => void;
  maximize: () => void;
  close: () => void;
};
declare global {
  interface Window {
    desktopWindow?: DesktopWindow;
  }
}
export function Header({ explore }: { explore: () => void }) {
  const desktop = window.desktopWindow;
  return (
    <header className={desktop ? "topbar desktop-titlebar" : "topbar"}>
      <div className="titlebar-brand">
        <span className="titlebar-logo">
          <img src={assetUrl("favicon.svg")} width="31" height="31" alt="" />
        </span>
        <strong>A.I BOX</strong>
        {!desktop && <span className="beta">BETA</span>}
      </div>
      <nav className="titlebar-nav" aria-label="Navegação principal">
        <a
          href="#catalogo"
          aria-label="Explorar catálogo"
          title="Explorar catálogo"
          onClick={(e) => {
            e.preventDefault();
            explore();
          }}
        >
          <Icon name="grid" size={16} />
          <span>Catálogo</span>
        </a>
        {desktop && <UpdateNotice compact />}
      </nav>
      {desktop && (
        <div className="window-controls" aria-label="Controles da janela">
          <button
            type="button"
            aria-label="Minimizar janela"
            onClick={() => desktop.minimize()}
          >
            <Icon name="minimize" size={16} />
          </button>
          <button
            type="button"
            aria-label="Maximizar ou restaurar janela"
            onClick={() => desktop.maximize()}
          >
            <Icon name="maximize" size={14} />
          </button>
          <button
            type="button"
            className="window-close"
            aria-label="Fechar janela"
            onClick={() => desktop.close()}
          >
            <Icon name="close" size={17} />
          </button>
        </div>
      )}
    </header>
  );
}
