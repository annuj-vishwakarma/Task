const API_KEY = "49M0LJ9542X5BF8K";
const symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NFLX"];
const stocksContainer = document.getElementById("stocks-container");
const symbolsPerPage = 5;
let currentPage = 1;
const totalPages = Math.ceil(symbols.length / symbolsPerPage);

function fetchStockData(symbol) {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data["Global Quote"] && data["Global Quote"]["05. price"]) {
                const price = data["Global Quote"]["05. price"];
                const changePercent = data["Global Quote"]["10. change percent"];
                return { symbol, price, changePercent };
            } else {
                return { symbol, price: "Unavailable", changePercent: "N/A" };
            }
        })
        .catch(() => ({ symbol, price: "Error", changePercent: "N/A" }));
}

function displayStockData(stockData) {
    const stockDiv = document.createElement("div");
    stockDiv.className = "stock-info";
    stockDiv.innerHTML = `
        <h3>${stockData.symbol}</h3>
        <p><strong>Price:</strong> $${stockData.price}</p>
        <p><strong>Change:</strong> ${stockData.changePercent}</p>
    `;
    stocksContainer.appendChild(stockDiv);
}

function refreshStockData() {
    stocksContainer.innerHTML = "";
    const startIndex = (currentPage - 1) * symbolsPerPage;
    const pageSymbols = symbols.slice(startIndex, startIndex + symbolsPerPage);

    pageSymbols.forEach(symbol => fetchStockData(symbol).then(displayStockData));
    updatePaginationControls();
}

function updatePaginationControls() {
    document.getElementById("currentPage").textContent = `Page ${currentPage} of ${totalPages}`;
    document.getElementById("prevPage").disabled = currentPage === 1;
    document.getElementById("nextPage").disabled = currentPage === totalPages;
}

document.getElementById("prevPage").addEventListener("click", () => {
    currentPage--;
    refreshStockData();
});

document.getElementById("nextPage").addEventListener("click", () => {
    currentPage++;
    refreshStockData();
});

refreshStockData();
