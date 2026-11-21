import "server-only";
import { normalizeHttpUrl } from "@/lib/linkUrl";
import * as linksRepository from "./linksRepository";

const LINK_COLORS = ["#244d9c", "#2a45a8", "#a24a0b", "#6a34a3"];

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

function parseId(value) {
  if (value === null || value === undefined || value === "") return null;
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id < 1) throw new ValidationError("Bağlantı seçimi geçersiz.");
  return id;
}

function validateInput(input) {
  const name = String(input.name ?? "").trim();
  const rawUrl = String(input.url ?? "").trim();

  if (!name) throw new ValidationError("Bir ad yazın.");
  if (name.length > 120) throw new ValidationError("Bağlantı adı en fazla 120 karakter olabilir.");

  const url = normalizeHttpUrl(rawUrl);
  if (rawUrl && !url) {
    throw new ValidationError("Geçerli bir web adresi girin (http veya https).");
  }

  return { name, url: url || null, icon_letter: Array.from(name)[0].toLocaleUpperCase("tr-TR") };
}

export async function saveLink(input) {
  const id = parseId(input.id);
  const fields = validateInput(input);

  if (id !== null) {
    return linksRepository.updateLink(id, fields);
  }

  const sortOrder = await linksRepository.getNextSortOrder();
  return linksRepository.createLink({
    ...fields,
    color: LINK_COLORS[sortOrder % LINK_COLORS.length],
    sort_order: sortOrder,
    active: true,
  });
}

export async function removeLink(value) {
  const id = parseId(value);
  if (id === null) throw new ValidationError("Silinecek bağlantıyı seçin.");

  try {
    await linksRepository.deactivateLink(id);
  } catch (error) {
    if (error?.message === "Link not found or already inactive") {
      throw new ValidationError("Bu bağlantı bulunamadı veya daha önce silinmiş.");
    }
    throw error;
  }
}
