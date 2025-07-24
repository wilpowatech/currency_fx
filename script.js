// script.js

async function convertCurrency() {
  console.log("convertCurrency() triggered");

  // Get user input values
  const amount = parseFloat(document.getElementById("amount").value);
  const from = document.getElementById("from").value.toUpperCase();
  const to = document.getElementById("to").value.toUpperCase();

  console.log(`Amount: ${amount} From: ${from} To: ${to}`);

  if (isNaN(amount) || !from || !to) {
    alert("Please enter valid input values.");
    return;
  }

  try {
    // Fetch latest exchange rates from open.er-api
    const apiUrl = `https://open.er-api.com/v6/latest/${from}`;
    console.log(`Fetching: ${apiUrl}`);

    const response = await fetch(apiUrl);
    const data = await response.json();

    console.log("API Response:", data);

    if (data.result !== "success") {
      throw new Error("Failed to get exchange rates");
    }

    const rate = data.rates[to];
    if (!rate) {
      throw new Error(`Currency not supported: ${to}`);
    }

    const converted = amount * rate;
    const resultBox = document.getElementById("result");
    resultBox.textContent = `${amount} ${from} = ${converted.toFixed(2)} ${to}`;

    // Make result glow green
    resultBox.style.color = "#00ff00"; // bright green text
    resultBox.style.fontWeight = "bold";
    resultBox.style.textShadow = "0 0 10px #00ff00"; // glowing effect
  } catch (error) {
    console.error("Conversion Error:", error);
    alert(`Conversion Error: ${error.message}`);
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const icon = document.getElementById("theme-icon");
  if (document.body.classList.contains("dark-mode")) {
    icon.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  } else {
    icon.textContent = "🌙";
    localStorage.setItem("theme", "light");
  }
}

// Auto-load theme on page load
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    const icon = document.getElementById("theme-icon");
    if (icon) icon.textContent = "☀️";
  }
});
function swapCurrencies() {
  const fromSelect = document.getElementById("from");
  const toSelect = document.getElementById("to");
  const resultDiv = document.getElementById("result"); // Make sure this exists in your HTML

  // Swap values
  const temp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = temp;

  // Trigger conversion again (optional)
  convertCurrency();
}
