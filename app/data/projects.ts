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

// Author floor plans in physical bottom-to-top order (basement first, roof last).
// The elevator strip reverses this for display so the top floor sits at the top.
export type FloorKind = "basement" | "ground" | "mezzanine" | "typical" | "roof";

export interface FloorPlan {
  label: string;      // short label for the elevator strip, e.g., "GF", "Typ", "Roof"
  fullLabel: string;  // full name shown under the plan, e.g., "Ground Floor", "Typical Floor (2F–8F)"
  image: string;
  kind?: FloorKind;   // optional semantic tag — reserved for icons/filtering later
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
  floorPlans?: FloorPlan[]; // one entry per floor; drives the elevator-strip gallery
  architect?: Architect;
}

export const PROJECT_DETAILS: ProjectDetail[] = [
  {
    slug: "amanat",
    name: "Amanat",
    tagline: "Precision in form",
    type: "Residential",
    status: "Ongoing",
    address: "House 64, Road 1, Block I, Banani, Dhaka",
    location: "Banani",
    heroImage: "/projectimages/amanat/front-side-view-01.jpg",
    buildingImage: "/projectimages/amanat/hero-night.jpg",
    // Standard 9-field At-a-Glance template — split 5/4 for the two-column layout.
    // Set any field to TBC if not yet confirmed.
    specsLeft: [
      { label: "Land Area", value: "7.118 Katha" },
      { label: "Size of Apartments", value: "3,200 sft (approx.)" },
      { label: "Facing of Land", value: "West" },
      { label: "Front Road Width", value: "30 ft" },
      { label: "Number of Floors", value: "G + 9" },
    ],
    specsRight: [
      { label: "Number of Apartments", value: "9" },
      { label: "Number of Basements", value: "1" },
      { label: "Number of Parking", value: "18" },
      { label: "Specialty of Land", value: "Lake Facing" },
    ],
    // Standard features template — comment out any that don't apply to a project.
    features: [
      { icon: "Zap",         label: "Full Load Power Backup Generator" },
      { icon: "ArrowUpDown", label: "High Speed Elevators" },
      { icon: "TreePine",    label: "Landscaped Gardens" },
      { icon: "Waves",       label: "Swimming Pool" },
      { icon: "Dumbbell",    label: "Loaded Fitness Centre" },
      // { icon: "Droplets",    label: "Central Water Treatment Plant" },
      { icon: "Flame",       label: "Firefighting System" },
      { icon: "ShieldCheck", label: "Earthquake Proof Structure" },
      { icon: "Car",         label: "Chauffeurs' Waiting Room" },
      { icon: "Sofa",        label: "Elegant Reception & Waiting Room" },
      // { icon: "DoorOpen",    label: "Grand Double-Height Entrance" },
      { icon: "Video",       label: "24-Hour CCTV Surveillance" },
      // { icon: "ChefHat",     label: "BBQ Area" },
      { icon: "Sparkles",    label: "Artistic Lighting & Water Features" },
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
      image: "/neighborhoods/banani.jpg",
      paragraphs: [
        "Situated in one of Dhaka’s most coveted diplomatic and commercial enclaves, Banani combines urban sophistication with structured residential tranquility. Wide, tree-lined avenues, quiet residential blocks, and modern architectural landmarks define its landscape, establishing the neighborhood as a core center for high-end living and corporate enterprise.",
        "At the heart of this district lies Banani Road 11, a premier lifestyle and commercial corridor. Famed for its high-end boutiques, multinational corporate hubs, and vibrant culinary scene, Road 11 balances fast-paced urban energy with exclusive convenience—placing world-class amenities right at your doorstep.",
      ],
    },
    // Bottom-to-top order; component reverses for display.
    // Amanat has a basement + ground floor + typical residential floors + roof (no mezzanine).
    floorPlans: [
      { kind: "basement", label: "B1",   fullLabel: "Basement Parking",   image: "/floorplans/typical.jpg" },
      { kind: "ground",   label: "GF",   fullLabel: "Ground Floor",       image: "/floorplans/typical.jpg" },
      { kind: "typical",  label: "Typ",  fullLabel: "Typical Floor (1F–9F)", image: "/floorplans/typical.jpg" },
      { kind: "roof",     label: "Roof", fullLabel: "Rooftop",            image: "/floorplans/typical.jpg" },
    ],
    architect: {
      name: "Syeda Nitee Mahbub",
      title: "Principal Architect",
      image: "/architects/nitee.jpg",
      quote:
        "Amanat is a house that listens — the way morning light finds the kitchen, the pause between the entry and the family room. Every corner had to earn its place.",
    },
  },
  {
    slug: "rahma",
    name: "Rahma",
    tagline: "Tranquility defined",
    type: "Residential",
    status: "Ongoing",
    address: "Plot 16, Road 410, Sector 11, Jolshiri",
    location: "Jolshiri",
    heroImage: "/projectimages/rahma/view-02.jpg",
    buildingImage: "/projectimages/rahma/view-01.jpg",
    specsLeft: [
      { label: "Land Area", value: "5 Katha" },
      { label: "Size of Apartments", value: "2850 sft (approx.)" },
      { label: "Facing of Land", value: "South" },
      { label: "Front Road Width", value: "20 ft" },
      { label: "Number of Floors", value: "G + M + 8" },
    ],
    specsRight: [
      { label: "Number of Apartments", value: "8" },
      // { label: "Number of Basements", value: "0" },
      { label: "Number of Parking", value: "8" },
      { label: "Specialty of Land", value: "Lake adjacant" },
    ],
    features: [
      // { icon: "Zap",         label: "Full Load Power Backup Generator" },
      { icon: "ArrowUpDown", label: "High Speed Elevators" },
      { icon: "TreePine",    label: "Landscaped Gardens" },
      { icon: "Waves",       label: "Swimming Pool" },
      // { icon: "Dumbbell",    label: "Loaded Fitness Centre" },
      // { icon: "Droplets",    label: "Central Water Treatment Plant" },
      { icon: "Flame",       label: "Firefighting System" },
      { icon: "ShieldCheck", label: "Earthquake Proof Structure" },
      { icon: "Car",         label: "Chauffeurs' Waiting Room" },
      { icon: "Sofa",        label: "Elegant Reception & Waiting Room" },
      { icon: "DoorOpen",    label: "Grand Double-Height Entrance" },
      { icon: "Video",       label: "24-Hour CCTV Surveillance" },
      { icon: "ChefHat",     label: "BBQ Area" },
      { icon: "Sparkles",    label: "Artistic Lighting & Water Features" },
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
      image: "/neighborhoods/jolshiri.jpeg",
      paragraphs: [
        "Located along the eastern corridor of Greater Dhaka, Jolshiri Abashon is a master-planned township designed around green spaces, wide avenues, and clean urban organization. Spanning lush, landscaped parks and an extensive network of intertwined lakes and natural water bodies, the enclave seamlessly blends outdoor activity with residential serenity. At its recreational heart lies the Jolshiri Golf Club, alongside dedicated sports facilities, walking tracks, and open fields, offering an active lifestyle unmatched by central urban hubs.",
        "Directly connected via the 300 Feet Purbachal Expressway, Jolshiri balances quiet living with swift access to central districts like Gulshan and Baridhara. Designed as a fully self-contained ecosystem, the township integrates dedicated educational zones housing reputed schools and universities, neighborhood mosques, secure frameworks, and modern civic utilities—setting a rising benchmark for organized, community-focused living.",
      ],
    },
    // Bottom-to-top order; component reverses for display.
    // Rahma has a ground floor + mezzanine + typical residential floors + roof (no basement).
    floorPlans: [
      { kind: "ground",    label: "GF",   fullLabel: "Ground Floor",        image: "/floorplans/typical.jpg" },
      { kind: "mezzanine", label: "M",    fullLabel: "Mezzanine",           image: "/floorplans/typical.jpg" },
      { kind: "typical",   label: "Typ",  fullLabel: "Typical Floor (1F–8F)", image: "/floorplans/typical.jpg" },
      { kind: "roof",      label: "Roof", fullLabel: "Rooftop",             image: "/floorplans/typical.jpg" },
    ],
    architect: {
      name: "Syeda Nitee Mahbub",
      title: "Principal Architect",
      image: "/architects/nitee.jpg",
      quote:
        "In Jolshiri, the site does half the design work. Rahma opens toward the lake and quietly turns its back to the road — calm inside, alive outside.",
    },
  },
    {
    slug: "mumin",
    name: "Mumin",
    tagline: "Built on truth",
    type: "Residential",
    status: "Completed",
    address: "Plot 43, Road 512, Sector 11, Jolshiri",
    location: "Jolshiri",
    heroImage: "/projectimages/mumin/view-03.jpg",
    buildingImage: "/projectimages/mumin/view-01.jpg",
    // Standard 9-field At-a-Glance template — split 5/4 for the two-column layout.
    // Set any field to TBC if not yet confirmed.
    specsLeft: [
      { label: "Land Area", value: "5 Katha" },
      { label: "Size of Apartments", value: "3,200 sft (approx.)" },
      { label: "Facing of Land", value: "West" },
      { label: "Front Road Width", value: "20 ft" },
      { label: "Number of Floors", value: "G + 8" },
    ],
    specsRight: [
      { label: "Number of Apartments", value: "8" },
      // { label: "Number of Basements", value: "0" },
      { label: "Number of Parking", value: "8" },
      // { label: "Specialty of Land", value: "Lake Facing" },
    ],
    // Standard features template — comment out any that don't apply to a project.
    features: [
      // { icon: "Zap",         label: "Full Load Power Backup Generator" },
      { icon: "ArrowUpDown", label: "High Speed Elevators" },
      { icon: "TreePine",    label: "Landscaped Gardens" },
      // { icon: "Waves",       label: "Swimming Pool" },
      { icon: "Dumbbell",    label: "Loaded Fitness Centre" },
      // { icon: "Droplets",    label: "Central Water Treatment Plant" },
      { icon: "Flame",       label: "Firefighting System" },
      { icon: "ShieldCheck", label: "Earthquake Proof Structure" },
      { icon: "Car",         label: "Chauffeurs' Waiting Room" },
      { icon: "Sofa",        label: "Elegant Reception & Waiting Room" },
      // { icon: "DoorOpen",    label: "Grand Double-Height Entrance" },
      { icon: "Video",       label: "24-Hour CCTV Surveillance" },
      // { icon: "ChefHat",     label: "BBQ Area" },
      { icon: "Sparkles",    label: "Artistic Lighting & Water Features" },
    ],
    mapEmbedSrc:
      "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d456.3634925238462!2d90.40258377066533!3d23.78629235200158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1786272438097!5m2!1sen!2sbd",
    gallery: [
      "/projectimages/mumin/view-01.jpg",
      "/projectimages/mumin/view-02.jpg",
      "/projectimages/mumin/view-03.jpg",
    ],
    neighborhood: {
      image: "/neighborhoods/jolshiri.jpeg",
      paragraphs: [
        "Located along the eastern corridor of Greater Dhaka, Jolshiri Abashon is a master-planned township designed around green spaces, wide avenues, and clean urban organization. Spanning lush, landscaped parks and an extensive network of intertwined lakes and natural water bodies, the enclave seamlessly blends outdoor activity with residential serenity. At its recreational heart lies the Jolshiri Golf Club, alongside dedicated sports facilities, walking tracks, and open fields, offering an active lifestyle unmatched by central urban hubs.",
        "Directly connected via the 300 Feet Purbachal Expressway, Jolshiri balances quiet living with swift access to central districts like Gulshan and Baridhara. Designed as a fully self-contained ecosystem, the township integrates dedicated educational zones housing reputed schools and universities, neighborhood mosques, secure frameworks, and modern civic utilities—setting a rising benchmark for organized, community-focused living.",
      ],
    },
    // Bottom-to-top order; component reverses for display.
    // Amanat has a basement + ground floor + typical residential floors + roof (no mezzanine).
    floorPlans: [
      // { kind: "basement", label: "B1",   fullLabel: "Basement Parking",   image: "/floorplans/typical.jpg" },
      { kind: "ground",   label: "GF",   fullLabel: "Ground Floor",       image: "/floorplans/mumin/ground.jpg" },
      { kind: "typical",  label: "Typ",  fullLabel: "Typical Floor", image: "/floorplans/mumin/floor.jpg" },
      { kind: "roof",     label: "Roof", fullLabel: "Rooftop",            image: "/floorplans/mumin/roof.jpg" },
    ],
    architect: {
      name: "REDACTED",
      title: "Principal Architect",
      image: "/architects/.jpg",
      quote:
        "Redacted",
    },
  },
];

export function getProjectBySlug(slug: string): ProjectDetail | undefined {
  return PROJECT_DETAILS.find((p) => p.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return PROJECT_DETAILS.map((p) => p.slug);
}
