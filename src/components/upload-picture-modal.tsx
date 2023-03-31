import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import catWaiting from "../../public/assets/waiting.jpg";
import { uploadFile } from "@uploadcare/upload-client";
import { api } from "~/utils/api";
import { Spinner } from "./spinner";

const publicKey = process.env.NEXT_PUBLIC_UPLOAD;

interface ViewModalPictureType {
  isOpen: boolean;
  closeModal: () => void;
}

export const UploadPictureModal = ({
  isOpen,
  closeModal,
}: ViewModalPictureType) => {
  const ctx = api.useContext();

  const { mutate: mutateImage, isLoading: isPosting } =
    api.image.savePost.useMutation({
      onSuccess: () => {
        void ctx.image.getAll.invalidate();
        closeModal();
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        console.error(errorMessage);
      },
    });

  const [preview, setPreview] = useState<string | undefined>();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [isUploading, setIsUploading] = useState(false);
  const [caption, setCaption] = useState("");

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl: string = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory whenever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    setSelectedFile(e.target.files[0]);
  };

  async function handleUpload(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    if (!selectedFile || !publicKey) return;

    setIsUploading(true);
    const result = await uploadFile(selectedFile, {
      publicKey,
      store: "auto",
      metadata: {
        subsystem: "uploader",
      },
    });

    if (!result.cdnUrl) return;

    mutateImage({ postUrl: result.cdnUrl, caption });
    setSelectedFile(undefined);
    setCaption("");
    setIsUploading(false);
  }

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
              {isPosting ? (
                <Spinner />
              ) : (
                <Dialog.Panel className="min-h-[500px] w-full transform overflow-hidden rounded-2xl bg-[#E9E9E9] px-10 py-6 text-left align-middle shadow-xl transition-all lg:w-1/2">
                  <form className="flex h-full flex-col items-center justify-between gap-4 bg-[#E9E9E9] py-4">
                    <label
                      htmlFor="uploadFile"
                      className="flex w-full cursor-pointer items-center justify-center border border-dashed border-black bg-white p-3 text-center text-slate-800 lg:w-96"
                    >
                      Click here to select a lovely image of your pet!
                    </label>
                    <input
                      id="uploadFile"
                      type="file"
                      className="bg-red-200"
                      accept="image/png, image/jpeg"
                      hidden
                      onChange={onSelectFile}
                    />

                    <Image
                      src={preview ?? catWaiting}
                      alt="Preview of uploaded picture"
                      className="aspect-square border border-black object-cover"
                      width={320}
                      height={320}
                    />
                    <p className="bg-[#E9E9E9] text-sm text-black">
                      {preview
                        ? "Nice, upload this one so everyone can see my friend."
                        : "Here, waiting for you to upload an image of a friend."}
                    </p>

                    <textarea
                      placeholder="Write a caption."
                      className="h-16 w-full p-2 text-black"
                      value={caption}
                      onChange={(e) => setCaption(e.currentTarget.value)}
                    />

                    <button
                      className=" w-1/2 rounded-xl bg-slate-800 p-2 hover:bg-slate-600 disabled:cursor-not-allowed disabled:bg-slate-400"
                      onClick={(e) => void handleUpload(e)}
                      disabled={isUploading}
                    >
                      Upload!
                    </button>
                  </form>
                </Dialog.Panel>
              )}
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
