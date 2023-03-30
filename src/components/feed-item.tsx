import Image from "next/image";
import { useState } from "react";
import type { RouterOutputs } from "~/utils/api";
import { ViewModalPicture } from "./view-modal-picture";

type Post = RouterOutputs["image"]["getAll"][0];

export const FeedItem = (image: Post) => {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <div
      key={image.id}
      className="relative col-span-1 grid aspect-square gap-y-0"
    >
      <Image
        className="cursor-pointer border border-black object-cover"
        src={image.postUrl}
        alt="Pet"
        onClick={openModal}
        fill
      />
      <ViewModalPicture isOpen={isOpen} closeModal={closeModal} src={image} />
    </div>
  );
};
