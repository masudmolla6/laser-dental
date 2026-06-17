// hooks/useBranchesSecure.js — Admin dashboard এর জন্য (active + inactive সব branch)
import useAxiosSecure from "./useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const useBranchesSecure = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: branches = [],
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["admin-branches"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/branches");
      return res.data.branches;
    },
  });

  return [branches, isLoading, refetch, error];
};

export default useBranchesSecure;