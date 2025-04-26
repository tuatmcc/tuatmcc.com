import { Navigation } from '../_components/Navigation/Navigation';
import { Footer } from './_components/Footer';
import { Introduction } from './_components/Introduction';
import { Projects } from './_components/Projects';
import { Pulse } from './_components/Pulse';
import { RecentNews } from './_components/RecentNews';
import { Top } from './_components/Top';
import { WireframeImage } from './_components/WireframeImage';

export default function HomePage() {
  return (
    <Navigation>
      <main className="relative">
        <Top />
        <WireframeImage />
        <Introduction />
        <Pulse />
        <RecentNews />
        <Projects />
        <Footer />
      </main>
    </Navigation>
  );
}
