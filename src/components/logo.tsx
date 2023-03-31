import { useRouter } from "next/router";

type LogoType = {
  className?: string;
  link?: boolean;
};

export const Logo = ({ className, link }: LogoType) => {
  const router = useRouter();

  return (
    <h2
      className={`logo text-3xl ${className ?? ""} ${
        link ? "cursor-pointer" : ""
      }`}
      onClick={link ? () => router.push("/") : undefined}
    >
      <span className="text-blue-300">pet</span>stagram
    </h2>
  );
};
