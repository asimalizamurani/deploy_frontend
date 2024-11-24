const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      <div className="relative">
        {/* Outer Ring */}
        <div className="w-24 h-24 border-4 border-emerald-400 border-opacity-25 rounded-full animate-pulse" />

        {/* Spinning Ring */}
        <div className="absolute top-0 left-0 w-24 h-24 border-4 border-t-emerald-500 border-r-emerald-500 border-opacity-75 rounded-full animate-spin" />

        {/* Inner Pulse */}
        <div className="absolute top-2 left-2 w-20 h-20 bg-emerald-500 bg-opacity-30 rounded-full animate-ping" />

        {/* Inner Static Circle */}
        <div className="absolute top-4 left-4 w-16 h-16 bg-emerald-500 rounded-full" />

        {/* Accessibility */}
        <div className="sr-only">Loading</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
