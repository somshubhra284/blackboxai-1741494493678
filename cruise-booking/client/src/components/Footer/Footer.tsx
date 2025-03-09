import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Cruise Booking</h3>
            <p className="text-gray-400">
              Experience luxury cruises to the world's most beautiful destinations.
              Book your dream vacation today.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/cruises" className="text-gray-400 hover:text-white">
                  Find Cruises
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="text-gray-400 hover:text-white">
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/special-deals" className="text-gray-400 hover:text-white">
                  Special Deals
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <address className="text-gray-400 not-italic">
              <p>1234 Cruise Way,</p>
              <p>Miami, FL 33101</p>
              <p className="mt-2">
                <a href="tel:(555) 123-4567" className="hover:text-white">
                  (555) 123-4567
                </a>
              </p>
              <p>
                <a href="mailto:info@cruisebooking.com" className="hover:text-white">
                  info@cruisebooking.com
                </a>
              </p>
            </address>
          </div>
        </div>
      </div>
    </footer>
  );
}
