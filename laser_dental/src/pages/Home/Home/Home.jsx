import React, { useEffect, useState } from 'react';
import Banner from '../Banner/Banner';
import Contact from '../Contact/Contact';
import About from '../About/About';
import axios from 'axios';

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
            <Contact></Contact>
            <About></About>
        </div>
    );
};

export default Home;