import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Image from "next/image";

export const Header = () => {
  const { isLoaded: userLoaded, isSignedIn, user } = useUser();
  // console.log(user);

  return (
    <div className="flex items-center justify-between border-b-[1px] border-slate-100 p-4">
      <div className="flex items-center gap-2">
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
      <h2 className="logo text-3xl">
        <span className="text-blue-300">pet</span>stagram
      </h2>

      {!isSignedIn ? <SignInButton /> : <SignOutButton />}
    </div>
  );
};
