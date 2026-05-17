import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Star } from "lucide-react";

const DEMO_REVIEWS = [
  {
    _id: "1",
    name: "Rahima Hossain",
    initials: "RH",
    treatment: "Laser Whitening",
    rating: 5,
    review:
      "মাত্র একটি সেশনেই আমার দাঁত অনেক উজ্জ্বল হয়ে গেছে। ডাক্তার এবং স্টাফ সবাই অনেক আন্তরিক ছিলেন। লেজার ট্রিটমেন্টে কোনো ব্যথা ছিল না, দারুণ অভিজ্ঞতা!",
    date: "April 2025",
    avatarBg: "#e0f2fe",
    avatarColor: "#0369a1",
  },
  {
    _id: "2",
    name: "Karim Ahmed",
    initials: "KA",
    treatment: "Root Canal Treatment",
    rating: 5,
    review:
      "আমি রুট ক্যানেল নিয়ে অনেক ভয়ে ছিলাম। কিন্তু Laser Dental Point এ এসে সব ভয় দূর হয়ে গেছে। আধুনিক যন্ত্রপাতি ও দক্ষ ডাক্তারের কারণে পুরো প্রক্রিয়াটি প্রায় ব্যথামুক্ত ছিল।",
    date: "March 2025",
    avatarBg: "#dcfce7",
    avatarColor: "#166534",
  },
  {
    _id: "3",
    name: "Sabrina Begum",
    initials: "SB",
    treatment: "Dental Implant",
    rating: 5,
    review:
      "Dental implant করার পরে আমার হাসি সম্পূর্ণ বদলে গেছে। ডাক্তার প্রতিটি ধাপ বুঝিয়ে দিয়েছেন। ক্লিনিকটি অত্যন্ত পরিষ্কার ও পরিপাটি। সবাইকে এখানে আসার পরামর্শ দেব।",
    date: "May 2025",
    avatarBg: "#fce7f3",
    avatarColor: "#9d174d",
  },
  {
    _id: "4",
    name: "Tanvir Islam",
    initials: "TI",
    treatment: "Braces & Orthodontics",
    rating: 4,
    review:
      "১৮ মাস ব্রেসেস পরার পর এখন আমার দাঁত সুন্দরভাবে সাজানো। পুরো জার্নিতে ডাক্তার নিয়মিত ফলো-আপ করেছেন। ফলাফলে আমি সত্যিই খুশি।",
    date: "February 2025",
    avatarBg: "#d1fae5",
    avatarColor: "#065f46",
  },
  {
    _id: "5",
    name: "Nasrin Rashid",
    initials: "NR",
    treatment: "Scaling & Polishing",
    rating: 5,
    review:
      "প্রতি ৬ মাসে স্কেলিং করাই এখন আমার অভ্যাস হয়ে গেছে। এখানকার সার্ভিস সবসময় চমৎকার। দাঁত পরিষ্কারের পরে মুখ একদম ফ্রেশ লাগে। খুব সাশ্রয়ী মূল্যে উন্নত সেবা।",
    date: "January 2025",
    avatarBg: "#fef3c7",
    avatarColor: "#92400e",
  },
  {
    _id: "6",
    name: "Mahbub Khan",
    initials: "MK",
    treatment: "Teeth Extraction",
    rating: 5,
    review:
      "দাঁত তোলার ব্যাপারে অনেক ভয় ছিল, কিন্তু ডাক্তারের দক্ষতায় মাত্র কয়েক মিনিটেই শেষ হয়ে গেছে। পরের দিন থেকেই স্বাভাবিক জীবনে ফিরে গেছি।",
    date: "May 2025",
    avatarBg: "#ede9fe",
    avatarColor: "#5b21b6",
  },
];

const STATS = [
  { value: "4.9", label: "Average rating" },
  { value: "1,200+", label: "Happy patients" },
  { value: "98%", label: "Would recommend" },
];

const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={14}
        className={s <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}
      />
    ))}
  </div>
);

const ReviewCard = ({ review }) => (
  <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 flex flex-col gap-4 h-full hover:shadow-md transition-shadow duration-300">
    <div className="flex items-center gap-3">
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
        style={{ backgroundColor: review.avatarBg, color: review.avatarColor }}
      >
        {review.initials}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-800 dark:text-white leading-tight">
          {review.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{review.treatment}</p>
      </div>
    </div>

    <StarRating rating={review.rating} />

    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex-1">
      "{review.review}"
    </p>

    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
      <span className="text-xs text-gray-400 dark:text-gray-500">{review.date}</span>
      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Verified patient
      </span>
    </div>
  </div>
);

const Testimonials = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-500">
      <div className="container mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            <Star size={12} className="fill-blue-500 text-blue-500" />
            Patient reviews
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white">
            What our patients say
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Real experiences from our dental care community in Dhaka
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12 max-w-xl mx-auto">
          {STATS.map(({ value, label }) => (
            <div
              key={label}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 text-center"
            >
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Swiper */}
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          loop
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="!pb-10"
        >
          {DEMO_REVIEWS.map((review) => (
            <SwiperSlide key={review._id} className="h-auto">
              <ReviewCard review={review} />
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
};

export default Testimonials;
