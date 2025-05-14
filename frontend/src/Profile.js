import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Profile.css'

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
    <div className="profile-container">
      <h2 className="profile-title">🛡️ Profile Page</h2>
      <p className="profile-user">Welcome, {username}</p>
      <p className="profile-user">Your role: {role}</p>
      <hr />
      <p>This is a protected section of the app.</p>
      <button onClick={handleLogout} className="profile-btn">Logout</button>
    </div>
  );

}

export default Profile;
