import { accessLabels } from "../config/accessModes";
interface Props {
  access: string;
  setAccess: (value: string) => void;
}
export function AccessFilter({ access, setAccess }: Props) {
  return (
    <div className="access-filter">
      <label>
        Como você quer usar?{" "}
        <select
          aria-label="Forma de uso"
          value={access}
          onChange={(e) => setAccess(e.target.value)}
        >
          <option value="all">Todas as opções</option>
          {Object.entries(accessLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <span>
        Gratuitas e planos gratuitos. Limites informados em cada ferramenta.
      </span>
    </div>
  );
}
