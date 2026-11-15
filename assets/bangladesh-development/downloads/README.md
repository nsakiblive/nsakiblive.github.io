# Bangladesh Development Dashboard

Independent portfolio project by Nazmus Sakib. Built November 2026.

## What is included
- case-bangladesh-development.html, bangladesh-development.css and assets/bangladesh-development/: responsive dashboard integrated with the portfolio.
- downloads/Methodology_and_Findings.pdf: findings, peer comparison, methodology and indicator notes.
- downloads/development_data.csv: 250 country-indicator-year records, including 32 missing observations.
- downloads/indicator_dictionary.csv: indicator codes, units and official reference links.
- downloads/quality_report.json: row controls, source hash and preparation decisions.
- prepare_data.py: reproducible standard-library data transformation.
- source/: original supplied data and companion metadata.

## Run locally
Serve the portfolio root, for example python -m http.server 8000. Open http://localhost:8000/case-bangladesh-development.html. Opening HTML directly as a file can block the JSON fetch.

## Rebuild data
python prepare_data.py source/Data.csv output

## Reading the charts
Trend charts and bars start at zero. Bangladesh is highlighted in teal. Data-point tooltips and accessible data tables accompany trend charts. Rankings are descriptive for the five selected countries only. No composite ranking or causal inference is used.

## Status and limitations
Values are checked against the supplied files. Original-source verification is pending. Data is static, not live. This is an HTML/JavaScript project, not a Power BI file. The charts use no third-party chart runtime. The page follows the portfolio typography: DM Sans and Instrument Serif, with blue/lavender accents and a dark background. Google Fonts have local serif/sans-serif fallbacks.

Missing values are blank in CSV and null in JSON. Comparisons use 2024, except clean cooking (2023). Current-price GDP and PPP changes are not real growth. Metadata identifies CC BY 4.0 for the selected series; original-source verification is still pending. Official indicator links are references, not evidence of a live data refresh.
