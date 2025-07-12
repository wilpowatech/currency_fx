// ticker.js (using exchangerate-api.com with static rates, no arrows)

async function loadCurrencyTicker() {
  const apiKey = "0dd5b69b9a0eeec0328d4c64";
  const pairs = ["USD/NGN", "EUR/NGN", "USD/EUR", "USD/AUD", "USD/INR"];
  const baseURL = `https://v6.exchangerate-api.com/v6/${apiKey}/pair`;

  const results = await Promise.all(
    pairs.map(async pair => {
      const [from, to] = pair.split("/");
      try {
        const response = await fetch(`${baseURL}/${from}/${to}`);
        const data = await response.json();

        if (data.result === "success") {
          return `${from}/${to}: ${data.conversion_rate.toFixed(2)}`;
        } else {
          return `${from}/${to}: N/A`;
        }
      } catch (error) {
        console.error(`${from}/${to} error:`, error);
        return `${from}/${to}: N/A`;
      }
    })
  );

  document.getElementById("currencyTicker").innerHTML = results.join(" | ");
}

document.addEventListener("DOMContentLoaded", loadCurrencyTicker);
