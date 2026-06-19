// hooks/useDoctors.js — Public (Doctors listing page, Home page এর জন্য)
import useAxiosPublic from "./useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const useDoctors = () => {
  const axiosPublic = useAxiosPublic();

  const {
    data: doctors = [],
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["doctors-public"],
    queryFn: async () => {
      const res = await axiosPublic.get("/doctors");
      return res.data.doctors;
    },
  });

  return [doctors, isLoading, refetch, error];
};

export default useDoctors;