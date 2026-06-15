// ── ServicesSkeleton.jsx ──────────────────────────────────────────────────
// Premium shimmer skeleton for the Services section.
// Drop the <ServicesSkeleton /> inside the {isLoading} block in Services.jsx

const SkeletonPulse = ({ className = "", style = {} }) => (
  <div
    className={`animate-pulse bg-gray-200 rounded-lg ${className}`}
    style={style}
  />
);

// ── Single card skeleton ──────────────────────────────────────────────────
const ServiceCardSkeleton = () => (
  <div className="relative flex flex-col rounded-3xl overflow-hidden border border-gray-100 bg-white shadow-sm">

    {/* Top accent bar placeholder */}
    <div className="h-1 w-full bg-gray-100" />

    <div className="flex flex-col gap-5 p-7 flex-1">

      {/* Icon + tag row */}
      <div className="flex items-start justify-between">
        {/* Icon box */}
        <SkeletonPulse className="w-14 h-14 rounded-2xl flex-shrink-0" />

        {/* Tag + category */}
        <div className="flex flex-col items-end gap-1.5">
          <SkeletonPulse className="h-5 w-[72px] rounded-full" />
          <SkeletonPulse className="h-3 w-20" />
        </div>
      </div>

      {/* Title + shortDesc */}
      <div className="space-y-2">
        <SkeletonPulse className="h-5 w-3/4" />
        <SkeletonPulse className="h-3.5 w-full" />
        <SkeletonPulse className="h-3.5 w-5/6" />
        <SkeletonPulse className="h-3.5 w-4/6" />
      </div>

      <div className="flex-1" />

      {/* Footer */}
      <div className="flex items-center justify-between pt-5 border-t border-gray-100">
        {/* Duration */}
        <div className="space-y-1.5">
          <SkeletonPulse className="h-2.5 w-14" />
          <SkeletonPulse className="h-4 w-20" />
        </div>

        {/* Price */}
        <div className="flex flex-col items-end space-y-1.5">
          <SkeletonPulse className="h-2.5 w-20" />
          <SkeletonPulse className="h-5 w-24" />
        </div>
      </div>
    </div>

    {/* CTA button placeholder */}
    <div className="px-7 pb-6">
      <SkeletonPulse className="h-10 w-full rounded-xl" />
    </div>
  </div>
);

// ── Full section skeleton ─────────────────────────────────────────────────
const ServicesSkeleton = ({ count = 6 }) => (
  <div>

    {/* Header skeleton */}
    <div className="text-center mb-16 space-y-4">
      {/* "Our Services" label */}
      <div className="flex items-center justify-center gap-2">
        <div className="w-8 h-px bg-gray-200" />
        <SkeletonPulse className="h-3 w-24" style={{ borderRadius: "999px" }} />
        <div className="w-8 h-px bg-gray-200" />
      </div>

      {/* Heading line 1 */}
      <SkeletonPulse className="h-10 md:h-12 w-72 mx-auto rounded-xl" />
      {/* Heading line 2 (gradient text placeholder) */}
      <SkeletonPulse className="h-10 md:h-12 w-80 mx-auto rounded-xl" />

      {/* Subtitle lines */}
      <div className="space-y-2 max-w-xl mx-auto">
        <SkeletonPulse className="h-4 w-full" />
        <SkeletonPulse className="h-4 w-4/5 mx-auto" />
      </div>
    </div>

    {/* Category pills skeleton */}
    <div className="flex flex-wrap justify-center gap-2 mb-12">
      {["All", "Cosmetic", "Restorative", "Orthodontics", "Preventive"].map((label) => (
        <SkeletonPulse
          key={label}
          className="h-9 rounded-full"
          style={{ width: `${label.length * 9 + 24}px` }}
        />
      ))}
    </div>

    {/* Cards grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ServiceCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

export default ServicesSkeleton;
