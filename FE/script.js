async function searchGame() {

    const gameName = document
        .getElementById("gameInput")
        .value
        .trim();

    const resultDiv = document.getElementById("result");

    if (!gameName) return;

    resultDiv.innerHTML = `
        <div class="loading-card">
            Searching...
        </div>
    `;

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/predict",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    game_name: gameName
                })
            }
        );

        const data = await response.json();

        if (data.success === false) {

            resultDiv.innerHTML = `
                <div class="error-card">
                    <h2>Game Not Found</h2>
                    <p>Try another game title.</p>
                </div>
            `;

            return;
        }

        let recommendationsHTML = "";

        data.recommendations.forEach(game => {

            recommendationsHTML += `
                <div class="recommend-card">
                    <div class="recommend-name">${game.name}</div>
                    <div class="recommend-genre">${game.genre}</div>
                </div>
            `;

        });

        const confidenceValue = parseFloat(
            data.confidence.replace("%", "")
        );

        resultDiv.innerHTML = `

            <div class="card">

                <div class="title">${data.name}</div>

                <div class="genre">${data.genre}</div>

                <div class="metric-grid">

                    <div class="metric">
                        <div class="metric-label">Rating</div>
                        <div class="metric-value">${data.rating}</div>
                    </div>

                    <div class="metric">
                        <div class="metric-label">Owners</div>
                        <div class="metric-value">${data.owners}</div>
                    </div>

                    <div class="metric">
                        <div class="metric-label">Playtime</div>
                        <div class="metric-value">${data.playtime}</div>
                    </div>

                </div>

            </div>

            <div class="card">

                <div class="result-title ${data.hidden ? "hidden" : "not-hidden"}">
                    ${data.hidden ? "HIDDEN GEM" : "NOT HIDDEN GEM"}
                </div>

                <p>Confidence: ${data.confidence}</p>

                <div class="progress-container">
                    <div class="progress-bar" style="width:${confidenceValue}%"></div>
                </div>

            </div>

            <div class="card">

                <div class="section-title">Analysis</div>

                ${data.reasons.map(reason =>
                    `<div class="analysis-item">• ${reason}</div>`
                ).join("")}

            </div>

            <div class="card">

                <div class="section-title">
                    Recommended Hidden Gems
                </div>

                <div class="recommend-grid">
                    ${recommendationsHTML}
                </div>

            </div>

        `;

    }

    catch (error) {

        resultDiv.innerHTML = `
            <div class="error-card">
                <h2>Connection Error</h2>
                <p>Backend server is not running.</p>
            </div>
        `;

        console.error(error);

    }

}

document
    .getElementById("gameInput")
    .addEventListener("keypress", function (event) {

        if (event.key === "Enter") {
            searchGame();
        }

    });