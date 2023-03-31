import { api } from "~/utils/api";
import { Spinner } from "./spinner";
import { FeedItem } from "./feed-item";

export const Feed = () => {
  const { data: images, isLoading: isImagesLoading } =
    api.image.getAll.useQuery();

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
