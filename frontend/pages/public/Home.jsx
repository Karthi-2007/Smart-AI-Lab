import About from "../../components/home/About";
import AIPreview from "../../components/home/AIPreview";
import ContactSection from "../../components/home/ContactSection";
import DashboardPreview from "../../components/home/DashboardPreview";
import Departments from "../../components/home/Departments";
import Features from "../../components/home/Features";
import Hero from "../../components/home/Hero";
import Statistics from "../../components/home/Statistics";
import Testimonials from "../../components/home/Testimonials";
import Workflow from "../../components/home/Workflow";

const Home = () => {
  return (
    <>
      <Hero />

      {/* Wave divider */}
      <div className="-mt-1 overflow-hidden bg-slate-955" style={{ background: '#f5f7fa' }}>
        <svg viewBox="0 0 1440 60" className="w-full block" preserveAspectRatio="none" style={{ height: "60px", display: "block" }}>
          <path d="M0,0 C360,60 1080,0 1440,60 L1440,0 L0,0 Z" fill="#0f172a" />
        </svg>
      </div>

      <Statistics />
      <Features />
      <About />
      <Departments />
      <Workflow />
      <AIPreview />
      <DashboardPreview />
      <Testimonials />
      <ContactSection />
    </>
  );
};

export default Home;