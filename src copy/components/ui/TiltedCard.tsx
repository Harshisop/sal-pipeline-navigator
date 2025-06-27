import React from "react";

interface TiltedCardProps {
  children: React.ReactNode;
  containerHeight?: string;
  containerWidth?: string;
  rotateAmplitude?: number;
  scaleOnHover?: number;
}

const TiltedCard: React.FC<TiltedCardProps> = ({
  children,
  containerHeight = "220px",
  containerWidth = "220px",
  rotateAmplitude = 10,
  scaleOnHover = 1.08,
}) => {
  const [style, setStyle] = React.useState({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * rotateAmplitude;
    const rotateY = ((x - centerX) / centerX) * -rotateAmplitude;
    setStyle({
      transform: `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scaleOnHover})`,
      transition: "transform 0.2s cubic-bezier(.03,.98,.52,.99)",
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: "perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)",
      transition: "transform 0.4s cubic-bezier(.03,.98,.52,.99)",
    });
  };

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ height: containerHeight, width: containerWidth }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center transition-all duration-300"
        style={style}
      >
        {children}
      </div>
    </div>
  );
};

export default TiltedCard; 