import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            Cruise Booking
          </Link>

          <div className="hidden md:flex space-x-8">
            <Link
              to="/cruises"
              className="text-gray-700 hover:text-primary-600"
            >
              Cruises
            </Link>
            <Link
              to="/destinations"
              className="text-gray-700 hover:text-primary-600"
            >
              Destinations
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-primary-600"
            >
              About
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/sign-in"
              className="text-gray-700 hover:text-primary-600"
            >
              Sign In
            </Link>
            <Link
              to="/sign-up"
              className="btn bg-primary-600 text-white hover:bg-primary-700"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
