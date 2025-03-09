const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Cruise Booking</h3>
            <p className="text-gray-400">
              Experience luxury cruises to the world's most beautiful destinations. Book your dream vacation today.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/cruises" className="text-gray-400 hover:text-white">Find Cruises</a>
              </li>
              <li>
                <a href="/destinations" className="text-gray-400 hover:text-white">Destinations</a>
              </li>
              <li>
                <a href="/special-deals" className="text-gray-400 hover:text-white">Special Deals</a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-white">About Us</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="/contact" className="text-gray-400 hover:text-white">Contact Us</a>
              </li>
              <li>
                <a href="/faq" className="text-gray-400 hover:text-white">FAQ</a>
              </li>
              <li>
                <a href="/terms" className="text-gray-400 hover:text-white">Terms & Conditions</a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li>1234 Cruise Way,</li>
              <li>Miami, FL 33101</li>
              <li>
                <a href="tel:(555)123-4567" className="hover:text-white">(555) 123-4567</a>
              </li>
              <li>
                <a href="mailto:info@cruisebooking.com" className="hover:text-white">
                  info@cruisebooking.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Cruise Booking. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
