import CategoriesClient from "./components/CategoriesClient";

async function getHome() {
  const res = await fetch(
    "https://darkcyan-koala-320694.hostingersite.com/api/home",
    { cache: "no-store" }
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function Home() {
  const page = await getHome();
  const homeContent = page?.[0];
  return <CategoriesClient homeContent={homeContent} />;
}