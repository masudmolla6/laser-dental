// hooks/useFeaturedDoctors.js — Public (Home page এর "About Doctor" section এর জন্য)
// 1 doctor থাকলে এক জনই আসবে, future এ একাধিক isFeatured doctor থাকলে সবাই আসবে
import useAxiosPublic from "./useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const useFeaturedDoctors = () => {
  const axiosPublic = useAxiosPublic();

  const {
    data: doctors = [],
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["doctors-featured"],
    queryFn: async () => {
      const res = await axiosPublic.get("/doctors/featured");
      return res.data.doctors;
    },
  });

  return [doctors, isLoading, refetch, error];
};

export default useFeaturedDoctors;