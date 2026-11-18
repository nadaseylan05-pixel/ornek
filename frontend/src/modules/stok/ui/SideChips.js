import { earSideLabel } from "../stockRules";

// Ear-side chips from the design: green "Sağ", blue "Sol", neutral "İki kulak" / "Taraf yok".

// A model's shelf split: "Sağ 2" "Sol 1" "İki kulak 1". Nothing when no unit has one of these sides.
export function SideChips({ counts }) {
  const sides = ["right", "left", "both"].filter((side) => counts?.[side] > 0);
  if (!sides.length) return null;
  return (
    <span className="stock-sides">
      {sides.map((side) => (
        <span key={side} className={`stock-side stock-side-${side}`}>
          {earSideLabel(side)} <b>{counts[side]}</b>
        </span>
      ))}
    </span>
  );
}

// One unit's side; a unit saved before the side was required has none and shows "—".
export function SideChip({ side }) {
  if (!side) return "—";
  return <span className={`stock-side stock-side-${side}`}>{earSideLabel(side)}</span>;
}
