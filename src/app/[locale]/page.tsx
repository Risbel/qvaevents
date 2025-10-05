import { redirect } from "next/navigation";

const Home = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  redirect(`/${locale}/landing`);

  return <div>Home</div>;
};

export default Home;
