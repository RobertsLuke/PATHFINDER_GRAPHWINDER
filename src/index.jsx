import "./style.css";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience.jsx";
import RadarOverlay from "./Experience.jsx";

const root = ReactDOM.createRoot(document.querySelector("#root"));

const App = () => {
  // State to track the car's position
  const [carPosition, setCarPosition] = useState({ x: 0, y: 0, z: 0 });

  // Callback function to update the car's position
  const updateCarPosition = (newPosition) => {
    setCarPosition(newPosition);
  };

  return (
    <>
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 2000,
          position: [0, 0, 0],
        }}
      >
        <Experience updateCarPosition={updateCarPosition} />
      </Canvas>
      {/* <Radar carPosition={carPosition} /> */}
    </>
  );
};

root.render(<App />);
