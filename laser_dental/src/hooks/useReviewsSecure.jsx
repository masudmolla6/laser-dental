// useReviewsSecure.js — Admin dashboard এর জন্য
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const useReviewsSecure = (status = "") => {
  const axiosSecure = useAxiosSecure();

  const {
    data: reviews = [],
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["admin-reviews", status],
    queryFn: async () => {
      const params = {};
      if (status) params.status = status;
      const res = await axiosSecure.get("/reviews", { params });
      return res.data.reviews;
    },
  });

  return [reviews, isLoading, refetch, error];
};

export default useReviewsSecure;