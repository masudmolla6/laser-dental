// import doctor from "../../../assets/doctor-784329_1280.png";

const About = () => {
  return (
    <section className="w-full px-4 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        
        {/* TEXT CONTENT */}
        <div className="text-center lg:text-left">
          <h1 className="text-3xl sm:text-3xl font-bold mb-4">
            Welcome to LASER DENTAL Clinic in Dalan Bazer & Gazipur Branch
          </h1>

          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Dr. Faishal Chowdhary Sumon <br />
            <span className="text-sm sm:text-base font-normal">
              BDS, FCPS, FWFO (USA)
            </span>
          </h2>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            LASER DENTAL is one of the most hi-tech dental clinics in Dhaka, serving all of your dental needs with special emphasis on 3D Dental Scanning, Guided Dental Implant Surgery, Digital Smile Design, Laser Dentistry, Invisalign, ZOOM Teeth Whitening and more.
            <br /><br />
            Looking for the best dentist in Uttara, Banani, Gulshan, Baridhara or Dhanmondi? You’re in the right place.
            <br /><br />
            Dr. Shihabur Rahman is one of Bangladesh’s top cosmetic dentists with advanced European and USA training in Digital Smile Design, Guided Dental Implants, All-on-4 surgery and same-day full mouth rehabilitation.
          </p>
        </div>

        {/* IMAGE */}
        <div className="flex justify-center">
          <img
            src=""
            alt="Doctor"
            className="rounded-lg shadow-lg"
          />
        </div>

      </div>
    </section>
  );
};

export default About;