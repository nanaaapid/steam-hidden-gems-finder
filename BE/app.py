from flask import Flask, request, jsonify
from flask_cors import CORS

import pandas as pd
import joblib

app = Flask(__name__)
CORS(app)

df = pd.read_csv("steam_processed.csv")

model = joblib.load(
    "decision_tree.pkl"
)

@app.route("/predict", methods=["POST"])
def predict():

    data = request.json

    keyword = (
        data.get("game_name", "")
        .strip()
    )

    result = df[
        df["name"]
        .str.contains(
            keyword,
            case=False,
            na=False
        )
    ]

    if len(result) == 0:

        return jsonify({
            "success": False,
            "message": "Game not found."
        })

    game = result.iloc[0]

    X = [[
        game["price"],
        game["rating_ratio"],
        game["log_playtime"],
        game["log_owners"]
    ]]

    prediction = int(
        model.predict(X)[0]
    )

    probability = float(
        model.predict_proba(X)[0][prediction]
    )

    if prediction == 1:
        confidence = probability
    else:
        confidence = 1 - probability
    reasons = []

    if game["rating_ratio"] >= 0.8:
        reasons.append(
            "Very High Rating"
        )
    else:
        reasons.append(
            "Moderate Rating"
        )

    if game["owner_mid"] < 500000:
        reasons.append(
            "Relatively Unknown"
        )
    else:
        reasons.append(
            "Highly Popular"
        )

    if game["average_playtime"] > 1000:
        reasons.append(
            "Strong Player Engagement"
        )
    else:
        reasons.append(
            "Low Player Engagement"
        )

    first_genre = (
        str(game["genres"])
        .split(";")[0]
    )

    recommendations = (
        df[
            (df["hidden_gem"] == 1)
            &
            (
                df["genres"]
                .str.contains(
                    first_genre,
                    case=False,
                    na=False
                )
            )
        ]
        .sort_values(
            by="hidden_gem_score",
            ascending=False
        )
        .head(5)
    )

    recommendation_list = []

    for _, row in recommendations.iterrows():

        if row["name"] == game["name"]:
            continue

        recommendation_list.append({

            "name":
                row["name"],

            "genre":
                row["genres"]

        })

    playtime = (
        "N/A"
        if game["average_playtime"] == 0
        else f"{int(game['average_playtime'])} mins"
    )

    return jsonify({

        "success": True,

        "name":
            game["name"],

        "genre":
            game["genres"],

        "rating":
            f"{game['rating_ratio']:.2%}",

        "owners":
            game["owners"],

        "playtime":
            playtime,

        "hidden":
            bool(prediction),

        "confidence":
            f"{confidence:.2%}",

        "reasons":
            reasons,

        "recommendations":
            recommendation_list

    })

if __name__ == "__main__":

    app.run(
        debug=True
    )
