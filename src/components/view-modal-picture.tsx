import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { type RouterOutputs, api } from "~/utils/api";
import { AiOutlineCloseCircle } from "react-icons/ai";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getFullName } from "~/helpers/get-full-name";
import { useRouter } from "next/router";
import { IoPawOutline, IoPawSharp } from "react-icons/io5";
import { tap } from "~/helpers/tap";
import { useUser } from "@clerk/nextjs";
import { type Prisma } from "@prisma/client";

dayjs.extend(relativeTime);

interface ViewModalPictureType {
  isOpen: boolean;
  closeModal: () => void;
  src: Post;
}

type Post = RouterOutputs["image"]["getAll"][0];

export const ViewModalPicture = ({
  isOpen,
  closeModal,
  src,
}: ViewModalPictureType) => {
  const { data: userData } = api.user.getUserWithUserId.useQuery({
    userId: src.userId,
  });

  const ctx = api.useContext();

  const { mutate: mutateLike, isLoading: isLikeLoading } =
    api.image.likeToggle.useMutation({
      onSuccess: () => {
        void ctx.image.getAll.invalidate();
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        console.error(errorMessage);
      },
    });

  const [like, setLike] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState(false);
  const [likeNumber, setLikeNumber] = useState(0);

  const { user } = useUser();

  const router = useRouter();

  useEffect(() => {
    const fetchLike = () => {
      const postId = src.id;
      const loggedInUserId = user?.id;
      if (!loggedInUserId) return;
      mutateLike({ like, postId, userId: loggedInUserId });
    };

    fetchLike();
  }, [like, mutateLike, src.id, user?.id]);

  useEffect(() => {
    const peopleLiked = src.likedBy as Prisma.JsonArray;
    if (!peopleLiked) {
      setLike(false);
      return;
    }
    setLikeNumber(peopleLiked.length);
    if (!user) return;
    const isLiked = peopleLiked.find((personId) => personId === user.id);
    setLike(!!isLiked);
  }, [src.likedBy, user]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-[#E9E9E9] text-left align-middle shadow-xl transition-all">
                <AiOutlineCloseCircle
                  className="absolute right-4 top-4 cursor-pointer text-slate-700"
                  size={20}
                  onClick={closeModal}
                />
                <div className="flex flex-col gap-4 p-6 pt-12">
                  <div className="grid place-items-center">
                    <Image
                      src={src.postUrl}
                      alt="Pet photo"
                      className="grid-column-1 grid-row-1 rounded-2xl object-cover"
                      width={450}
                      height={450}
                      onClick={(e) => {
                        tap(e, {
                          onSingleTap: undefined,
                          onDoubleTap: () => {
                            setLike(true);
                            setLikeAnimation(true);
                          },
                        });
                      }}
                    />
                    {likeAnimation && (
                      <IoPawSharp
                        size={100}
                        onAnimationEnd={() => {
                          setLikeAnimation(false);
                        }}
                        className={`grid-column-1 grid-row-1  rounded-full p-1 text-red-700 ${
                          likeAnimation ? "animate-like" : "hidden"
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-slate-800">
                    <div
                      className="flex cursor-pointer items-center gap-2"
                      onClick={() =>
                        void router.push(`/user/${userData?.id ?? ""}`)
                      }
                    >
                      {userData?.profileImageUrl && (
                        <Image
                          src={userData?.profileImageUrl}
                          alt="profile image"
                          width={50}
                          height={50}
                          className="rounded-full"
                        />
                      )}
                      <h4>{userData?.username ?? getFullName(userData)}</h4>
                    </div>
                    <p className="text-sm">{dayjs(src.createdAt).fromNow()}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    {src.caption && <p className="text-black">{src.caption}</p>}
                    <span className="text-slate-800">{`${likeNumber} likes`}</span>
                    {like ? (
                      <IoPawSharp
                        size={36}
                        className="cursor-pointer rounded-full border border-red-400 p-1 text-red-700 hover:text-red-500"
                        onClick={
                          !isLikeLoading
                            ? () => setLike((prev) => !prev)
                            : undefined
                        }
                      />
                    ) : (
                      <IoPawOutline
                        size={36}
                        className="cursor-pointer rounded-full border border-red-400 p-1 text-red-700  hover:text-red-500"
                        onClick={
                          !isLikeLoading
                            ? () => setLike((prev) => !prev)
                            : undefined
                        }
                      />
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
