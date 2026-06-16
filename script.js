let gamesData = [];

async function loadData() {

    const response = await fetch("steam_data.json");

    gamesData = await response.json();

    console.log(
        "Loaded:",
        gamesData.length,
        "games"
    );
}

loadData();

async function searchGame() {

    const keyword =
        document
        .getElementById("gameInput")
        .value
        .trim()
        .toLowerCase();

    const resultDiv =
        document.getElementById("result");

    if(!keyword) return;

    resultDiv.innerHTML =
    `
    <div class="loading-card">
        Searching...
    </div>
    `;

    const matches =
        gamesData.filter(game =>
            game.name
            .toLowerCase()
            .includes(keyword)
        );

    if(matches.length === 0){

        resultDiv.innerHTML =
        `
        <div class="error-card">
            <h2>Game Not Found</h2>
            <p>Try another title.</p>
        </div>
        `;

        return;
    }

    const data = matches[0];

    const hidden =
        data.hidden_gem === 1;

    const confidence =
        Math.abs(
            data.hidden_gem_score
        ) * 100;

    const firstGenre =
        data.genres.split(";")[0];

    const recommendations =
        gamesData
        .filter(game =>
            game.hidden_gem === 1 &&
            game.genres.includes(firstGenre) &&
            game.name !== data.name
        )
        .sort(
            (a,b)=>
            b.hidden_gem_score -
            a.hidden_gem_score
        )
        .slice(0,5);

    let recommendationHTML = "";

    recommendations.forEach(game => {

        recommendationHTML +=
        `
        <div class="recommend-card">
            <div class="recommend-name">
                ${game.name}
            </div>

            <div class="recommend-genre">
                ${game.genres}
            </div>
        </div>
        `;
    });

    const reasons = [];

    if(data.rating_ratio >= 0.8)
        reasons.push("Very High Rating");

    if(data.owner_mid < 500000)
        reasons.push("Relatively Unknown");
    else
        reasons.push("Highly Popular");

    if(data.average_playtime > 1000)
        reasons.push("Strong Player Engagement");
    else
        reasons.push("Low Player Engagement");

    resultDiv.innerHTML =
    `
    <div class="card">

        <div class="title">
            ${data.name}
        </div>

        <div class="genre">
            ${data.genres}
        </div>

        <div class="metric-grid">

            <div class="metric">
                <div class="metric-label">Rating</div>
                <div class="metric-value">
                    ${(data.rating_ratio*100).toFixed(2)}%
                </div>
            </div>

            <div class="metric">
                <div class="metric-label">Owners</div>
                <div class="metric-value">
                    ${formatOwners(data.owners)}
                </div>
            </div>

            <div class="metric">
                <div class="metric-label">Playtime</div>
                <div class="metric-value">
                    ${formatPlaytime(data.average_playtime)}
                </div>
            </div>

        </div>

    </div>

    <div class="card">

        <div class="result-title ${hidden ? "hidden" : "not-hidden"}">
            ${hidden ? "HIDDEN GEM" : "NOT HIDDEN GEM"}
        </div>

        <p style="text-align:center;margin-top:10px;">
            Hidden Gem Potential ${confidence.toFixed(2)}%
        </p>

        <div class="progress-container">
            <div
                class="progress-bar"
                style="width:${Math.min(confidence,100)}%">
            </div>
        </div>

    </div>

    <div class="card">

        <div class="section-title">
            Analysis
        </div>

        ${reasons.map(
            r=>`<div class="analysis-item">• ${r}</div>`
        ).join("")}

    </div>

    <div class="card">

        <div class="section-title">
            Recommended Hidden Gems
        </div>

        <div class="recommend-grid">
            ${recommendationHTML}
        </div>

    </div>
    `;
}

document
.getElementById("gameInput")
.addEventListener("keypress", function(e){

    if(e.key === "Enter"){
        searchGame();
    }

});
