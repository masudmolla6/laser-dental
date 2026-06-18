import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useCheckAdmin from "../hooks/useCheckAdmin";
import DashboardSkeleton from "../components/DashboardSkeleton/DashboardSkeleton";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [admin, isAdminLoading] = useCheckAdmin();
  const location = useLocation();

  // 🔥 loading handle (VERY IMPORTANT)
  if (loading || isAdminLoading) {
    return <DashboardSkeleton></DashboardSkeleton>
  }

  // ✅ only admin allowed
  if (user && admin) {
    return children;
  }

  // ❌ block others
  return <Navigate to="/" state={{ from: location }} replace />;
};

export default AdminRoute;