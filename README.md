# Electron YouTube Mini Player

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![Electron](https://img.shields.io/badge/Electron-desktop-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-supported-blue)
![License](https://img.shields.io/badge/license-MIT-green)

A minimalist floating desktop music player built with **Electron** that allows you to search and play embeddable YouTube videos in a distraction-free window.

This project focuses on simplicity, performance, and a clean user experience.

---

# Features

- Search videos using **YouTube Data API v3**
- Play videos inside a **mini embedded player**
- Filters out **non-embeddable or restricted videos**
- Minimalist interface
- Responsive video player that adjusts to window size
- Cross-platform desktop app (**Windows, macOS, Linux**)
- Graceful fallback when videos cannot be embedded

---

# Architecture

The application is built using Electron with a separated structure for the main process, preload scripts, and renderer logic.

```
src
├ main
│  └ main.ts
├ preload
│  └ preload.ts
├ renderer
│  └ renderer.ts
├ types
│  └ global.d.ts
├ styles
│  └ styles.css
└ index.html
```

---

# Installation

Clone the repository

```
git clone https://github.com/your-username/electron-youtube-mini-player.git
```

Navigate into the project

```
cd electron-youtube-mini-player
```

Install dependencies

```
npm install
```

---

# Environment Variables

Create a `.env` file in the root directory:

```
YOUTUBE_API_KEY=your_api_key_here
```

You can obtain a YouTube API key from:

https://console.cloud.google.com/

Enable the following API:

```
YouTube Data API v3
```

---

# Running the App

Build TypeScript files

```
npm run build
```

Run the Electron app

```
npm run dev
```

---

# Building Executables

To generate desktop executables:

```
npx electron-builder
```

This will create installers for supported platforms.

---

# YouTube Embed Relay

Some YouTube videos block embedding when loaded from `file://` origins.

To bypass this limitation, the player loads videos through a **YouTube relay page** hosted on HTTPS.

```
Electron App
      ↓
YouTube Relay (HTTPS origin)
      ↓
YouTube Embed Player
```

This prevents common errors such as **YouTube error 153**.

---

# Work in Progress

The following improvements are currently being implemented:

- Thumbnail previews in search results
- Auto-play next video
- Keyboard shortcuts for playback
- Favorites system
- Playback history
- Spotify-style mini player layout
- Improved responsive design
- Better error handling for restricted videos

---

# Roadmap

### v1.0

Basic YouTube mini player

- Search functionality
- Embedded player
- Relay system
- Minimal interface

### v1.1

UX improvements

- Thumbnails
- Autoplay next video
- Keyboard shortcuts

### v1.2

Advanced features

- Favorites
- Playback history
- Improved floating player

---

# License

MIT License
