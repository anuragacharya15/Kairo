export default function Loading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse p-2">

      {/* Header skeleton */}
      <div className="flex items-center gap-3">
        <div className="h-7 w-1.5 rounded-full bg-gradient-to-b from-purple-300 to-violet-300" />
        <div className="h-5 w-52 rounded-xl bg-purple-100" />
      </div>

      {/* Subtitle skeleton */}
      <div className="h-3 w-36 rounded-lg bg-gray-100 -mt-2" />

      {/* Cards grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-40 rounded-2xl bg-white border border-purple-100 shadow-sm shadow-purple-50 p-5 flex flex-col justify-between"
          >
            {/* Card top row */}
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-28 rounded-lg bg-purple-100" />
              <div className="h-8 w-8 rounded-xl bg-violet-100" />
            </div>

            {/* Card middle line */}
            <div className="h-3 w-3/4 rounded-lg bg-gray-100" />

            {/* Card bottom row */}
            <div className="flex items-center gap-2.5">
              <div className="h-6 w-20 rounded-full bg-purple-100" />
              <div className="h-6 w-16 rounded-full bg-gray-100" />
              <div className="ml-auto h-6 w-14 rounded-lg bg-purple-50" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}