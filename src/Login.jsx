


import { useState } from 'react';
import { API_BASE } from './api'

export default function Registration({ onSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [language, setLanguage] = useState('English');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!name.trim() || !email.trim() || !birthday) {
      setError('Please enter name, email, and birthday.');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    
    const birthDate = new Date(birthday);
    const today = new Date();
    if (birthDate > today) {
      setError('Birthday cannot be in the future.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
  const res = await fetch(`${API_BASE}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: name.trim(), 
          email: email.trim().toLowerCase(), 
          birthday, 
          language 
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        if (data.existing) {
          // existing user - inform and continue
          alert('Account already exists. Signing you in.');
          if (onSuccess) onSuccess(data.id);
        } else {
          alert('User saved successfully!');
          if (onSuccess) onSuccess(data.id);
        }
      } else {
        setError(data.error || 'Failed to save user. Please try again.');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img src="/vite.svg" alt="Logo" className="h-16 w-16 mb-2" />
          <h2 className="text-2xl font-bold text-center">User Registration</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              id="name"
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">Birthday</label>
            <input
              id="birthday"
              type="date"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={birthday}
              onChange={e => setBirthday(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language</label>
            <select
              id="language"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={language}
              onChange={e => setLanguage(e.target.value)}
            >
              <option value="English">English</option>
              <option value="Chinese">Chinese</option>
            </select>
          </div>
          {error && <div className="text-red-500 text-sm p-2 bg-red-50 rounded">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 transition"
          >
            {loading ? 'Creating Account...' : 'Let\'s Dive'}
          </button>
        </form>
      </div>
    </div>
  );
}