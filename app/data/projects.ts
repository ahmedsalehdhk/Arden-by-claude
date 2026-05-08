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
    slug: "amanat",
    name: "Amanat",
    tagline: "A Testament to Trust and Timeless Design",
    type: "Residential",
    status: "Ongoing",
    address: "Road 1, Block I, Banani, Dhaka",
    location: "Banani",
    heroImage: "/projectimages/amanat/Front Side View_01.jpg",
    buildingImage: "/projectimages/amanat/Eye Level View_01.jpg",
    specsLeft: [
      { label: "Land", value: "8 Katha" },
      { label: "Floors", value: "G + 12" },
      { label: "Size", value: "2,200 - 3,600 sft" },
      { label: "Car Parking", value: "2 Basements" },
    ],
    specsRight: [
      { label: "Facing", value: "South" },
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
      { icon: "Dumbbell", label: "Rooftop Amenities" },
      { icon: "TreePine", label: "Landscaped Gardens" },
      { icon: "Users", label: "Prayer Room" },
    ],
  },
  {
    slug: "rahma",
    name: "Rahma",
    tagline: "Grace and Serenity in Every Detail",
    type: "Residential",
    status: "Ongoing",
    address: "Road 410, Sector 11, Jolshiri",
    location: "Jolshiri",
    heroImage: "/projectimages/rahma/View 02.jpg",
    buildingImage: "/projectimages/rahma/View 01.jpg",
    specsLeft: [
      { label: "Land", value: "10 Katha" },
      { label: "Floors", value: "G + 10" },
      { label: "Size", value: "1,800 - 3,200 sft" },
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
      { icon: "TreePine", label: "Rooftop Garden" },
      { icon: "Users", label: "Community Hall" },
    ],
  },
];

export function getProjectBySlug(slug: string): ProjectDetail | undefined {
  return PROJECT_DETAILS.find((p) => p.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return PROJECT_DETAILS.map((p) => p.slug);
}
