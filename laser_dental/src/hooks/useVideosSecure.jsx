// hooks/useVideosSecure.js — Admin dashboard এর জন্য (active + inactive সব video)
import useAxiosSecure from "./useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const useVideosSecure = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: videos = [],
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["admin-videos"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/videos");
      return res.data.videos;
    },
  });

  return [videos, isLoading, refetch, error];
};

export default useVideosSecure;