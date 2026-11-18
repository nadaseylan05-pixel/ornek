import Link from "next/link";
import { stockGroupByCategory, stockHref, stockLevelInfo } from "../stockRules";

// The design's "Stok uyarıları" card: a red count badge, "3 bitti · 2 azalıyor" and a chevron. Closed by
// default so it never pushes the list down; each row opens that model in its own group.
export default function StockAlerts({ alerts }) {
  if (!alerts.items.length) return null;

  const counts = [alerts.out && `${alerts.out} bitti`, alerts.low && `${alerts.low} azalıyor`].filter(Boolean).join(" · ");

  return (
    <details className="stock-alerts">
      <summary>
        <span className="stock-alerts-title">Stok uyarıları</span>
        <span className="stock-alerts-badge">{alerts.items.length}</span>
        <span className="stock-alerts-counts">{counts}</span>
        <span className="stock-alerts-chevron" aria-hidden="true">▾</span>
      </summary>
      <ul>
        {alerts.items.map((item) => {
          const level = stockLevelInfo(item.stockLevel);
          return (
            <li key={item.productId}>
              <Link href={stockHref({}, { grup: stockGroupByCategory(item.category).key, ac: item.productId })}>
                <span className={`stock-alert-dot ${level.tone}`} aria-hidden="true" />
                <span className="stock-alert-text">
                  <b>{item.name}</b>
                  <small>
                    {item.brandName} · {item.inStock} adet
                  </small>
                </span>
                <span className={`stock-alert-pill ${level.tone}`}>{level.label}</span>
                <span className="stock-alert-go">Göster →</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
