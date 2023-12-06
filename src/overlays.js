const safetyVariables = {
  "Road Condition":
    "Considers the current state of the road surface, affecting vehicle handling.",
  "Traffic Density":
    "Assesses the volume of traffic, which can impact driving strategy.",
  Visibility:
    "Takes into account how well drivers can see, which is crucial for safety.",
  "Accident History":
    "Reflects the historical data of accidents in the area to predict future risks.",
  // Add the rest of your variables and justifications here...
};

const accordion = document.getElementById("safetyVariablesAccordion");

Object.entries(safetyVariables).forEach(([variable, justification]) => {
  const item = document.createElement("div");
  item.classList.add("accordion-item");

  const title = document.createElement("button");
  title.classList.add("accordion-title");
  title.textContent = variable;
  title.onclick = () => content.classList.toggle("active");

  const content = document.createElement("div");
  content.classList.add("accordion-content");
  content.textContent = justification;

  item.appendChild(title);
  item.appendChild(content);
  accordion.appendChild(item);
});
