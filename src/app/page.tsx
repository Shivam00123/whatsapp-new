"use client";

import LeftPanel from "@/components/Home/left-panel";
import RightPanel from "@/components/Home/right-panel";
import Loader from "@/components/Loader";
import { useLoaderState } from "@/store/loader";

export default function Home() {
  const { loaderState } = useLoaderState();
  return (
    <main className="m-5">
      {loaderState && (
        <div className="w-screen h-screen absolute z-50 flex items-center justify-center">
          <div className="w-full h-full bg-black bg-opacity-50 backdrop-blur-lg absolute top-0"></div>
          <Loader />
        </div>
      )}
      <div className="flex overflow-y-hidden h-[calc(100vh-50px)] max-w-[1700px] mx-auto bg-left-panel">
        {/* Green background decorator for Light Mode */}
        <div className="fixed top-0 left-0 w-full h-36 bg-green-primary dark:bg-transparent -z-30" />
        <LeftPanel />
        <RightPanel />
      </div>
    </main>
  );
}
