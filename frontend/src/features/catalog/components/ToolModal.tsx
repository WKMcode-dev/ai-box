import { pricingLabels, accessNotes } from "../config/pricing";
import { accessLabels } from "../config/accessModes";
import { useEffect, useRef } from "react";
import type { Tool } from "@ai-box/contracts";
import { Icon } from "../../../components/ui/Icon";
import { ToolLogo } from "./ToolLogo";
export function ToolModal({
  tool,
  onClose,
}: {
  tool: Tool;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    dialog.showModal();
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = before;
    };
  }, []);
  return (
    <dialog
      ref={ref}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-labelledby="modal-title"
    >
      <div className={`modal-art ${tool.color}`}>
        <ToolLogo tool={tool} />
        <button
          className="close"
          onClick={onClose}
          aria-label="Fechar detalhes"
        >
          <Icon name="close" />
        </button>
      </div>
      <div className="modal-body">
        <span className="eyebrow">
          {tool.category} / {tool.maker}
        </span>
        <h2 id="modal-title">{tool.name}</h2>
        <p>{tool.description}</p>
        <div className="usage-note">
          <strong>
            {pricingLabels[tool.pricing]} · {accessLabels[tool.access]} ·{" "}
            {tool.kind}
          </strong>
          <p>{tool.usageNote}</p>
          <a
            className="pricing-source"
            href={tool.pricingSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Consultar condições na fonte oficial ↗
          </a>
        </div>
        <div className="tags">
          {tool.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <a
          className="primary official"
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver projeto oficial
          <Icon name="external" size={18} />
        </a>
        <small>
          Fonte revisada em{" "}
          {new Date(tool.checkedAt + "T12:00:00").toLocaleDateString("pt-BR")}.{" "}
          {accessNotes[tool.access]}
        </small>
      </div>
    </dialog>
  );
}
