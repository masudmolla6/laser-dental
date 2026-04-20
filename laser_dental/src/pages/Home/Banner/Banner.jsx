import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className="w-full">
      <Carousel
        autoPlay
        infiniteLoop
        interval={2000}
        showThumbs={false}
        showStatus={false}
        showArrows={true}
        swipeable
        emulateTouch
      >
        {/* Slide 1 */}
        <div className="relative h-[70vh]">
          <img
            src="https://images.pexels.com/photos/8376318/pexels-photo-8376318.jpeg"
            className="h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center">
            <div className="text-left px-6 md:px-16 text-white max-w-xl">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Advanced Dental Care
              </h1>
              <p className="mb-6">
                Modern technology & expert dentists for your perfect smile.
              </p>
              <Link to="/appointment" className="btn btn-primary rounded-full">
                Book Appointment
              </Link>
            </div>
          </div>
        </div>

        {/* Slide 2 */}
        <div className="relative h-[70vh] w-full">
          <img
            src="https://images.pexels.com/photos/19438558/pexels-photo-19438558.jpeg"
            className="absolute inset-0 w-full h-full object-cover"
            alt="Dental Care"
            />
          <div className="absolute inset-0 bg-black/50 flex items-center">
            <div className="text-left px-6 md:px-16 text-white max-w-xl">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Pain-Free Treatment
              </h1>
              <p className="mb-6">
                Comfortable and safe dental procedures for all ages.
              </p>
              <Link to="/services" className="btn btn-primary rounded-full">
                Our Services
              </Link>
            </div>
          </div>
        </div>

        {/* Slide 3 */}
        <div className="relative h-[70vh]">
          <img
            src="https://images.pexels.com/photos/5207089/pexels-photo-5207089.jpeg"
            className="h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center">
            <div className="text-left px-6 md:px-16 text-white max-w-xl">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Trusted Family Dentist
              </h1>
              <p className="mb-6">
                Caring smiles for children, adults & seniors.
              </p>
              <Link to="/contact" className="btn btn-primary rounded-full">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </Carousel>
    </div>
  );
};

export default Banner;