"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { STOCK_GROUPS } from "../stockRules";

// The design's group row: hearing aids are one pill-shaped select ("Tüm işitme cihazları" or a brand),
// the accessory groups are plain pills. Group and brand live in the address bar like the rest of the view.
export default function GroupPills({ currentGroup, brands }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const onDevices = currentGroup === STOCK_GROUPS[0].key;
  const brand = searchParams.get("marka");

  function hrefFor(group, brandId) {
    const next = new URLSearchParams(searchParams);
    // A different group or brand shows other models, so the open model and its units do not carry over.
    next.delete("ac");
    next.delete("marka");
    if (group === STOCK_GROUPS[0].key) next.delete("grup");
    else next.set("grup", group);
    if (brandId) next.set("marka", brandId);
    const query = next.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  function chooseDevices(value) {
    if (value === "") return;
    router.push(hrefFor(STOCK_GROUPS[0].key, value === "tumu" ? null : value), { scroll: false });
  }

  return (
    <nav className="stock-group-pills" aria-label="Ürün grubu">
      <select
        className={`stock-pill-select${onDevices ? " on" : ""}`}
        aria-label="İşitme cihazı markası"
        value={onDevices ? (brand ?? "tumu") : ""}
        onChange={(event) => chooseDevices(event.target.value)}
      >
        {!onDevices && <option value="">İşitme cihazları</option>}
        <option value="tumu">Tüm işitme cihazları</option>
        {brands.map((item) => (
          <option key={item.id} value={String(item.id)}>
            {item.name}
          </option>
        ))}
      </select>
      {STOCK_GROUPS.slice(1).map((group) => {
        const active = group.key === currentGroup;
        return (
          <Link
            key={group.key}
            href={hrefFor(group.key, null)}
            scroll={false}
            className={`stock-pill${active ? " on" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            {group.label}
          </Link>
        );
      })}
    </nav>
  );
}
