import Image from "next/image";
import { useState } from "react";
import type { RouterOutputs } from "~/utils/api";
import { ViewModalPicture } from "./view-modal-picture";
import { type Prisma } from "@prisma/client";
import { BsHeart } from "react-icons/bs";

type Post = RouterOutputs["image"]["getAll"][0];

export const FeedItem = (image: Post) => {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const peopleLiked = (image.likedBy as Prisma.JsonArray) ?? [];

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
      <div className="pointer-events-none z-10 flex items-end justify-end bg-gradient-to-t from-black to-transparent px-3 py-2 opacity-70">
        <div className="flex items-center gap-2">
          <BsHeart size={14} />
          <span className="z-20 cursor-default text-sm text-white">
            {peopleLiked.length}
          </span>
        </div>
      </div>

      <ViewModalPicture isOpen={isOpen} closeModal={closeModal} src={image} />
    </div>
  );
};
