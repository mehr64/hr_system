import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';

function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let role = '';
  let username = '';

  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
      username = decoded.username;
    } catch (err) {
      console.error('Invalid token');
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card p-4 shadow-sm" style={{ maxWidth: '400px', width: '100%' }}>
        <h4 className="text-center mb-3">🛡️ Profile Page</h4>
        <p className="text-center fw-bold">Welcome, {username}</p>
        <p className="text-center text-muted">Your role: {role}</p>
        <hr />
        <p className="text-center">This is a protected section of the app.</p>
        <button className="btn btn-primary w-100 mt-3" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
