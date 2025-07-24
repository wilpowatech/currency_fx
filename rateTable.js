// rateTable.js — Load exchange rate table for USD, GBP, EUR against NGN

async function loadExchangeTable() {
  const fxTable = document.getElementById("fx-table");
  if (!fxTable) return;

  try {
    const currencies = ["USD", "GBP", "EUR"];
    const today = new Date().toISOString().split("T")[0];
    let html = `<tr><td>${today}</td>`;

    for (const currency of currencies) {
      const url = `https://api.exchangerate.host/latest?base=${currency}&symbols=NGN`;
      const response = await fetch(url);
      const data = await response.json();

      const rate = data?.rates?.NGN;
      if (!rate) throw new Error(`Rate for ${currency} to NGN not available`);

      const sell = rate.toFixed(2);
      const buy = (rate * 0.98).toFixed(2); // Buying at 2% margin

      html += `
        <td>
          <span style="color: green; font-weight: bold;">Buy: ${buy}</span><br/>
          <span style="color: red; font-weight: bold;">Sell: ${sell}</span>
        </td>`;
    }

    html += "</tr>";
    fxTable.innerHTML = html;
  } catch (error) {
    console.error("FX Error:", error);
    fxTable.innerHTML = `
      <tr><td colspan="4" style="color: red; font-weight: bold;">
        Error fetching exchange rates.<br/>${error.message}
      </td></tr>`;
  }
}

document.addEventListener("DOMContentLoaded", loadExchangeTable);
