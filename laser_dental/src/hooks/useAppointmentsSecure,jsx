// useAppointmentsSecure.js — Admin dashboard এর জন্য
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const useAppointmentsSecure = (filters = {}) => {
  const axiosSecure = useAxiosSecure();
  const { status, location, date } = filters;

  const {
    data: appointments = [],
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["admin-appointments", status, location, date],
    queryFn: async () => {
      const params = {};
      if (status)   params.status   = status;
      if (location) params.location = location;
      if (date)     params.date     = date;

      const res = await axiosSecure.get("/appointments", { params });
      return res.data.appointments;
    },
  });

  return [appointments, isLoading, refetch, error];
};

export default useAppointmentsSecure;