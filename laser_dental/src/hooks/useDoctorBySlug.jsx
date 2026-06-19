// hooks/useDoctorBySlug.js — Public (Doctor Details page এর জন্য, route: /doctors/:slug)
import useAxiosPublic from "./useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const useDoctorBySlug = (slug) => {
  const axiosPublic = useAxiosPublic();

  const {
    data: doctor = null,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["doctor-by-slug", slug],
    queryFn: async () => {
      const res = await axiosPublic.get(`/doctors/slug/${slug}`);
      return res.data.doctor;
    },
    enabled: !!slug, // slug না থাকলে query চালাবে না
  });

  return [doctor, isLoading, refetch, error];
};

export default useDoctorBySlug;