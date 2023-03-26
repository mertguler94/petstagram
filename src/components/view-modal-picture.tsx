import { Dialog, Transition } from "@headlessui/react";
import Image, { type StaticImageData } from "next/image";
import { Fragment } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";

interface ViewModalPictureType {
  isOpen: boolean;
  closeModal: () => void;
  src: StaticImageData;
}

export const ViewModalPicture = ({
  isOpen,
  closeModal,
  src,
}: ViewModalPictureType) => {
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
              <Dialog.Panel className="w-4/5 transform overflow-hidden rounded-2xl bg-[#E9E9E9] text-left align-middle shadow-xl transition-all sm:w-3/5 md:w-2/5">
                <Image src={src} alt="Pet photo" />
                {/* <button
                  type="button"
                  onClick={closeModal}
                  className="absolute top-8 right-4 cursor-pointer bg-transparent text-white focus:outline-none"
                >
                  <AiOutlineCloseCircle size={36} />
                </button> */}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
