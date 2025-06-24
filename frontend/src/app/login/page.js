"use client"; 
import "../../styles/login.css";
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');  // Store error messages
  const [loading, setLoading] = useState(false); // Prevent multiple submissions
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message before a new request
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        router.push('/');
      }
    } catch (error) {
      console.error('Login error:', error);

      if (error.response) {
        if (error.response.status === 401) {
          setError('Invalid username or password.');
        } else {
          setError(error.response.data.message || 'Something went wrong. Try again.');
        }
      } else {
        setError('Connection failed. Check backend status.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-4 text-center">Admin Login</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>} {/* Error message */}

        <input 
          type="text" 
          placeholder="Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 mb-4 w-full" 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-4 w-full" 
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"} {/* Show loading text */}
        </button>
      </form>
    </div>
  );
}
