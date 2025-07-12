// script.js

// Function to convert currency using ExchangeRate-API (real-time)
async function convertCurrency() {
  const amount = parseFloat(document.getElementById("amount").value);
  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;
  const resultDiv = document.getElementById("result");

  if (isNaN(amount) || amount <= 0) {
    resultDiv.innerText = "Please enter a valid amount.";
    resultDiv.style.color = "red";
    return;
  }

  if (from === to) {
    resultDiv.innerText = `Same currency selected. Result: ${amount.toFixed(2)} ${to}`;
    resultDiv.style.color = "black";
    return;
  }

  try {
    const apiKey = "0dd5b69b9a0eeec0328d4c64";
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}/${amount}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.result === "success") {
      resultDiv.innerText = `${amount} ${from} = ${data.conversion_result.toFixed(2)} ${to}`;
      resultDiv.style.color = "green";
    } else {
      resultDiv.innerText = "Failed to fetch exchange rate.";
      resultDiv.style.color = "red";
    }
  } catch (error) {
    resultDiv.innerText = "Error fetching data.";
    resultDiv.style.color = "red";
    console.error("Conversion Error:", error);
  }
}
