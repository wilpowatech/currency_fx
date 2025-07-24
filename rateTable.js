// rateTable.js

document.addEventListener("DOMContentLoaded", async () => {
  const currencies = ["USD", "GBP", "EUR"];
  const base = "NGN"; // Show everything against Naira
  const tableBody = document.getElementById("rate-table-body");

  const flags = {
    USD: "🇺🇸",
    GBP: "🇬🇧",
    EUR: "🇪🇺",
  };

  const today = new Date();
  const getFormattedDate = (date) => date.toISOString().split("T")[0];

  const fetchRateForDate = async (dateStr) => {
    const url = `https://open.er-api.com/v6/latest/${base}`;
    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.result !== "success") throw new Error("API Error");

      return currencies.map((cur) => ({
        currency: cur,
        rate: (1 / data.rates[cur]).toFixed(2), // NGN to cur
      }));
    } catch (err) {
      console.error("Rate Table Error:", err);
      throw new Error("Failed to fetch rate history");
    }
  };

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = getFormattedDate(date);

    try {
      const rates = await fetchRateForDate(dateStr);

      const row = document.createElement("tr");
      row.innerHTML =
        `<td><strong>${dateStr}</strong></td>` +
        rates
          .map((r) => `<td>${r.rate} ${flags[r.currency]} ${r.currency}</td>`)
          .join("");
      tableBody.appendChild(row);
    } catch (err) {
      const row = document.createElement("tr");
      row.innerHTML = `<td colspan="${
        currencies.length + 1
      }">Failed to load data for ${dateStr}</td>`;
      tableBody.appendChild(row);
    }
  }
});
