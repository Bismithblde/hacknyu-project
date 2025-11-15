import SideNav from './components/SideNav';
import Hero from './components/Hero';
import About from './components/About';
import ReportSection from './components/ReportSection';

function App() {
  return (
    <>
      <SideNav />
      <main>
        <Hero />
        <About />
        <ReportSection />
      </main>
    </>
  );
}

export default App;
