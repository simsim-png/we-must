import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { useT } from "~/lib/i18n";
import { site, whatsappUrl } from "~/lib/site";

/** Phone-only WhatsApp shortcut, shown after the first screen. Hidden until a number is set. */
export function WhatsAppFab() {
  const t = useT();
  const [show, setShow] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setShow(y > 600));
  if (!site.whatsapp) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={whatsappUrl(t({ fr: "Bonjour WeMust, j’ai un projet.", en: "Hello WeMust, I have a project." }))}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t({ fr: "Écrire sur WhatsApp", en: "Message us on WhatsApp" })}
          className="fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 grid size-14 place-items-center bg-cobalt text-ivory md:hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <MessageCircle aria-hidden className="size-6" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
