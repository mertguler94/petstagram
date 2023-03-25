import { type NextPage } from "next";

import { api } from "~/utils/api";
import { Layout } from "~/components/layout";
import { Header } from "~/components/header";

const users = api.user.getSignedInUser.useQuery();

const Home: NextPage = () => {
  return (
    <>
      <Layout>
        <Header />
      </Layout>
    </>
  );
};

export default Home;
