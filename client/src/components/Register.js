import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Country, State, City } from 'country-state-city';
import ReCAPTCHA from 'react-google-recaptcha';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    country: 'IN', // Default country (India) - you can change this as needed
    state: '',
    city: '',
  });
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { name, email, password, country, state, city } = formData;

  // Load countries on component mount
  useEffect(() => {
    const fetchedCountries = Country.getAllCountries();
    setCountries(fetchedCountries);
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (country) {
      const fetchedStates = State.getStatesOfCountry(country);
      setStates(fetchedStates);
      setFormData(prev => ({ ...prev, state: '', city: '' }));
    }
  }, [country]);

  // Load cities when state changes
  useEffect(() => {
    if (country && state) {
      const fetchedCities = City.getCitiesOfState(country, state);
      setCities(fetchedCities);
      setFormData(prev => ({ ...prev, city: '' }));
    }
  }, [country, state]);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onRecaptchaChange = token => {
    setRecaptchaToken(token);
  };

  // This is a simpler fix that bypasses the city object lookup
const onSubmit = async e => {
    e.preventDefault();
    
    if (!recaptchaToken) {
      setError('Please complete the reCAPTCHA verification');
      return;
    }
  
    setLoading(true);
    try {
      // Get state name
      const selectedState = states.find(s => s.isoCode === state);
      const stateName = selectedState?.name || '';
      
      // Get city name directly from the select element
      const citySelect = document.getElementById('city');
      const cityName = citySelect?.options[citySelect.selectedIndex]?.text || '';
      
      // Make sure we have a city
      if (!cityName || cityName === 'Select City') {
        throw new Error('Please select a valid city');
      }
      
      console.log('Submitting with city:', cityName);
  
      const res = await axios.post('http://localhost:5000/api/register', {
        name,
        email,
        password,
        state: stateName,
        city: cityName,
        recaptchaToken
      });
  
      setMessage(res.data.message);
      setError('');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        country: 'IN',
        state: '',
        city: ''
      });
      setRecaptchaToken('');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || err.message || 'Registration failed');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Create your account</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join us today and get started with your journey
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {message && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{message}</span>
            </div>
          )}
          
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={onChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={onChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={onChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <div className="mt-1">
                <select
                  id="country"
                  name="country"
                  value={country}
                  onChange={onChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.isoCode} value={country.isoCode}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <div className="mt-1">
                  <select
                    id="state"
                    name="state"
                    value={state}
                    onChange={onChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    disabled={!country}
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <div className="mt-1">
                  <select
                    id="city"
                    name="city"
                    value={city}
                    onChange={onChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    disabled={!state}
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-center">
                <ReCAPTCHA
                  sitekey="6LdIRSIrAAAAALcCQPT-QvsdXVhYjnIJs93TBjiB"
                  onChange={onRecaptchaChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <Link 
                  to="/login" 
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Sign In
                </Link>
              </div>
              <div>
                <Link 
                  to="/admin/login" 
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Admin Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;