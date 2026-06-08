// useBanners.js — Public (Home page এর জন্য)
import useAxiosPublic from './useAxiosPublic';
import { useQuery } from '@tanstack/react-query';

const useBanners = () => {
  const axiosPublic = useAxiosPublic();

  const {
    data: banners = [],
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["banners-public"],
    queryFn: async () => {
      const res = await axiosPublic.get("/banners/public");
      return res.data.banners;
    },
  });

  return [banners, isLoading, refetch, error];
};

export default useBanners;