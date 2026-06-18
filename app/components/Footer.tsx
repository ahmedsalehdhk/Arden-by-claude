import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] py-12 sm:py-16 px-[7.5%]">
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr] gap-10 sm:gap-12 border-b border-white/10 pb-10 sm:pb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-">
              <Image
                src="/logo.png"
                alt="Arden Holdings"
                width={160}
                height={40}
                className="h-[96px] w-auto brightness-0 invert"
              />
            </Link>
            <p
              className="font-sans text-white leading-relaxed"
              style={{ fontSize: "14px", maxWidth: "280px" }}
            >
              {/* Legacy in every landmark */}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p
              className="font-sans text-white mb-6"
              style={{
                fontSize: "11px",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
              }}
            >
              Navigation
            </p>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-sans text-white/60 hover:text-white transition-colors"
                    style={{ fontSize: "15px" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p
              className="font-sans text-white mb-6"
              style={{
                fontSize: "11px",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
              }}
            >
              Contact
            </p>
            <ul className="space-y-3">
              <li
                className="font-sans text-white/60"
                style={{ fontSize: "15px" }}
              >
                74 Gulshan Avenue
                <br />
                Dhaka 1212
              </li>
              <li>
                <a
                  href="tel:+8802-9882345"
                  className="font-sans text-white/60 hover:text-white transition-colors"
                  style={{ fontSize: "15px" }}
                >
                  +880 2-9882345
                </a>
              </li>
              <li>
                <a
                  href="mailto:inquiries@ardengroup.com"
                  className="font-sans text-white/60 hover:text-white transition-colors"
                  style={{ fontSize: "15px" }}
                >
                  inquiries@ardengroup.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-white/40" style={{ fontSize: "12px" }}>
            &copy; {new Date().getFullYear()} Arden Holdings Ltd. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Use", "Sitemap"].map((label) => (
              <a
                key={label}
                href="#"
                className="font-sans text-white/40 hover:text-white/70 transition-colors"
                style={{ fontSize: "12px" }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
