// Business details shown across the site.
// Empty strings are placeholders: the UI shows them as "à compléter" until filled.
export const site = {
  name: "WeMust",
  city: "Casablanca",
  coords: "33.57°N 7.59°W",
  instagram: "https://www.instagram.com/wemustagency/",
  instagramHandle: "@wemustagency",
  linkedin: "https://www.linkedin.com/company/wemustagency",
  threads: "https://www.threads.net/@wemustagency",
  // TODO(wemust): international format without "+" or spaces, e.g. "2126XXXXXXXX".
  whatsapp: "",
  // TODO(wemust): business email address.
  email: "",
  // TODO(wemust): budget ranges in MAD for the contact form. Leave empty to hide the field.
  budgetRanges: [] as string[],
};

export function whatsappUrl(message?: string) {
  if (!site.whatsapp) return "";
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${site.whatsapp}${text}`;
}
