// hooks/useBranches.js — Public (Appointment Form, Home page এর জন্য)
import useAxiosPublic from "./useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const useBranches = () => {
  const axiosPublic = useAxiosPublic();

  const {
    data: branches = [],
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["branches-public"],
    queryFn: async () => {
      const res = await axiosPublic.get("/branches");
      return res.data.branches;
    },
  });

  return [branches, isLoading, refetch, error];
};

export default useBranches;