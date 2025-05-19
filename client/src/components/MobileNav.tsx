import { Link, useLocation } from "wouter";
import { FaHome, FaClipboardList, FaPlus, FaMapMarkerAlt, FaUser } from "react-icons/fa";

const MobileNav = () => {
  const [location] = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="flex justify-around">
        <Link href="/">
          <div className={`flex flex-col items-center py-3 ${location === "/" ? "text-primary-600" : "text-gray-500"}`}>
            <FaHome className="text-xl" />
            <span className="text-xs mt-1">Home</span>
          </div>
        </Link>
        <Link href="/my-reports">
          <div className={`flex flex-col items-center py-3 ${location === "/my-reports" ? "text-primary-600" : "text-gray-500"}`}>
            <FaClipboardList className="text-xl" />
            <span className="text-xs mt-1">Reports</span>
          </div>
        </Link>
        <Link href="/report">
          <div className="flex flex-col items-center py-2">
            <div className="bg-primary-600 rounded-full p-3 -mt-6 shadow-lg">
              <FaPlus className="text-white text-xl" />
            </div>
            <span className="text-xs mt-1">Report</span>
          </div>
        </Link>
        <Link href="/map">
          <div className={`flex flex-col items-center py-3 ${location === "/map" ? "text-primary-600" : "text-gray-500"}`}>
            <FaMapMarkerAlt className="text-xl" />
            <span className="text-xs mt-1">Map</span>
          </div>
        </Link>
        <div className="flex flex-col items-center py-3 text-gray-500">
          <FaUser className="text-xl" />
          <span className="text-xs mt-1">Profile</span>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
