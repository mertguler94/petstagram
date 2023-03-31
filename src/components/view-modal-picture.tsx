import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { Fragment } from "react";
import { type RouterOutputs, api } from "~/utils/api";
import { AiOutlineCloseCircle } from "react-icons/ai";

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
                  <Image
                    src={src.postUrl}
                    alt="Pet photo"
                    className="rounded-2xl object-cover"
                    width={450}
                    height={450}
                  />
                  <div className="flex justify-between text-slate-800">
                    <div className="flex items-center gap-2">
                      {userData?.profileImageUrl && (
                        <Image
                          src={userData?.profileImageUrl}
                          alt="profile image"
                          width={50}
                          height={50}
                          className="rounded-full"
                        />
                      )}
                      <h4>{userData?.username}</h4>
                    </div>
                    <p className="text-sm">{src.createdAt.toLocaleString()}</p>
                  </div>
                  {src.caption && <p className="text-black">{src.caption}</p>}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
