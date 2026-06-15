import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Star, Send, Loader2, CheckCircle2, ChevronDown } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useReviews from "../../../hooks/useReviews";
import TestimonialsSkeleton from "./TestimonialsSkeleton";


// ── Constants ─────────────────────────────────────────────────────────────
const TREATMENTS = [
  "Laser Teeth Whitening",
  "Dental Implants",
  "Braces & Aligners",
  "Scaling & Polishing",
  "Root Canal Treatment",
  "Smile Makeover",
  "Tooth Extraction",
  "Dental Checkup",
  "Other",
];

// fallback demo data — backend এ approved review না থাকলে দেখাবে
const DEMO_REVIEWS = [
  { _id: "1", name: "Rahima Hossain", initials: "RH", treatment: "Laser Whitening",       rating: 5, review: "মাত্র একটি সেশনেই আমার দাঁত অনেক উজ্জ্বল হয়ে গেছে। ডাক্তার এবং স্টাফ সবাই অনেক আন্তরিক ছিলেন। লেজার ট্রিটমেন্টে কোনো ব্যথা ছিল না, দারুণ অভিজ্ঞতা!", date: "April 2025",    avatarBg: "#e0f2fe", avatarColor: "#0369a1" },
  { _id: "2", name: "Karim Ahmed",    initials: "KA", treatment: "Root Canal Treatment",  rating: 5, review: "আমি রুট ক্যানেল নিয়ে অনেক ভয়ে ছিলাম। কিন্তু এখানে এসে সব ভয় দূর হয়ে গেছে। আধুনিক যন্ত্রপাতি ও দক্ষ ডাক্তারের কারণে পুরো প্রক্রিয়াটি প্রায় ব্যথামুক্ত ছিল।", date: "March 2025",   avatarBg: "#dcfce7", avatarColor: "#166534" },
  { _id: "3", name: "Sabrina Begum", initials: "SB", treatment: "Dental Implant",         rating: 5, review: "Dental implant করার পরে আমার হাসি সম্পূর্ণ বদলে গেছে। ডাক্তার প্রতিটি ধাপ বুঝিয়ে দিয়েছেন। ক্লিনিকটি অত্যন্ত পরিষ্কার ও পরিপাটি।",                           date: "May 2025",     avatarBg: "#fce7f3", avatarColor: "#9d174d" },
  { _id: "4", name: "Tanvir Islam",  initials: "TI", treatment: "Braces & Orthodontics",  rating: 4, review: "১৮ মাস ব্রেসেস পরার পর এখন আমার দাঁত সুন্দরভাবে সাজানো। পুরো জার্নিতে ডাক্তার নিয়মিত ফলো-আপ করেছেন। ফলাফলে আমি সত্যিই খুশি।",                            date: "February 2025",avatarBg: "#d1fae5", avatarColor: "#065f46" },
  { _id: "5", name: "Nasrin Rashid", initials: "NR", treatment: "Scaling & Polishing",    rating: 5, review: "প্রতি ৬ মাসে স্কেলিং করাই এখন আমার অভ্যাস হয়ে গেছে। খুব সাশ্রয়ী মূল্যে উন্নত সেবা।",                                                                           date: "January 2025", avatarBg: "#fef3c7", avatarColor: "#92400e" },
  { _id: "6", name: "Mahbub Khan",   initials: "MK", treatment: "Teeth Extraction",       rating: 5, review: "দাঁত তোলার ব্যাপারে অনেক ভয় ছিল, কিন্তু ডাক্তারের দক্ষতায় মাত্র কয়েক মিনিটেই শেষ হয়ে গেছে।",                                                               date: "May 2025",     avatarBg: "#ede9fe", avatarColor: "#5b21b6" },
];

const STATS = [
  { value: "4.9",    label: "Average rating"  },
  { value: "1,200+", label: "Happy patients"  },
  { value: "98%",    label: "Would recommend" },
];

// ── Star display ──────────────────────────────────────────────────────────
const StarDisplay = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} size={14}
        className={s <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"} />
    ))}
  </div>
);

// ── Interactive star picker ───────────────────────────────────────────────
const StarPicker = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);
  const LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-125 active:scale-110"
        >
          <Star
            size={30}
            className={`transition-colors ${
              s <= (hovered || value)
                ? "fill-amber-400 text-amber-400"
                : "text-gray-200"
            }`}
          />
        </button>
      ))}
      {(hovered || value) > 0 && (
        <span className="text-xs font-bold text-amber-600 ml-1">
          {LABELS[hovered || value]}
        </span>
      )}
    </div>
  );
};

// ── Review card ───────────────────────────────────────────────────────────
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
        <p className="text-sm font-semibold text-gray-800 dark:text-white leading-tight">{review.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{review.treatment}</p>
      </div>
    </div>

    <StarDisplay rating={review.rating} />

    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex-1">
      "{review.review}"
    </p>

    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
      <span className="text-xs text-gray-400 dark:text-gray-500">{review.date}</span>
      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
        <CheckCircle2 size={12} /> Verified patient
      </span>
    </div>
  </div>
);

// ── Review submit form ────────────────────────────────────────────────────
const ReviewForm = ({ onSuccess }) => {
  const axiosPublic = useAxiosPublic();

  const {
    register, handleSubmit, control, reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: "", treatment: "", rating: 0, review: "" },
  });

  const onSubmit = async (data) => {
    try {
      const res = await axiosPublic.post("/reviews", data);
      if (res.data?.success) {
        reset();
        onSuccess();
      }
    } catch (err) {
      console.error("Review submit error:", err);
    }
  };

  const inputCls = (hasErr) =>
    `w-full px-4 py-3 rounded-xl border text-sm text-gray-800 placeholder-gray-400 outline-none transition-all bg-gray-50 focus:bg-white focus:ring-2 ${
      hasErr
        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
        : "border-gray-200 focus:border-sky-400 focus:ring-sky-100"
    }`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>

      {/* Name + Treatment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Your Name *</label>
          <input
            {...register("name", { required: "Name is required" })}
            className={inputCls(!!errors.name)}
            placeholder="Full name"
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Treatment *</label>
          <div className="relative">
            <select
              {...register("treatment", { required: "Please select a treatment" })}
              className={inputCls(!!errors.treatment) + " cursor-pointer appearance-none pr-10"}
            >
              <option value="">Select treatment</option>
              {TREATMENTS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          {errors.treatment && <p className="text-xs text-red-500">{errors.treatment.message}</p>}
        </div>
      </div>

      {/* Star rating */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Your Rating *</label>
        <Controller
          name="rating"
          control={control}
          rules={{ validate: (v) => v > 0 || "Please select a rating" }}
          render={({ field }) => (
            <StarPicker value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.rating && <p className="text-xs text-red-500">{errors.rating.message}</p>}
      </div>

      {/* Review text */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Your Review *</label>
        <textarea
          {...register("review", {
            required: "Please write your review",
            minLength: { value: 20, message: "Review must be at least 20 characters" },
          })}
          rows={4}
          placeholder="Share your experience with Laser Dental Point..."
          className={inputCls(!!errors.review) + " resize-none"}
        />
        {errors.review && <p className="text-xs text-red-500">{errors.review.message}</p>}
      </div>

      {/* Notice */}
      <p className="text-[11px] text-gray-400 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
        ✅ Your review will appear on the website after a quick approval by our team.
      </p>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 bg-gradient-to-r from-sky-600 to-sky-400 shadow-lg shadow-sky-200 hover:brightness-105"
      >
        {isSubmitting
          ? <><Loader2 size={16} className="animate-spin" /> Submitting...</>
          : <><Send size={15} /> Submit Review</>
        }
      </button>
    </form>
  );
};

// ── Main Testimonials ─────────────────────────────────────────────────────
const Testimonials = () => {
  const [submitted, setSubmitted] = useState(false);

  // ✅ useReviews hook — /reviews/public → only approved
  const [reviews, isLoading, refetch, error] = useReviews();


    // ✅ Loading state handle
  if (isLoading) {
    return <TestimonialsSkeleton />;
  }

    // console.log(reviews);

  // // backend এ approved review থাকলে সেগুলো, না থাকলে demo
  // const reviews = backendReviews.length > 0 ? backendReviews : DEMO_REVIEWS;


  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-500">
      <div className="container mx-auto px-6">

        {/* ── Section header ── */}
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

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-4 mb-12 max-w-xl mx-auto">
          {STATS.map(({ value, label }) => (
            <div key={label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 text-center">
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Reviews swiper ── */}
        {!isLoading && (
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            loop
            breakpoints={{
              640:  { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="!pb-10"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review._id} className="h-auto">
                <ReviewCard review={review} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {/* ── Review submit form / success ── */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-violet-500 to-emerald-500" />

            <div className="p-8 md:p-10">
              {submitted ? (
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 size={32} className="text-emerald-600" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">
                    Thank you for your review!
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs leading-relaxed">
                    Your review has been submitted and will appear on the website after approval.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-sm font-semibold text-sky-600 hover:underline"
                  >
                    Submit another review
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Share Your Experience
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Had treatment at Laser Dental Point? We'd love to hear from you.
                    </p>
                  </div>
                  <ReviewForm onSuccess={() => setSubmitted(true)} />
                </>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
