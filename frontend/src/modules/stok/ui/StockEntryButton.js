"use client";

import { useState } from "react";
import StockEntryDialog from "./StockEntryDialog";

// "Stok ekle" button with its window. Used in the toolbar and in the empty search result, where a scanned
// barcode that is not in stock is passed on so a new model starts with that GTIN.
// variant "fab" is the design's large toolbar button with its icon.
export default function StockEntryButton({ options, initialGtin = null, label, ghost = false, variant }) {
  const [open, setOpen] = useState(false);
  const fab = variant === "fab";

  return (
    <>
      <button
        type="button"
        className={fab ? "stock-fab" : `ui-button ${ghost ? "ui-button-ghost" : "ui-button-primary"}`}
        onClick={() => setOpen(true)}
      >
        {fab && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v8M8 12h8" />
          </svg>
        )}
        {label ?? (fab ? "Stok ekle" : "＋ Stok ekle")}
      </button>
      {open && <StockEntryDialog options={options} initialGtin={initialGtin} onClose={() => setOpen(false)} />}
    </>
  );
}
