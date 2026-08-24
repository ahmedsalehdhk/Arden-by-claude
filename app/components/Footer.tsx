"use client";

import { useEffect, useState } from "react";

const DEFAULT_INFO = {
  phone: "+88 019 1688 2330",
  email: "info@ardenholdingsltd.com",
  address: "House 40 (2nd Floor), Road 20,\nMohakhali DOHS, Dhaka-1206",
};

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

// Inline social glyphs — matches the set used in the mobile nav overlay.
type IconProps = { size?: number; className?: string };

const FacebookIcon = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M13.5 21v-7.5h2.6l.4-3.1h-3V8.4c0-.9.3-1.5 1.5-1.5H16.7V4.1c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4v2.4H7.6v3.1h2.7V21h3.2z" />
  </svg>
);

const InstagramIcon = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const LinkedinIcon = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM3 9.75h4v11H3v-11zm7 0h3.8v1.5h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1v5.46h-4v-4.84c0-1.16-.02-2.65-1.62-2.65-1.62 0-1.87 1.26-1.87 2.57v4.92h-4v-11z" />
  </svg>
);

const SOCIALS = [
  { label: "Facebook",  href: "https://www.facebook.com/profile.php?id=61567335483561", Icon: FacebookIcon },
  { label: "Instagram", href: "https://www.instagram.com/arden_holdings_ltd/",         Icon: InstagramIcon },
  { label: "LinkedIn",  href: "https://www.linkedin.com/company/116103933/",           Icon: LinkedinIcon },
];

export default function Footer() {
  const [info, setInfo] = useState(DEFAULT_INFO);
  useEffect(() => {
    fetch("/api/settings/contact-info")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d) setInfo({ ...DEFAULT_INFO, ...d }); })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-[#0f0f0f] py-8 px-[7.5%]">
      {/* Contact + Address row — both columns share the same top baseline */}
      <div className="pb-6 sm:pb-8 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-16 items-start">
        {/* Left — Contact */}
        <div>
          <p className="font-sans text-eyebrow uppercase text-white mb-3">
            Contact
          </p>
          <ul className="space-y-3 sm:space-y-4">
            <li className="font-sans text-body text-white/70">
              Phone:&nbsp;
              <a href={telHref(info.phone)} className="text-white hover:text-[#c9a54a] transition-colors">
                {info.phone}
              </a>
            </li>
            <li className="font-sans text-body text-white/70">
              Email:&nbsp;
              <a
                href={`mailto:${info.email}`}
                className="text-white hover:text-[#c9a54a] transition-colors break-all"
              >
                {info.email}
              </a>
            </li>
          </ul>
        </div>

        {/* Right — Address */}
        <div className="sm:text-right">
          <p className="font-sans text-eyebrow uppercase text-white mb-3">
            Address
          </p>
          <p className="font-sans text-body text-white/70 whitespace-pre-line">
            {info.address}
          </p>
        </div>
      </div>

      <hr className="-mx-[7.5%] border-0 border-t border-white/15 mb-6 sm:mb-8" />

      {/* Bottom bar — on mobile: socials first, copyright below.
          On desktop: copyright left, socials right. */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-6 sm:gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 font-sans text-body-sm text-white/50">
          <p>&copy; {new Date().getFullYear()} Arden Holdings Ltd. All rights reserved.</p>
          <span className="hidden sm:inline text-white/25">|</span>
          <p>Made By <span className="text-white/70">Proteron Digital</span></p>
        </div>

        <div className="flex items-center gap-3">
          {SOCIALS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-white/25 flex items-center justify-center text-white/70 hover:text-[#c9a54a] hover:border-[#c9a54a]/60 transition-colors"
            >
              <Icon size={15} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
