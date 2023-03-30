import Image from "next/image";
import { useState } from "react";
import { ViewModalPicture } from "./view-modal-picture";
import { api } from "~/utils/api";
import { Spinner } from "./spinner";
import { FeedItem } from "./feed-item";

export const Feed = () => {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const { data: images, isLoading: isImagesLoading } =
    api.image.getAll.useQuery();

  if (isImagesLoading) return <Spinner />;
  if (!images) return <div>Something went wrong</div>;

  return (
    <div className="h-full">
      <div className="no-scrollbar grid grid-cols-3 overflow-y-scroll">
        {images.map((image) => (
          <FeedItem key={image.id} {...image} />
        ))}
      </div>
    </div>
  );
};
