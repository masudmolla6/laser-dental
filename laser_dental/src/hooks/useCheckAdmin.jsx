import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';


const useCheckAdmin = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: isAdmin = false, isLoading, refetch } = useQuery({
    queryKey: ["admin", user?.email],
    enabled: !!user?.email, // 🔥 important (prevents early call)
    queryFn: async () => {
      const res = await axiosSecure.get(`/admin/users/${user.email}`);
      return res.data?.isAdmin; // return boolean
    },
  });

  return [isAdmin, isLoading, refetch];
};

export default useCheckAdmin;