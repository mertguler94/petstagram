import { type NextPage } from "next";
import Head from "next/head";
import { Layout } from "~/components/layout";
import { Feed } from "~/components/feed";

// const users = api.user.getSignedInUser.useQuery();

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Petstagram</title>
      </Head>
      <Layout>
        <Feed />
      </Layout>
    </>
  );
};

export default Home;
