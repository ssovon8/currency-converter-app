let inputBox = document.querySelector("#inputBox");
let from = document.querySelector(".from select");
let to = document.querySelector(".to select");
let dropdowns = document.querySelectorAll(".dropdown select");
let btn = document.querySelector("#btn");
let showCurr = document.querySelector("#showCurr");

const apiKey = "YOUR_API_KEY_HERE";

// Populate Dropdowns with Currencies
for (let select of dropdowns) {
  for (let currCode in countryList) {
    // Create new element
    let newOption = document.createElement("option");
    newOption.textContent = currCode;
    newOption.value = currCode;

    // Set default selected values
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }
    select.appendChild(newOption);
  }

  //  Change flag with currency changes
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

//  Update flag function
function updateFlag(element) {
  let currCode = element.value;
  let countryCode = countryList[currCode];

  if (!countryCode) return;

  //   Generate flag image URL
  let newImg = `https://flagsapi.com/${countryCode}/flat/24.png`;

  //   Get image inside dropdown container
  let img = element.parentElement.querySelector("img");
  img.src = newImg;
}

// Currency converter funcction
async function currExchange() {
  try {
    let amount = Number(inputBox.value);

    // Validate input
    if (!amount || amount <= 0) {
      amount = 1;
      inputBox.value = "1";
    }
    let fromCurr = from.value;
    let toCurr = to.value;

    //   API url
    const Url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurr}`;

    const response = await fetch(Url);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    if (data.result !== "success") {
      throw new Error("API Error");
    }
    const rate = data.conversion_rates[toCurr];

    if (!rate) {
      throw new Error("Currency not found");
    }

    // Final converted amount
    const finalAmount = amount * rate;

    // Display result
    showCurr.innerText = `${amount} ${fromCurr} = ${finalAmount.toFixed(2)} ${toCurr}`;
  } catch (error) {
    showCurr.innerText = "Something went wrong. Try again.";
  }
}

// Swap functionality
let swap = document.querySelector("#swapIcon");

swap.addEventListener("click", () => {
  // Swap currency values
  [from.value, to.value] = [to.value, from.value];

  // Update flags after swapping
  updateFlag(from);
  updateFlag(to);

  // Auto convert after swap
  currExchange();
});

// Event Listener
// mouse click to convert
btn.addEventListener("click", currExchange);

// Press enter to convert
inputBox.addEventListener("keydown", (evt) => {
  if (evt.key === "Enter") {
    currExchange();
  }
});

// Auto convert when page load
window.addEventListener("load", currExchange);
