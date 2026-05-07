// Shared project data for detail pages
// Each project has its own slug, specs, features, and images

export interface ProjectSpec {
  label: string;
  value: string;
}

export interface ProjectFeature {
  icon: string; // lucide icon name
  label: string;
}

export interface ProjectDetail {
  slug: string;
  name: string;
  tagline: string;
  type: "Residential" | "Commercial";
  status: "Ongoing" | "Upcoming" | "Completed";
  address: string;
  location: string;
  heroImage: string;
  buildingImage: string;
  specsLeft: ProjectSpec[];
  specsRight: ProjectSpec[];
  features: ProjectFeature[];
}

export const PROJECT_DETAILS: ProjectDetail[] = [
  {
    slug: "zenith",
    name: "Zenith",
    tagline: "A Landmark of Modern Commercial Architecture",
    type: "Commercial",
    status: "Ongoing",
    address: "199, Bir Uttam Mir Shawkat Sarak, Tejgaon, Dhaka",
    location: "Tejgaon",
    heroImage:
      "https://images.pexels.com/photos/1486785/pexels-photo-1486785.jpeg?auto=compress&cs=tinysrgb&w=1920",
    buildingImage:
      "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=800",
    specsLeft: [
      { label: "Land", value: "10 Katha" },
      { label: "Floors", value: "G + 14" },
      { label: "Size", value: "1,800 - 5,200 sft" },
      { label: "Car Parking", value: "3 Basements" },
    ],
    specsRight: [
      { label: "Facing", value: "South" },
      { label: "Front Road", value: "40 ft" },
      { label: "Basement", value: "3 Levels" },
    ],
    features: [
      { icon: "Zap", label: "Full Generator Backup" },
      { icon: "Wind", label: "Central Air Conditioning" },
      { icon: "ShieldCheck", label: "24/7 Security & CCTV" },
      { icon: "Droplets", label: "Water Treatment Plant" },
      { icon: "Flame", label: "Fire Detection & Protection" },
      { icon: "Car", label: "3-Level Basement Parking" },
      { icon: "Wifi", label: "High-Speed Elevator" },
      { icon: "Dumbbell", label: "Rooftop Amenities" },
      { icon: "TreePine", label: "Landscaped Gardens" },
      { icon: "Users", label: "Prayer Room" },
    ],
  },
  {
    slug: "arden-tower",
    name: "Arden Tower",
    tagline: "Defining the Skyline of Tomorrow",
    type: "Commercial",
    status: "Completed",
    address: "203-204, Tejgaon I/A, Dhaka",
    location: "Tejgaon",
    heroImage:
      "https://images.pexels.com/photos/1486785/pexels-photo-1486785.jpeg?auto=compress&cs=tinysrgb&w=1920",
    buildingImage:
      "https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg?auto=compress&cs=tinysrgb&w=800",
    specsLeft: [
      { label: "Land", value: "15 Katha" },
      { label: "Floors", value: "G + 20" },
      { label: "Size", value: "2,200 - 8,400 sft" },
      { label: "Car Parking", value: "4 Basements" },
    ],
    specsRight: [
      { label: "Facing", value: "North-East" },
      { label: "Front Road", value: "60 ft" },
      { label: "Basement", value: "4 Levels" },
    ],
    features: [
      { icon: "Zap", label: "Full Generator Backup" },
      { icon: "Wind", label: "Central Air Conditioning" },
      { icon: "ShieldCheck", label: "24/7 Security & CCTV" },
      { icon: "Droplets", label: "Water Treatment Plant" },
      { icon: "Flame", label: "Fire Detection & Protection" },
      { icon: "Car", label: "4-Level Basement Parking" },
      { icon: "Wifi", label: "High-Speed Elevator" },
      { icon: "Dumbbell", label: "Fitness Center" },
      { icon: "TreePine", label: "Sky Lounge & Gardens" },
      { icon: "Users", label: "Conference Facilities" },
    ],
  },
  {
    slug: "the-veldt",
    name: "The Veldt",
    tagline: "Where Elegance Meets Everyday Living",
    type: "Residential",
    status: "Ongoing",
    address: "12 Gulshan Avenue, Dhaka",
    location: "Gulshan",
    heroImage:
      "https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg?auto=compress&cs=tinysrgb&w=1920",
    buildingImage:
      "https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg?auto=compress&cs=tinysrgb&w=800",
    specsLeft: [
      { label: "Land", value: "8 Katha" },
      { label: "Floors", value: "G + 12" },
      { label: "Size", value: "2,400 - 3,800 sft" },
      { label: "Car Parking", value: "2 Basements" },
    ],
    specsRight: [
      { label: "Facing", value: "South-West" },
      { label: "Front Road", value: "35 ft" },
      { label: "Basement", value: "2 Levels" },
    ],
    features: [
      { icon: "Zap", label: "Full Generator Backup" },
      { icon: "Wind", label: "Central Air Conditioning" },
      { icon: "ShieldCheck", label: "24/7 Security & CCTV" },
      { icon: "Droplets", label: "Water Treatment Plant" },
      { icon: "Flame", label: "Fire Detection & Protection" },
      { icon: "Car", label: "2-Level Basement Parking" },
      { icon: "Wifi", label: "High-Speed Elevator" },
      { icon: "Dumbbell", label: "Gymnasium & Pool" },
      { icon: "TreePine", label: "Rooftop Garden" },
      { icon: "Users", label: "Community Hall" },
    ],
  },
  {
    slug: "oasis",
    name: "Oasis",
    tagline: "A Sanctuary in the Heart of the City",
    type: "Residential",
    status: "Ongoing",
    address: "1373, Block L, Bashundhara R/A, Dhaka",
    location: "Bashundhara",
    heroImage:
      "https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg?auto=compress&cs=tinysrgb&w=1920",
    buildingImage:
      "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=800",
    specsLeft: [
      { label: "Land", value: "7.5 Katha" },
      { label: "Floors", value: "G + 10" },
      { label: "Size", value: "1,650 - 2,800 sft" },
      { label: "Car Parking", value: "2 Basements" },
    ],
    specsRight: [
      { label: "Facing", value: "East" },
      { label: "Front Road", value: "30 ft" },
      { label: "Basement", value: "2 Levels" },
    ],
    features: [
      { icon: "Zap", label: "Full Generator Backup" },
      { icon: "Wind", label: "Central Air Conditioning" },
      { icon: "ShieldCheck", label: "24/7 Security & CCTV" },
      { icon: "Droplets", label: "Water Treatment Plant" },
      { icon: "Flame", label: "Fire Detection & Protection" },
      { icon: "Car", label: "2-Level Basement Parking" },
      { icon: "Wifi", label: "High-Speed Elevator" },
      { icon: "Dumbbell", label: "Swimming Pool" },
      { icon: "TreePine", label: "Landscaped Courtyard" },
      { icon: "Users", label: "Prayer Room" },
    ],
  },
  {
    slug: "majesta",
    name: "Majesta",
    tagline: "Prestige Redefined in North Gulshan",
    type: "Residential",
    status: "Ongoing",
    address: "Plot 06, Road 67, North Gulshan, Dhaka",
    location: "Gulshan",
    heroImage:
      "https://images.pexels.com/photos/1486785/pexels-photo-1486785.jpeg?auto=compress&cs=tinysrgb&w=1920",
    buildingImage:
      "https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg?auto=compress&cs=tinysrgb&w=800",
    specsLeft: [
      { label: "Land", value: "12 Katha" },
      { label: "Floors", value: "G + 16" },
      { label: "Size", value: "3,200 - 5,000 sft" },
      { label: "Car Parking", value: "3 Basements" },
    ],
    specsRight: [
      { label: "Facing", value: "North" },
      { label: "Front Road", value: "50 ft" },
      { label: "Basement", value: "3 Levels" },
    ],
    features: [
      { icon: "Zap", label: "Full Generator Backup" },
      { icon: "Wind", label: "Central Air Conditioning" },
      { icon: "ShieldCheck", label: "24/7 Security & CCTV" },
      { icon: "Droplets", label: "Water Treatment Plant" },
      { icon: "Flame", label: "Fire Detection & Protection" },
      { icon: "Car", label: "3-Level Basement Parking" },
      { icon: "Wifi", label: "High-Speed Elevator" },
      { icon: "Dumbbell", label: "Fitness & Recreation" },
      { icon: "TreePine", label: "Rooftop Sky Garden" },
      { icon: "Users", label: "Multi-Purpose Hall" },
    ],
  },
];

export function getProjectBySlug(slug: string): ProjectDetail | undefined {
  return PROJECT_DETAILS.find((p) => p.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return PROJECT_DETAILS.map((p) => p.slug);
}
