// script.js – uses open.er-api.com for currency conversion (no API key)

// ==================== Currency Conversion ====================
async function convertCurrency() {
  const amount = parseFloat(document.getElementById("amount").value);
  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;
  const resultDiv = document.getElementById("result");

  if (isNaN(amount) || amount <= 0) {
    resultDiv.innerText = "Please enter a valid amount.";
    resultDiv.style.color = "red";
    resultDiv.style.backgroundColor = "transparent";
    return;
  }

  if (from === to) {
    resultDiv.innerText = `${amount.toFixed(2)} ${from} = ${amount.toFixed(2)} ${to}`;
    resultDiv.style.color = "black";
    resultDiv.style.backgroundColor = "transparent";
    return;
  }

  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${from}`);
    const data = await response.json();
    const rate = data?.rates?.[to];

    if (rate) {
      const result = amount * rate;
      resultDiv.innerText = `${amount} ${from} = ${result.toFixed(2)} ${to}`;
      resultDiv.style.color = "#ffffff";
      resultDiv.style.backgroundColor = "#28a745";
      resultDiv.style.padding = "0.75rem";
      resultDiv.style.borderRadius = "6px";
      resultDiv.style.boxShadow = "0 0 10px rgba(0, 255, 0, 0.8)";
    } else {
      resultDiv.innerText = "Conversion failed.";
      resultDiv.style.color = "red";
      resultDiv.style.backgroundColor = "transparent";
    }
  } catch (error) {
    resultDiv.innerText = "Error fetching data.";
    resultDiv.style.color = "red";
    resultDiv.style.backgroundColor = "transparent";
    console.error("Conversion Error:", error);
  }
}

// ==================== Swap Currency ====================
function swapCurrencies() {
  const from = document.getElementById("from");
  const to = document.getElementById("to");
  const temp = from.value;
  from.value = to.value;
  to.value = temp;
  convertCurrency(); // Optional: auto-convert on swap
}

// ==================== Highlight Active Nav Link ====================
window.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".topnav-right a");
  const currentPath = window.location.pathname.split("/").pop();

  navLinks.forEach(link => {
    const linkPath = link.getAttribute("href");
    if (linkPath === currentPath || (linkPath === "index.html" && currentPath === "")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // Load saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    const icon = document.getElementById("theme-icon");
    if (icon) icon.textContent = "🌞";
  }
});

// ==================== Dark Mode Toggle ====================
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const icon = document.getElementById("theme-icon");
  if (icon) {
    icon.textContent = document.body.classList.contains("dark-mode") ? "🌞" : "🌙";
  }
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}
