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
import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";

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

  const { mutate: mutateBio, isLoading: isBioSaving } =
    api.user.saveBio.useMutation({
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        console.error(errorMessage);
      },
    });

  const currentUser = useUser();

  const [showSave, setShowSave] = useState(false);
  const [bio, setBio] = useState("");
  const bioInput = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setBio(userData?.privateMetadata.customBio as string);
  }, [userData?.privateMetadata.customBio]);

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
        <div className="flex flex-col items-center justify-center gap-3 border-b pt-6 pb-3">
          <div className="relative aspect-square w-24 md:w-40">
            <Image
              src={userData.profileImageUrl}
              alt={`${getFullName(userData)}'s profile`}
              className="relative rounded-full"
              fill
            />
          </div>
          <div className="flex w-full flex-col items-center justify-center">
            <h2 className="text-xl sm:text-2xl">{getFullName(userData)}</h2>
            <fieldset className="flex w-full items-center justify-center gap-4 px-4">
              <textarea
                data-gramm="false"
                data-gramm_editor="false"
                data-enable-grammarly="false"
                spellCheck={false}
                ref={bioInput}
                className={`w-full ${
                  currentUser.user && userData.id === currentUser.user.id
                    ? "cursor-pointer"
                    : "cursor-default"
                } resize-none bg-transparent px-3 py-2 text-center text-xs text-slate-400 focus:cursor-text sm:text-sm`}
                placeholder="Enter your bio."
                onFocus={() => setShowSave(true)}
                onBlur={() => {
                  setTimeout(() => setShowSave(false), 100);
                }}
                value={bio}
                disabled={
                  !currentUser.user
                    ? false
                    : userData.id !== currentUser.user.id
                }
                onChange={(e) => {
                  setBio(e.currentTarget.value);
                  if (!bioInput.current) return;
                  // auto adjust height of the textarea input
                  bioInput.current.style.height = "auto";
                  bioInput.current.style.height =
                    bioInput.current.scrollHeight.toString() + "px";
                }}
              />
              {showSave &&
                currentUser.user &&
                userData.id === currentUser.user.id && (
                  <button
                    type="button"
                    className="rounded-md border p-2"
                    disabled={isBioSaving}
                    onClick={() =>
                      mutateBio({ userId: currentUser.user.id, bio })
                    }
                  >
                    Save
                  </button>
                )}
            </fieldset>
          </div>
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
