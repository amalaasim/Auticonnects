# Landscape-phone responsiveness pass

Branch: `muzammal` on https://github.com/amalaasim/Auticonnects
Last updated: 18 October 2026

This document explains what was changed to make the app usable on phones held sideways, how to run the branch locally, and how to check each page.

---

## 1. Get the code

```powershell
git clone https://github.com/amalaasim/Auticonnects.git
cd Auticonnects
git checkout muzammal
```

If you already have a clone:

```powershell
git fetch origin
git checkout muzammal
git pull
```

## 2. Set up and run

Requirements: Node 20 or newer. Check with `node -v`.

1. Create a file named `.env` in the project root (next to `package.json`) with the Supabase and Gemini keys. Ask the project owner for the values. The file must be named `.env`, not `env`.

   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_PUBLISHABLE_KEY=...
   GEMINI_API_KEY=...
   ```

2. Install dependencies for the main app and for the Sheru bot sub-app, then build the Sheru bot once. Run these from the project root:

   ```powershell
   npm install
   npm install --prefix sheru-bot
   npm run build --prefix sheru-bot
   ```

3. Start the dev server:

   ```powershell
   npm run dev
   ```

4. Open http://localhost:3000. Log in with a test account. Google sign-in works on localhost only if `http://localhost:3000` is in the Supabase project's Redirect URLs list, which it now is.

Notes:

- Run the Sheru bot build **before** starting the dev server, not at the same time. Running both together corrupts Vite's dependency cache and the app crashes with "Invalid hook call". If that happens, stop the server and run `npm run dev -- --force`.
- The Sheru bot is a separate build served from `public/sheru-bot/`. After changing anything in `sheru-bot/`, run the build step again. The dev server does not hot-reload it.

## 3. How to test a page in landscape phone mode

1. Open the page in Chrome or Edge.
2. Press F12, then click the device toolbar icon (or Ctrl+Shift+M).
3. Choose **Pixel 9 Pro** (952 x 427) or any phone, and click the rotate icon so it is **landscape**.
4. Compare against the normal desktop window. Nothing should overlap, clip, or be smaller than about 11px.

To test as each character, open `/settings`, change the character, and save. The next page you open uses the new character. The three characters are the lion (stored as `rocco`), Bubbles, and Mimmi. Backgrounds, boards, and mascots change with the character, so pages that look right as the lion can still break as Mimmi.

To open the onboarding pages when your profile is already complete, paste this in the browser console first:

```js
sessionStorage.setItem('childName', 'Test');
sessionStorage.setItem('childAge', '5');
```

Then visit `/child-profile/name`, `/child-profile/age`, `/child-profile/character`. To see the consent page again, also run:

```js
Object.keys(localStorage).filter(k => k.startsWith('parental-consent:')).forEach(k => localStorage.removeItem(k));
```

Do not press the final button on the character page unless you want to overwrite the saved profile.

## 4. All page addresses

| Area | Address |
|---|---|
| Auth | `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/email-verified` |
| Onboarding | `/child-profile/consent`, `/child-profile/name`, `/child-profile/age`, `/child-profile/character` |
| Hub | `/` (language picker), `/english` |
| Games | `/wonderworld`, then per object: learn `/learnobject` `/learnobjectcar` `/learnobjshoe` `/learnobjball`, find `/find` `/findcar` `/findshoe` `/findball`, show your own `/car` `/yourShoe` `/showball`, result `/final` |
| Story | `/garden` |
| Parent | `/reports`, `/settings`, `/change-password`, `/new-password` |
| Sheru bot | `/sheru-bot/` (needs camera and microphone) |

## 5. The breakpoint

Every phone rule in this pass uses the same media query:

```
(orientation: landscape) and (max-height: 500px)
```

- In Tailwind classes it is the `mland:` prefix (and `phone:` for either orientation). Defined in `tailwind.config.js`.
- In MUI `sx` objects it is a constant named `phoneLandscape` or `PHONE_LANDSCAPE` declared at the top of the file.
- In plain CSS it is written out in full.

Desktop and tablet layouts are untouched by these rules.

## 6. What changed, by page

### Shared pieces

- `src/components/AppGreetingHeader.jsx`: the "HI-NAME" greeting shrinks on landscape phones. Used by the language, English, wonderworld, reports, and settings pages.
- `src/components/auth/AuthInput.tsx`, `AuthButton.tsx`: labels, inputs, and buttons get pixel minimums on phones so they never fall below readable size.
- `src/components/auth/BackSignpost.tsx`: smaller Back sign on phones.
- `src/components/auth/HangingBoard.tsx`: the "email sent" board fills the phone height and its message has a minimum size.
- `src/components/auth/AuthBackground.tsx`: auth pages cannot scroll vertically on landscape phones.

### Auth pages

- `/forgot-password`: board enlarged for phones, text sizes raised, no scrolling.
- `/reset-password` and `/email-verified`: rebuilt on the same layout as the login page. They previously used plain desktop text sizes and the default font.
- `/signup`: same phone spacing as login.

### Hub

- `/` language page: compact top bar and smaller icons on phones so the greeting no longer collides with the banner.
- `/english`: top bar brought in line with the language page (30px icons, 3% side padding).

### WonderWorld games (12 pages)

- `/wonderworld`: compact top bar, "Select object to learn" sign moved above the circles and layered on top.
- Learn, find, show, and result pages: on phones the board is capped so its top clears the Back, Next, and Upload buttons and its bottom clears the caption. Caption and badge text have pixel minimums.
- Back, Next, and Upload buttons moved from 5% to 7% of screen height on all twelve pages.
- `/yourShoe` was rebuilt entirely. It used fixed pixel sizes that only lined up at one window size. It now matches the car and ball show pages, its playback buttons work, and it swaps background and mascot for Bubbles and Mimmi like the other pages.
- `/car`: its full-screen container had only a minimum height, which made every height-based offset collapse to zero on all screen sizes. Fixed by giving it an explicit height. See section 8.
- `/final`: the Try Again fallback pointed to `/gameselection`, which does not exist. It now goes to `/wonderworld`.

### Garden story (`playing-in-the-garden/`)

- Playback buttons, home and sound buttons, and the two status badges have pixel minimums on phones.
- The banner SVG now stretches to fill its box (`preserveAspectRatio="none"`), so the dark strip reaches both screen edges and the next arrow sits on it, as on desktop.
- Fixed a broken CSS value (`top: 4the eye.5cqh`) that stopped Mimmi's mascot positioning on the final score screen.

### Reports

- On landscape phones the dashboard scrolls instead of squeezing all eight cards into the screen. Stat tiles go two per row, chart cards get a fixed 210px plot area, text has pixel minimums, and the top bar matches the other pages.

### Build fix (already on the branch from the earlier commit)

- `vite.config.js`: the dependency scanner is limited to the root `index.html` and React is deduplicated. Without this, installing the Sheru bot's dependencies caused two copies of React to load and the app crashed on start.

## 7. Still to check

These have not been looked at on a landscape phone yet:

- `/settings`, `/change-password`, `/new-password`
- `/sheru-bot/` in all three states: loading, ready, and in conversation
- Garden emotion-question scenes (scenes 2, 4, 6) and the final score screen
- The Upload Picture modals opened from the learn pages
- The sign-out menu from the top bar door icon
- Every character-aware page as Bubbles and Mimmi

Files not reachable from any route, safe to delete when tidying: `src/component/showCookie.js`, `showShoe.js`, `gameselection.js`, `src/pages/ChildLanguageSetup.tsx`, `ChildCharacterSetup.backup.tsx`.

## 8. Technical notes for whoever continues

- **Container height trap.** Game pages position everything in `cqh` and `cqw` units relative to a full-screen Box with `containerType: "size"`. That Box must have an explicit `height: "100dvh"`. If it only has `minHeight`, size containment makes the query height zero and every `top`/`bottom` in `cqh` collapses to 0. Verified in a headless browser.
- **Per-character layout.** Three background images with very different shapes are used (wide strip for the lion, 3:2 for Bubbles, near-square for Mimmi). `background-size: cover` crops them differently on a 2.2:1 phone, and several pages shift the mascot size and position per character. Test each page three times.
- **Phone rules go last.** In MUI `sx` objects, the `[phoneLandscape]` key is placed after the other media queries so it wins when more than one matches.
- **Settings save race.** `src/pages/SettingsPage.tsx` fills its fields with placeholders ("Abdullah", age 7, lion) and replaces them when the profile loads. Save is not disabled during that gap, so a quick Save can overwrite the real profile with placeholders. Not fixed yet.
- **Dev-only delay.** In development, React Strict Mode plus the Supabase client can hold Supabase requests for up to 5 seconds after a page load (a "lock was not released" warning in the console). The greeting shows "AutiConnects" until the child's name arrives. Production builds do not have this delay.
