// Business details shown across the site.
// Only what is public on the Instagram profile is filled in. Empty strings stay hidden in
// the UI: nothing is shown until WeMust supplies the real value.
export const site = {
  name: "WeMust",
  city: "Casablanca",
  instagram: "https://www.instagram.com/wemustagency/",
  instagramHandle: "@wemustagency",
  linkedin: "https://www.linkedin.com/company/wemustagency",
  threads: "https://www.threads.net/@wemustagency",
  // TODO(wemust): business email address. The Email link appears once this is set.
  email: "",
  // TODO(wemust): international format without "+" or spaces, e.g. "2126XXXXXXXX".
  whatsapp: "",
};

export function whatsappUrl(message?: string) {
  if (!site.whatsapp) return "";
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${site.whatsapp}${text}`;
}
