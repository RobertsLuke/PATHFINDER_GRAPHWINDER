import {
  waypoints,
  roadSegments,
  integrateSafetyScoresAndDistances,
} from "./dora.js";

function heuristic(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy) * 2;
}

// A* Algorithm Implementation with Safety Tolerance
function aStar(start, end, safetyTolerance = 1) {
  let pathData = [];
  let openSet = [start];
  let cameFrom = {};
  let gScore = {};
  let fScore = {};
  let distanceWithSafety = 0;
  let distanceWithoutSafety = 0;

  integrateSafetyScoresAndDistances();
  Object.keys(waypoints).forEach((wp) => {
    gScore[wp] = Infinity;
    fScore[wp] = Infinity;
  });
  gScore[start] = 0;
  fScore[start] = heuristic(
    waypoints[start].coordinates,
    waypoints[end].coordinates
  );

  while (openSet.length > 0) {
    let current = openSet.reduce((a, b) => (fScore[a] < fScore[b] ? a : b));

    if (current === end) {
      let path = [];
      let totalDistanceWithSafety = 0;
      let totalSafetyScore = 0;
      let prev = null;

      while (current) {
        path.unshift(current);
        if (prev) {
          let neighbourInfo = waypoints[prev].neighbours.find(
            (n) => n.id === current
          );
          if (neighbourInfo) {
            let normalizedDistance = neighbourInfo.distance * 10;
            let normalizedSafetyScore = neighbourInfo.safetyScore / 10;
            totalDistanceWithSafety += normalizedDistance;
            totalSafetyScore += normalizedSafetyScore;
          }
        }
        prev = current;
        current = cameFrom[current];
      }

      updatePathDataTable(pathData, path); // Call this function after the loop completes
      console.log("Path with safety:", path.join(" -> "));
      console.log("Total distance with safety:", totalDistanceWithSafety);
      console.log("Total safety score:", totalSafetyScore);
      console.log("Road segments:", roadSegments);
      // Simulate path ignoring safety scores
      let pathIgnoringSafety = simulatePathIgnoringSafety(start, end);
      // Calculate total distance for path ignoring safety
      let totalDistanceWithoutSafety =
        calculateTotalDistance(pathIgnoringSafety);

      // Update the overlay with path info
      document.getElementById("storedFinalPath").textContent =
        path.join(" -> ");
      document.getElementById("storedFinalPathDistance").textContent =
        totalDistanceWithSafety;
      document.getElementById("storedShortestPath").textContent =
        pathIgnoringSafety.join(" -> ");
      document.getElementById("storedShortestPathDistance").textContent =
        totalDistanceWithoutSafety;
      document.getElementById("roadSegments").textContent = roadSegments;
      //Logging what I just updated the path with

      // Call simulatePathIgnoringSafety to get path without considering safety
      simulatePathIgnoringSafety(start, end);
      if (safetyTolerance === 0) {
        totalDistanceWithSafety = totalDistanceWithoutSafety;
      }

      return path;
    }

    openSet = openSet.filter((wp) => wp !== current);
    waypoints[current].neighbours.forEach((neighbour) => {
      let neighbourData = waypoints[neighbour.id];
      let normalisedSafetyScore = neighbour.safetyScore / 10;
      let normalisedDistance = neighbour.distance * 10;
      let safetyComponent = normalisedSafetyScore * safetyTolerance;
      let tentativeGScoreWithSafety =
        gScore[current] + normalisedDistance + safetyComponent;

      if (tentativeGScoreWithSafety < gScore[neighbour.id]) {
        distanceWithSafety += normalisedDistance;
        cameFrom[neighbour.id] = current;
        gScore[neighbour.id] = tentativeGScoreWithSafety;
        fScore[neighbour.id] =
          tentativeGScoreWithSafety +
          heuristic(neighbourData.coordinates, waypoints[end].coordinates);

        // Update path data for each node
        pathData.push({
          Node: neighbour.id,
          "Cumulative Distance": gScore[neighbour.id],
          "F-Score": fScore[neighbour.id],
          "H-Score": heuristic(
            neighbourData.coordinates,
            waypoints[end].coordinates
          ),
        });

        if (!openSet.includes(neighbour.id)) {
          openSet.push(neighbour.id);
        }
      }
    });
  }

  return []; // Return an empty array if no path is found
}

// Calculate total distance for path ignoring safety
function calculateTotalDistance(path) {
  let totalDistance = 0;

  for (let i = 0; i < path.length - 1; i++) {
    let currentWaypoint = waypoints[path[i]];
    let nextWaypointId = path[i + 1];

    let neighbourInfo = currentWaypoint.neighbours.find(
      (n) => n.id === nextWaypointId
    );
    if (neighbourInfo) {
      totalDistance += neighbourInfo.distance;
    }
  }

  return totalDistance * 10; // Assuming you need to normalize the distance by multiplying by 10
}

// path without safety basically copy paste of astar
function simulatePathIgnoringSafety(start, end) {
  let openSet = [start];
  let cameFrom = {};
  let gScore = {};
  let fScore = {};

  Object.keys(waypoints).forEach((wp) => {
    gScore[wp] = Infinity;
    fScore[wp] = Infinity;
  });

  gScore[start] = 0;
  fScore[start] = heuristic(
    waypoints[start].coordinates,
    waypoints[end].coordinates
  );

  while (openSet.length > 0) {
    let current = openSet.reduce((a, b) => (fScore[a] < fScore[b] ? a : b));

    if (current === end) {
      let path = [];
      let totalDistance = 0;
      let prev = null;

      while (current) {
        path.unshift(current);
        if (prev) {
          let distance =
            waypoints[prev].neighbours.find((n) => n.id === current)
              ?.distance || 0;
          totalDistance += distance; // Accumulate the distance
        }
        prev = current;
        current = cameFrom[current];
      }

      console.log("Path ignoring safety:", path.join(" -> "));
      console.log("Total Distance (ignoring safety):", totalDistance * 10); // Log the total distance

      return path;
    }

    openSet = openSet.filter((wp) => wp !== current);
    waypoints[current].neighbours.forEach((neighbour) => {
      let neighbourData = waypoints[neighbour.id];
      let tentativeGScore = gScore[current] + neighbour.distance; // Ignoring safety scores

      if (tentativeGScore < gScore[neighbour.id]) {
        cameFrom[neighbour.id] = current;
        gScore[neighbour.id] = tentativeGScore;
        fScore[neighbour.id] =
          tentativeGScore +
          heuristic(neighbourData.coordinates, waypoints[end].coordinates);

        if (!openSet.includes(neighbour.id)) {
          openSet.push(neighbour.id);
        }
      }
    });
  }
  return []; // Return an empty array if no path is found
}

// Save path info to local storage
function savePathInfoToLocal(
  finalPath,
  finalPathDistance,
  shortestPath,
  shortestPathDistance
) {
  localStorage.setItem("finalPath", JSON.stringify(finalPath));
  localStorage.setItem("finalPathDistance", finalPathDistance);
  localStorage.setItem("shortestPath", JSON.stringify(shortestPath));
  localStorage.setItem("shortestPathDistance", shortestPathDistance);
}

// UI table
function updatePathDataTable(pathData, finalPath) {
  const tbody = document.querySelector("#pathfindingTable tbody");
  const tableContainer = document.querySelector(".pathfinding-table-container");
  const finalPathDisplay = document.querySelector("#finalPathDisplay");

  tbody.innerHTML = "";
  finalPathDisplay.textContent = "Final Path: " + finalPath.join(", ");

  pathData.forEach((data, index) => {
    setTimeout(() => {
      const isPathNode = finalPath.includes(data.Node);
      const rowClass = isPathNode ? "path-node" : "";

      const tableRow = `<tr class="${rowClass}">
                            <td>${data.Node}</td>
                            <td>${parseFloat(
                              data["Cumulative Distance"]
                            ).toFixed(2)}</td>
                            <td>${parseFloat(data["F-Score"]).toFixed(2)}</td>
                            <td>${parseFloat(data["H-Score"]).toFixed(2)}</td>
                        </tr>`;
      tbody.innerHTML += tableRow;
      tableContainer.scrollTop = tableContainer.scrollHeight;
    }, 500 * index); // 0.5 seconds delay per row
  });
}

export function findPath(startId, endId) {
  //by the time it gets here, the wp is set incorrectly - so maybe just either update it before this is called or force feed it
  //   console.log("wp: ", waypoints);
  let path = aStar(startId, endId);
  //console.log(path);
  return path;
}
