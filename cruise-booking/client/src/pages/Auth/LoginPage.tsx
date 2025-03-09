import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const LoginPage: React.FC = () => {
  const [userType, setUserType] = useState<'customer' | 'business'>('customer'); // New state for user type
  const { login, requestOtp, loading, error, clearError } = useAuth();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

  useEffect(() => {
    // Clear errors when component unmounts
    return () => {
      clearError();
      setOtpError(null);
    };
  }, [clearError]);

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    return phoneRegex.test(phone);
  };

  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setOtpError(null);
    clearError();
    
    if (!validatePhone(phone)) {
      setOtpError('Please enter a valid phone number');
      return;
    }

    const success = await requestOtp(phone);
    if (success) {
      setOtpRequested(true);
      setCountdown(60); // Start 60 second countdown
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    clearError();

    if (!otp || otp.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP');
      return;
    }

    await login({ phone, otp });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setUserType('customer')}
              className={`px-4 py-2 rounded ${userType === 'customer' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Customer
            </button>
            <button
              onClick={() => setUserType('business')}
              className={`px-4 py-2 rounded ${userType === 'business' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Business
            </button>
          </div>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>

        {(error || otpError) && (
          <div className="rounded-md bg-red-50 p-4 animate-fade-in">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {error || otpError}
                </h3>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={otpRequested ? handleLogin : handleRequestOtp}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="phone" className="sr-only">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className={`appearance-none rounded-t-md relative block w-full px-3 py-2 border ${
                  otpError && !otpRequested ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Phone Number (e.g., +1234567890)"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setOtpError(null);
                  clearError();
                }}
                disabled={otpRequested}
                pattern="^\+?[1-9]\d{9,14}$"
              />
            </div>
            {otpRequested && (
              <div>
                <label htmlFor="otp" className="sr-only">OTP</label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  className={`appearance-none rounded-b-md relative block w-full px-3 py-2 border ${
                    otpError ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                    setOtpError(null);
                    clearError();
                  }}
                  pattern="\d{6}"
                  maxLength={6}
                  autoComplete="one-time-code"
                />
              </div>
            )}
          </div>

          {otpRequested && (
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleRequestOtp()}
                disabled={countdown > 0 || loading}
                className="text-sm font-medium text-blue-600 hover:text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Resend OTP {countdown > 0 ? `(${countdown}s)` : ''}
              </button>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : null}
              {otpRequested ? 'Sign In' : 'Request OTP'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                Need help?
              </span>
            </div>
          </div>
          <div className="mt-6 text-center text-sm">
            <Link to="/contact" className="font-medium text-blue-600 hover:text-blue-500">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
