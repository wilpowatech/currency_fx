// ticker.js – uses open.er-api.com to load live ticker

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
        return rate
          ? `${from}/${to}: ${rate.toFixed(2)}`
          : `${from}/${to}: N/A`;
      } catch (err) {
        console.error(`Failed for ${from}/${to}`, err);
        return `${from}/${to}: N/A`;
      }
    })
  );

  const ticker = document.getElementById("currencyTicker");
  if (ticker) ticker.innerText = results.join(" | ");
}

// Load ticker on page load and refresh every 30s
window.addEventListener("DOMContentLoaded", loadCurrencyTicker);
setInterval(loadCurrencyTicker, 30000);
