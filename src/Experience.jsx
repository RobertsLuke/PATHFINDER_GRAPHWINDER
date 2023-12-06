import * as YUKA from "yuka";
import {
  path,
  updatePath,
  sortedMeshIslands,
  townADefaultNodes,
  townBDefaultNodes,
  calculateAndUpdateMeshIslandWeights,
  updateWaypoints,
  randomiseIndividualNodeValues,
  meshIslands,
  randomiseWeights,
  randomizeRoadSegmentProperties,
  roadSegments,
} from "./dora.js";
import {
  Text,
  Html,
  ContactShadows,
  PresentationControls,
  Float,
  Environment,
  useGLTF,
  OrbitControls,
} from "@react-three/drei";
import * as THREE from "three";
import React, { useRef, useState, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import gsap from "gsap";
import {
  waypointsA,
  waypointsB,
  meshIslandsA,
  meshIslandsB,
} from "./waypoints.js";

export let safetyThreshold = 1;
export let activeTownLetter = "X";

export default function Experience({}) {
  const car = useGLTF("car.gltf");
  const carRef = useRef();
  const controls = useRef();
  const { camera } = useThree();
  const townA = useGLTF("/TOWNA.gltf");
  const townARef = useRef();
  const townB = useGLTF("/TOWNB.gltf");
  const townBRef = useRef();
  const vehicle = new YUKA.Vehicle();
  const waypointsARef = useRef();
  const waypointsBRef = useRef();
  car.matrixAutoUpdate = false;
  car.scene.scale.set(0.1, 0.1, 0.1);
  vehicle.maxSpeed = 1;
  vehicle.mass = 0.1;
  path.loop = false;

  let waypoints = waypointsA;
  let meshIslands = meshIslandsA;

  let followPathBehavior = new YUKA.FollowPathBehavior(path, 0.1);
  vehicle.steering.add(followPathBehavior);

  const entityManager = new YUKA.EntityManager();
  entityManager.add(vehicle);

  let activeTown = townA;
  activeTownLetter = "A";
  const time = new YUKA.Time();
  // State to track the current town scene
  const [currentTown, setCurrentTown] = useState(townA.scene);
  // Reset/make a new path
  function resetPath(startLetter, endLetter) {
    // Stopping me if I mess up letters
    if (!waypoints[startLetter] || !waypoints[endLetter]) {
      console.log("StartLetters", startLetter);
      console.log("EndLetters", endLetter);
      console.error("Waypoints for the provided letters do not exist");
      return;
    }

    // Update the vehicle's initial position to the start waypoint
    const startPosition = waypoints[startLetter].coordinates;
    vehicle.position.set(startPosition.x, startPosition.y, startPosition.z);

    // Delay before recalculating and reactivating the path
    const delay = 0; // 1-second delay
    setTimeout(() => {
      // Clear the existing path
      followPathBehavior.active = false;
      followPathBehavior.path.clear();
      // console.log("Start letter", startLetter);
      // console.log("End letter", endLetter);
      // console.log("Waypoints before UP:", waypoints);
      // Calculate a new path
      updatePath(startLetter, endLetter, waypoints);

      // Reassign the path to the behavior and activate it
      followPathBehavior.path = path;
      followPathBehavior.active = true;
    }, delay);
  }

  // Pause the pathing
  function pausePath() {
    followPathBehavior.active = false;
  }

  // Resume the pathing
  function resumePath() {
    followPathBehavior.active = true;
  }

  // Confetti central explosion
  function confettiExplosion() {
    const count = 200,
      defaults = {
        origin: { x: 0.55 },
      };

    function fire(particleRatio, opts) {
      confetti(
        Object.assign({}, defaults, opts, {
          particleCount: Math.floor(count * particleRatio),
        })
      );
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }

  // Trigger the cars movement after setting it's start and end locations
  const startCarMovement = () => {
    // Retrieve start and end letters from localStorage
    const startLetter = localStorage.getItem("input1");
    const endLetter = localStorage.getItem("input2");
    safetyThreshold = localStorage.getItem("safetyThreshold");
    console.log("safetyThreshold", safetyThreshold);
    // console.log("start car Waypoints", waypoints);
    // Check if both start and end letters are defined
    if (!startLetter || !endLetter) {
      // console.error("Start or end letter not defined");
      return;
    }
    // Call the resetPath function immediately
    resetPath(startLetter, endLetter);

    // Set a delay for the confettiExplosion
    const delay = 500;
    setTimeout(() => {
      confettiExplosion();
    }, delay);
  };

  // Effect to trigger movement on button click
  useEffect(() => {
    window.startCarMovement = startCarMovement;

    return () => {
      delete window.startCarMovement; // Clean up
    };
  }, [carRef, waypoints]);

  // Clear the island weights

  // Randomise the node values
  function randomiseNodeValues() {
    // Basic version where I just randomise the weights for the islands
    //randomiseWeights();
    //randomizeRoadSegmentProperties(roadSegments);
    // Lets make a more advanced version to randomise the node values

    randomiseIndividualNodeValues();
    let updatedSortedMeshIslands = calculateAndUpdateMeshIslandWeights(
      meshIslands,
      waypoints
    );
    // You arent usingthe values that you think you are, sortMeshIslands doesn't seem to change
    console.log("meshIslands", meshIslands);
    console.log("waypoints", waypoints);
    updateMeshIslandColors("R", updatedSortedMeshIslands);
    console.log("Randomised node values");
  }

  useEffect(() => {
    const randomiseButton = document.querySelector(".randomise-values-button");
    if (randomiseButton) {
      randomiseButton.addEventListener("click", randomiseNodeValues);
    }

    return () => {
      if (randomiseButton) {
        randomiseButton.removeEventListener("click", randomiseNodeValues);
      }
    };
  }, []); // Depend on any state or props if necessary

  // Paint the town
  function updateMeshIslandColors(colourMode, sortedMeshIslands) {
    const meshNamePattern = /^[A-Za-z]\d+$/; // Pattern to match a letter followed by a number

    // Definitions for Town A
    const blueMeshIslandsA = ["D1", "D4", "C3", "C4", "C7", "B2", "B5", "B6"];
    const redMeshIslandsA = ["D2", "D3", "C5", "C6", "B3", "B4", "A3", "A4"];

    // Definitions for Town B
    const blueMeshIslandsB = [
      "E2",
      "E3",
      "E4",
      "E5",
      "C5",
      "C6",
      "D6",
      "D5",
      "B5",
      "A4",
      "A2",
      "B2",
    ];
    const redMeshIslandsB = [
      "C2",
      "C3",
      "C4",
      "D1",
      "D3",
      "D2",
      "D4",
      "B3",
      "B4",
    ];

    // Select the appropriate lists based on colourMode
    const blueMeshIslands =
      colourMode === "A" ? blueMeshIslandsA : blueMeshIslandsB;
    const redMeshIslands =
      colourMode === "A" ? redMeshIslandsA : redMeshIslandsB;

    // console.log("Stored mesh islands", sortedMeshIslands);

    if ((colourMode === "A" || colourMode === "B") && sortedMeshIslands) {
      activeTown.scene.traverse((child) => {
        if (
          child.isMesh &&
          child.material &&
          meshNamePattern.test(child.name)
        ) {
          child.material = child.material.clone();
          let color;

          if (redMeshIslands.includes(child.name)) {
            color = "red";
            // console.log(
            //   `Coloring ${child.name} red because it is in the red mesh islands list.`
            // );
          } else if (blueMeshIslands.includes(child.name)) {
            color = "blue";
            // console.log(
            //   `Coloring ${child.name} blue because it is in the blue mesh islands list.`
            // );
          } else {
            color = "green";
            // console.log(`Coloring ${child.name} green as a default color.`);
          }

          child.material.color = new THREE.Color(color);
        }
      });
    } else if (colourMode === "R" && sortedMeshIslands) {
      console.log("Randomised mesh islands", sortedMeshIslands);
      const reversedSortedMeshIslands = [...sortedMeshIslands].reverse();
      const totalIslands = reversedSortedMeshIslands.length;
      const thirdSize = Math.floor(totalIslands / 3);

      reversedSortedMeshIslands.forEach((island, position) => {
        let color;
        if (position < thirdSize) {
          color = "red";
          // console.log(
          //   `Coloring ${island.key} red because its position ${position} is in the lower third.`
          // );
        } else if (position < thirdSize * 2) {
          color = "blue";
          // console.log(
          //   `Coloring ${island.key} blue because its position ${position} is in the middle third.`
          // );
        } else {
          color = "green";
          // console.log(
          //   `Coloring ${island.key} green because its position ${position} is in the upper third.`
          // );
        }

        const mesh = activeTown.scene.getObjectByName(island.key);
        if (
          mesh &&
          mesh.isMesh &&
          mesh.material &&
          meshNamePattern.test(mesh.name)
        ) {
          mesh.material = mesh.material.clone();
          mesh.material.color = new THREE.Color(color);
        }
      });
    }
  }

  // Function to set the scene to town A
  function townADefaults() {
    waypoints = waypointsA;
    updateWaypoints(waypoints);
    meshIslands = meshIslandsA;
    activeTownLetter = "A";
    console.log("active town now A");
    // console.log("Stage 1: townADefaults ran - wp:", waypoints);
    pausePath();
    townADefaultNodes();

    const updatedSortedMeshIslands = calculateAndUpdateMeshIslandWeights(
      meshIslands,
      waypoints
    );

    // Set townA visible and townB invisible
    townA.scene.visible = true;
    townB.scene.visible = false;
    activeTown = townA; //Setting this to mess with it in randomise
    if (waypointsARef.current) {
      waypointsARef.current.visible = true; // Show Town A waypoints
    }
    if (waypointsBRef.current) {
      waypointsBRef.current.visible = false; // Hide Town B waypoints
    }
    resumePath();
    // Call the new function to update colors
    updateMeshIslandColors("A", updatedSortedMeshIslands);
  }

  // Function to set the scene to town B
  function townBDefaults() {
    waypoints = waypointsB;
    updateWaypoints(waypoints);
    meshIslands = meshIslandsB;
    activeTownLetter = "B";
    console.log("active town now B");
    // console.log("Stage 1: townBDefaults ran - wp:", waypoints);
    pausePath();
    townBDefaultNodes(); //This is still using town A nodes

    const updatedSortedMeshIslands = calculateAndUpdateMeshIslandWeights(
      meshIslands,
      waypoints
    );

    // Set townB visible and townA invisible
    townB.scene.visible = true;
    townA.scene.visible = false;
    activeTown = townB; //Setting this to mess with it in randomise
    if (waypointsBRef.current) {
      waypointsBRef.current.visible = true; // Show Town B waypoints
    }
    if (waypointsARef.current) {
      waypointsARef.current.visible = false; // Hide Town A waypoints
    }
    resumePath();
    // console.log("I've tried to change the town");
    // Call the new function to update colors
    updateMeshIslandColors("B", updatedSortedMeshIslands); // Assuming this should be "B" for town B
  }

  // Effect to trigger town a default value setup
  useEffect(() => {
    window.townADefaults = townADefaults;
    // console.log("townADefaults clicked");
    return () => {
      delete window.townADefaults; // Clean up
    };
  }, []);
  // Same as above but for B
  useEffect(() => {
    window.townBDefaults = townBDefaults;
    // console.log("townBDefaults clicked");
    return () => {
      delete window.townBDefaults;
    };
  }, []);

  // Paint the town
  useEffect(() => {
    if (townA && sortedMeshIslands) {
      const totalIslands = sortedMeshIslands.length;
      const third = Math.ceil(totalIslands / 3);

      townA.scene.traverse((child) => {
        if (child.isMesh && child.material) {
          // Find the index of the mesh in the sorted list
          const position = sortedMeshIslands.findIndex(
            (island) => island.key === child.name
          );

          // Only color the mesh if it is found in the sorted list
          if (position !== -1) {
            //console.log(`Mesh Name: ${child.name}`);

            // Clone the material for this mesh
            child.material = child.material.clone();

            // Determine the color based on the position
            let color;
            if (position < third) {
              color = "red";
            } else if (position < third * 2) {
              color = "blue";
            } else {
              color = "green";
            }

            child.material.color = new THREE.Color(color);
          }
        }
      });
    }
  }, [townA, sortedMeshIslands]);

  // Camera and car positioning
  useFrame(() => {
    const delta = time.update().getDelta();
    entityManager.update(delta);

    if (carRef.current) {
      carRef.current.position.copy(vehicle.position);

      // Calculate the angle for the direction vector
      const direction = new YUKA.Vector3().copy(vehicle.velocity).normalize();
      const angle = Math.atan2(direction.x, direction.z);

      // Update the y rotation of the carMesh
      carRef.current.rotation.y = angle;

      // Define the offset as if the camera is behind and slightly above the car
      const offset = new THREE.Vector3(0, 1, -4); // Adjust as needed

      // Rotate the offset to align with the car's current rotation
      const rotatedOffset = offset.applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        angle
      );

      // Calculate the camera position based on the car's position and the rotated offset
      const cameraPosition = carRef.current.position.clone().add(rotatedOffset);

      // Smoothly interpolate the camera's position
      camera.position.lerp(cameraPosition, 0.05); // Adjust the lerp factor as needed for smoothness

      // Make the camera look at the car
      camera.lookAt(carRef.current.position);
    }
  });
  townADefaults();
  return (
    <>
      <color args={["#ffffff"]} attach="background" />
      <Environment preset="city" />
      <PresentationControls
        global
        rotation={[0.13, 0.1, 0]}
        polar={[-0.4, 0.2]}
        azimuth={[-1, 0.75]}
        config={{ mass: 2, tension: 200 }}
        snap={{ mass: 4, tension: 50 }}
      >
        <Float rotationIntensity={0.4}>
          <rectAreaLight
            width={2.5}
            height={1.65}
            intensity={65}
            color={"#ff6900"}
            rotation={[-0.1, Math.PI, 0]}
            position={[0, 0.55, -1.15]}
          />

          {/* Town A */}
          <primitive object={townA.scene} ref={townARef} />

          {/* Town B */}
          <primitive
            object={townB.scene}
            ref={townBRef}
            rotation={[0, Math.PI, 0]}
          />

          {/* Car and other shared elements */}
          <primitive object={car.scene} ref={carRef} />
          <OrbitControls ref={controls} />

          <Text
            font="./bangers-v20-latin-regular.woff"
            fontSize={1}
            position={[2, 1.2, 0.75]}
            rotation-y={-1.25}
            maxWidth={2}
          >
            PATH FINDER
          </Text>

          {/* Waypoints for Town A */}
          <group ref={waypointsARef}>
            {Object.keys(waypointsA).map((key) => (
              <Text
                key={key}
                font="./bangers-v20-latin-regular.woff"
                fontSize={0.5}
                position={[
                  waypointsA[key].coordinates.x,
                  waypointsA[key].coordinates.y + 0.4,
                  waypointsA[key].coordinates.z,
                ]}
                rotation-y={0}
                color="red"
              >
                {key}
              </Text>
            ))}
          </group>

          {/* Waypoints for Town B */}
          <group ref={waypointsBRef} visible={false}>
            {Object.keys(waypointsB).map((key) => (
              <Text
                key={key}
                font="./bangers-v20-latin-regular.woff"
                fontSize={0.5}
                position={[
                  waypointsB[key].coordinates.x,
                  waypointsB[key].coordinates.y + 0.4,
                  waypointsB[key].coordinates.z,
                ]}
                rotation-y={0}
                color="red"
              >
                {key}
              </Text>
            ))}
          </group>
        </Float>
      </PresentationControls>

      <ContactShadows position-y={-1.4} opacity={0.4} scale={5} blur={2.4} />
    </>
  );
}
