# Nazmus Sakib's portfolio

Live site: https://nsakiblive.github.io/

A responsive static personal portfolio built with HTML, CSS and JavaScript. Content is adapted from Nazmus Sakib's October 2026 CV. Internal project materials, reference contacts, private phone numbers and the full home address are not published.

## Publishing

GitHub Pages uses **GitHub Actions** as the publishing source. `.github/workflows/pages.yml` deploys static files from `main` using the `ubuntu-22.04` hosted runner, without a Jekyll build. Every push to `main` triggers deployment; the workflow also supports manual runs. Only the website files are packaged in the Pages artifact. HTTPS is enforced by GitHub Pages.

## Files and editing

- `index.html`: profile, project overview, experience, writing and contact.
- `script.js`: project detail content, filters and mobile navigation.
- `styles.css`: responsive layout and print styles.
- `resume.html`: public professional résumé. Print or save as PDF from the page.
- `assets/`: favicon and social preview image.
- `404.html`: custom missing-page screen.

Update both `index.html` and `resume.html` when employment or education changes. Project detail text is in `script.js`. The artwork is illustrative and contains no real client data. Google Fonts are optional; system fallbacks work without them. No analytics or form service is configured. Contact links open the visitor's email application.

## Local preview

Run `python3 -m http.server 8000` in the repository root, then open http://localhost:8000/. There is no package installation or build step.
