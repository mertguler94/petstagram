import Image, { type StaticImageData } from "next/image";
import cat from "../../public/assets/cat.webp";
import { useState } from "react";
import { ViewModalPicture } from "./view-modal-picture";

const mock = new Array(20).fill(cat);

export const Feed = () => {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  return (
    <div className="grid grid-cols-3 overflow-y-scroll">
      {mock.map((src: StaticImageData, idx) => (
        <>
          <Image
            className="aspect-square cursor-pointer border border-black object-cover"
            key={idx}
            src={src}
            alt="Pet"
            onClick={openModal}
          />

          <ViewModalPicture isOpen={isOpen} closeModal={closeModal} src={src} />
        </>
      ))}
    </div>
  );
};
