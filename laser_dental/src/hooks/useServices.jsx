// useServices.js — Public (Home page এর জন্য)
import useAxiosPublic from './useAxiosPublic';
import { useQuery } from '@tanstack/react-query';
 
const useServices = () => {
  const axiosPublic = useAxiosPublic();
 
  const {
    data: services = [],
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["services-public"],
    queryFn: async () => {
      const res = await axiosPublic.get("/services");
      return res.data.services;
    },
  });
 
  return [services, isLoading, refetch, error];
};
 
export default useServices;