async function loadCurrencyTicker() {
  const apiKey = "0dd5b69b9a0eeec0328d4c64";
  const pairs = [
    { from: "USD", to: "NGN" },
    { from: "EUR", to: "NGN" },
    { from: "USD", to: "EUR" },
    { from: "USD", to: "AUD" },
    { from: "USD", to: "INR" }
  ];

  const baseURL = `https://v6.exchangerate-api.com/v6/${apiKey}/pair`;
  const results = await Promise.all(
    pairs.map(async ({ from, to }) => {
      try {
        const currentRes = await fetch(`${baseURL}/${from}/${to}`);
        const currentData = await currentRes.json();

        const yesterday = new Date(Date.now() - 86400000);
        const yDate = yesterday.toISOString().split("T")[0];

        const histRes = await fetch(`https://api.exchangerate.host/${yDate}?base=${from}&symbols=${to}`);
        const histData = await histRes.json();

        const current = currentData.conversion_rate;
        const previous = histData.rates[to];
        const isUp = current > previous;

        const arrow = isUp
          ? '<span style="color:lime">&#9650;</span>'
          : '<span style="color:red">&#9660;</span>';

        return `${from}/${to}: ${current.toFixed(2)} ${arrow}`;
      } catch (err) {
        return `${from}/${to}: N/A`;
      }
    })
  );

  document.getElementById("currencyTicker").innerHTML = results.join("  |  ");
}

loadCurrencyTicker();
