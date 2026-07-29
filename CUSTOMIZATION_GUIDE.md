# Birthday Surprise App Customization Guide 🎂

This guide lists exactly which files and lines you need to modify to customize the texts, names, pictures, and music for each section/page of the birthday microsite.

---

## 📂 Quick Asset Locations

* **🎵 Music Files:** Save your `.mp3` songs inside `/public/audio/`.
* **📸 Custom Photos:** You can create a folder called `images` inside `/public/` (e.g. `/public/images/`) and place your photos there. In code, reference them as `/images/filename.jpg`.
* **📄 Central Content File:** Most page text and details are defined in [src/constants/content.ts](file:///Users/anmol/birthday/src/constants/content.ts).

---

## 📖 Customization by Screen

### 1. Browser Tab / SEO Title
* **Path:** [src/app/layout.tsx](file:///Users/anmol/birthday/src/app/layout.tsx)
* **Lines to Customize:**
  * **Line 18:** `title` (What appears in the browser tab)
  * **Line 19:** `description` (Search engine/preview text)

---

### 2. Screen 1: The Envelope Cover
* **Path:** [src/components/Section1Envelope.tsx](file:///Users/anmol/birthday/src/components/Section1Envelope.tsx)
* **Lines to Customize:**
  * **Line 46:** Header text above envelope (currently `"A little something for you, Priya 💌"`)
  * **Line 73:** Written note on the card inside (currently `"For Priya"`)

---

### 3. Screen 2: The Music & Intro Card
This is the card that flips open and plays background tracks.
* **Paths:**
  * **Name on Card Flap:** [src/components/Section2Card.tsx](file:///Users/anmol/birthday/src/components/Section2Card.tsx) (Line 90: change `"Anmol"` to your name).
  * **Text/Wishes inside Card:** [src/constants/content.ts](file:///Users/anmol/birthday/src/constants/content.ts)
    * **Line 24:** `title` (e.g., `"Happy Birthday, Priya! 🎂"`)
    * **Line 25:** `subtitle` (e.g., `"A special melody and message for you..."`)
    * **Line 26:** `message` (The paragraph text shown next to the music player)
  * **Audio Tracks:** [src/constants/content.ts](file:///Users/anmol/birthday/src/constants/content.ts)
    * **Lines 36-44:** `songs` array (Add or edit song titles, artists, and their relative path from the `public/` directory).

---

### 4. Screen 3: Polaroid Gallery
A scattering of polaroid pictures that can be dragged and examined.
* **Path:** [src/constants/content.ts](file:///Users/anmol/birthday/src/constants/content.ts)
* **Lines to Customize:**
  * **Lines 46-83 (`GALLERY_PHOTOS`):**
    * Edit the `imageUrl` to use your custom image path (e.g., `"/images/my-gallery-1.jpg"`) or a web URL.
    * Edit the `caption` (the handwritten note at the bottom of the Polaroid).

---

### 5. Screen 4: Wishing Cards (Interactive Grid)
Four clickable cards that flip to reveal specific wishes.
* **Path:** [src/constants/content.ts](file:///Users/anmol/birthday/src/constants/content.ts)
* **Lines to Customize:**
  * **Lines 85-110 (`WISH_CARDS`):**
    * Change `frontText` (currently `"Tap to reveal a wish"`)
    * Change `backText` to your custom birthday wishes.
    * You can change the `icon` to `'heart'`, `'star'`, `'flower'`, or `'sparkle'`.

---

### 6. Screen 5: The Birthday Cake (Blow the Candles)
An interactive 3D-like birthday cake where the user pops balloons and blows out candles.
* **Path:** [src/components/Section5Cake.tsx](file:///Users/anmol/birthday/src/components/Section5Cake.tsx)
* **Lines to Customize:**
  * **Line 150:** Headline (currently `"Make a Wish 🎂"`)
  * **Line 153:** Instructions text below the headline.
  * **Line 257:** Candle blow button text.
  * **Line 265:** Success banner text (currently `"Yay! Make a wish ✨"`)
  * **Line 272:** Next step button text (currently `"Read your letter"`).

---

### 7. Screen 6: "10 Reasons I Love You" (Scrolling Cards)
A list of reasons why you love them.
* **Path:** [src/constants/content.ts](file:///Users/anmol/birthday/src/constants/content.ts)
* **Lines to Customize:**
  * **Lines 112-123 (`REASONS_I_LOVE_YOU`):**
    * Customize the array of text items with your own personal reasons.

---

### 8. Screen 7: Our Timeline (Milestones)
A chronological journey showing key milestones of your relationship.
* **Path:** [src/constants/content.ts](file:///Users/anmol/birthday/src/constants/content.ts)
* **Lines to Customize:**
  * **Lines 125-154 (`TIMELINE_MILESTONES`):**
    * Edit `date` (e.g., `"August 14, 2024"`)
    * Edit `title` (e.g., `"The Day We Met ☕"`)
    * Edit `description` of the milestone.
    * Edit `imageUrl` to use a custom photo path.

---

### 9. Screen 8: The Final Letter
A beautiful letter format with an envelope theme.
* **Path:** [src/constants/content.ts](file:///Users/anmol/birthday/src/constants/content.ts)
* **Lines to Customize:**
  * **Lines 156-165 (`LETTER_CONTENT`):**
    * `heading`: Letter salutation (e.g., `"Dearest Priya,"`)
    * `paragraphs`: Array of paragraphs containing the letter's main body.
    * `closing`: Letter sign-off (e.g., `"With all my love,"`)
    * `sender`: Your name (e.g., `"Anmol ❤️"`)

---

### 10. Vintage Voice Notes Tape Player (`/voicenotes`)
A standalone retro 80s cassette tape deck player and live microphone recorder.
* **Path:** [src/constants/content.ts](file:///Users/anmol/birthday/src/constants/content.ts)
* **Lines to Customize:**
  * **`VOICE_NOTES` Array:** Add/edit custom audio files, handwritten notes, cassette color gradients, dates, and durations.
* **Path:** [src/components/VintageTapePlayer.tsx](file:///Users/anmol/birthday/src/components/VintageTapePlayer.tsx)
  * Custom cassette deck controls, mechanical sound synthesis, dual spinning spools, analog VU meters, and live `MediaRecorder` voice recording.

