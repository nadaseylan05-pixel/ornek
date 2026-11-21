import LinksPage from "@/modules/baglantilar/ui/LinksPage";
import { getActiveLinks } from "@/modules/baglantilar/server/linksRepository";
import { connection } from "next/server";

export const metadata = { title: "Bağlantılar | Şelale İşitme" };

export default async function Page() {
  await connection();
  const links = await getActiveLinks();
  return <LinksPage links={links} />;
}
