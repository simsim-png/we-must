import { Footer } from "~/components/layout/Footer";
import { Header } from "~/components/layout/Header";
import { WhatsAppFab } from "~/components/layout/WhatsAppFab";
import { Cursor } from "~/components/motion/Cursor";
import { TransitionOutlet } from "~/components/motion/PageTransition";
import { SmoothScroll } from "~/components/motion/SmoothScroll";
import { useT } from "~/lib/i18n";

export default function SiteLayout() {
  const t = useT();
  return (
    <SmoothScroll>
      <a
        href="#main"
        className="label-mono fixed left-4 top-4 z-[80] -translate-y-24 bg-cobalt px-4 py-3 text-ivory transition-transform focus:translate-y-0"
      >
        {t({ fr: "Aller au contenu", en: "Skip to content" })}
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <TransitionOutlet />
      </main>
      <Footer />
      <WhatsAppFab />
      <Cursor />
    </SmoothScroll>
  );
}
