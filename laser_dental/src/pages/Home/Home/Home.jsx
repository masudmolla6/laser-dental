import React, { useEffect, useState } from 'react';
import Banner from '../Banner/Banner';
import Contact from '../Contact/Contact';
import About from '../About/About';
import axios from 'axios';
import ServicesSection from '../Services/Services';
import Testimonials from '../Testimonials/Testimonials';
import CtaBanner from '../CtaBanner/CtaBanner';
import Services from '../Services/Services';
import StatsSection from '../StatsSection/StatsSection';
import Hero from '../Hero/Hero';
import AboutDoctor from '../AboutDoctor/AboutDoctor';
import ContactBooking from '../ContactBooking/ContactBooking';
import Locations from '../Locations/Locations';

const Home = () => {
  const [data, setData] = useState([]);

useEffect(() => {
  const token = localStorage.getItem("access-token");

  axios.get("http://localhost:5000/secure", {
    headers: {
      authorization: `Bearer ${token}`
    }
  })
  .then(res => {
    setData(res.data);
  })
  .catch(err => {
    console.log(err);
  });

}, []);
  console.log(data);
    return (
        <div>
            <Banner></Banner>
            <Hero></Hero>
            <AboutDoctor></AboutDoctor>
            <ContactBooking></ContactBooking>
            {/* <StatsSection></StatsSection> */}
            <Services></Services>
            <Testimonials></Testimonials>
            <Locations></Locations>
            {/* <CtaBanner></CtaBanner> */}
            {/* <Contact></Contact> */}
            {/* <About></About> */}
        </div>
    );
};

export default Home;