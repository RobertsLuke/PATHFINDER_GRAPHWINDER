import * as YUKA from "yuka";
import { findPath } from "./algorithm.js";

export let path = new YUKA.Path();
export let waypoints = {};

// Start point
waypoints["A"] = {
  coordinates: new YUKA.Vector3(-0.0908522829413414, 0, 3.062549591064453),
  weight: getRandomWeight(),
  neighbours: ["D"],
};
//Adding the coordinates to the path

// Row 1
waypoints["B"] = {
  coordinates: new YUKA.Vector3(-4.258955001831055, 0, 2.4583702087402344),
  weight: getRandomWeight(),
  neighbours: ["M", "C"],
};
waypoints["C"] = {
  coordinates: new YUKA.Vector3(-3.6725292205810547, 0, 2.4583702087402344),
  weight: getRandomWeight(),
  neighbours: ["B", "D", "L"],
};
waypoints["D"] = {
  coordinates: new YUKA.Vector3(-0.18015336990356445, 0, 2.4583702087402344),
  weight: getRandomWeight(),
  neighbours: ["A", "C", "J", "K", "L", "E"],
};
waypoints["E"] = {
  coordinates: new YUKA.Vector3(2.6552371978759766, 0, 2.4583702087402344),
  weight: getRandomWeight(),
  neighbours: ["F", "D", "H"],
};
waypoints["F"] = {
  coordinates: new YUKA.Vector3(3.478020191192627, 0, 2.4583702087402344),
  weight: getRandomWeight(),
  neighbours: ["E", "G"],
};

// Row 2
waypoints["G"] = {
  coordinates: new YUKA.Vector3(3.478020191192627, 0, 1.19381844997406),
  weight: getRandomWeight(),
  neighbours: ["F", "H", "T"],
};
waypoints["H"] = {
  coordinates: new YUKA.Vector3(2.0038840770721436, 0, 1.19381844997406),
  weight: getRandomWeight(),
  neighbours: ["E", "G", "R", "S"],
};
waypoints["I"] = {
  coordinates: new YUKA.Vector3(0.6296098232269287, 0, 1.19381844997406),
  weight: getRandomWeight(),
  neighbours: ["D", "H", "J", "R"],
};
waypoints["J"] = {
  coordinates: new YUKA.Vector3(-0.11812174320220947, 0, 1.19381844997406),
  weight: getRandomWeight(),
  neighbours: ["D", "I", "K", "Q"],
};
waypoints["K"] = {
  coordinates: new YUKA.Vector3(-0.7302283644676208, 0, 1.19381844997406),
  weight: getRandomWeight(),
  neighbours: ["D", "J", "L", "P"],
};
waypoints["L"] = {
  coordinates: new YUKA.Vector3(-3.1584267616271973, 0, 1.19381844997406),
  weight: getRandomWeight(),
  neighbours: ["C", "M", "O", "K"],
};
waypoints["M"] = {
  coordinates: new YUKA.Vector3(-4.201684951782227, 0, 1.19381844997406),
  weight: getRandomWeight(),
  neighbours: ["N", "L"],
};

// Row 3
waypoints["N"] = {
  coordinates: new YUKA.Vector3(-4.201684951782227, 0, -0.10426831245422363),
  weight: getRandomWeight(),
  neighbours: ["O", "V", "M"],
};
waypoints["O"] = {
  coordinates: new YUKA.Vector3(-2.720555305480957, 0, -0.10426831245422363),
  weight: getRandomWeight(),
  neighbours: ["N", "V", "L", "Y", "P"],
};
waypoints["P"] = {
  coordinates: new YUKA.Vector3(-1.3455042839050293, 0, -0.10426831245422363),
  weight: getRandomWeight(),
  neighbours: ["Y", "O", "K", "Q"],
};
waypoints["Q"] = {
  coordinates: new YUKA.Vector3(-0.114859938621521, 0, -0.10426831245422363),
  weight: getRandomWeight(),
  neighbours: ["P", "J", "R", "Z"],
};
waypoints["R"] = {
  coordinates: new YUKA.Vector3(1.240871787071228, 0, -0.10426831245422363),
  weight: getRandomWeight(),
  neighbours: ["Q", "I", "H", "S", "AA"],
};
waypoints["S"] = {
  coordinates: new YUKA.Vector3(2.5966243743896484, 0, -0.10426831245422363),
  weight: getRandomWeight(),
  neighbours: ["U", "R", "H", "T"],
};
waypoints["T"] = {
  coordinates: new YUKA.Vector3(3.485111951828003, 0, -0.10426831245422363),
  weight: getRandomWeight(),
  neighbours: ["U", "S", "G"],
};

// Row 4
waypoints["U"] = {
  coordinates: new YUKA.Vector3(2.8128910064697266, 0, -0.7648482322692871),
  weight: getRandomWeight(),
  neighbours: ["AB", "AC", "S", "T"],
};
waypoints["V"] = {
  coordinates: new YUKA.Vector3(-3.625488042831421, 0, -0.9578653573989868),
  weight: getRandomWeight(),
  neighbours: ["O", "N", "W", "X", "Y"],
};

// Row 5
waypoints["W"] = {
  coordinates: new YUKA.Vector3(-4.4565749168396, 0, -1.7634589672088623),
  weight: getRandomWeight(),
  neighbours: ["V", "X"],
};
waypoints["X"] = {
  coordinates: new YUKA.Vector3(-3.069730281829834, 0, -1.7634589672088623),
  weight: getRandomWeight(),
  neighbours: ["W", "V", "Y", "AF"],
};
waypoints["Y"] = {
  coordinates: new YUKA.Vector3(-2.1570639610290527, 0, -1.7634589672088623),
  weight: getRandomWeight(),
  neighbours: ["AF", "X", "O", "P", "Z"],
};
waypoints["Z"] = {
  coordinates: new YUKA.Vector3(-0.1685734987258911, 0, -1.7634589672088623),
  weight: getRandomWeight(),
  neighbours: ["Y", "Q", "AA", "AE"],
};
waypoints["AA"] = {
  coordinates: new YUKA.Vector3(0.4177762269973755, 0, -1.7634589672088623),
  weight: getRandomWeight(),
  neighbours: ["Z", "AE", "AB", "R"],
};
waypoints["AB"] = {
  coordinates: new YUKA.Vector3(1.9218908548355103, 0, -1.7634589672088623),
  weight: getRandomWeight(),
  neighbours: ["AA", "U", "AC", "AD"],
};
waypoints["AC"] = {
  coordinates: new YUKA.Vector3(3.2002806663513184, 0, -1.7634589672088623),
  weight: getRandomWeight(),
  neighbours: ["AD", "AB", "U"],
};
waypoints["AD"] = {
  coordinates: new YUKA.Vector3(1.711462140083313, 0, -2.316910982131958),
  weight: getRandomWeight(),
  neighbours: ["AE", "AB", "AC"],
};

// Row 6
waypoints["AE"] = {
  coordinates: new YUKA.Vector3(-0.06288325786590576, 0, -2.8165829181671143),
  weight: getRandomWeight(),
  neighbours: ["AG", "AD", "AA", "Z", "AF"],
};
waypoints["AF"] = {
  coordinates: new YUKA.Vector3(-2.647921085357666, 0, -2.8165829181671143),
  weight: getRandomWeight(),
  neighbours: ["X", "Y", "AE"],
};
waypoints["AG"] = {
  coordinates: new YUKA.Vector3(-0.18015336990356445, 0, -3.4386234283447266),
  weight: getRandomWeight(),
  neighbours: ["AE"],
};

// Randomise the weights of the waypoints
export function randomiseWeights() {
  for (let key in waypoints) {
    waypoints[key].weight = getRandomWeight();
  }
  console.log("waypoints rand vals", waypoints);
}

export let meshIslands = {
  A1: { nodes: ["B", "C", "M", "L"], meshIslandWeight: null },
  A2: { nodes: ["C", "L", "K", "D"], meshIslandWeight: null },
  A3: { nodes: ["D", "J", "K"], meshIslandWeight: null },
  A4: { nodes: ["J", "I", "D"], meshIslandWeight: null },
  A5: { nodes: ["D", "I", "H", "E"], meshIslandWeight: null },
  A6: { nodes: ["E", "F", "G", "H"], meshIslandWeight: null },

  B1: { nodes: ["N", "L", "M", "O"], meshIslandWeight: null },
  B2: { nodes: ["O", "L", "P", "K"], meshIslandWeight: null },
  B3: { nodes: ["P", "K", "Q", "J"], meshIslandWeight: null },
  B4: { nodes: ["Q", "R", "J", "I"], meshIslandWeight: null },
  B5: { nodes: ["R", "I", "H"], meshIslandWeight: null },
  B6: { nodes: ["R", "S", "H"], meshIslandWeight: null },
  B7: { nodes: ["S", "T", "H", "G"], meshIslandWeight: null },

  C1: { nodes: ["W", "X", "V"], meshIslandWeight: null },
  C2: { nodes: ["V", "O", "N"], meshIslandWeight: null },
  C3: { nodes: ["V", "X", "O", "Y"], meshIslandWeight: null },
  C4: { nodes: ["Y", "O", "P"], meshIslandWeight: null },
  C5: { nodes: ["Y", "Z", "P", "Q"], meshIslandWeight: null },
  C6: { nodes: ["Z", "Q", "R", "AA"], meshIslandWeight: null },
  C7: { nodes: ["AA", "AB", "R", "U", "S"], meshIslandWeight: null },
  C8: { nodes: ["AB", "AC", "U"], meshIslandWeight: null },
  C9: { nodes: ["U", "S", "T"], meshIslandWeight: null },

  D1: { nodes: ["AF", "X", "Y"], meshIslandWeight: null },
  D2: { nodes: ["AF", "AE", "Y", "Z"], meshIslandWeight: null },
  D3: { nodes: ["AE", "Z", "AA"], meshIslandWeight: null },
  D4: { nodes: ["AE", "AA", "AD", "AB"], meshIslandWeight: null },
  D5: { nodes: ["AD", "AB", "AC"], meshIslandWeight: null },
};

// List of waypoint IDs
export let waypointIds = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "AA",
  "AB",
  "AC",
  "AD",
  "AE",
  "AF",
  "AG",
];

// Set the weight of specific waypoints
export function setWeight(waypointId, weight) {
  if (waypoints[waypointId]) {
    waypoints[waypointId].weight = weight;
  } else {
    console.error(`Waypoint ${waypointId} does not exist`);
  }
}

// Generate a random number
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}
// Set my node values to the default framework
export function townADefaultNodes() {
  // First loop - Set all waypoints' weights to a random number between 1 and 2
  for (let key in waypoints) {
    waypoints[key].weight = getRandomNumber(1, 2);
  }

  // Arrays for the second and third loops, now named as mesh islands
  const secondLoopMeshIslands = [
    "D1",
    "D4",
    "C3",
    "C4",
    "C7",
    "B2",
    "B5",
    "B6",
  ];
  const thirdLoopMeshIslands = ["D2", "D3", "C5", "C6", "B3", "B4", "A3", "A4"];

  // Second loop - Update waypoints associated with specified mesh islands to a random number between 2 and 3
  secondLoopMeshIslands.forEach((meshIslandKey) => {
    if (meshIslands[meshIslandKey]) {
      meshIslands[meshIslandKey].nodes.forEach((nodeKey) => {
        if (waypoints[nodeKey]) {
          waypoints[nodeKey].weight = getRandomNumber(2, 3);
        }
      });
    }
  });

  // Third loop - Update waypoints associated with specified mesh islands to a random number between 3 and 4
  thirdLoopMeshIslands.forEach((meshIslandKey) => {
    if (meshIslands[meshIslandKey]) {
      meshIslands[meshIslandKey].nodes.forEach((nodeKey) => {
        if (waypoints[nodeKey]) {
          waypoints[nodeKey].weight = getRandomNumber(3, 4);
        }
      });
    }
  });
}

//FUNCTIONALITY
export function updatePath(startId, endId) {
  const newPathIds = findPath(startId, endId);

  // Reset the path
  path = new YUKA.Path();

  // Add new waypoints to the path
  newPathIds.forEach((waypointId) => {
    if (waypoints[waypointId]) {
      path.add(waypoints[waypointId].coordinates);
    } else {
      console.error(`Waypoint ${waypointId} does not exist`);
    }
  });
}
// TEMPORARY
path.add(waypoints["A"].coordinates);
path.add(waypoints["D"].coordinates);
path.add(waypoints["E"].coordinates);
path.add(waypoints["F"].coordinates);
path.add(waypoints["T"].coordinates);

// Function to generate random weights
function getRandomWeight() {
  return Math.random() * 9 + 1; // Random weight between 1 and 10
}

export function calculateAndUpdateMeshIslandWeights(meshIslands, waypoints) {
  // Calculate weights
  console.log("Waypoints in calculateAndUpdateMeshIslandWeights", waypoints);
  console.log(
    "Mesh islands in calculateAndUpdateMeshIslandWeights",
    meshIslands
  );
  for (let island in meshIslands) {
    let totalWeight = 0;
    let nodeCount = meshIslands[island].nodes.length;

    meshIslands[island].nodes.forEach((node) => {
      if (waypoints[node] && waypoints[node].weight) {
        totalWeight += waypoints[node].weight;
        console.log("mesh island", island, "total weight:", totalWeight);
      } else {
        console.error(`Weight not found for node: ${node}`);
        nodeCount--; // Adjust node count if weight is missing
      }
    });

    if (nodeCount > 0) {
      let meanWeight = totalWeight / nodeCount;
      meshIslands[island].meshIslandWeight = meanWeight;
      // console.log(`Mesh island ${island} has mean weight: ${meanWeight}`);
    } else {
      console.error(`No valid nodes with weights for island: ${island}`);
      meshIslands[island].meshIslandWeight = null;
    }
    // console.log("mesh island ", meshIslands);
  }

  // Convert to array and sort
  let sortedIslands = Object.keys(meshIslands)
    .map((key) => ({ key, ...meshIslands[key] }))
    .sort((a, b) => a.meshIslandWeight - b.meshIslandWeight);
  console.log("random sorted islands", sortedIslands);
  return sortedIslands; // Return the sorted array directly
}

// Example usage:
export let sortedMeshIslands = calculateAndUpdateMeshIslandWeights(
  meshIslands,
  waypoints
);
