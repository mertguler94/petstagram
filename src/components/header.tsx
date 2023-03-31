import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Logo } from "./logo";
import { useRouter } from "next/router";

export const Header = () => {
  const { isLoaded: userLoaded, isSignedIn, user } = useUser();

  const router = useRouter();

  return (
    <div className="grid grid-cols-3 border-b-[1px] border-slate-100 p-4">
      <div
        className="flex cursor-pointer items-center gap-2"
        onClick={() => void router.push(`/user/${user?.id ?? ""}`)}
      >
        {user?.profileImageUrl && (
          <Image
            src={user?.profileImageUrl}
            alt="Your profile picture"
            width={40}
            height={40}
            className="rounded-full"
          />
        )}
        <span>{(user?.username || user?.fullName) ?? ""}</span>
      </div>
      <div className="self-center justify-self-center">
        <Logo link />
      </div>

      {!isSignedIn ? (
        <div className="self-center justify-self-end">
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
