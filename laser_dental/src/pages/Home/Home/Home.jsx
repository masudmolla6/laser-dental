import Banner from '../Banner/Banner';
import Hero from '../Hero/Hero';
import Services from '../Services/Services';
import Testimonials from '../Testimonials/Testimonials';
import AboutDoctor from '../AboutDoctor/AboutDoctor';
import ContactBooking from '../ContactBooking/ContactBooking';
import Locations from '../Locations/Locations';

const Home = () => {
  return (
    <div>
      {/* 1. Full-screen carousel */}
      <Banner />

      {/* 2. Hero — clinic intro, stats, location strip */}
      <Hero />

      {/* 3. Services overview */}
      <Services />

      {/* 4. About the doctor */}
      <AboutDoctor />

      {/* 5. Patient testimonials */}
      <Testimonials />

      {/* 6. Locations */}
      <Locations />

      {/* 7. Contact / Booking form */}
      <ContactBooking />
    </div>
  );
};

export default Home;
