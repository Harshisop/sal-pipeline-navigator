import React from "react";
import TiltedCard from "../components/ui/TiltedCard";

const metrics = [
  { label: "Meetings to Book (PQLs)", value: 333 },
  { label: "Meetings via LinkedIn", value: 200 },
  { label: "Meetings via Email", value: 100 },
  { label: "Meetings via Call", value: 33 },
  { label: "Positive Replies LinkedIn", value: 333 },
  { label: "Total Replies LinkedIn", value: 952 },
  { label: "Connection Requests to Send (LinkedIn)", value: 15873 },
  { label: "Positive Replies Email", value: 167 },
  { label: "Total Replies Email", value: 556 },
  { label: "Email Contacts Required", value: 18519 },
  { label: "Positive Responses from Call", value: 33 },
  { label: "Total Responses from Call", value: 1449 },
  { label: "Phone Contacts Required (Call)", value: 6588 },
  { label: "Required TAM LinkedIn", value: 39683 },
  { label: "Required TAM Email", value: 46296 },
  { label: "Required TAM Call", value: 16469 },
];

const stepColors = [
  "bg-red-600",
  "bg-yellow-400",
  "bg-green-600",
  "bg-cyan-800",
];

export default function MISTracking() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <h1 className="text-3xl font-bold mb-10 text-center text-gray-800">MIS Tracking Metrics</h1>
      <div className="flex flex-col items-start mt-10 ml-4 font-sans">
        {metrics.slice(0, -3).map((metric, idx) => (
          <div
            key={metric.label}
            className={`card shadow-lg text-white w-80 p-4 mb-[-40px] z-10 ${stepColors[idx % stepColors.length]} relative ${idx !== 0 ? "ml-16" : ""}`}
            style={{
              top: idx * 40,
              borderRadius: "0.75rem",
              fontFamily: "inherit",
            }}
          >
            <div className="font-bold text-lg">{metric.label}</div>
            <div className="text-2xl font-extrabold mt-1">{metric.value.toLocaleString()}</div>
          </div>
        ))}
        {/* Bottom 3 metrics as glass/tilted cards */}
        <div className="flex gap-8 mt-24 ml-32">
          {metrics.slice(-3).map((metric, idx) => (
            <TiltedCard key={metric.label} containerHeight="220px" containerWidth="220px" rotateAmplitude={12} scaleOnHover={1.12}>
              <div className="flex flex-col items-center justify-center h-full w-full">
                <div className="font-bold text-lg text-gray-800 mb-2 text-center">{metric.label}</div>
                <div className="text-2xl font-extrabold text-gray-900">{metric.value.toLocaleString()}</div>
              </div>
            </TiltedCard>
          ))}
        </div>
      </div>
    </div>
  );
} 