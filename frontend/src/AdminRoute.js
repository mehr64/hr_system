// components/AdminRoute.js
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token);
    return decoded.role === 'admin' ? children : <Navigate to="/profile" />;
  } catch (err) {
    return <Navigate to="/login" />;
  }
};

export default AdminRoute;
