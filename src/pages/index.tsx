import { type NextPage } from "next";

import { api } from "~/utils/api";
import { Layout } from "~/components/layout";
import { Header } from "~/components/header";
import { Feed } from "~/components/feed";
import { Footer } from "~/components/footer";

// const users = api.user.getSignedInUser.useQuery();

const Home: NextPage = () => {
  return (
    <>
      <Layout>
        <Header />
        <Feed />
        <Footer />
      </Layout>
    </>
  );
};

export default Home;
