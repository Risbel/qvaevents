import { redirect } from "next/navigation";

const Home = ({ params }: { params: { locale: string } }) => {
  const { locale } = params;
  redirect(`/${locale}/landing`);
};

export default Home;
