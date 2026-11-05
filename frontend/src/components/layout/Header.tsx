import { Icon } from "../ui/Icon";
type DesktopWindow = { minimize: () => void; maximize: () => void; close: () => void };
export function Header({ explore }: { explore: () => void }) {
  const desktop = (window as Window & { desktopWindow?: DesktopWindow }).desktopWindow;
  return <header className={desktop ? "topbar desktop-titlebar" : "topbar"}>
    <div className="titlebar-brand"><span className="titlebar-logo"><Icon name="box" size={20}/></span><strong>A.I BOX</strong><span className="beta">BETA</span></div>
    <nav className="titlebar-nav" aria-label="Navegação principal">
      <a href="#catalogo" onClick={e => {e.preventDefault(); explore();}}><Icon name="grid" size={16}/> Catálogo</a>
    </nav>
    {desktop && <div className="window-controls" aria-label="Controles da janela">
      <button type="button" aria-label="Minimizar janela" onClick={() => desktop.minimize()}>—</button>
      <button type="button" aria-label="Maximizar ou restaurar janela" onClick={() => desktop.maximize()}>□</button>
      <button type="button" className="window-close" aria-label="Fechar janela" onClick={() => desktop.close()}>×</button>
    </div>}
  </header>;
}