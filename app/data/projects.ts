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

export interface NeighborhoodSection {
  title: string; // short heading shown above the paragraph, e.g. "The District"
  body: string;
}

export interface Neighborhood {
  images: string[]; // 2 photos for the mosaic: [top-right, bottom-right] (large left slot is the map)
  sections: NeighborhoodSection[]; // typically two short titled paragraphs about the area
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
  byAllianceArden?: boolean;  // true → show "by Alliance-Arden Consortium" + dual-logo lockup on detail hero and card
  byTrilliantArden?: boolean; // true → show "by Trilliant-Arden Consortium" + dual-logo lockup on detail hero and card
  specs: ProjectSpec[];
  features: ProjectFeature[];
  gallery: string[];
  mapEmbedSrc?: string;
  neighborhood?: Neighborhood;
  floorPlans?: FloorPlan[]; // one entry per floor; drives the elevator-strip gallery
  architect?: Architect;
}

export const PROJECT_DETAILS: ProjectDetail[] = [
  // HASIB
  {
    slug: "hasib",
    name: "Hasib",
    tagline: "Designed to inspire",
    type: "Residential",
    status: "Ongoing",
    address: "Plot 34, Western Road, Banani DOHS",
    location: "Banani DOHS",
    heroImage: "/projectimages/hasib/hasib-01.jpeg",
    buildingImage: "/projectimages/hasib/hasib-01.jpeg",
    byAllianceArden: true,
    specs: [
      { label: "Land Area", value: "12.5 Katha" },
      { label: "Size of Apartments", value: "4,025 - 4,075 sft (approx.)" },
      { label: "Facing of Land", value: "East" },
      { label: "Front Road Width", value: "25 ft" },
      { label: "Number of Floors", value: "B+G+7" },
      { label: "Number of Apartments", value: "14" },
      { label: "Number of Parking", value: "28" },
    ],
    features: [
      { icon: "ArrowUpDown", label: "High Speed Elevators" },
      { icon: "TreePine",    label: "Landscaped Gardens" },
      { icon: "Flame",       label: "Firefighting System" },
      { icon: "ShieldCheck", label: "Earthquake Proof Structure" },
      { icon: "Car",         label: "Chauffeurs' Waiting Room" },
      { icon: "Sofa",        label: "Elegant Reception & Waiting Room" },
      { icon: "Video",       label: "24-Hour CCTV Surveillance" },
      { icon: "Sparkles",    label: "Artistic Lighting & Water Features" },
    ],
    gallery: [
      "/projectimages/hasib/hasib-01.jpeg",
      "/projectimages/hasib/hasib-02.jpeg",
    ],
    neighborhood: {
      images: [
        "/neighborhoods/hasib/image-01.jpg",
        "/neighborhoods/hasib/image-02.jpg",
      ],
      sections: [
        {
          title: "A Sanctuary of Quiet Order",
          body: "Tucked away from the surrounding city rush, Banani DOHS offers an exceptional residential atmosphere defined by order, safety, and quiet sophistication. Controlled access points, wide, tree-lined streets, and a tight-knit community structure create a calm and secure environment. Designed specifically for peaceful urban living, the neighborhood pairs clean architectural lines with minimal traffic noise, making it one of Dhaka’s most tranquil and exclusive enclaves.",
        },
        {
          title: "The Heart of Community & Living",
          body: "At the social and physical heart of the community lies its expansive central field, serving as an open green sanctuary for residents. Flanked by well-maintained walking tracks, sports facilities, a neighborhood mosque, and convenient local amenities, the central grounds naturally bring people together. Whether for morning walks, youth sports, or casual evening gatherings, this central hub gives Banani DOHS a rare, self-contained lifestyle centered on health and active living.",
        },
      ],
    },
  },
  // AMANAT
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
    byAllianceArden: true,
    // Standard At-a-Glance template — comment out any field that doesn't apply.
    specs: [
      { label: "Land Area", value: "7.118 Katha" },
      { label: "Number of Floors", value: "G + 9" },
      { label: "Number of Apartments", value: "9" },
      { label: "Size of Apartments", value: "3,200 sft (approx.)" },
      { label: "Facing of Land", value: "West" },
      { label: "Front Road Width", value: "30 ft" },
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
      images: [
        "/neighborhoods/amanat/banani-club.jpg",
        "/neighborhoods/amanat/banani-field.jpg",
      ],
      sections: [
        {
          title: "The District",
          body: "Situated in one of Dhaka’s most coveted diplomatic and commercial enclaves, Banani combines urban sophistication with structured residential tranquility. Wide, tree-lined avenues, quiet residential blocks, and modern architectural landmarks define its landscape, establishing the neighborhood as a core center for high-end living and corporate enterprise.",
        },
        {
          title: "Road 11",
          body: "At the heart of this district lies Banani Road 11, a premier lifestyle and commercial corridor. Famed for its high-end boutiques, multinational corporate hubs, and vibrant culinary scene, Road 11 balances fast-paced urban energy with exclusive convenience—placing world-class amenities right at your doorstep.",
        },
      ],
    },
    // Bottom-to-top order; component reverses for display.
    // Amanat has a basement + ground floor + typical residential floors + roof (no mezzanine).
    floorPlans: [
      // { kind: "basement", label: "B1",   fullLabel: "Basement Parking",   image: "/floorplans/amanat/amanat-ground.jpg" },
      { kind: "ground",   label: "GF",   fullLabel: "Ground Floor",       image: "/floorplans/amanat/amanat-ground.jpg" },
      { kind: "typical",  label: "Typ",  fullLabel: "Typical Floor (1F–9F)", image: "/floorplans/amanat/amanat-floor-01.jpg" },
      { kind: "roof",     label: "Roof", fullLabel: "Rooftop",            image: "/floorplans/amanat/amanat-roof.jpg" },
    ],
    architect: {
      name: "Syeda Nitee Mahbub",
      title: "Principal Architect",
      image: "/architects/nitee.jpg",
      quote:
        "Amanat is a house that listens — the way morning light finds the kitchen, the pause between the entry and the family room. Every corner had to earn its place.",
    },
  },
  // RAHMA
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
    byAllianceArden: true,
    specs: [
      { label: "Land Area", value: "5 Katha" },
      { label: "Size of Apartments", value: "2850 sft (approx.)" },
      { label: "Facing of Land", value: "South" },
      { label: "Front Road Width", value: "20 ft" },
      { label: "Number of Floors", value: "G + M + 8" },
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
      images: [
        "/neighborhoods/rahma/jolshiri-maze.jpeg",
        "/neighborhoods/rahma/jolshiri-golf.jpg",
      ],
      sections: [
        {
          title: "The Township",
          body: "Located along the eastern corridor of Greater Dhaka, Jolshiri Abashon is a master-planned township designed around green spaces, wide avenues, and clean urban organization. Spanning lush, landscaped parks and an extensive network of intertwined lakes and natural water bodies, the enclave seamlessly blends outdoor activity with residential serenity. At its recreational heart lies the Jolshiri Golf Club, alongside dedicated sports facilities, walking tracks, and open fields, offering an active lifestyle unmatched by central urban hubs.",
        },
        {
          title: "Connectivity",
          body: "Directly connected via the 300 Feet Purbachal Expressway, Jolshiri balances quiet living with swift access to central districts like Gulshan and Baridhara. Designed as a fully self-contained ecosystem, the township integrates dedicated educational zones housing reputed schools and universities, neighborhood mosques, secure frameworks, and modern civic utilities—setting a rising benchmark for organized, community-focused living.",
        },
      ],
    },
    // Bottom-to-top order; component reverses for display.
    // Rahma has a ground floor + mezzanine + typical residential floors + roof (no basement).
    floorPlans: [
      { kind: "ground",    label: "GF",   fullLabel: "Ground Floor",        image: "/floorplans/rahma/rahma-ground.jpg" },
      { kind: "mezzanine", label: "M",    fullLabel: "Mezzanine",           image: "/floorplans/rahma/rahma-mezzanine.jpg" },
      { kind: "typical",   label: "Typ",  fullLabel: "Typical Floor (1F–8F)", image: "/floorplans/rahma/rahma-floor.jpg" }
    ],
    architect: {
      name: "Syeda Nitee Mahbub",
      title: "Principal Architect",
      image: "/architects/nitee.jpg",
      quote:
        "In Jolshiri, the site does half the design work. Rahma opens toward the lake and quietly turns its back to the road — calm inside, alive outside.",
    },
  },
  // MUMIN
  {
    slug: "bayt-al-mumin",
    name: "Bayt Al-Mumin",
    tagline: "A statement in sophistication",
    type: "Residential",
    status: "Completed",
    address: "Plot 43, Road 512, Sector 11, Jolshiri",
    location: "Jolshiri",
    heroImage: "/projectimages/mumin/view-03.jpg",
    buildingImage: "/projectimages/mumin/view-01.jpg",
    byTrilliantArden: true,
    // Standard At-a-Glance template — comment out any field that doesn't apply.
    specs: [
      { label: "Land Area", value: "5 Katha" },
      { label: "Size of Apartments", value: "2,850 sft (approx.)" },
      { label: "Facing of Land", value: "West" },
      { label: "Front Road Width", value: "20 ft" },
      { label: "Number of Floors", value: "G+M+8" },
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
      images: [
        "/neighborhoods/mumin/image-01.jpg",
        "/neighborhoods/mumin/image-02.jpeg",
      ],
      sections: [
        {
          title: "The Township",
          body: "Located along the eastern corridor of Greater Dhaka, Jolshiri Abashon is a master-planned township designed around green spaces, wide avenues, and clean urban organization. Spanning lush, landscaped parks and an extensive network of intertwined lakes and natural water bodies, the enclave seamlessly blends outdoor activity with residential serenity. At its recreational heart lies the Jolshiri Golf Club, alongside dedicated sports facilities, walking tracks, and open fields, offering an active lifestyle unmatched by central urban hubs.",
        },
        {
          title: "Connectivity",
          body: "Directly connected via the 300 Feet Purbachal Expressway, Jolshiri balances quiet living with swift access to central districts like Gulshan and Baridhara. Designed as a fully self-contained ecosystem, the township integrates dedicated educational zones housing reputed schools and universities, neighborhood mosques, secure frameworks, and modern civic utilities—setting a rising benchmark for organized, community-focused living.",
        },
      ],
    },
    // Bottom-to-top order; component reverses for display.
    // Amanat has a basement + ground floor + typical residential floors + roof (no mezzanine).
    floorPlans: [
      // { kind: "basement", label: "B1",   fullLabel: "Basement Parking",   image: "/floorplans/typical.jpg" },
      { kind: "ground",   label: "GF",   fullLabel: "Ground Floor",       image: "/floorplans/mumin/mumin-ground.jpg" },
      { kind: "typical",  label: "Typ",  fullLabel: "Typical Floor", image: "/floorplans/mumin/mumin-floor.jpg" },
      { kind: "roof",     label: "Roof", fullLabel: "Rooftop",            image: "/floorplans/mumin/mumin-roof.jpg" },
    ],
    architect: {
      name: "REDACTED",
      title: "Principal Architect",
      image: "/architects/.jpg",
      quote:
        "Redacted",
    },
  },
  // TRANQUIL PARK
  {
    slug: "tranquil-park",
    name: "Tranquil Park",
    tagline: "Where elegance resides",
    type: "Residential",
    status: "Completed",
    address: "Plot 23, Road 503, Sector 13, Jolshiri",
    location: "Jolshiri",
    heroImage: "/projectimages/tranquil-park/tranquil-park-01.jpg",
    buildingImage: "/projectimages/mumin/view-01.jpg",
    byTrilliantArden: true,
    specs: [
      { label: "Land Area", value: "5 Katha" },
      { label: "Size of Apartments", value: "2,850 sft (approx.)" },
      { label: "Facing of Land", value: "East" },
      { label: "Front Road Width", value: "20 ft" },
      { label: "Number of Floors", value: "G+M+8" },
      { label: "Number of Apartments", value: "8" },
      { label: "Number of Parking", value: "8" },
      // { label: "Specialty of Land", value: "Park Facing" },
    ],
    features: [
      { icon: "ArrowUpDown", label: "High Speed Elevators" },
      { icon: "TreePine",    label: "Landscaped Gardens" },
      { icon: "Flame",       label: "Firefighting System" },
      { icon: "ShieldCheck", label: "Earthquake Proof Structure" },
      { icon: "Car",         label: "Chauffeurs' Waiting Room" },
      { icon: "Sofa",        label: "Elegant Reception & Waiting Room" },
      { icon: "Video",       label: "24-Hour CCTV Surveillance" },
      { icon: "Sparkles",    label: "Artistic Lighting & Water Features" },
    ],
    gallery: [
      "/projectimages/tranquil-park/tranquil-park-01.jpg",
      "/projectimages/tranquil-park/tranquil-park-02.jpg",
      "/projectimages/tranquil-park/tranquil-park-03.jpg",
      "/projectimages/tranquil-park/tranquil-park-04.jpg",
      "/projectimages/tranquil-park/tranquil-park-05.jpg",
    ],
    floorPlans: [
      { kind: "ground",   label: "GF",   fullLabel: "Ground Floor",       image: "/floorplans/tranquil-park/tranquil-park-ground.jpg" },
      { kind: "mezzanine",   label: "M",   fullLabel: "Mezzanine Floor",       image: "/floorplans/tranquil-park/tranquil-park-mezzanine.jpg" },
      { kind: "typical",  label: "Typ",  fullLabel: "Typical Floor", image: "/floorplans/tranquil-park/tranquil-park-floor-01.jpg" },
      { kind: "typical",  label: "2F",  fullLabel: "Second Floor (Duplex lower)", image: "/floorplans/tranquil-park/tranquil-park-floor-02.jpg" },
      { kind: "typical",  label: "3F",  fullLabel: "Third Floor (Duplex upper", image: "/floorplans/tranquil-park/tranquil-park-floor-03.jpg" },
      { kind: "roof",     label: "Roof", fullLabel: "Rooftop",            image: "/floorplans/tranquil-park/tranquil-park-roof.jpg" },
    ],
    neighborhood: {
      images: [
        "/neighborhoods/rahma/jolshiri-maze.jpeg",
        "/neighborhoods/rahma/jolshiri-golf.jpg",
      ],
      sections: [
        {
          title: "The Township",
          body: "Located along the eastern corridor of Greater Dhaka, Jolshiri Abashon is a master-planned township designed around green spaces, wide avenues, and clean urban organization. Spanning lush, landscaped parks and an extensive network of intertwined lakes and natural water bodies, the enclave seamlessly blends outdoor activity with residential serenity.",
        },
        {
          title: "Connectivity",
          body: "Directly connected via the 300 Feet Purbachal Expressway, Jolshiri balances quiet living with swift access to central districts like Gulshan and Baridhara. Designed as a fully self-contained ecosystem, the township integrates dedicated educational zones, neighborhood mosques, secure frameworks, and modern civic utilities.",
        },
      ],
    },
  },
  // CRYSTAL LAKE
  {
    slug: "crystal-lake",
    name: "Crystal Lake",
    tagline: "A timeless expression",
    type: "Residential",
    status: "Completed",
    address: "Plot 25, Road 406, Sector 14, Jolshiri",
    location: "Jolshiri",
    heroImage: "/projectimages/crystal-lake/crystal-lake-02.jpg",
    buildingImage: "/projectimages/crystal-lake/crystal-lake-01.jpg",
    byTrilliantArden: true,
    specs: [
      { label: "Land Area", value: "6 Katha" },
      { label: "Size of Apartments", value: "2,850 sft (approx.)" },
      { label: "Facing of Land", value: "South" },
      { label: "Front Road Width", value: "25 ft" },
      { label: "Number of Floors", value: "G+M+8" },
      { label: "Number of Apartments", value: "8" },
      { label: "Number of Parking", value: "8" },
      // { label: "Specialty of Land", value: "Lake Facing" },
    ],
    features: [
      { icon: "Zap",         label: "Full Load Power Backup Generator" },
      { icon: "ArrowUpDown", label: "High Speed Elevators" },
      { icon: "TreePine",    label: "Landscaped Gardens" },
      { icon: "Waves",       label: "Swimming Pool" },
      { icon: "Dumbbell",    label: "Loaded Fitness Centre" },
      { icon: "Flame",       label: "Firefighting System" },
      { icon: "ShieldCheck", label: "Earthquake Proof Structure" },
      { icon: "Car",         label: "Chauffeurs' Waiting Room" },
      { icon: "Sofa",        label: "Elegant Reception & Waiting Room" },
      { icon: "Video",       label: "24-Hour CCTV Surveillance" },
      { icon: "Sparkles",    label: "Artistic Lighting & Water Features" },
    ],
    gallery: [
      "/projectimages/crystal-lake/crystal-lake-01.jpg",
      "/projectimages/crystal-lake/crystal-lake-02.jpg",
      "/projectimages/crystal-lake/crystal-lake-03.jpg",
      "/projectimages/crystal-lake/crystal-lake-04.jpg",
      "/projectimages/crystal-lake/crystal-lake-05.jpg",
      "/projectimages/crystal-lake/crystal-lake-06.jpg",
      "/projectimages/crystal-lake/crystal-lake-07.jpg",
      "/projectimages/crystal-lake/crystal-lake-08.jpg",
      "/projectimages/crystal-lake/crystal-lake-09.jpg",
      "/projectimages/crystal-lake/crystal-lake-10.jpg",
      "/projectimages/crystal-lake/crystal-lake-11.jpg",
      "/projectimages/crystal-lake/crystal-lake-12.jpg",
      "/projectimages/crystal-lake/crystal-lake-13.jpg"
    ],
    neighborhood: {
      images: [
        "/neighborhoods/rahma/jolshiri-maze.jpeg",
        "/neighborhoods/rahma/jolshiri-golf.jpg",
      ],
      sections: [
        {
          title: "The Township",
          body: "Located along the eastern corridor of Greater Dhaka, Jolshiri Abashon is a master-planned township designed around green spaces, wide avenues, and clean urban organization. Its extensive network of intertwined lakes and natural water bodies make it one of the most tranquil residential enclaves in the region.",
        },
        {
          title: "Connectivity",
          body: "Directly connected via the 300 Feet Purbachal Expressway, Jolshiri balances quiet living with swift access to central districts like Gulshan and Baridhara. The township integrates dedicated educational zones, neighborhood mosques, secure frameworks, and modern civic utilities.",
        },
      ],
    },
  },
  // ELYSIUM
  {
    slug: "elysium",
    name: "Elysium",
    tagline: "Defined by distinction",
    type: "Residential",
    status: "Upcoming",
    address: "House 22, Road 11, Baridhara, Dhaka",
    location: "Baridhara",
    heroImage: "/projectimages/elysium/elysium-01.jpg",
    buildingImage: "/projectimages/elysium/elysium-01.jpg",
    byTrilliantArden: true,
    specs: [
      { label: "Land Area", value: "5 Katha" },
      { label: "Size of Apartments", value: "2,850 sft (approx.)" },
      { label: "Facing of Land", value: "North" },
      { label: "Front Road Width", value: "40 ft" },
      { label: "Number of Floors", value: "G+M+8" },
      { label: "Number of Apartments", value: "8" },
      { label: "Number of Parking", value: "8" },
    ],
    features: [
      { icon: "Zap",         label: "Full Load Power Backup Generator" },
      { icon: "ArrowUpDown", label: "High Speed Elevators" },
      { icon: "TreePine",    label: "Landscaped Gardens" },
      { icon: "Waves",       label: "Swimming Pool" },
      { icon: "Dumbbell",    label: "Loaded Fitness Centre" },
      { icon: "Droplets",    label: "Central Water Treatment Plant" },
      { icon: "Flame",       label: "Firefighting System" },
      { icon: "ShieldCheck", label: "Earthquake Proof Structure" },
      { icon: "Car",         label: "Chauffeurs' Waiting Room" },
      { icon: "Sofa",        label: "Elegant Reception & Waiting Room" },
      { icon: "DoorOpen",    label: "Grand Double-Height Entrance" },
      { icon: "Video",       label: "24-Hour CCTV Surveillance" },
      { icon: "Sparkles",    label: "Artistic Lighting & Water Features" },
    ],
    gallery: [
      "/projectimages/elysium/elysium-01.jpg",
    ],
    floorPlans: [
      { kind: "ground", label: "GF", fullLabel: "Ground Floor", image: "/floorplans/elysium/elysium-ground.jpg" },
      { kind: "mezzanine", label: "M", fullLabel: "Mezzanine Floor", image: "/floorplans/elysium/elysium-mezzanine.jpg" },
      { kind: "typical", label: "1F", fullLabel: "1st Floor", image: "/floorplans/elysium/elysium-floor-01.jpg" },
      { kind: "typical", label: "Even Floors", fullLabel: "2nd,4th,6th,8th Floors", image: "/floorplans/elysium/elysium-floor-even.jpg" },
      { kind: "typical", label: "Odd Floors", fullLabel: "3rd, 5th, 7th Floors", image: "/floorplans/elysium/elysium-floor-odd.jpg" },
      { kind: "roof", label: "Roof", fullLabel: "Rooftop Plan", image: "/floorplans/elysium/elysium-roof.jpg" }
    ],
    neighborhood: {
      images: [
        "/neighborhoods/rahma/jolshiri-maze.jpeg",
        "/neighborhoods/rahma/jolshiri-golf.jpg",
      ],
      sections: [
        {
          title: "The Township",
          body: "Located along the eastern corridor of Greater Dhaka, Jolshiri Abashon is a master-planned township designed around green spaces, wide avenues, and clean urban organization. Spanning lush, landscaped parks and an extensive network of intertwined lakes and natural water bodies, the enclave seamlessly blends outdoor activity with residential serenity.",
        },
        {
          title: "Connectivity",
          body: "Directly connected via the 300 Feet Purbachal Expressway, Jolshiri balances quiet living with swift access to central districts like Gulshan and Baridhara. Designed as a fully self-contained ecosystem, the township integrates dedicated educational zones, neighborhood mosques, secure frameworks, and modern civic utilities.",
        },
      ],
    },
  },
];

export function getProjectBySlug(slug: string): ProjectDetail | undefined {
  return PROJECT_DETAILS.find((p) => p.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return PROJECT_DETAILS.map((p) => p.slug);
}
