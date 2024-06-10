"use client";

import dynamic from "next/dynamic";

const DynamicVideoUI = dynamic(() => import("./video-ui-kit"), { ssr: false });

const VideoCall = () => {
  return <DynamicVideoUI />;
};

export default VideoCall;
