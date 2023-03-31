import { api } from "~/utils/api";
import { Spinner } from "./spinner";
import { FeedItem } from "./feed-item";

export const Feed = () => {
  const { data: images, isLoading: isImagesLoading } =
    api.image.getAll.useQuery();

  if (isImagesLoading) return <Spinner />;
  if (!images) return <div>Something went wrong</div>;

  return (
    <div className=" h-full overflow-y-scroll">
      <div className=" grid grid-cols-3">
        {images.map((image) => (
          <FeedItem key={image.id} {...image} />
        ))}
      </div>
    </div>
  );
};
