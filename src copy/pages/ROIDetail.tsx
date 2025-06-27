import React from "react";

// Placeholder for OGL gallery (replace with actual OGL component when ready)
function AnimatedStairGallery() {
  return (
    <div className="flex flex-col items-start justify-center h-full w-full px-8 py-12">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-blue-200/60 rounded-xl shadow-lg px-8 py-4 mb-[-32px] border border-blue-200"
          style={{
            marginLeft: `${i * 32}px`,
            minWidth: 180,
            minHeight: 60,
            fontWeight: 600,
            fontSize: 20,
          }}
        >
          Month {i + 1}: $XX,XXX
        </div>
      ))}
    </div>
  );
}

export default function ROIDetail() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Left: Glass Scaffold */}
      <div className="w-[40vw] min-w-[320px] max-w-[600px] h-screen sticky top-0 flex items-center justify-center z-10">
        <div className="w-[80%] h-[80%] rounded-3xl" style={{
          background: 'rgba(255,255,255,0.18)',
          boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          border: '1.5px solid rgba(255,255,255,0.25)'
        }}>
          <div className="flex flex-col items-start justify-center h-full w-full px-8 py-12">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="mb-[-32px] w-48 h-16"
                style={{
                  background: 'rgba(255,255,255,0.32)',
                  boxShadow: '0 2px 8px 0 rgba(31,38,135,0.10)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1.5px solid rgba(255,255,255,0.18)',
                  borderRadius: '1rem',
                }}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Right: Animated Gallery */}
      <div className="flex-1 h-screen overflow-y-scroll relative">
        <AnimatedStairGallery />
      </div>
    </div>
  );
} 