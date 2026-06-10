// useServicesSecure.js — Admin Dashboard এর জন্য
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
 
const useServicesSecure = () => {
  const axiosSecure = useAxiosSecure();
 
  const {
    data: services = [],
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["admin-services"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/services");
      return res.data.services;
    },
  });
 
  return [services, isLoading, refetch, error];
};
 
export default useServicesSecure;
