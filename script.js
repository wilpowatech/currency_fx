// script.js (updated to auto-convert on swap and highlight result)

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
    resultDiv.innerText = `Same currency selected. Result: ${amount.toFixed(2)} ${to}`;
    resultDiv.style.color = "black";
    resultDiv.style.backgroundColor = "transparent";
    return;
  }

  try {
    const apiKey = "0dd5b69b9a0eeec0328d4c64";
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}/${amount}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.result === "success") {
      resultDiv.innerText = `${amount} ${from} = ${data.conversion_result.toFixed(2)} ${to}`;
      resultDiv.style.color = "#ffffff";
      resultDiv.style.backgroundColor = "#28a745";
      resultDiv.style.padding = "0.75rem";
      resultDiv.style.borderRadius = "6px";
      resultDiv.style.boxShadow = "0 0 10px rgba(0, 255, 0, 0.8)";
    } else {
      resultDiv.innerText = "Failed to fetch exchange rate.";
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

function swapCurrencies() {
  const from = document.getElementById("from");
  const to = document.getElementById("to");
  const temp = from.value;
  from.value = to.value;
  to.value = temp;
  convertCurrency();
}

// Highlight active nav link
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
});
