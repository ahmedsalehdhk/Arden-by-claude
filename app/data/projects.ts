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

export type NeighborhoodCategory =
  | "Education"
  | "Healthcare"
  | "Dining"
  | "Shopping"
  | "Faith"
  | "Recreation"
  | "Transit";

export interface NeighborhoodItem {
  category: NeighborhoodCategory;
  name: string;
  distance: string; // e.g., "0.6 km", "5 min walk"
}

export interface FloorPlan {
  label: string;       // e.g., "Type A"
  sizeSft: string;     // e.g., "2,200 sft"
  bedrooms: number;
  image: string;       // placeholder for now; drop real renders into /public/projectimages/<slug>/floorplans/
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
  gallery: string[];
  mapEmbedSrc?: string;
  neighborhood?: NeighborhoodItem[];
  floorPlans?: FloorPlan[];
}

export const PROJECT_DETAILS: ProjectDetail[] = [
  {
    slug: "amanat",
    name: "Amanat",
    tagline: "A Testament to Trust and Timeless Design",
    type: "Residential",
    status: "Ongoing",
    address: "House 64, Road 1, Block I, Banani, Dhaka",
    location: "Banani",
    heroImage: "/projectimages/amanat/front-side-view-01.jpg",
    buildingImage: "/projectimages/amanat/eye-level-view-01.jpg",
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
    mapEmbedSrc:
      "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d456.3634925238462!2d90.40258377066533!3d23.78629235200158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1786272438097!5m2!1sen!2sbd",
    gallery: [
      "/projectimages/amanat/front-side-view-01.jpg",
      "/projectimages/amanat/eye-level-view-01.jpg",
      "/projectimages/amanat/high-eye-level-view-04.jpg",
      "/projectimages/amanat/side-view-03.jpg",
      "/projectimages/amanat/hero-night.jpg",
      "/projectimages/amanat/rooftop-01.jpg",
      "/projectimages/amanat/rooftop-02.jpg",
      "/projectimages/amanat/lobby-view-01.jpg",
    ],
    neighborhood: [
      { category: "Faith", name: "Banani Central Mosque", distance: "0.5 km" },
      { category: "Recreation", name: "Banani Lake Park", distance: "0.7 km" },
      { category: "Dining", name: "Cafe Kaldi, Banani 11", distance: "0.6 km" },
      { category: "Dining", name: "Izumi Japanese Restaurant", distance: "0.9 km" },
      { category: "Shopping", name: "Banani Super Market", distance: "0.8 km" },
      { category: "Education", name: "Sunbeams School, Banani", distance: "1.4 km" },
      { category: "Healthcare", name: "Ibn Sina Diagnostic, Banani", distance: "1.1 km" },
      { category: "Healthcare", name: "United Hospital, Gulshan", distance: "2.5 km" },
      { category: "Shopping", name: "Gulshan Avenue Shops", distance: "2.1 km" },
      { category: "Transit", name: "Banani Bus Stand", distance: "1.0 km" },
    ],
    floorPlans: [
      { label: "Type A", sizeSft: "2,200 sft", bedrooms: 3, image: "/projectimages/amanat/eye-level-view-01.jpg" },
      { label: "Type B", sizeSft: "2,800 sft", bedrooms: 3, image: "/projectimages/amanat/high-eye-level-view-04.jpg" },
      { label: "Type C — Duplex", sizeSft: "3,600 sft", bedrooms: 4, image: "/projectimages/amanat/rooftop-01.jpg" },
    ],
  },
  {
    slug: "rahma",
    name: "Rahma",
    tagline: "Grace and Serenity in Every Detail",
    type: "Residential",
    status: "Ongoing",
    address: "Plot 16, Road 410, Sector 11, Jolshiri",
    location: "Jolshiri",
    heroImage: "/projectimages/rahma/view-02.jpg",
    buildingImage: "/projectimages/rahma/view-01.jpg",
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
    mapEmbedSrc:
      "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3650.0045361860552!2d90.49945621367509!3d23.818437734417067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1786272613172!5m2!1sen!2sbd",
    gallery: [
      "/projectimages/rahma/view-01.jpg",
      "/projectimages/rahma/view-02.jpg",
      "/projectimages/rahma/view-03.jpg",
      "/projectimages/rahma/view-04.jpg",
      "/projectimages/rahma/view-06.jpg",
      "/projectimages/rahma/view-07.jpg",
      "/projectimages/rahma/view-08.png",
      "/projectimages/rahma/view-09.png",
      "/projectimages/rahma/view-10.jpg",
      "/projectimages/rahma/construction-jan-2026.jpg",
    ],
    neighborhood: [
      { category: "Faith", name: "Jolshiri Jame Masjid", distance: "0.4 km" },
      { category: "Recreation", name: "Jolshiri Lakeside Park", distance: "0.6 km" },
      { category: "Dining", name: "Sultan's Dine, Jolshiri", distance: "1.0 km" },
      { category: "Shopping", name: "Jolshiri Bazaar", distance: "0.5 km" },
      { category: "Education", name: "Cambrian School, Jolshiri", distance: "1.5 km" },
      { category: "Education", name: "Purbachal International School", distance: "2.2 km" },
      { category: "Healthcare", name: "CMH Dhaka Cantonment", distance: "3.0 km" },
      { category: "Healthcare", name: "Popular Diagnostic, Uttara", distance: "4.5 km" },
      { category: "Transit", name: "300 Feet Highway", distance: "1.0 km" },
      { category: "Shopping", name: "Bashundhara City Mall", distance: "8.0 km" },
    ],
    floorPlans: [
      { label: "Type A", sizeSft: "1,800 sft", bedrooms: 3, image: "/projectimages/rahma/view-01.jpg" },
      { label: "Type B", sizeSft: "2,400 sft", bedrooms: 3, image: "/projectimages/rahma/view-03.jpg" },
      { label: "Type C — Penthouse", sizeSft: "3,200 sft", bedrooms: 4, image: "/projectimages/rahma/view-06.jpg" },
    ],
  },
];

export function getProjectBySlug(slug: string): ProjectDetail | undefined {
  return PROJECT_DETAILS.find((p) => p.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return PROJECT_DETAILS.map((p) => p.slug);
}
