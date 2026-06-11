// useReviews.js — Public (Testimonials page এর জন্য)
import useAxiosPublic from './useAxiosPublic';
import { useQuery } from '@tanstack/react-query';

const useReviews = () => {
  const axiosPublic = useAxiosPublic();

  const {
    data: reviews = [],
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["reviews-public"],
    queryFn: async () => {
      const res = await axiosPublic.get("/reviews/public");
      return res.data.reviews;
    },
  });

  return [reviews, isLoading, refetch, error];
};

export default useReviews;