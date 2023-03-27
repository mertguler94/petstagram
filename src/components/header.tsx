import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

export const Header = () => {
  const { isLoaded: userLoaded, isSignedIn, user } = useUser();
  console.log(user);

  return (
    <div className="flex items-center justify-between border-b-[1px] border-slate-100 p-4">
      <span>{user?.username ?? ""}</span>
      <h2 className="logo text-3xl">
        <span className="text-blue-300">pet</span>stagram
      </h2>

      {!isSignedIn ? <SignInButton /> : <SignOutButton />}
    </div>
  );
};
