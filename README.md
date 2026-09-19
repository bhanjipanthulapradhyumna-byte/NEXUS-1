# NEXUS Website Prototype

This package is a responsive front-end prototype for the NEXUS AI interface.

## Included
- Animated NEXUS + Phoenix opening screen.
- Black / royal-purple / white visual system.
- Login flow UI:
  - Google account chooser simulation
  - Add-account simulation
  - Terms & Conditions
  - Email + password flow
  - Cancel returns to the previous modal
- Logged-in profile panel and logout.
- Privacy mode.
- Responsive right-side navigation drawer.
- New conversation, Deep research, Finance, Problem solving, Coding and Analysis screens.
- Settings:
  - Personalize: accent color, font, font size
  - Appearance: Dark / Light / System selector
  - General
  - About
- Image-only attachment input.
- Browser microphone permission request.
- LocalStorage for demo login/preferences.

## Run
Open `index.html` in a modern browser.

For microphone permissions, use a secure context such as HTTPS or localhost.

## Production integration
The Google account chooser in this front-end is intentionally a demo. For real authentication, connect a backend/OAuth provider and verify tokens server-side. The Send button is also a front-end hook; connect it to your AI API through a secure backend rather than exposing API keys in browser JavaScript.
