// Define image assets for the application
// We'll use free stock images that match our requirements

export const IMAGES = {
  WATER_LEAKS: [
    "https://images.unsplash.com/photo-1580894908361-967195033215?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=450",
    "https://images.pexels.com/photos/3246665/pexels-photo-3246665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.unsplash.com/photo-1584432438268-49a9f5806542?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "https://pixabay.com/get/gbd32aeab3624e1afd8f0978286659fb7d3903afb680e21f74c380a80e7b125456c71146fe726637fca3af88910121b93b81656a74fc36b210a58ff3c6e777430_1280.jpg",
    "https://pixabay.com/get/g191980c85ce6a80e42573d8093a971ca15c2ef3f9674d37df90bf10796b72e010b4cc782d8934b0d716ea3722d31afa288369d3e111f9e248c489109c0ab7953_1280.jpg",
    "https://pixabay.com/get/g15a38b2256000f858bf9726541ff577607aaf5db7246f54944317cebde6b614461446318bcd31e1c9f44bb3e0f6a9ea1146f3ac0d7c91139f73d1043c98e98a2_1280.jpg"
  ],
  INFRASTRUCTURE_DAMAGE: [
    "https://images.unsplash.com/photo-1562005080-c43f05fc72ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "https://pixabay.com/get/gbe9466d6171f808f7d66f83022da88543e3ab5648dba7bd808239845f8dad658ae5f5e5976feae36a030edc731c92ca9e63036ebcb1f5e32780b3259165bcdca_1280.jpg",
    "https://images.pexels.com/photos/4557684/pexels-photo-4557684.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/4557685/pexels-photo-4557685.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  ],
  CITY_WORKERS: [
    "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
    "https://images.pexels.com/photos/2760242/pexels-photo-2760242.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/3847753/pexels-photo-3847753.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  ],
  CIVIC_ENGAGEMENT: [
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
    "https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  ],
  APP_SCREENSHOT: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=800"
};

// Define leak types for the form
export const LEAK_TYPES = [
  { value: "water_main", label: "Water Main Break" },
  { value: "fire_hydrant", label: "Fire Hydrant Leak" },
  { value: "pipe", label: "Pipe Leak" },
  { value: "infrastructure", label: "Infrastructure Damage" },
  { value: "other", label: "Other" }
];

// Define leak statuses
export const LEAK_STATUS = {
  PENDING: { value: "pending", label: "Pending Review", color: "bg-gray-500" },
  IN_PROGRESS: { value: "in_progress", label: "In Progress", color: "bg-amber-500" },
  RESOLVED: { value: "resolved", label: "Resolved", color: "bg-green-500" },
  URGENT: { value: "urgent", label: "Urgent", color: "bg-red-500" },
  REJECTED: { value: "rejected", label: "Rejected", color: "bg-red-700" }
};

// Sample data for map markers (initial state)
export const INITIAL_MAP_CENTER = { lat: 40.7128, lng: -74.0060 }; // New York City
