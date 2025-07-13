// chart.js — handles chart loading, updating, and downloading

const API_KEY = "W3JoiwBPaacwKiA86OWTwXu8GbftQoMu";
let chartInstance = null;

// Load chart with selected currencies and date range
async function loadExchangeChart() {
  const base = document.getElementById("base").value;
  const target = document.getElementById("target").value;
  const range = parseInt(document.getElementById("range").value);

  const today = new Date();
  const endDate = today.toISOString().split("T")[0];

  const startDateObj = new Date(today);
  startDateObj.setDate(today.getDate() - (range - 1));
  const startDate = startDateObj.toISOString().split("T")[0];

  const url = `https://api.apilayer.com/exchangerates_data/timeseries?start_date=${startDate}&end_date=${endDate}&base=${base}&symbols=${target}`;

  try {
    const response = await fetch(url, {
      headers: {
        apikey: API_KEY,
      },
    });

    const data = await response.json();
    if (!data.success || !data.rates) {
      console.error("API response error:", data);
      throw new Error("Invalid data returned from API");
    }

    const labels = Object.keys(data.rates).sort();
    const rates = labels.map(date => data.rates[date][target]);

    const ctx = document.getElementById("exchangeChart").getContext("2d");

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: `${base} to ${target}`,
          data: rates,
          borderColor: "#28a745",
          backgroundColor: "rgba(40, 167, 69, 0.2)",
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    });

  } catch (error) {
    console.error("Chart error:", error);
    alert("Could not load exchange rate data.");
  }
}

// Optional: Download chart as image
function downloadChart() {
  if (!chartInstance) return;
  const link = document.createElement('a');
  link.href = chartInstance.toBase64Image();
  link.download = 'exchange_rate_chart.png';
  link.click();
}

// Auto-load chart when page is ready
window.addEventListener("DOMContentLoaded", loadExchangeChart);
