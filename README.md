# Mihad AI | مهاد

A web-based prototype for an adoption-related platform featuring organization-facing pages, child listings, community features, and experimental face-analysis/matching workflows.

## Tech stack
- HTML, CSS, JavaScript
- Firebase Realtime Database and Firebase SDK
- Browser-based face-api.js models (SSD MobileNet V1, face landmarks, face recognition)

## Features in the source
- Landing, about, community, stories, children and organization/admin pages
- Parent-image upload and face descriptor comparison workflow
- Firebase-backed records and requests (requires configuration)

## Local setup
1. Serve the project through a local HTTP server, e.g. `python -m http.server 8000`.
2. Open `http://localhost:8000`.
3. Replace `YOUR_...` Firebase configuration placeholders with **your own test Firebase project** if you need database functionality. Multiple HTML files contain inline configuration; search the project for `YOUR_`.
4. Implement **Firebase Authentication and restrictive authorization rules** before enabling database reads/writes or admin features. `firebase-rules.example.json` intentionally denies all access.

## Important limitations and safety
- **This public portfolio copy is intentionally not connected to the original live Firebase project.** Database-backed features will not work until configured.
- Demo organization login has been disabled where hard-coded credentials were found; sessionStorage is not a security boundary. Review all routes and authorization before deployment.
- The included face-matching approach compares facial descriptors. **It does not establish biological parentage or familial relationships**, and it must not be used to make adoption, identity or eligibility decisions.
- Accuracy percentages appearing in older project notes were not supported by a reproducible evaluation and are not claimed here.
- Model files are included as supplied with the project. Verify third-party model/library licenses before redistribution or production use.
- Sample images are from the project archive; review ownership/permissions before public deployment.

## Portfolio note
Academic/project showcase source code. This repository does not represent a production-ready adoption or identity-verification system.
