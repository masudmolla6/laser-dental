// hooks/useActiveVideo.js — Public (Home page Hero section এর জন্য)
import useAxiosPublic from "./useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const useActiveVideo = () => {
  const axiosPublic = useAxiosPublic();

  const {
    data: video = null,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["video-active"],
    queryFn: async () => {
      const res = await axiosPublic.get("/videos/active");
      return res.data.video;
    },
  });

  return [video, isLoading, refetch, error];
};

export default useActiveVideo;