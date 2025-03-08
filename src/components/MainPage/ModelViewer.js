import React from "react";
import { Canvas, useLoader } from "@react-three/fiber"; // Add useLoader import here
import { OrbitControls } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

const Model = ({ modelPath }) => {
  const model = useLoader(STLLoader, modelPath); // Use STLLoader to load the .stl file
  return <primitive object={model} scale={1.5} />;
};

const ModelViewer = ({ modelPath }) => {
  return (
    <Canvas
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      }}
      camera={{ position: [0, 1, 3] }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} />
      <Model modelPath={modelPath} />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
};

export default ModelViewer;
