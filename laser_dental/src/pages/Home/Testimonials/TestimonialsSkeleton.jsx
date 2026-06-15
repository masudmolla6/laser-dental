// components/Skeletons/TestimonialsSkeleton.jsx
import React from 'react';

const TestimonialsSkeleton = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-500">
      <div className="container mx-auto px-6">
        
        {/* ── Section header skeleton ── */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 px-4 py-1.5 rounded-full mb-4">
            <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
            <div className="w-20 h-3 bg-blue-200 dark:bg-blue-800 rounded animate-pulse" />
          </div>
          <div className="w-64 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-3 animate-pulse" />
          <div className="w-72 h-4 bg-gray-200 dark:bg-gray-700 rounded-md mx-auto animate-pulse" />
        </div>

        {/* ── Stats skeleton ── */}
        <div className="grid grid-cols-3 gap-4 mb-12 max-w-xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 text-center"
            >
              <div className="w-16 h-7 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2 animate-pulse" />
              <div className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse" />
            </div>
          ))}
        </div>

        {/* ── Reviews cards skeleton (Swiper style) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 flex flex-col gap-4 h-full"
            >
              {/* Avatar + Name */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="flex-1">
                  <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
                  <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              </div>

              {/* Stars */}
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div key={s} className="w-3.5 h-3.5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                ))}
              </div>

              {/* Review text */}
              <div className="space-y-2">
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="w-11/12 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="w-10/12 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="w-28 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* ── Form skeleton ── */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-violet-500 to-emerald-500" />
            
            <div className="p-8 md:p-10">
              {/* Form header */}
              <div className="text-center mb-8">
                <div className="w-48 h-7 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-2 animate-pulse" />
                <div className="w-64 h-4 bg-gray-200 dark:bg-gray-700 rounded-md mx-auto animate-pulse" />
              </div>

              {/* Form fields */}
              <div className="flex flex-col gap-5">
                {/* Name + Treatment row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
                    <div className="w-full h-11 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                  </div>
                  <div>
                    <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
                    <div className="w-full h-11 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <div key={s} className="w-7 h-7 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    ))}
                  </div>
                </div>

                {/* Review textarea */}
                <div>
                  <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
                  <div className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                </div>

                {/* Notice */}
                <div className="w-full h-16 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />

                {/* Submit button */}
                <div className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSkeleton;