import { type NextPage } from "next";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";
import { Layout } from "~/components/layout";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  const { isLoaded: userLoaded, isSignedIn } = useUser();
  return (
    <>
      <Layout>{!isSignedIn ? <SignInButton /> : <SignOutButton />}</Layout>
    </>
  );
};

export default Home;
