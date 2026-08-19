// Seed the DB from the existing hardcoded content. Idempotent: skips anything that already exists (by slug/email).
// Run with: npm run db:seed

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

import bcrypt from "bcryptjs";

// ── Featured projects (from app/page.tsx FEATURED_PROJECTS) ─────────
const FEATURED_SLUGS = ["amanat", "rahma"];

// ── Team (verbatim from app/about/page.tsx TEAM) ────────────────────
const TEAM = [
  {
    slug: "mazharul-haque",
    name: "Mazharul Haque",
    role: "Founder & Managing Director",
    quote: "We measure a building the way people measure a home — by how it lives, not how it looks on day one.",
    image: "/team/mazharul.png",
    bio: [
      "Mazharul Haque Chowdhury founded Arden Holdings with a singular ambition: to raise the standard of what a residential address in Dhaka can mean. His professional journey began in 1997 and now spans nearly three decades across media, communications, marketing and enterprise leadership.",
      "He played a pivotal role in establishing Havas Group Bangladesh in partnership with the Impress Group (Channel i), building one of the most influential communications platforms in the country and shaping the careers of a generation of marketers and creative leaders along the way.",
      "At Arden, he leads with the conviction that architecture is a long conversation with a city. Every project the company undertakes reflects his insistence on the right location, the right partners and the discipline to deliver a home that will still feel considered thirty years from now.",
    ],
  },
  {
    slug: "yaminul-haq",
    name: "Yaminul Haq",
    role: "Managing Director, Alliance-Arden Consortium",
    quote: "Every space we shape is built to be a legacy your family can hold onto for generations.",
    image: "/team/yaminul.png",
    bio: [
      "Yaminul Haq, a recognized real estate icon in Bangladesh with over 20 years of experience, leads the Alliance-Arden Consortium, the joint venture platform through which some of Arden's most ambitious projects are delivered. His work sits at the intersection of capital, design, and long-horizon planning.",
      "After completing his Masters degree, Yaminul has founded and built multiple thriving enterprises across various sectors including but not limited to real estate, automotive, agro-business, tourism and hospitality and many more.",
      "Within the consortium, he oversees strategy, investor relations, and execution governance, ensuring that every square feet built carries the same standard of craftsmanship and accountability from concept through completion.",
    ],
  },
  {
    slug: "mohiuddin-ahmed",
    name: "Mohiuddin Ahmed",
    role: "Director",
    quote: "We don’t just sketch beautiful ideas; we bring them to life down to the very last detail.",
    image: "/team/mohiuddin.png",
    bio: [
      "Mohiuddin Ahmed serves as Director at Arden Holdings, where he oversees project execution, design coordination and the operational rigor that turns architectural intent into a finished home. He is known internally as the person who reads every drawing twice.",
      "His background bridges construction management and design review, giving him a rare fluency in both the language of the studio and the reality of the site. He has spent years refining Arden's internal standards for material selection, tolerance and finish quality.",
      "For Mohiuddin, luxury is not ornament — it is the confidence that comes from a door that closes the same way for the next fifty years. That standard sets the tempo for how Arden's project teams work every day.",
    ],
  },
  {
    slug: "sanjib-kumar-mitra",
    name: "Sanjib Kumar Mitra",
    role: "Chief Financial Officer",
    quote: "Protecting your investment with the same care and discipline as if it were our own.",
    image: "/team/sanjib.png",
    bio: [
      "Sanjib Kumar Mitra leads finance at Arden Holdings, bringing a career's worth of experience across corporate finance, treasury and real estate capital structuring to the company's growth. He is the quiet architect of Arden's fiscal discipline.",
      "Before joining Arden, he held senior finance roles across industries where trust in the numbers was non-negotiable, working closely with auditors, lenders and institutional partners to build reporting practices that stood up to scrutiny.",
      "At Arden, he is responsible for ensuring that every project is capitalized responsibly, every customer's investment is protected, and every commitment the company makes on paper is one it can honor in full. His work is what allows the design and construction teams to build with confidence.",
    ],
  },
];

function statusToEnum(s: string): "ongoing" | "upcoming" | "completed" {
  return s.toLowerCase() as "ongoing" | "upcoming" | "completed";
}
function typeToEnum(t: string): "residential" | "commercial" {
  return t.toLowerCase() as "residential" | "commercial";
}

async function main() {
  const { pool, withTx } = await import("../lib/db");
  const { PROJECT_DETAILS } = await import("../app/data/projects");

  // 1) Admin user
  const email = process.env.SEED_ADMIN_EMAIL;
  const pw = process.env.SEED_ADMIN_PASSWORD;
  if (email && pw) {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rowCount === 0) {
      const hash = await bcrypt.hash(pw, 10);
      await pool.query(
        "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3)",
        [email, hash, process.env.SEED_ADMIN_NAME || "Admin"],
      );
      console.log(`✔ admin user ${email}`);
    } else {
      console.log(`· admin user ${email} exists, skipping`);
    }
  } else {
    console.log("· no SEED_ADMIN_EMAIL/PASSWORD in env, skipping admin user");
  }

  // 2) Projects
  for (let i = 0; i < PROJECT_DETAILS.length; i++) {
    const p = PROJECT_DETAILS[i];
    const existing = await pool.query<{ id: number }>(
      "SELECT id FROM projects WHERE slug = $1",
      [p.slug],
    );
    if (existing.rowCount && existing.rowCount > 0) {
      console.log(`· project ${p.slug} exists, skipping`);
      continue;
    }

    const featuredIdx = FEATURED_SLUGS.indexOf(p.slug);
    const isFeatured = featuredIdx >= 0;

    await withTx(async (c) => {
      const r = await c.query<{ id: number }>(
        `INSERT INTO projects
          (slug, name, tagline, type, status, address, location,
           hero_image, building_image, map_embed_src,
           by_alliance_arden, by_trilliant_arden,
           is_featured, featured_order, is_published)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
         RETURNING id`,
        [
          p.slug, p.name, p.tagline, typeToEnum(p.type), statusToEnum(p.status),
          p.address, p.location, p.heroImage, p.buildingImage, p.mapEmbedSrc ?? null,
          !!p.byAllianceArden, !!p.byTrilliantArden,
          isFeatured, isFeatured ? featuredIdx : 0, true,
        ],
      );
      const projectId = r.rows[0].id;

      for (let j = 0; j < p.specs.length; j++) {
        const s = p.specs[j];
        await c.query(
          "INSERT INTO project_specs (project_id, label, value, sort_order) VALUES ($1,$2,$3,$4)",
          [projectId, s.label, s.value, j],
        );
      }
      for (let j = 0; j < p.features.length; j++) {
        const f = p.features[j];
        await c.query(
          "INSERT INTO project_features (project_id, icon, label, sort_order) VALUES ($1,$2,$3,$4)",
          [projectId, f.icon, f.label, j],
        );
      }
      for (let j = 0; j < p.gallery.length; j++) {
        await c.query(
          "INSERT INTO project_gallery (project_id, url, sort_order) VALUES ($1,$2,$3)",
          [projectId, p.gallery[j], j],
        );
      }
      if (p.floorPlans) {
        for (let j = 0; j < p.floorPlans.length; j++) {
          const fp = p.floorPlans[j];
          await c.query(
            "INSERT INTO project_floor_plans (project_id, label, full_label, image, kind, sort_order) VALUES ($1,$2,$3,$4,$5,$6)",
            [projectId, fp.label, fp.fullLabel, fp.image, fp.kind ?? null, j],
          );
        }
      }
      if (p.neighborhood) {
        // Collapse the old sections[] into one markdown body (paragraphs joined).
        const body = p.neighborhood.sections
          .map((s) => `**${s.title}**\n\n${s.body}`)
          .join("\n\n");
        await c.query(
          "INSERT INTO project_neighborhood (project_id, image_1, image_2, body_md) VALUES ($1,$2,$3,$4)",
          [projectId, p.neighborhood.images[0] ?? null, p.neighborhood.images[1] ?? null, body],
        );
      }
      if (p.architect) {
        await c.query(
          "INSERT INTO project_architect (project_id, name, title, image, quote) VALUES ($1,$2,$3,$4,$5)",
          [projectId, p.architect.name, p.architect.title, p.architect.image, p.architect.quote],
        );
      }
    });
    console.log(`✔ project ${p.slug}`);
  }

  // 3) Team
  for (let i = 0; i < TEAM.length; i++) {
    const m = TEAM[i];
    const existing = await pool.query(
      "SELECT id FROM team_members WHERE slug = $1",
      [m.slug],
    );
    if (existing.rowCount && existing.rowCount > 0) {
      console.log(`· team ${m.slug} exists, skipping`);
      continue;
    }
    const bioMd = m.bio.join("\n\n");
    await pool.query(
      `INSERT INTO team_members (slug, name, role, quote, image, bio_md, sort_order, is_published)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [m.slug, m.name, m.role, m.quote, m.image, bioMd, i, true],
    );
    console.log(`✔ team ${m.slug}`);
  }

  console.log("Done.");
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
