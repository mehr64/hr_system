import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Login from './Login';
import Profile from './Profile';
import AdminDashboard from './AdminDashboard';
import AdminRoute from './AdminRoute';

function App() {
  const token = localStorage.getItem('token');

  let isAuthenticated = false;

  try {
    if (token) {
      const decoded = jwtDecode(token);
      isAuthenticated = !!decoded;
    }
  } catch (err) {
    isAuthenticated = false;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/" />}
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
