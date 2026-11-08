// Registry of the Higgsfield assets (IDs match the creative direction document).
// Until a file is added, components draw an on-brand placeholder instead.
//
// To add an asset, put the encoded files in /public/media and fill in the entry, e.g.
//   "H-01": {
//     tone: "horizon",
//     poster: "/media/hero-poster.avif",
//     video: { webm: "/media/hero-1080.webm", mp4: "/media/hero-1080.mp4" },
//     mobile: "/media/hero-720x1280.mp4",   // H-02
//   },

export type Tone = "horizon" | "cobalt" | "warm";

export type MediaId = "H-01" | "H-04" | "H-05" | "H-06" | "H-07" | "H-08" | "H-09" | "H-10" | "H-11" | "H-12";

export type MediaAsset = {
  tone: Tone;
  /** AVIF still, shown first and kept when video is off. */
  poster?: string;
  /** JPEG for browsers without AVIF support. */
  posterFallback?: string;
  /** CSS object-position, e.g. to keep the subject in frame on portrait screens. */
  focus?: string;
  video?: { webm?: string; mp4: string };
  /** Portrait version served under 768px. */
  mobile?: string;
};

export const media: Record<MediaId, MediaAsset> = {
  // Hero: studio keyframe v1 (Z Image) as poster until the video loop is generated.
  "H-01": {
    tone: "horizon",
    poster: "/media/hero-poster.avif",
    posterFallback: "/media/hero-poster.jpg",
    focus: "18% 50%",
  },
  "H-04": { tone: "warm" }, // Branding
  "H-05": { tone: "cobalt" }, // Photo & video
  "H-06": { tone: "cobalt" }, // Social media
  "H-07": { tone: "cobalt" }, // Marketing & content
  "H-08": { tone: "warm" }, // Website design
  "H-09": { tone: "cobalt" }, // Web applications
  "H-10": { tone: "warm" }, // About: Casablanca Art Deco
  "H-11": { tone: "horizon" }, // Final CTA: Atlantic horizon
  "H-12": { tone: "horizon" }, // 404
};
