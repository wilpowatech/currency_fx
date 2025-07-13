// ticker.js – working Unicode arrows version

const previousRates = {};

async function loadCurrencyTicker() {
  const pairs = [
    ["USD", "NGN"],
    ["EUR", "NGN"],
    ["USD", "EUR"],
    ["USD", "AUD"],
    ["USD", "INR"]
  ];

  const results = await Promise.all(
    pairs.map(async ([from, to]) => {
      try {
        const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
        const data = await res.json();
        const rate = data?.rates?.[to];

        if (!rate) return `${from}/${to}: N/A`;

        let trendArrow = "";
        const key = `${from}_${to}`;
        if (previousRates[key] !== undefined) {
          if (rate > previousRates[key]) trendArrow = " ▲"; // Unicode up
          else if (rate < previousRates[key]) trendArrow = " ▼"; // Unicode down
        }

        previousRates[key] = rate;
        return `${from}/${to}: ${rate.toFixed(2)}${trendArrow}`;
      } catch (err) {
        console.error(`Error loading ${from}/${to}:`, err);
        return `${from}/${to}: N/A`;
      }
    })
  );

  const ticker = document.getElementById("currencyTicker");
  if (ticker) ticker.innerHTML = results.join(" | ");
}

window.addEventListener("DOMContentLoaded", loadCurrencyTicker);
setInterval(loadCurrencyTicker, 30000);
