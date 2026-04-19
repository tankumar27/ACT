import About from './components/About';
import CommonIssues from './components/CommonIssues';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Resources from './components/Resources';
import Tips from './components/Tips';

export default function Home() {
  return (
    <main className="overflow-x-hidden bg-slate-950">
      <Navbar />
      <Hero />
      <About />
      <CommonIssues />
      <Resources />
      <Tips />
      <Contact />
      <Footer />
    </main>
  );
}
