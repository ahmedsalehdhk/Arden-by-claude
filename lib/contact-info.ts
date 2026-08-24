import { getSetting } from "./settings";

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
}

export const DEFAULT_CONTACT_INFO: ContactInfo = {
  phone: "+88 019 1688 2330",
  email: "info@ardenholdingsltd.com",
  address: "House 40 (2nd Floor), Road 20,\nMohakhali DOHS, Dhaka-1206",
};

export const CONTACT_INFO_KEY = "contact_info";

export async function getContactInfo(): Promise<ContactInfo> {
  const stored = await getSetting<Partial<ContactInfo>>(CONTACT_INFO_KEY);
  return { ...DEFAULT_CONTACT_INFO, ...(stored ?? {}) };
}

export function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  return `tel:${digits}`;
}
