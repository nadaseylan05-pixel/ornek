"use server";

import { refresh } from "next/cache";
import { requireStaff } from "@/lib/auth";
import { toActionResult } from "@/modules/shared/server/actionResult";
import * as linksService from "./linksService";

export async function saveLinkAction(_previous, form) {
  return toActionResult(async () => {
    await requireStaff();
    const saved = await linksService.saveLink({
      id: form.get("id"),
      name: form.get("name"),
      url: form.get("url"),
    });
    refresh();
    return saved;
  });
}

export async function deleteLinkAction(id) {
  return toActionResult(async () => {
    await requireStaff();
    await linksService.removeLink(id);
    refresh();
  });
}
