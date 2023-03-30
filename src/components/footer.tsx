import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { UploadPictureModal } from "./upload-picture-modal";

export const Footer = () => {
  const { isLoaded: userLoaded, isSignedIn, user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  if (!isSignedIn) return null;

  return (
    <div className="flex items-center justify-center border border-slate-100 p-4">
      <button
        className="h-6 w-6 rounded-lg bg-slate-300 text-slate-800 hover:bg-slate-400"
        onClick={openModal}
      >
        +
      </button>
      <UploadPictureModal isOpen={isOpen} closeModal={closeModal} />
    </div>
  );
};
