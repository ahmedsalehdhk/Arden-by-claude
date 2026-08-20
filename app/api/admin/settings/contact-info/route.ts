import { NextRequest, NextResponse } from "next/server";
import { setSetting } from "../../../../../lib/settings";
import { getContactInfo, CONTACT_INFO_KEY, DEFAULT_CONTACT_INFO } from "../../../../../lib/contact-info";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getContactInfo());
}

export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const next = {
    phone: typeof body?.phone === "string" && body.phone.trim() ? body.phone.trim() : DEFAULT_CONTACT_INFO.phone,
    email: typeof body?.email === "string" && body.email.trim() ? body.email.trim() : DEFAULT_CONTACT_INFO.email,
    address: typeof body?.address === "string" && body.address.trim() ? body.address : DEFAULT_CONTACT_INFO.address,
  };
  await setSetting(CONTACT_INFO_KEY, next);
  return NextResponse.json({ ok: true, ...next });
}
