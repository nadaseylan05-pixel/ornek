"use client";

import { useActionState, useEffect, useTransition } from "react";
import { deleteLinkAction, saveLinkAction } from "../server/actions";
import Modal from "@/modules/shared/ui/Modal";
import { useToast } from "@/modules/shared/ui/Toast";
import { useResultToast } from "@/modules/ayarlar/ui/useResultToast";

export default function LinkEditor({ link, onClose, canDelete }) {
  const [result, submit, pending] = useActionState(saveLinkAction, null);
  const [deleting, startDeleting] = useTransition();
  const toast = useToast();
  useResultToast(result, "Bağlantı kaydedildi.");

  useEffect(() => {
    if (result?.ok) onClose();
  }, [onClose, result]);

  function remove() {
    if (!link || !canDelete || !window.confirm(`"${link.name}" bağlantısı silinsin mi?`)) return;

    startDeleting(async () => {
      const deleteResult = await deleteLinkAction(link.id);
      if (deleteResult.ok) {
        toast("Bağlantı silindi.");
        onClose();
      } else {
        toast(deleteResult.error, "error");
      }
    });
  }

  const busy = pending || deleting;

  return (
    <Modal
      open
      onClose={onClose}
      title={link ? "Bağlantıyı düzenle" : "Bağlantı ekle"}
      eyebrow="Bağlantılar"
    >
      <form action={submit} id="link-editor-form" className="links-form">
        {link && <input type="hidden" name="id" value={link.id} />}
        <label className="ui-field">
          <span className="ui-label">Ad</span>
          <input
            className="ui-input"
            name="name"
            maxLength={120}
            defaultValue={link?.name ?? ""}
            autoFocus={!link}
            required
          />
        </label>
        <label className="ui-field">
          <span className="ui-label">Web adresi</span>
          <input
            className="ui-input"
            name="url"
            inputMode="url"
            maxLength={2048}
            placeholder="https://…"
            defaultValue={link?.url ?? ""}
          />
          <span className="links-hint">Boş bırakabilir veya alan adını https:// olmadan yazabilirsiniz.</span>
        </label>
        {result && !result.ok && result.error && <p className="ui-error" role="alert">{result.error}</p>}
        <footer className="links-form-actions">
          {canDelete && (
            <button type="button" className="ui-button ui-button-danger links-delete" onClick={remove} disabled={busy}>
              Sil
            </button>
          )}
          <button type="button" className="ui-button ui-button-ghost" onClick={onClose} disabled={busy}>
            Vazgeç
          </button>
          <button type="submit" className="ui-button ui-button-primary" disabled={busy}>
            {pending ? "Kaydediliyor…" : "Kaydet"}
          </button>
        </footer>
      </form>
    </Modal>
  );
}
