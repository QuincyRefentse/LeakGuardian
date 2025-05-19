import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { FaPlus, FaMapMarkerAlt, FaCamera, FaMapPin, FaCheckCircle, FaChevronDown, FaApple, FaGooglePlay, FaWater } from "react-icons/fa";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { IMAGES } from "@/lib/constants";

const Home = () => {
  const [recentReports, setRecentReports] = useState([
    {
      id: 1,
      title: "Fire Hydrant Leak",
      description: "Large leak from hydrant on Main St causing sidewalk flooding and potential road damage.",
      location: "1234 Main St, Central District",
      image: IMAGES.WATER_LEAKS[1],
      status: "in_progress",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      user: { name: "Michael S." },
      likes: 12
    },
    {
      id: 2,
      title: "Underground Pipe Leak",
      description: "Water continuously seeping through sidewalk cracks, creating slippery conditions for pedestrians.",
      location: "567 Oak Ave, Westside",
      image: IMAGES.WATER_LEAKS[2],
      status: "resolved",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      user: { name: "Sophia T." },
      likes: 24
    },
    {
      id: 3,
      title: "Bridge Infrastructure Damage",
      description: "Significant structural damage and water seepage on the north side of Johnson Bridge. Poses safety hazard.",
      location: "Johnson Bridge, River District",
      image: IMAGES.INFRASTRUCTURE_DAMAGE[0],
      status: "urgent",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      user: { name: "David R." },
      likes: 47
    }
  ]);

  return (
    <div className="pb-20 md:pb-10">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative container mx-auto px-4 py-12 md:py-24 flex flex-col items-center text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl mb-6">
            Report Water Leaks & Infrastructure Issues
          </h2>
          <p className="text-lg md:text-xl max-w-2xl mb-8">
            Help your community by reporting water leaks and infrastructure damage. Your reports make a difference!
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/report">
              <Button className="bg-white text-primary-700 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg flex items-center justify-center h-auto">
                <FaPlus className="mr-2" /> Report a Leak
              </Button>
            </Link>
            <Link href="/map">
              <Button className="bg-secondary-500 hover:bg-secondary-600 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center h-auto">
                <FaMapMarkerAlt className="mr-2" /> View Leak Map
              </Button>
            </Link>
          </div>
          <div className="mt-10 md:mt-16 grid grid-cols-3 gap-6 w-full max-w-2xl">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-bold">2,450+</span>
              <span className="text-sm mt-1">Issues Reported</span>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-bold">87%</span>
              <span className="text-sm mt-1">Resolution Rate</span>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-bold">1.2M</span>
              <span className="text-sm mt-1">Gallons Saved</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl text-gray-800 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our simple process makes it easy to report leaks and track their resolution
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCamera className="text-2xl" />
              </div>
              <h3 className="font-heading font-semibold text-xl mb-3">Document the Issue</h3>
              <p className="text-gray-600">
                Take photos or videos of the leak or infrastructure damage you've spotted.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMapPin className="text-2xl" />
              </div>
              <h3 className="font-heading font-semibold text-xl mb-3">Submit Your Report</h3>
              <p className="text-gray-600">
                Fill out a simple form with location details and upload your media evidence.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-2xl" />
              </div>
              <h3 className="font-heading font-semibold text-xl mb-3">Track Resolution</h3>
              <p className="text-gray-600">
                Receive updates as your municipality addresses the reported issue.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Reports Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-heading font-bold text-2xl text-gray-800">Recent Reports</h2>
            <Link href="/map">
              <a className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
                View all <span className="ml-2">→</span>
              </a>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  <img
                    src={report.image}
                    alt={report.title}
                    className="w-full h-48 object-cover"
                  />
                  <div
                    className={`absolute top-3 right-3 ${
                      report.status === "urgent"
                        ? "bg-red-500"
                        : report.status === "in_progress"
                        ? "bg-amber-500"
                        : "bg-secondary-500"
                    } text-white text-xs font-medium py-1 px-2 rounded-full`}
                  >
                    {report.status === "urgent"
                      ? "Urgent"
                      : report.status === "in_progress"
                      ? "In Progress"
                      : "Resolved"}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-heading font-semibold text-lg">{report.title}</h3>
                    <span className="text-gray-500 text-sm">
                      {report.createdAt.toLocaleDateString(undefined, { 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{report.description}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <FaMapMarkerAlt className="mr-1" />
                    <span>{report.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                      <span className="text-sm ml-2">{report.user.name}</span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-400 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"
                        />
                      </svg>
                      <span className="text-sm text-gray-500">{report.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Impact Section */}
      <section className="py-16 bg-primary-700 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl mb-4">Community Impact</h2>
            <p className="max-w-2xl mx-auto">
              Together, we're making a difference in our communities by addressing water waste and infrastructure issues.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <div className="flex flex-col items-center md:items-start">
              <img
                src={IMAGES.CITY_WORKERS[0]}
                alt="City workers repairing infrastructure"
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <h3 className="font-heading font-semibold text-xl mb-3">Infrastructure Improvements</h3>
              <p className="text-gray-100">
                Your reports have led to critical repairs of aging infrastructure, preventing major failures and service
                disruptions.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <img
                src={IMAGES.CIVIC_ENGAGEMENT[0]}
                alt="Community members working together"
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <h3 className="font-heading font-semibold text-xl mb-3">Water Conservation</h3>
              <p className="text-gray-100">
                Together we've saved millions of gallons of water from going to waste, protecting this precious resource
                for future generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl text-gray-800 mb-4">Success Stories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See how citizen reports have made a real difference in our communities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-xl overflow-hidden shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-5">
                <div className="md:col-span-2">
                  <img
                    src={IMAGES.WATER_LEAKS[5]}
                    alt="Before - Water main leak"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:col-span-3 p-6">
                  <div className="flex items-center mb-3">
                    <span className="text-xs font-medium text-white bg-red-500 rounded-full px-2 py-1 mr-2">Before</span>
                    <span className="text-sm text-gray-500">Reported 3 months ago</span>
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">Main Street Water Main Break</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    A severe leak was reported by multiple citizens that was wasting an estimated 100 gallons per hour.
                  </p>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                    <div className="ml-2">
                      <p className="text-xs font-medium">Response by</p>
                      <p className="text-sm">Central Water Authority</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl overflow-hidden shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-5">
                <div className="md:col-span-2">
                  <img
                    src={IMAGES.CITY_WORKERS[1]}
                    alt="After - Repaired water main"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:col-span-3 p-6">
                  <div className="flex items-center mb-3">
                    <span className="text-xs font-medium text-white bg-green-500 rounded-full px-2 py-1 mr-2">After</span>
                    <span className="text-sm text-gray-500">Fixed within 48 hours</span>
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">Rapid Response & Repair</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Maintenance crews quickly identified and fixed the leak, implementing a modern valve system to prevent
                    future issues.
                  </p>
                  <div className="flex items-center">
                    <FaWater className="text-primary-600 mr-2" />
                    <p className="text-sm">
                      <span className="font-medium">27,000</span> gallons of water saved monthly
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Download Section */}
      <section className="py-16 bg-gradient-to-r from-primary-700 to-primary-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:max-w-md">
              <h2 className="font-heading font-bold text-3xl mb-4">Download the LeakAlert App</h2>
              <p className="mb-6">
                Report leaks on the go with our mobile app. Available for iOS and Android devices.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-black hover:bg-gray-900 text-white font-medium py-3 px-5 rounded-lg flex items-center">
                  <FaApple className="text-2xl mr-3" />
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </button>
                <button className="bg-black hover:bg-gray-900 text-white font-medium py-3 px-5 rounded-lg flex items-center">
                  <FaGooglePlay className="text-2xl mr-3" />
                  <div className="text-left">
                    <div className="text-xs">Get it on</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
            <div className="max-w-xs">
              <img
                src={IMAGES.APP_SCREENSHOT}
                alt="LeakAlert mobile app interface"
                className="w-full h-auto rounded-2xl shadow-lg border-8 border-gray-800"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl text-gray-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Everything you need to know about using LeakAlert</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-heading font-semibold text-lg">
                  What types of leaks should I report?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  <p>Report any water leaks or infrastructure damage you see in public areas, including:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Fire hydrant leaks or damage</li>
                    <li>Water main breaks</li>
                    <li>Sustained sidewalk or street flooding</li>
                    <li>Infrastructure cracks with water seepage</li>
                    <li>Broken water fountains</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left font-heading font-semibold text-lg">
                  How does the validation system work?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  <p>
                    Our system uses computer vision technology to analyze your uploaded images and videos. It can detect
                    water presence, estimate leak severity, and verify the infrastructure damage you're reporting. This
                    helps municipalities prioritize responses based on severity.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left font-heading font-semibold text-lg">
                  How quickly will the leak be fixed?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  <p>Response times vary based on:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Severity of the leak or damage</li>
                    <li>Current municipal workload</li>
                    <li>Available resources</li>
                  </ul>
                  <p className="mt-2">
                    Urgent issues are typically addressed within 24-48 hours, while less critical issues may take 3-7
                    days. You'll receive updates as your report moves through the system.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left font-heading font-semibold text-lg">
                  Can I report leaks anonymously?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  <p>Yes, you can submit reports anonymously. However, creating an account allows you to:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Track the status of your reports</li>
                    <li>Receive notifications about resolution</li>
                    <li>Build a history of your community contributions</li>
                    <li>Earn recognition for your civic engagement</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
