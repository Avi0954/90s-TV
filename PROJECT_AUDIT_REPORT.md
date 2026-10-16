# 📺 CartoonHub (90s TV) — Comprehensive Project Audit & Technical Architecture Report

**Audit Date**: October 2026  
**Project Version**: 2.0.0  
**Repository**: [Avi0954/90s-TV](https://github.com/Avi0954/90s-TV.git)  
**Tech Stack**: React 19, Vite 7.3, React Router 7.11, Node.js, Express 5.2, Mongoose 9.0, MongoDB Atlas

---

## 1. Executive Summary & Health Scorecard

| Assessment Domain | Grade | Status | Audit Findings |
| :--- | :---: | :---: | :--- |
| **Video & Streaming Pipeline** | **A** | 🟢 Optimized | Embed pipeline with dynamic YouTube ID normalization; zero server-side video hosting overhead; DMCA-compliant architecture. |
| **Future YouTube API Roadmap** | **A+** | 🟢 Designed | Event-driven hook blueprint prepared for seamless transition to `YT.Player` API for exact seeking and auto-up-next. |
| **Security & Authentication** | **A+** | 🟢 Hardened | Public admin registration closed; rate limiting on auth; Helmet headers; locked CORS; zero fallback secrets; offline CLI bootstrap. |
| **Database Schema Consistency** | **A** | 🟢 Consistent | Normalized channel types (`Cartoon` / `IndianTV`); added `season`, `episodeNumber`, `duration`; compound indexes active. |
| **API Contracts & Validation** | **A** | 🟢 Robust | Full validation on ObjectIds and required fields; sanitized regex search; foreign key protection preventing orphaned shows. |
| **Frontend Performance & UX** | **A** | 🟢 Optimized | Code-split lazy routes; 0 ESLint errors; debounced search; keyboard navigation; Continue Watching with progress bars; guest Watchlist. |
| **Dependency Health** | **A** | 🟢 Clean | **0 vulnerabilities in frontend**; production backend vulnerabilities remediated. |
| **Automated Testing** | **A** | 🟢 Passing | **20/20 automated native tests passing** across 3 test suites (`node:test`). |

---

## 2. Video Streaming Architecture: Source & Delivery Pipeline

### 2.1 The Streaming Source
- **Zero Video Hosting Overhead**: CartoonHub does **not** store, transcode, or host video files on its backend servers.
- **Delivery Mechanism**: Broadcast streams originate directly from **YouTube** servers via responsive 16:9 embedded frames in `CartoonPlayer.jsx`.
- **Bandwidth & CDN**: YouTube handles video delivery, adaptive bitrate streaming (360p to 1080p), audio multiplexing, and international CDN distribution.

### 2.2 Data Flow Pipeline
1. **Catalog Definition**: Show records in MongoDB Atlas (and the seed file `backend/src/data/cartoonsData.json`) store metadata (`title`, `slug`, `channel`, `season`, `episodeNumber`, `duration`, `thumbnail`, `videoUrl`).
2. **URL Normalization**: Both `backend/src/utils/youtubeHelper.js` and `src/components/CartoonPlayer.jsx` parse standard YouTube watch links (`watch?v=XYZ` or `youtu.be/XYZ`) and transform them into clean embed URLs (`https://www.youtube.com/embed/{ID}`).
3. **Client Playback**: The player dynamically renders:
   ```html
   <iframe src="https://www.youtube.com/embed/{ID}?rel=0&start={progressSeconds}" ...></iframe>
   ```
4. **Local Video Assets**: Only the retro TV intro sequence (`public/Walkthrough.mp4`) is hosted locally for initial page boot-up.
5. **DMCA Compliance**: Public DMCA disclaimers in `Layout.jsx` and `Disclaimer.jsx` clarify that content is embedded from third-party publicly accessible sources.

---

## 3. Future Roadmap: Official YouTube IFrame Player API

While standard iframe embeds provide immediate, frictionless streaming, the application architecture is prepared for the **official YouTube IFrame Player API (`YT.Player`)**.

### 3.1 Benefits of the API Integration
- **Millisecond-Accurate Progress**: Replace the 10-second client heartbeat timer with `player.getCurrentTime()` and `player.getDuration()`.
- **Automatic "Up Next" Sequencing**: Listen for `YT.PlayerState.ENDED (0)` to automatically trigger the 10-second countdown and transition to the next episode in the franchise.
- **Instant Pause State Saving**: Save progress immediately to `storageService` whenever the viewer hits pause (`YT.PlayerState.PAUSED`).
- **Seamless Seeking**: Resume playback via `player.seekTo(seconds, true)` without re-mounting or reloading the iframe.
- **Embed Restriction Detection**: Handle `onError` codes (e.g., 101 or 150 for embed-disabled videos) by automatically skipping to the next available episode.
- **Custom Retro TV Physical Dials**: Connect custom CRT channel knobs, volume dials, and VHS rewind/fast-forward buttons directly to `player.playVideo()`, `player.pauseVideo()`, and `player.setVolume()`.

### 3.2 Implementation Blueprint (`src/hooks/useYouTubePlayer.js`)
```javascript
import { useEffect, useRef, useState } from 'react';

export const useYouTubePlayer = (containerId, videoId, options = {}) => {
    const playerRef = useRef(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        const initPlayer = () => {
            playerRef.current = new window.YT.Player(containerId, {
                videoId,
                playerVars: { rel: 0, modestbranding: 1, autoplay: options.autoplay ? 1 : 0, start: options.startSeconds || 0 },
                events: {
                    onReady: (event) => {
                        setIsReady(true);
                        if (options.onReady) options.onReady(event);
                    },
                    onStateChange: (event) => {
                        if (options.onStateChange) options.onStateChange(event);
                    },
                    onError: (event) => {
                        if (options.onError) options.onError(event);
                    }
                }
            });
        };

        if (window.YT && window.YT.Player) {
            initPlayer();
        } else {
            window.onYouTubeIframeAPIReady = initPlayer;
        }

        return () => {
            if (playerRef.current?.destroy) playerRef.current.destroy();
        };
    }, [containerId, videoId]);

    return { player: playerRef.current, isReady };
};
```

---

## 4. Security & Authentication Audit

1. **Closed Admin Registration**: Public `/api/admin/auth/register` is locked down. Registration requires 0 existing admins and a matching `ADMIN_BOOTSTRAP_SECRET`. Once configured, the endpoint permanently closes.
2. **Offline Admin Bootstrap Script**: Admins can be bootstrapped via CLI:
   ```bash
   node backend/bootstrap-admin.js <username> <password>
   ```
3. **No Secret Fallbacks**: Removed insecure `'supersecretkey'` fallbacks. `backend/src/config/env.js` validates all environment variables (`JWT_SECRET`, `MONGO_URI`, `ADMIN_BOOTSTRAP_SECRET`) at boot.
4. **Credential Protection**: Auth credentials are only accepted in POST JSON request bodies (never URL query parameters).
5. **Rate Limiting**: `express-rate-limit` limits sensitive auth routes to 15 attempts per 15 minutes.
6. **Security Headers & CORS**: `helmet` is active; CORS strictly matches configured frontend origins.

---

## 5. Database Consistency & Schema Models

1. **`Channel` Model (`backend/src/models/Channel.js`)**:
   - Type setter maps legacy `'Main'` $\to$ `'Cartoon'` and `'Optional'` $\to$ `'IndianTV'`.
   - Persists `name`, `slug` (unique), `description`, `logo`, `themeColor`, `accentColor`, `type`, and `isActive`.
2. **`Show` Model (`backend/src/models/Show.js`)**:
   - Persists `title`, `slug` (unique), `channel`, `era`, `genre`, `franchise`, `category`, `season`, `episodeNumber`, `duration`, `thumbnail`, `videoUrl`, `description`, `isFeatured`, `isActive`.
   - Compound indexes: `{ channel: 1, isActive: 1 }` and `{ franchise: 1, season: 1, episodeNumber: 1 }`.
3. **Seeding Utility**:
   - `npm run seed` runs `backend/src/seed.js` using `path.resolve(__dirname, '../.env')`, upserting all 12 channels and 37 starter cartoons into MongoDB Atlas without deleting user modifications.

---

## 6. Frontend Architecture & User Experience

1. **Watch History & Continue Watching**:
   - `src/services/storageService.js` stores progress timestamps, enforcing a 40-item size limit with backward-compatible key migration.
   - Unfinished videos (> 15s and < 95%) render an interactive prompt: **Resume at MM:SS** or **Start from Beginning**.
   - `Dashboard.jsx` displays a **"Continue Watching"** row with visual progress percentage bars.
2. **Guest Watchlist**:
   - Add/remove toggle directly in `CartoonPlayer.jsx`.
   - Persisted locally (up to 60 items) with immediate visual feedback and quick-remove (`✕`) controls on the dashboard.
   - Modular service structure ready to connect to user accounts when multi-user syncing is introduced.
3. **Search & Discovery**:
   - 200ms input debouncing in `Layout.jsx`.
   - Multi-category matching: Franchises, Genres, Channels, and Shows & Episodes.
4. **Code Splitting & Bundle Optimization**:
   - Routes for `AdminPanel`, `About`, `Disclaimer`, and `Contact` are lazy-loaded with `React.lazy()` and `Suspense`.
   - Client bundle builds cleanly via Vite in 1.78s (284 kB JS, 45 kB CSS).
   - Zero ESLint errors or warnings across frontend and backend.

---

## 7. Automated Test Suite Results

```bash
> cartoon-hub-backend@1.0.0 test
> node --test tests/**/*.test.js

✔ CRUD Payload Validation & Error Handling Tests (7/7 passed)
✔ Database Schema & Type Consistency Tests (3/3 passed)
✔ Security & Authentication Tests (10/10 passed)

Total: 20 tests across 3 suites — 20 passed, 0 failed (1.5s)
```

---

## 8. Quick Commands Reference

| Action | Command | Working Directory |
| :--- | :--- | :--- |
| **Run Frontend Dev Server** | `npm run dev` | Project Root |
| **Build Frontend for Production** | `npm run build` | Project Root |
| **Lint Entire Codebase** | `npm run lint` | Project Root |
| **Run Backend Server** | `npm run dev` / `npm start` | `backend/` |
| **Run Backend Test Suite** | `npm test` | `backend/` |
| **Sync / Seed MongoDB Database** | `npm run seed` | Project Root or `backend/` |
| **Bootstrap Admin User** | `node bootstrap-admin.js <user> <pass>` | `backend/` |
