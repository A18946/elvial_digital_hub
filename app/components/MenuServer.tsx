import MenuClient from "./Menu";

async function getMenuItems(locale: string) {
  const res = await fetch(
    `https://darkcyan-koala-320694.hostingersite.com/${locale}/jsonapi/menu_items/main`,
    { cache: "no-store" }
  );
  if (!res.ok) {
    const fallback = await fetch(
      `https://darkcyan-koala-320694.hostingersite.com/jsonapi/menu_items/main`,
      { cache: "no-store" }
    );
    if (!fallback.ok) return [];
    const json = await fallback.json();
    return json.data || [];
  }
  const json = await res.json();
  return json.data || [];
}

export default async function MenuServer({ locale }: { locale: string }) {
  const items = await getMenuItems(locale);
  return <MenuClient menuItems={items} />;
}