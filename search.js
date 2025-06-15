async function search(query){
    const response = await fetch(`/api/google?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data;
}

function setUpDownloadElement(jsonData, filename, downloadElement) {
    if (!jsonData || jsonData?.length === 0) {
        downloadElement.removeAttribute('href');
        downloadElement.removeAttribute('download');
        downloadElement.classList.add('disabled');
        return;
    }
    const jsonString = JSON.stringify(jsonData);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    downloadElement.href = url;
    downloadElement.download = filename;
}

function loadSearchResults(searchResult, element) {
    element.innerHTML = ""; // Clear previous results
    if(!searchResult || searchResult?.length === 0){
        element.textContent = "No results found.";
        return;
    }
    for( const result of searchResult){
        const resultElement = document.createElement("div");
        resultElement.className = "search-result-item";
        resultElement.innerHTML = `
            <a href="${result.formattedUrl}" target="_blank">
                <h3>${result.htmlTitle}</h3>
            </a>
            <p>${result.htmlSnippet}</p>
        `;
        element.appendChild(resultElement);
    }
}

document.getElementById("searchInput").addEventListener("input",(e)=>{
    const query = e.target.value;
    const resultElement = document.querySelector(".search-result");
    resultElement.textContent = "Loading...";
    if(query){
        search(query).then(data => {
            const downloadElement = document.getElementById("downloadBtn");
            loadSearchResults(data.items, resultElement);
            setUpDownloadElement(data.items, "search-results.json", downloadElement);
        }).catch(error => {
            console.error("Error fetching search results:", error);
            resultElement.textContent = "Error fetching results.";
        });
    }
})

module.exports = {
    search,
    setUpDownloadElement,
    loadSearchResults
}