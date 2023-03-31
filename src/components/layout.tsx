import { type PropsWithChildren, useEffect } from "react";
import { Header } from "./header";
import { Footer } from "./footer";

export const Layout = (props: PropsWithChildren) => {
  const setViewHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  };

  useEffect(() => {
    setViewHeight();
    window.addEventListener("resize", setViewHeight);
    return () => {
      window.removeEventListener("resize", setViewHeight);
    };
  }, []);

  return (
    <>
      <div className="absolute inset-0">
        <main className="h-screen-custom flex justify-center overflow-hidden bg-gradient-to-br from-[#000000] to-[#434343] ">
          <div className=" flex h-full w-full flex-col justify-between border-x border-slate-400 md:max-w-2xl">
            <Header />
            {props.children}
            <Footer />
          </div>
        </main>
      </div>
    </>
  );
};
