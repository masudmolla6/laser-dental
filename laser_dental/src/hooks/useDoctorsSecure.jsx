// hooks/useDoctorsSecure.js — Admin dashboard এর জন্য (active + inactive সব doctor)
import useAxiosSecure from "./useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const useDoctorsSecure = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: doctors = [],
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["admin-doctors"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/doctors");
      return res.data.doctors;
    },
  });

  return [doctors, isLoading, refetch, error];
};

export default useDoctorsSecure;