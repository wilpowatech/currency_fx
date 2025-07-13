// chart.js (using exchangerate.host - free, no API key)

let chartInstance;
let chartTimer;
let autoRefresh = true;

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

    const url = `https://api.exchangerate.host/${formatted}?base=${base}&symbols=${targets.join(',')}`;
    const res = await fetch(url);
    const data = await res.json();

    targets.forEach(symbol => {
      if (!dataMap.has(symbol)) dataMap.set(symbol, []);
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

// Load once on page load
window.addEventListener("DOMContentLoaded", () => {
  loadExchangeChart();
  chartTimer = setInterval(() => {
    if (autoRefresh) loadExchangeChart();
  }, 60000);
});

// Download chart as PNG
function downloadChart() {
  if (!chartInstance) return;
  const link = document.createElement('a');
  link.href = chartInstance.toBase64Image();
  link.download = 'exchange_chart.png';
  link.click();
}

// Export data as CSV
function exportCSV() {
  const base = document.getElementById("base").value;
  const target = document.getElementById("target").value;
  const labels = chartInstance.data.labels;
  const csvHeader = ["Date", ...chartInstance.data.datasets.map(d => d.label)].join(",");
  const csvRows = [csvHeader];

  for (let i = 0; i < labels.length; i++) {
    const row = [labels[i]];
    for (const dataset of chartInstance.data.datasets) {
      row.push(dataset.data[i]);
    }
    csvRows.push(row.join(","));
  }

  const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "exchange_data.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Toggle auto-refresh
function toggleAutoRefresh(btn) {
  autoRefresh = !autoRefresh;
  btn.textContent = autoRefresh ? "⏳ Auto Refresh: ON" : "⏸️ Auto Refresh: OFF";
}
