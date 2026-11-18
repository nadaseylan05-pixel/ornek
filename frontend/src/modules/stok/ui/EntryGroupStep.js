"use client";

import { useState } from "react";
import { STOCK_GROUPS } from "../stockRules";
import { addBrand } from "../server/actions";

// The design's first letter tile ("İ", "R", "Ş"…), upper-cased the Turkish way so "i" becomes "İ".
function initial(text) {
  return (text ?? "?").trim().charAt(0).toLocaleUpperCase("tr-TR") || "?";
}

function ChoiceCard({ symbol, title, note, onClick, disabled }) {
  return (
    <button type="button" className="stock-choice" onClick={onClick} disabled={disabled}>
      <span className="stock-choice-symbol" aria-hidden="true">{symbol}</span>
      <b>{title}</b>
      <small>{note}</small>
    </button>
  );
}

// "Yeni marka ekle": a button that opens a name box under the cards. An existing name comes back as the
// existing brand (catalogService), so a second "Bernafon" is never created.
function NewBrand({ onAdded, disabled }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function add() {
    if (!name.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const result = await addBrand(name);
      if (!result?.ok) return setError(result?.error ?? "Marka eklenemedi.");
      onAdded(result.data);
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button type="button" className="stock-outline-button" onClick={() => setOpen(true)} disabled={disabled}>
        ＋ Yeni marka ekle
      </button>
    );
  }

  return (
    <div className="stock-new-brand">
      <label className="ui-label" htmlFor="entry-new-brand">Yeni marka</label>
      <div className="stock-entry-inline">
        <input
          id="entry-new-brand"
          className="ui-input"
          value={name}
          maxLength={80}
          autoFocus
          placeholder="Marka adı, örn. Phonak"
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            add();
          }}
        />
        <button type="button" className="ui-button ui-button-primary" onClick={add} disabled={busy || !name.trim()}>
          {busy ? "Ekleniyor…" : "Ekle ve devam et"}
        </button>
        <button type="button" className="ui-button ui-button-ghost" onClick={() => setOpen(false)} disabled={busy}>
          Vazgeç
        </button>
      </div>
      {error && <span className="ui-error" role="alert">{error}</span>}
    </div>
  );
}

// Step 1 as in the design: the five groups as letter cards. Hearing aids are listed brand by brand, so that
// card first shows the brands (with "← Ürün grupları" as the first card). Choosing a card moves on at once.
export default function EntryGroupStep({ brands, onPick, onBrandAdded, busy }) {
  const [showBrands, setShowBrands] = useState(false);

  return (
    <div className="stock-entry-step">
      <header className="stock-entry-step-head">
        <h3>{showBrands ? "İşitme cihazı markası" : "Ürün grubunu seçin"}</h3>
        <p>{showBrands ? "Markayı seçin ya da yeni marka ekleyin." : "İşitme cihazı veya aksesuar grubuyla başlayın."}</p>
      </header>

      {!showBrands ? (
        <div className="stock-choice-grid">
          {STOCK_GROUPS.map((group) => (
            <ChoiceCard
              key={group.key}
              symbol={initial(group.label)}
              title={group.category === "device" ? "İşitme cihazı" : group.label}
              note={group.category === "device" ? "Marka seç veya yeni marka ekle" : "Model seç veya yeni model ekle"}
              disabled={busy}
              onClick={() => (group.category === "device" ? setShowBrands(true) : onPick("accessory", group.category, ""))}
            />
          ))}
        </div>
      ) : (
        <>
          <div className="stock-choice-grid">
            <button type="button" className="stock-choice stock-choice-back" onClick={() => setShowBrands(false)} disabled={busy}>
              ← Ürün grupları
            </button>
            {brands.map((brand) => (
              <ChoiceCard
                key={brand.id}
                symbol={initial(brand.name)}
                title={brand.name}
                note="Modelleri gör"
                disabled={busy}
                onClick={() => onPick("device", "device", String(brand.id))}
              />
            ))}
          </div>
          <div className="stock-entry-step-foot">
            <NewBrand
              disabled={busy}
              onAdded={(brand) => {
                onBrandAdded(brand);
                onPick("device", "device", String(brand.id));
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
