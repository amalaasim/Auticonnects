import React from "react";
import loadingWheel from "../assests/loadingwheel.png";

interface LoadingWheelProps {
  text?: string;
  size?: number;
  className?: string;
  textClassName?: string;
}

const LoadingWheel: React.FC<LoadingWheelProps> = ({
  text,
  size = 80,
  className = "",
  textClassName = "",
}) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <img
        src={loadingWheel}
        alt="Loading"
        style={{
          width: size,
          height: size,
          animation: "loadingWheelSpin 2.8s linear infinite",
          transformOrigin: "center",
        }}
      />
      {text ? <div className={textClassName}>{text}</div> : null}
      <style>{`
        @keyframes loadingWheelSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingWheel;
