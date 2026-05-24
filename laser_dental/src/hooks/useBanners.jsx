import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useBanners = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: banners = [],
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["banners"],

    queryFn: async () => {
      const res = await axiosSecure.get("/banners");

      // because backend returns:
      // { success: true, banners: result }

      return res.data.banners;
    },
  });

  return [banners, isLoading, refetch, error];
};

export default useBanners;