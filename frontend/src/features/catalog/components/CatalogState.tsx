import { Icon } from "../../../components/ui/Icon";
interface Props {
  title: string;
  description?: string;
  action?: () => void;
  actionLabel?: string;
}
export function CatalogState({
  title,
  description,
  action,
  actionLabel,
}: Props) {
  return (
    <div className="empty" role="status">
      <Icon name="search" size={32} />
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action && (
        <button className="primary" onClick={action}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
