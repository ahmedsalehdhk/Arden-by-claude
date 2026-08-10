import Link from "next/link";
import Image from "next/image";

const QUICK_LINKS = [
  { label: "About Arden", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

const SOCIALS = [
  { label: "Facebook", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Instagram", href: "#" },
];

const COMPANY = [
  { label: "Careers", href: "#" },
  { label: "News & Events", href: "/news" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0f0f0f] pt-16 sm:pt-20 pb-8 px-[7.5%]">
      {/* Top: logo only */}
      <div className="pb-10 sm:pb-14">
        <Link href="/" className="inline-block">
          <Image
            src="/logo.png"
            alt="Arden Holdings"
            width={220}
            height={56}
            className="h-[52px] sm:h-[60px] w-auto brightness-0 invert"
          />
        </Link>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* 4-column link grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 pt-12 sm:pt-16 pb-10 sm:pb-14">
        {/* Contact */}
        <div>
          <p
            className="font-sans text-white mb-6"
            style={{ fontSize: "11px", letterSpacing: "0.28em", textTransform: "uppercase" }}
          >
            Contact
          </p>
          <ul className="space-y-3.5">
            <li>
              <a
                href="tel:+8801615759822"
                className="font-sans text-white/60 hover:text-white transition-colors"
                style={{ fontSize: "15px" }}
              >
                +88 016 1575 9822
              </a>
            </li>
            <li>
              <a
                href="mailto:inquiries@ardengroup.com"
                className="font-sans text-white/60 hover:text-white transition-colors break-all"
                style={{ fontSize: "15px" }}
              >
                inquiries@ardengroup.com
              </a>
            </li>
            <li className="font-sans text-white/60" style={{ fontSize: "15px" }}>
              House 40 (2nd Floor), Road 20,<br />Mohakhali DOHS, Dhaka-1206
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <p
            className="font-sans text-white mb-6"
            style={{ fontSize: "11px", letterSpacing: "0.28em", textTransform: "uppercase" }}
          >
            Quick Links
          </p>
          <ul className="space-y-3.5">
            {QUICK_LINKS.map((link) => (
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

        {/* Follow Us */}
        <div>
          <p
            className="font-sans text-white mb-6"
            style={{ fontSize: "11px", letterSpacing: "0.28em", textTransform: "uppercase" }}
          >
            Follow Us
          </p>
          <ul className="space-y-3.5">
            {SOCIALS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="font-sans text-white/60 hover:text-white transition-colors"
                  style={{ fontSize: "15px" }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <p
            className="font-sans text-white mb-6"
            style={{ fontSize: "11px", letterSpacing: "0.28em", textTransform: "uppercase" }}
          >
            Company
          </p>
          <ul className="space-y-3.5">
            {COMPANY.map((link) => (
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
      </div>

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Bottom: copyright + legal */}
      <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-sans text-white/40" style={{ fontSize: "12px" }}>
          &copy; {new Date().getFullYear()} Arden Holdings Ltd. All rights reserved.
        </p>
        <a
          href="#"
          className="font-sans text-white/40 hover:text-white/70 transition-colors"
          style={{ fontSize: "12px" }}
        >
          Privacy Policy
        </a>
      </div>
    </footer>
  );
}
