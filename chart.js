let chartInstance;
let chartTimer;
let autoRefresh = true;

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
    // Fix: Wrap string in quotes, use template literal correctly
    resultDiv.innerText = `Same currency selected. Result: ${amount.toFixed(2)} ${to}`;
    resultDiv.style.color = "black";
    resultDiv.style.backgroundColor = "transparent";
    return;
  }

  try {
    // Fix: URL in quotes, template literals wrapped in backticks ``
    const url = `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.result !== undefined && data.result !== null) {
      resultDiv.innerText = `${amount} ${from} = ${data.result.toFixed(2)} ${to}`;
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

// Chart loading function
async function loadExchangeChart() {
  const base = document.getElementById("base").value;
  const target = document.getElementById("target").value;
  const range = parseInt(document.getElementById("range").value);

  if (base === target) {
    alert("Please select two different currencies.");
    return;
  }

  const labels = [];
  const dataMap = new Map();
  const targets = target.split(",").map(t => t.trim());
  const today = new Date();

  for (let i = range - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const formatted = date.toISOString().split('T')[0];
    labels.push(formatted);

    // Fix: URL string must be backticked for template literal
    const url = `https://api.exchangerate.host/${formatted}?base=${base}&symbols=${targets.join(',')}`;
    const res = await fetch(url);
    const data = await res.json();

    targets.forEach(symbol => {
      if (!dataMap.has(symbol)) dataMap.set(symbol, []);
      // Use optional chaining safely
      dataMap.get(symbol).push(data?.rates?.[symbol] ?? null);
    });
  }

  const datasets = Array.from(dataMap.entries()).map(([symbol, values], index) => {
    const colors = ["#007bff", "#28a745", "#ffc107", "#dc3545", "#6f42c1"];
    return {
      label: `${base} to ${symbol}`,
      data: values,
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length] + "33",
      tension: 0.3,
      spanGaps: true
    };
  });

  if (!datasets.length || datasets.every(d => d.data.every(v => v === null))) {
    console.warn("No valid exchange rate data.");
    return;
  }

  const ctx = document.getElementById("exchangeChart").getContext("2d");
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "line",
    data: { labels, datasets },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        y: { beginAtZero: false }
      }
    }
  });
}
