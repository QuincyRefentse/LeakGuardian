import { Link, useLocation } from "wouter";
import { FaHome, FaClipboardList, FaPlus, FaMapMarkerAlt, FaUser } from "react-icons/fa";

const MobileNav = () => {
  const [location] = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="flex justify-around">
        <Link href="/">
          <a className={`flex flex-col items-center py-3 ${location === "/" ? "text-primary-600" : "text-gray-500"}`}>
            <FaHome className="text-xl" />
            <span className="text-xs mt-1">Home</span>
          </a>
        </Link>
        <Link href="/my-reports">
          <a className={`flex flex-col items-center py-3 ${location === "/my-reports" ? "text-primary-600" : "text-gray-500"}`}>
            <FaClipboardList className="text-xl" />
            <span className="text-xs mt-1">Reports</span>
          </a>
        </Link>
        <Link href="/report">
          <a className="flex flex-col items-center py-2">
            <div className="bg-primary-600 rounded-full p-3 -mt-6 shadow-lg">
              <FaPlus className="text-white text-xl" />
            </div>
            <span className="text-xs mt-1">Report</span>
          </a>
        </Link>
        <Link href="/map">
          <a className={`flex flex-col items-center py-3 ${location === "/map" ? "text-primary-600" : "text-gray-500"}`}>
            <FaMapMarkerAlt className="text-xl" />
            <span className="text-xs mt-1">Map</span>
          </a>
        </Link>
        <a href="#" className="flex flex-col items-center py-3 text-gray-500">
          <FaUser className="text-xl" />
          <span className="text-xs mt-1">Profile</span>
        </a>
      </div>
    </div>
  );
};

export default MobileNav;
