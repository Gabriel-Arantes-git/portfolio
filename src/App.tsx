import { Navbar } from '@/components/Navbar/Navbar';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import { useT } from '@/i18n/hooks';
import { About } from '@/sections/About/About';
import { Contact } from '@/sections/Contact/Contact';
import { Hero } from '@/sections/Hero/Hero';
import { Projects } from '@/sections/Projects/Projects';
import { Stack } from '@/sections/Stack/Stack';
import { StackDivider } from '@/sections/StackDivider/StackDivider';
import { Timeline } from '@/sections/Timeline/Timeline';
import styles from './App.module.scss';

function Page() {
  const t = useT();
  return (
    <>
      <a className={styles.skip} href="#content">
        {t.common.skipToContent}
      </a>
      <Navbar />
      <main id="top">

        <div className={styles.firstFold}>
          <Hero />
          <StackDivider />
        </div>
        <div id="content" />
        <About />
        <Timeline />
        <Projects />
        <Stack />
        <Contact />
      </main>
    </>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <Page />
    </LanguageProvider>
  );
}
