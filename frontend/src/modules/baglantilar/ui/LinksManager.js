"use client";

import { useState } from "react";
import LinkEditor from "./LinkEditor";

export default function LinksManager({ links }) {
  const [editing, setEditing] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  return (
    <section className="links-page">
      <header className="links-head">
        <div>
          <h1>Bağlantılar</h1>
          <p>Başlığa tıklayın, ilgili site yeni sekmede açılsın.</p>
        </div>
        <button type="button" className="ui-button ui-button-ghost links-add" onClick={() => setIsAdding(true)}>
          <span aria-hidden="true">＋</span> Bağlantı ekle
        </button>
      </header>

      {links.length ? (
        <div className="links-grid">
          {links.map((link) => (
            <article className="links-item" key={link.id} style={{ "--link-color": link.color || "#244d9c" }}>
              {link.url ? (
                <a className="links-card" href={link.url} target="_blank" rel="noopener noreferrer">
                  <span className="links-icon" aria-hidden="true">{link.icon_letter}</span>
                  <strong>{link.name}</strong>
                  <span className="links-open">Siteyi aç ↗</span>
                </a>
              ) : (
                <button type="button" className="links-card links-card-empty" onClick={() => setEditing(link)}>
                  <span className="links-icon" aria-hidden="true">{link.icon_letter}</span>
                  <strong>{link.name}</strong>
                  <span className="links-open">Adres ekle</span>
                </button>
              )}
              <button
                type="button"
                className="links-edit"
                aria-label={`${link.name} bağlantısını düzenle`}
                title="Düzenle"
                onClick={() => setEditing(link)}
              >
                ✎
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="links-empty">
          <p>Henüz bağlantı eklenmemiş.</p>
          <button type="button" className="ui-button ui-button-primary" onClick={() => setIsAdding(true)}>
            İlk bağlantıyı ekle
          </button>
        </div>
      )}

      {(editing || isAdding) && (
        <LinkEditor
          key={editing?.id ?? "new"}
          link={editing}
          onClose={() => {
            setEditing(null);
            setIsAdding(false);
          }}
          canDelete={Boolean(editing)}
        />
      )}
    </section>
  );
}
