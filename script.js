// script.js

// Mock exchange rates (as of a sample date) const exchangeRates = { NGN: { USD: 0.0011, EUR: 0.001, AUD: 0.0016, INR: 0.091 }, USD: { NGN: 910, EUR: 0.89, AUD: 1.45, INR: 83 }, EUR: { NGN: 1000, USD: 1.12, AUD: 1.62, INR: 93 }, AUD: { NGN: 650, USD: 0.69, EUR: 0.62, INR: 57 }, INR: { NGN: 11, USD: 0.012, EUR: 0.011, AUD: 0.018 } };

function convertCurrency() { const amount = parseFloat(document.getElementById("amount").value); const from = document.getElementById("from").value; const to = document.getElementById("to").value; const resultDiv = document.getElementById("result");

if (isNaN(amount) || amount <= 0) { resultDiv.innerText = "Please enter a valid amount."; resultDiv.style.color = "red"; return; }

if (from === to) { resultDiv.innerText = Same currency selected. Result: ${amount.toFixed(2)} ${to}; resultDiv.style.color = "black"; return; }

const rate = exchangeRates[from][to]; const convertedAmount = amount * rate;

resultDiv.innerText = ${amount} ${from} = ${convertedAmount.toFixed(2)} ${to}; resultDiv.style.color = "green"; }
