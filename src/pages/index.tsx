import { type NextPage } from "next";

import { api } from "~/utils/api";
import { Layout } from "~/components/layout";
import { Header } from "~/components/header";
import { Feed } from "~/components/feed";

// const users = api.user.getSignedInUser.useQuery();

const Home: NextPage = () => {
  return (
    <>
      <Layout>
        <Header />
        <Feed />
      </Layout>
    </>
  );
};

export default Home;
