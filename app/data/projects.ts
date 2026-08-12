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

export interface Neighborhood {
  image: string;
  paragraphs: string[]; // typically two short paragraphs about what the area offers
}

export interface Architect {
  name: string;
  title: string;   // e.g., "Principal Architect"
  image: string;
  quote: string;   // a few words from them about this project or their approach
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
  neighborhood?: Neighborhood;
  floorPlanImage?: string; // single typical floor layout for the project
  architect?: Architect;
  consortium?: "alliance-arden"; // co-branded projects
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
    neighborhood: {
      image: "/neighborhoods/field.jpg",
      paragraphs: [
        "Banani sits at the quiet edge of Dhaka's diplomatic core — a neighborhood that has kept its residential feel while everything around it grew louder. Amanat is a short walk from Banani Lake, the Sunday farmers' market at Road 11, and the coffee-and-brunch strip that anchors weekend mornings here.",
        "Groceries, salons, tailors, and a mosque are all within five minutes on foot. Gulshan Avenue, United Hospital, and the international schools of Baridhara are a five-minute drive; the airport and Uttara are twenty on a clear day. It is a rare pocket of the city where you can live without your car needing to leave the driveway.",
      ],
    },
    floorPlanImage: "/floorplans/typical.jpg",
    architect: {
      name: "Farhan Kabir",
      title: "Principal Architect",
      image: "/architects/farhan.jpg",
      quote:
        "Amanat is a house that listens — the way morning light finds the kitchen, the pause between the entry and the family room. Every corner had to earn its place.",
    },
    consortium: "alliance-arden",
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
    neighborhood: {
      image: "/neighborhoods/field.jpg",
      paragraphs: [
        "Jolshiri Abashon is Dhaka's most deliberately planned residential district — wide roads, low density, and lakes that were dug before the first foundation was poured. Rahma sits on Sector 11, a five-minute walk from the lakeside promenade that families use for evening strolls and morning runs.",
        "The 300 Feet Highway puts Bashundhara, Baridhara, and the airport within twenty minutes without touching Dhaka's older gridlock. Cambrian and Purbachal International cover schools; CMH is the nearest hospital; and the neighborhood mosque, bazaar, and everyday shops sit just off the main sector road. Quiet by day, safe at night, and built for the way people actually live.",
      ],
    },
    floorPlanImage: "/floorplans/typical.jpg",
    architect: {
      name: "Sadia Islam",
      title: "Design Director",
      image: "/architects/sadia.jpg",
      quote:
        "In Jolshiri, the site does half the design work. Rahma opens toward the lake and quietly turns its back to the road — calm inside, alive outside.",
    },
    consortium: "alliance-arden",
  },
];

export function getProjectBySlug(slug: string): ProjectDetail | undefined {
  return PROJECT_DETAILS.find((p) => p.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return PROJECT_DETAILS.map((p) => p.slug);
}
