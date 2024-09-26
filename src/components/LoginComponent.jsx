import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginComponent.css'
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleLogin = async (event) => {
    event.preventDefault();

    // Check if the credentials are for the admin
    if (username === 'admin' && password === '1234AZERQSDF') {
      alert('hello');
      navigate('/alldemands');
      return;
    }

    // Check credentials against the database
    try {
      const response = await axios.post('http://localhost:8061/user/login', {
        username,
        mdp: password, 
        
        // Assuming the password field in your request payload is named 'mdp'
      });

      if (response.status === 200) {
        // Assuming the server returns a 200 status for successful authentication
        localStorage.setItem('userId', response.data.id); // Assuming ID is part of the response
console.log(localStorage.getItem('userId'));
        navigate('/demande');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 404) {
          alert('username or password incorrect');
        }
      } else {
        console.error('An error occurred during login:', error);
        alert('Une erreur s’est produite lors de la connexion.');
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="form">
        <div>
          <label htmlFor="username">Nom d utilisateur:</label>
          <input
          className="input"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Mot de passe:</label>
          <input
           className="input" 
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn">Connexion</button>
      </form>
    </div>
  );
};

export default Login;
