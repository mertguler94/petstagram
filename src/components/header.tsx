import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

export const Header = () => {
  const { isLoaded: userLoaded, isSignedIn, user } = useUser();
  console.log(user);

  return (
    <div className="flex justify-between border-b-[1px] border-slate-100 p-4">
      <span>{user?.username ?? ""}</span>
      <button className="h-6 w-6 rounded-lg bg-slate-300 text-slate-800 hover:bg-slate-400">
        +
      </button>
      {!isSignedIn ? <SignInButton /> : <SignOutButton />}
    </div>
  );
};
