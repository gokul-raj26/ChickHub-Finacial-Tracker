import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simple authentication check
    if (email === 'Chickhuboffcl@gmail.com' && password === '2624') {
      setTimeout(() => {
        onLogin();
        setIsLoading(false);
      }, 1000);
    } else {
      setError('Invalid email or password');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-white">CH</span>
          </div>
          <h2 className="text-3xl font-bold text-orange-400">ChickHub</h2>
          <p className="mt-2 text-gray-400">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Demo Credentials: Chickhuboffcl@gmail.com / 2624
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;