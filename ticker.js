// ticker.js – clean, with arrow indicators and memory of previous values

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

        const key = `${from}_${to}`;
        let trend = "";

        if (previousRates[key] !== undefined) {
          if (rate > previousRates[key]) {
            trend = ` <span class="arrow up">▲</span>`;
          } else if (rate < previousRates[key]) {
            trend = ` <span class="arrow down">▼</span>`;
          }
        }

        previousRates[key] = rate;

        return `<span class="pair">${from}/${to}: ${rate.toFixed(2)}${trend}</span>`;
      } catch (err) {
        console.error(`Error fetching ${from}/${to}:`, err);
        return `<span class="pair">${from}/${to}: N/A</span>`;
      }
    })
  );

  const ticker = document.getElementById("currencyTicker");
  if (ticker) ticker.innerHTML = results.join(" | ");
}

// Initial load and update every 30 seconds
window.addEventListener("DOMContentLoaded", loadCurrencyTicker);
setInterval(loadCurrencyTicker, 30000);
