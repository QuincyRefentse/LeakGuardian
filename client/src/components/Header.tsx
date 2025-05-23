import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { FaWater, FaPlus } from "react-icons/fa";

interface HeaderProps {
  currentUser: { id: number; username: string } | null;
}

const Header = ({ currentUser }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center space-x-2">
            <div className="text-primary">
              <FaWater className="text-2xl" />
            </div>
            <h1 className="font-heading font-bold text-xl">
              <span className="text-primary">Leak</span>
              <span className="text-secondary-500">Alert</span>
            </h1>
          </div>
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/">
                  <span className="font-medium text-gray-700 hover:text-primary-600 cursor-pointer">Home</span>
                </Link>
              </li>
              <li>
                <Link href="/my-reports">
                  <span className="font-medium text-gray-700 hover:text-primary-600 cursor-pointer">My Reports</span>
                </Link>
              </li>
              <li>
                <Link href="/map">
                  <span className="font-medium text-gray-700 hover:text-primary-600 cursor-pointer">Map</span>
                </Link>
              </li>
              {currentUser?.id && (
                <li>
                  <Link href="/admin">
                    <span className="font-medium text-gray-700 hover:text-primary-600 cursor-pointer">Admin</span>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
          <Link href="/report">
            <Button className="flex items-center">
              <FaPlus className="mr-2" />
              Report Leak
            </Button>
          </Link>
        </div>
        <button className="md:hidden text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
