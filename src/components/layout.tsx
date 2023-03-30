import type { PropsWithChildren } from "react";

export const Layout = (props: PropsWithChildren) => {
  return (
    <div className="absolute inset-0">
      <main className="flex h-screen justify-center overflow-hidden">
        <div className="flex h-full w-full flex-col justify-between border-x border-slate-400 md:max-w-2xl">
          {props.children}
        </div>
      </main>
    </div>
  );
};
