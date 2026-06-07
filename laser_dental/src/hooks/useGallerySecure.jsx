// useGallerySecure.js
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const useGallerySecure = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: gallery = [],
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/gallery");
      return res.data.gallery;
    },
  });

  return [gallery, isLoading, refetch, error];
};

export default useGallerySecure;