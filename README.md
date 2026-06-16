# Steam Hidden Gems Finder

Steam Hidden Gems Finder is a Machine Learning project designed to identify and recommend hidden gem games on Steam. The system analyzes game characteristics such as ratings, playtime, popularity, and ownership data to discover high-quality games that may be overlooked by the majority of players.

## Project Overview

With more than 27,000 games available on Steam, many high-quality titles receive little attention despite having excellent player reviews and engagement. This project aims to help users discover these hidden gems through data-driven analysis and machine learning techniques.

The project includes:

* Exploratory Data Analysis (EDA)
* Feature Engineering
* Hidden Gem Score Calculation
* K-Means Clustering
* Decision Tree Classification
* Interactive Web Application

---

## Dataset

The dataset contains information about Steam games, including:

* Game Name
* Genres
* Positive Ratings
* Negative Ratings
* Average Playtime
* Estimated Owners
* Price

Total records:

```text
27,075 Steam Games
```

---

## Methodology

### 1. Data Preprocessing

* Missing value checking
* Owners conversion into midpoint values
* Total ratings calculation
* Rating ratio calculation
* Log transformation for skewed features

### 2. Hidden Gem Discovery

A custom Hidden Gem Score was developed using:

```text
Hidden Gem Score =
(0.5 × Rating Ratio Scaled) +
(0.3 × Playtime Scaled) -
(0.4 × Owners Scaled)
```

A game is considered a Hidden Gem if:

```text
Hidden Gem Score ≥ 0.5
AND
Owner Mid < 500,000
```

Results:

```text
Hidden Gems     : 791
Non Hidden Gems : 26,284
```

---

### 3. K-Means Clustering

Features used:

* Price
* Rating Ratio
* Average Playtime
* Owner Mid

The Elbow Method was used to determine the optimal number of clusters.

---

### 4. Decision Tree Classification

Input Features:

* Price
* Rating Ratio
* Log Playtime
* Log Owners

Target:

```text
Hidden Gem
```

Model Performance:

```text
Accuracy : 98.86%
```

Classification Report:

```text
Precision (Hidden Gem) : 86%
Recall (Hidden Gem)    : 73%
F1 Score               : 79%
```

---

## Web Application

The project was implemented as a web application called:

```text
Steam Hidden Gems Finder
```

Features:

* Search games by name
* View Hidden Gem status
* Display Hidden Gem Score
* Show game statistics
* Recommend similar Hidden Gems

---

## Project Structure

```text
steam-hidden-gems-finder/

├── index.html
├── style.css
├── script.js
├── steam_data.json
├── FP_ML.ipynb
└── README.md
```

---

## Running Locally

Clone the repository:

```bash
git clone https://github.com/your-username/steam-hidden-gems-finder.git
```

Navigate to the project directory:

```bash
cd steam-hidden-gems-finder
```

Run a local server:

```bash
python -m http.server 5500
```

Open:

```text
http://localhost:5500
```

---

## Example

Input:

```text
Counter-Strike
```

Output:

```text
NOT HIDDEN GEM
Hidden Gem Score: 42.68%
```

Input:

```text
Pictopix
```

Output:

```text
HIDDEN GEM
Hidden Gem Score: 68.93%
```

---

## Technologies Used

* Python
* Pandas
* NumPy
* Scikit-Learn
* Matplotlib
* Seaborn
* HTML
* CSS
* JavaScript
* GitHub Pages

---

## Conclusion

This project demonstrates how machine learning and data analysis can be used to identify overlooked yet high-quality games on Steam. By combining custom scoring methods, clustering, classification, and a user-friendly web interface, the system provides an effective way for players to discover hidden gems within Steam's massive game library.
