// hooks/useService.js
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from './useAxiosPublic';


const useService = (id) => {
  const axiosPublic = useAxiosPublic();

  const {
    data: service = null,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["service", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await axiosPublic.get(`/services/${id}`);
      return res.data.service || res.data;
    },
    enabled: !!id, // id থাকলেই কেবল fetch করবে
  });

  return [service, isLoading, refetch, error];
};

export default useService;