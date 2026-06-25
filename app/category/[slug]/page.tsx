import Image from "next/image";
import Link from "next/link";

const DRUPAL = "https://darkcyan-koala-320694.hostingersite.com";

async function getCategoryProducts(slug: string) {
  const res = await fetch(`${DRUPAL}/api/${slug}`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function CategoryPage({ params }: any) {
  const { slug } = await params;
  const products = await getCategoryProducts(slug);

  const title = slug.replaceAll("-", " ").toUpperCase();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-8 tracking-widest">{title}</h1>

      {products.length === 0 && <p>No products found.</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((item: any, i: number) => {
          const productTitle = item.title?.[0]?.value ?? "";
          const imgPath = item.field_image?.[0]?.url ?? null;
          const nid = item.nid?.[0]?.value;

          return (
            <Link key={i} href={`/product/${nid}`}>
              <div className="cursor-pointer group">
                {imgPath ? (
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <Image
                      src={`${DRUPAL}${imgPath}`}
                      alt={productTitle}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-square bg-gray-200" />
                )}
                <p className="mt-2 text-sm font-semibold text-blue-700 underline">
                  {productTitle}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}