import { Link } from "wouter";
import { FaWater, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-primary-400">
                <FaWater className="text-2xl" />
              </div>
              <h3 className="font-heading font-bold text-xl text-white">
                Leak<span className="text-secondary-400">Alert</span>
              </h3>
            </div>
            <p className="text-gray-400 mb-4">
              Empowering citizens to report and resolve water leaks and infrastructure issues in their communities.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <FaFacebookF />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaTwitter />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaInstagram />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <span className="text-gray-400 hover:text-white cursor-pointer">Home</span>
                </Link>
              </li>
              <li>
                <Link href="/report">
                  <span className="text-gray-400 hover:text-white cursor-pointer">Report a Leak</span>
                </Link>
              </li>
              <li>
                <Link href="/map">
                  <span className="text-gray-400 hover:text-white cursor-pointer">View Leak Map</span>
                </Link>
              </li>
              <li>
                <Link href="/my-reports">
                  <span className="text-gray-400 hover:text-white cursor-pointer">My Reports</span>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <span className="text-gray-400 hover:text-white cursor-pointer">About Us</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Water Conservation Tips
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Community Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-gray-400" />
                <span className="text-gray-400">
                  123 Water Street, Suite 456
                  <br />
                  Anytown, ST 12345
                </span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-3 text-gray-400" />
                <span className="text-gray-400">(555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-gray-400" />
                <span className="text-gray-400">support@leakalert.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} LeakAlert. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
