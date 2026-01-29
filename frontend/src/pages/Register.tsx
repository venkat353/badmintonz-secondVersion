import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Stop page reload
    
    // DEBUG LOGS - Check your Browser Console (F12) for these!
    console.log("1. Register Button Clicked!"); 
    console.log("2. Form Data being sent:", formData);

    setError('');

    try {
      console.log("3. Sending request to backend...");
      const response = await fetch('https://badmintoz.shop/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log("4. Response received. Status:", response.status);

      if (response.ok) {
        console.log("5. Success!");
        alert('Registration Successful! Please Login.');
        navigate('/login');
      } else {
        const data = await response.text();
        console.error("5. Failed:", data);
        setError(data || 'Registration failed');
      }
    } catch (err) {
      console.error('6. Network Error:', err);
      setError('Something went wrong. Is the backend running?');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Create Account</h2>
        
        {error && <div className="p-3 text-sm text-red-600 bg-red-100 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" name="name" required className="w-full px-3 py-2 mt-1 border rounded-md" 
              value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" required className="w-full px-3 py-2 mt-1 border rounded-md" 
              value={formData.email} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" required className="w-full px-3 py-2 mt-1 border rounded-md" 
              value={formData.password} onChange={handleChange} />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}