# WanderLux Travel Agency

A responsive, multi-page travel agency website created with semantic HTML5, CSS3 and vanilla JavaScript for the ICT502 Internet and Web Development Assessment 2 project.

This is a static website: it has no signup, login, password, account features, database or application backend.

## Project structure

```text
502project1/
├── index.html
├── destinations.html
├── calculator.html
├── appointment.html
├── about.html
├── contact.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── README.md
```

Destination and editorial photographs are loaded from Unsplash image URLs; fonts are loaded from Google Fonts. The Sydney map is embedded from Google Maps. These external resources require an internet connection. No image files are required locally.

## Run locally

1. Open this project folder in Visual Studio Code.
2. Install the **Live Server** extension if it is not already installed.
3. In the Explorer, right-click `index.html` and choose **Open with Live Server** (or select **Go Live** in the status bar).
4. Use the navigation to visit the six pages. Keep the local server running while browsing.

The pages can also be opened directly in a modern browser, but a local web server is recommended for consistent behavior.

## Features

- Shared responsive navigation, footer, typography and visual styling on all pages.
- Homepage destination slider with automatic rotation, previous/next buttons and direct slide controls. Automatic rotation pauses while hovered and is disabled for reduced-motion preferences.
- Trip calculator using the specified illustrative AUD daily rates and travel-style multipliers.
- Appointment and contact forms with browser and JavaScript validation. Both forms send their submissions to the configured Formspree endpoint. Appointment submissions are requests only and do not confirm a booking.
- Scroll reveal effects, mobile navigation, accessible labels and focus indicators, reduced-motion support, page-specific titles and descriptions.

## Contact form and Formspree

The Contact and Appointment forms submit asynchronously to the Formspree endpoint `https://formspree.io/f/xaeezedj`. Formspree delivers submissions to the email address configured and verified for this form in your Formspree account. This is a static website; it has no database or application server.

To activate and test the forms, sign in to Formspree, confirm the `xaeezedj` form belongs to your account, and configure/verify the recipient email address in that form's settings. Formspree's free tier currently has a monthly submission limit; check its current plan details. The website displays success only for a successful Formspree response, and displays an error while preserving form contents if delivery fails. Appointment requests are emailed to the agency but are not confirmed bookings; the agency must follow up. Replace the fictional contact details on the page before publishing.


## Deploy with GitHub Pages

1. Create a GitHub repository and add this folder's files to its root.
2. Push the files to the repository's default branch.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select the default branch and the `/ (root)` folder, then save.
5. After GitHub Pages finishes publishing, use the URL displayed in the Pages settings.

## Deploy with Netlify

1. Create a new site in Netlify and import the GitHub repository, or use Netlify's manual deploy flow.
2. Set the publish directory to the project root (the folder containing `index.html`). No build command is needed.
3. Deploy. Netlify will provide a public URL for the static site.

The Formspree endpoint is public by design. Configure any available domain restrictions and spam controls in Formspree. Consider adding a privacy notice and consent language appropriate to the agency and jurisdiction.
