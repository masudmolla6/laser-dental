// useGallerySecure.js — Dashboard (admin এর জন্য)
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const useGallerySecure = (category = "", status = "") => {
  const axiosSecure = useAxiosSecure();

  const {
    data: gallery = [],
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["gallery-secure", category, status],
    queryFn: async () => {
      const params = {};
      if (category) params.category = category;
      if (status) params.status = status;

      const res = await axiosSecure.get("/gallery", { params });
      return res.data.gallery;
    },
  });

  return [gallery, isLoading, refetch, error];
};

export default useGallerySecure;