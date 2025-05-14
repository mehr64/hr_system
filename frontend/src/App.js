import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import Login from './Login';
import Profile from './Profile';

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
          element={
            isAuthenticated ? <Profile /> : <Navigate to="/" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
