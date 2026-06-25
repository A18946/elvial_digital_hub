import { redirect } from "next/navigation";

export default async function FlipbookPage({ params }: any) {
  const { id } = await params;
  
  redirect(`https://darkcyan-koala-320694.hostingersite.com/pdf-proxy/${id}`);
}