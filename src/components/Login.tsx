import React, { useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();           
  const navigate = useNavigate();        

  const handleLogin = async () => {
    try {
      const response = await axios.post('/Auth/login', { username, password });

      const token = response.data.token;
      localStorage.setItem('token', token);
      login();                            

      navigate('/dashboard');            
    } catch (error) {
      setErrorMessage('Invalid credentials');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: '400px' }}>
        <h3 className="text-center mb-4">Login</h3>

        <div className="form-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          onClick={handleLogin}
          className="btn btn-primary w-100"
          disabled={!username || !password} 
        >
          Login
        </button>

        {errorMessage && <p className="text-danger text-center mt-3">{errorMessage}</p>}

      </div>
    </div>
  );
};

export default Login;
