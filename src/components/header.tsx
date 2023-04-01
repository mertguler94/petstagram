import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Logo } from "./logo";
import { useRouter } from "next/router";
import useWindowDimensions from "~/hooks/use-window-dimensions";

export const Header = () => {
  const { isLoaded: userLoaded, isSignedIn, user } = useUser();

  const router = useRouter();
  const screen = useWindowDimensions();

  return (
    <div className="grid grid-cols-3 border-b-[1px] border-slate-100 p-4">
      {isSignedIn && (
        <div className="flex items-center gap-2">
          {user?.profileImageUrl && (
            <Image
              src={user?.profileImageUrl}
              alt="Your profile picture"
              width={40}
              height={40}
              className="cursor-pointer rounded-full"
              onClick={() => void router.push(`/user/${user?.id ?? ""}`)}
            />
          )}
          {screen !== "sm" && (
            <span
              onClick={() => void router.push(`/user/${user?.id ?? ""}`)}
              className="cursor-pointer"
            >
              {(user?.username || user?.fullName) ?? ""}
            </span>
          )}
        </div>
      )}
      <div className="col-start-2 col-end-2 self-center justify-self-center">
        <Logo link />
      </div>

      {!isSignedIn ? (
        <div className="self-center justify-self-end ">
          <SignInButton />
        </div>
      ) : (
        <div className="self-center justify-self-end">
          <SignOutButton />
        </div>
      )}
    </div>
  );
};
