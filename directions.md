1. Install using vite:

   ```bash
   npm init vite@latest
   ```

   Structure:
   index.html -> Loads the index.jsx
   index.jsx -> Gives us a canvas to work with, loads the 'experience' and loads our camera.
   experience.jsx -> Loads the 3d model for now
   Needs:

- figure out best entry point of the 3d model (app.jsx will then render it)

stage 1:
"import { useGLTF, OrbitControls } from "@react-three/drei";

export default function Experience() {
const car = useGLTF("car.gltf");
return (
<>
<color args={["#241a1a"]} attach="background" />
<OrbitControls makeDefault />

      <mesh>
        <boxGeometry />
        <meshNormalMaterial />
      </mesh>

      <primitive object={car.scene} />
    </>

);
}
"
