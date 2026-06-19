// hooks/useDoctorById.js — Admin (Edit Doctor form pre-fill এর জন্য)
import useAxiosSecure from "./useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const useDoctorById = (id) => {
  const axiosSecure = useAxiosSecure();

  const {
    data: doctor = null,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["doctor-by-id", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/doctors/${id}`);
      return res.data.doctor;
    },
    enabled: !!id, // id না থাকলে query চালাবে না
  });

  return [doctor, isLoading, refetch, error];
};

export default useDoctorById;