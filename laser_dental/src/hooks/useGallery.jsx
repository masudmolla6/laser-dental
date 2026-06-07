// useGallery.js — Public (website gallery page এর জন্য)
import useAxiosPublic from './useAxiosPublic';
import { useQuery } from '@tanstack/react-query';

const useGallery = (category = "", status = "published") => {
  const axiosPublic = useAxiosPublic();

  const {
    data: gallery = [],
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["gallery", category, status],  // ✅ category change হলে re-fetch হবে
    queryFn: async () => {
      const params = { status };
      if (category) params.category = category;

      const res = await axiosPublic.get("/gallery", { params });
      return res.data.gallery;
    },
  });

  return [gallery, isLoading, refetch, error];
};

export default useGallery;