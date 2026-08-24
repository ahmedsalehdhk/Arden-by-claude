import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getNewsBySlug } from "../../../lib/news";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import ProjectGallery from "../../components/ProjectGallery";
import MarkdownBody from "../../components/MarkdownBody";
import { Section, Tag } from "../../components/ui";

export const dynamic = "force-dynamic";

function formatDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function NewsPostPage({ params }: { params: { slug: string } }) {
  const post = await getNewsBySlug(params.slug);
  if (!post || !post.is_published) notFound();

  const category = post.category === "event" ? "Event" : "News";
  const galleryImages = post.images.filter((img) => !img.is_cover).map((img) => img.url);

  return (
    <main className="bg-bone">
      <Nav />

      {/* HEADER */}
      <Section tone="bone" rhythm="flush" className="pt-nav-offset" innerClassName="pt-6 sm:pt-12 pb-8 sm:pb-12">
        <Link
          href="/blog"
          className="inline-block font-sans text-eyebrow-sm uppercase text-ink/55 hover:text-gold transition-colors mb-6"
        >
          ← News &amp; Events
        </Link>

        <div className="mb-4">
          <Tag variant="category">{category}</Tag>
        </div>

        <h1
          className="font-serif text-ink uppercase text-balance"
          style={{
            fontSize: "clamp(2rem, 6vw, 4.5rem)",
            letterSpacing: "0.02em",
            lineHeight: 1.05,
            fontWeight: 400,
          }}
        >
          {post.title}
        </h1>

        {post.published_at && (
          <p className="font-sans text-eyebrow-sm uppercase text-ink/55 mt-6">
            Published {formatDate(post.published_at)}
          </p>
        )}
      </Section>

      {/* COVER IMAGE */}
      {post.cover_image && (
        <Section tone="bone" rhythm="flush" innerClassName="pb-10 sm:pb-16">
          <div
            className="relative w-full overflow-hidden bg-ink/5"
            style={{ aspectRatio: "16/9" }}
          >
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1200px"
            />
          </div>
        </Section>
      )}

      {/* BODY */}
      <Section tone="bone" rhythm="flush" innerClassName="pb-20 sm:pb-28">
        <MarkdownBody source={post.body_md || ""} />
      </Section>

      {galleryImages.length > 0 && (
        <ProjectGallery images={galleryImages} projectName={post.title} showHeading={false} />
      )}

      <Footer />
    </main>
  );
}
