import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { Layout } from "../../components/layout";
import Image from "next/image";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { getFullName } from "~/helpers/get-full-name";
import { Logo } from "~/components/logo";
import { Spinner } from "~/components/spinner";
import { FeedItem } from "~/components/feed-item";
import { type DehydrateOptions } from "@tanstack/react-query";

const ProfileFeed = ({ userId }: { userId: string }) => {
  const { data: images, isLoading: isImagesLoading } =
    api.image.getPostsByUserId.useQuery({ userId });

  if (isImagesLoading)
    return (
      <div className=" no-scrollbar flex h-full items-center justify-center overflow-y-scroll">
        <Spinner />
      </div>
    );
  if (!images) return <div>404 - Something went wrong</div>;

  return (
    <div className=" no-scrollbar h-full overflow-y-scroll">
      <div className=" grid grid-cols-3">
        {images.map((image) => (
          <FeedItem key={image.id} {...image} />
        ))}
      </div>
    </div>
  );
};

const ProfilePage: NextPage<{ userId: string }> = ({ userId }) => {
  const { data: userData } = api.user.getUserWithUserId.useQuery({
    userId,
  });

  if (!userData)
    return (
      <>
        <Head>
          <title>User Not Found</title>
        </Head>

        <div className="h-screen-custom flex flex-col items-center justify-center gap-4 bg-slate-900">
          <Logo className="text-7xl" link />
          <h1 className="text-center text-7xl">404!</h1>
          <div className="flex items-center justify-center text-2xl">
            User could not found!
          </div>
          <span className="text-center">
            Sorry for this, please visit us back again.
          </span>
        </div>
      </>
    );

  return (
    <>
      <Head>
        <title>{getFullName(userData) || "Profile Page"}</title>
      </Head>
      <Layout>
        <div className="flex flex-col items-center justify-center gap-3 border py-6">
          <Image
            src={userData.profileImageUrl}
            alt={`${getFullName(userData)}'s profile`}
            className="rounded-full"
            width={140}
            height={140}
          />
          <h2 className="text-2xl">{getFullName(userData)}</h2>
        </div>
        <ProfileFeed userId={userId} />
      </Layout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const userId = context.params?.userId;

  if (typeof userId !== "string") throw new Error("no userId");

  await ssg.user.getUserWithUserId.prefetch({ userId });

  return {
    props: {
      trpcState: JSON.parse(
        JSON.stringify(ssg.dehydrate())
      ) as DehydrateOptions,
      // trpcState: ssg.dehydrate(),
      userId,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
