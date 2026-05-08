// Selectors
const start = document.getElementById("start-date");
const end = document.getElementById("end-date");
const citySelect = document.getElementById("destination-select");
const budgetDisplay = document.getElementById("total-budget");
const destinationList = document.getElementById("destination-list");
const activityList = document.getElementById("activity-list");
const dateDisplay = document.getElementById("display-dates");

let selectedCities = [];

const today = new Date().toISOString().split("T")[0];
[start, end].forEach((el) => el.setAttribute("min", today));


const validateDates = () => {
  if (start.value) {
    end.setAttribute("min", start.value);
  }
  if (end.value && new Date(end.value) < new Date(start.value)) {
    end.value = "";
  }
  updateUI();
};


const addCity = () => {
  const selectedOption = citySelect.options[citySelect.selectedIndex];

  if (!selectedOption.value) return;

  // Duplicate check
  if (selectedCities.some((c) => c.name === selectedOption.value)) {
    return alert("This city is already in your itinerary!");
  }

  selectedCities.push({
    name: selectedOption.value,
    price: Number(selectedOption.dataset.price),
  });

  updateUI();
};


window.removeCity = (index) => {
  selectedCities.splice(index, 1);
  updateUI();
};

function updateUI() {
  let total = 0;

  destinationList.innerHTML = selectedCities
    .map((city, index) => {
      total += city.price;
      return `
                <li>
                    ${city.name} ($${city.price}) 
                    <span class="del" onclick="removeCity(${index})">✕</span>
                </li>`;
    })
    .join("");


  const checkedActivities = document.querySelectorAll(".activity:checked");
  activityList.innerHTML = Array.from(checkedActivities)
    .map((activity) => {
      const price = Number(activity.dataset.price);
      total += price;
      return `<li>${activity.value} ($${price})</li>`;
    })
    .join("");

  budgetDisplay.innerText = `$${total.toLocaleString()}`;
  dateDisplay.innerText =
    start.value && end.value
      ? `${start.value} to ${end.value}`
      : "Not selected";
}


document.getElementById("add-destination").onclick = addCity;

start.addEventListener("change", validateDates);
end.addEventListener("change", validateDates);


document.addEventListener("change", (e) => {
  if (e.target.classList.contains("activity")) {
    updateUI();
  }
});


document.querySelector(".btn-confirm").onclick = () => {
  if (!start.value || !end.value || selectedCities.length === 0) {
    return alert("Please select dates and at least one destination!");
  }
  alert(`✈️ Trip Confirmed! Total Cost: ${budgetDisplay.innerText}`);
};
