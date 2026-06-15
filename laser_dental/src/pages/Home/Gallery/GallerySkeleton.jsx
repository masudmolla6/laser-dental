// components/Skeletons/GallerySkeleton.jsx
import React from 'react';
import { ImagePlus } from 'lucide-react';

const GallerySkeleton = () => {
  // সkeleton কার্ড সংখ্যা (গ্রিড অনুযায়ী 6 বা 9)
  const skeletonCards = [1, 2, 3, 4, 5, 6];

  return (
    <section className="min-h-screen bg-[#f7f9fc] py-20 px-5 md:px-10">
      <div className="max-w-7xl mx-auto">

        {/* ── Section header skeleton ── */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-sky-400 to-transparent" />
            <div className="w-16 h-2 bg-sky-200 rounded-full animate-pulse" />
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-sky-400 to-transparent" />
          </div>
          
          {/* Gradient title skeleton */}
          <div className="relative inline-block mb-4">
            <div 
              className="font-display font-bold"
              style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)" }}
            >
              <div className="w-80 h-10 bg-gradient-to-r from-sky-200 via-purple-200 to-pink-200 rounded-lg animate-pulse mx-auto" />
            </div>
          </div>
          
          {/* Subtitle skeleton */}
          <div className="w-96 h-4 bg-gray-200 rounded-lg mx-auto animate-pulse" />
          <div className="w-64 h-4 bg-gray-200 rounded-lg mx-auto mt-2 animate-pulse" />
        </div>

        {/* ── Search + Filter skeleton ── */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search bar */}
          <div className="relative flex-1 max-w-sm">
            <div className="w-full h-12 bg-white border border-slate-200 rounded-2xl shadow-sm animate-pulse">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-slate-200 rounded" />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-3 bg-slate-200 rounded" />
            </div>
          </div>

          {/* Result count skeleton */}
          <div className="sm:ml-auto">
            <div className="w-32 h-5 bg-slate-200 rounded animate-pulse" />
          </div>
        </div>

        {/* ── Category pills skeleton ── */}
        <div className="flex flex-wrap gap-2 mb-10">
          {["All", "Whitening", "Implant", "Braces", "Root Canal"].map((_, idx) => (
            <div
              key={idx}
              className="w-24 h-9 bg-white border border-slate-200 rounded-full animate-pulse"
              style={{ animationDelay: `${idx * 0.05}s` }}
            />
          ))}
        </div>

        {/* ── Gallery Grid Skeleton ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {skeletonCards.map((item, idx) => (
            <div
              key={item}
              className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm transition-all duration-300"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {/* Main image area */}
              <div className="relative h-52 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse">
                {/* Category badge skeleton */}
                <div className="absolute top-3 left-3">
                  <div className="w-20 h-5 bg-sky-400/30 rounded-full backdrop-blur-sm" />
                </div>
                
                {/* View button skeleton (hidden on hover) */}
                <div className="absolute inset-0 bg-black/20 opacity-0" />
              </div>

              {/* Before/After mini thumbnails */}
              <div className="grid grid-cols-2 gap-0 h-20">
                {[1, 2].map((thumb) => (
                  <div key={thumb} className="relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse">
                    <div className="absolute bottom-1 left-1.5">
                      <div className="w-12 h-3 bg-black/30 rounded-full backdrop-blur-sm" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Card body skeleton */}
              <div className="p-5">
                {/* Title */}
                <div className="w-3/4 h-5 bg-slate-200 rounded-lg mb-2 animate-pulse" />
                
                {/* Description lines */}
                <div className="space-y-2 mb-4">
                  <div className="w-full h-3 bg-slate-100 rounded animate-pulse" />
                  <div className="w-11/12 h-3 bg-slate-100 rounded animate-pulse" />
                </div>

                {/* Treatment info + details button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    <div className="w-24 h-3 bg-slate-200 rounded animate-pulse" />
                  </div>
                  <div className="w-16 h-3 bg-sky-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Load More button skeleton ── */}
        <div className="flex justify-center mt-12">
          <div className="w-40 h-11 bg-gradient-to-br from-sky-300 to-sky-200 rounded-2xl animate-pulse" />
        </div>

      </div>

      {/* ── Decorative elements for premium feel ── */}
      <div className="fixed bottom-8 right-8 opacity-30 pointer-events-none">
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-sky-400/20 to-violet-400/20 blur-3xl" />
      </div>
    </section>
  );
};

export default GallerySkeleton;