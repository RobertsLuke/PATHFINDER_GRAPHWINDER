import React from "react";

const Radar = ({ carPosition }) => {
  // Constants for radar dimensions and scaling
  const RADAR_SIZE = 300; // Same as the width and height of the radar
  const WORLD_SIZE = 1000; // Adjust this based on the size of your 3D world

  // Function to convert 3D coordinates to 2D for the radar
  const convertToRadarCoordinates = (position) => {
    const x = (position.x / WORLD_SIZE) * RADAR_SIZE + RADAR_SIZE / 2; // Adjusted to center the car's position
    const y = (position.z / WORLD_SIZE) * RADAR_SIZE + RADAR_SIZE / 2; // Assuming Z is forward in your 3D world
    return { x, y };
  };

  // Convert car's 3D position to 2D radar coordinates
  const circlePosition = carPosition
    ? convertToRadarCoordinates(carPosition)
    : { x: RADAR_SIZE / 2, y: RADAR_SIZE / 2 };

  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        zIndex: 1000,
        width: `${RADAR_SIZE}px`,
        height: `${RADAR_SIZE}px`,
        border: "1px solid black",
      }}
    >
      <svg width="100%" height="100%">
        <circle
          cx={circlePosition.x}
          cy={circlePosition.y}
          r="10" // Radius of the car's representation
          fill="blue"
        />
      </svg>
    </div>
  );
};

export default Radar;
