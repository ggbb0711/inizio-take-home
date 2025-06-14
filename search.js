
async function search(query){
    const apiKey = "AIzaSyB9KWuDn2iQPuRImq5oMU8Q3AExm9lfdRw";
    const response = await fetch(`https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=34bc5eb72678646dd&q=${query}`);
    const data = await response.json();
    return data;
}

function loadSearchResulsts(searchResult,element){
    element.innerHTML = ""; // Clear previous results
    if(!searchResult || searchResult.length === 0){
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
            console.log(data);
            // You can update the UI with the search results here
            loadSearchResulsts(data.items, resultElement);
        }).catch(error => {
            console.error("Error fetching search results:", error);
            resultElement.textContent = "Error fetching results.";
        });
    }
})
