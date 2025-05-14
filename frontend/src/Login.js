import { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';


function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

const handleLogin = async () => {
  try {
    const res = await axios.post('http://localhost:5000/api/login', {
      username,
      password
    });

    localStorage.setItem('token', res.data.token);
    const decoded = jwtDecode(res.data.token);

    if (decoded.role === 'admin') {
      setMessage('Login successful! Welcome Admin!');
    } else {
      setMessage('Login successful! Welcome User!');
    }
    navigate('/profile');

  } catch (err) {
    setMessage('Login failed. Check your credentials.');
  }
};


  return (
    <div>
      <h2>Login</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <br />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <br />
      <button onClick={handleLogin}>Login</button>
      <p>{message}</p>
    </div>
  );
}

export default Login;
