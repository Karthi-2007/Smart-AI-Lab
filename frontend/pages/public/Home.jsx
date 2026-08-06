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
    <Hero/>
    <Statistics/>
    <Features/>
    <About/>
    <Departments/>
    <Workflow/>
    <AIPreview/>
    <DashboardPreview/>
    <Testimonials/>
    <ContactSection/>
    </>

  );
};

export default Home;