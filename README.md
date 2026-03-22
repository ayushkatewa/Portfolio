# Ayush Katewa - Full Stack Developer Portfolio

A premium, Awwwards-winning developer portfolio built with React, Vite, and GSAP. Designed with an ultra-minimalist, monochromatic bento-box aesthetic inspired by top-tier engineering showcases.

## 🚀 Live Tech Stack
- **Framework:** React + Vite
- **Styling:** Pure Vanilla CSS (Variables, Grid, Bento Layouts)
- **Animation Engine:** GSAP (ScrollTrigger)
- **Typography:** `Inter` (Sans-serif, Apple-style clean typography)

## ✨ Premium Micro-Interactions & Animations

This portfolio avoids heavy 3D WebGL libraries in favor of lightning-fast, highly polished DOM micro-interactions:

### 1. The Entrance
- **Cinematic 0-100% Preloader:** A sleek, dark loading screen that counts up to 100% before dramatically sliding up and out of the way to unveil the website.
- **Cascading GSAP Fade-Up:** As soon as the preloader lifts, the Hero section elements elegantly fade and slide up into view one after the other.

### 2. The Hero Section
- **Infinite Rolling Roles:** The subtitle under the header smoothly fades in and glides out every 2.5 seconds, continuously typing through core titles *(C++ Specialist, Full Stack Developer, etc.)*.

### 3. Navigation & Scrolling
- **Horizontal Scroll Progress Bar:** A razor-thin, glowing white line affixed perfectly to the top edge of the browser. It fills up horizontally as the user scrolls deeper into the portfolio.
- **Scroll-Triggered Reveals:** As the user scrolls down the page, every newly visible section (Projects, Skills, Explore) elegantly triggers a GSAP fade-up animation into view.

### 4. Custom Trailing Cursor
- **Fluid Geometry:** The default mouse is hidden and replaced by a sharp, responsive center dot and a smooth trailing, physics-based outer ring.
- **Magnetic Snap State:** Whenever hovering over an interactable element (like Projects, Bento Cards, or Skill Chips), the cursor ring expands, turns into a translucent highlight, and magnetically "snaps" to the element.

### 5. Hover Micro-Interactions
- **Matrix Text Scrambling:** Hovering over any Project title (`Air Quality Tracker`, `CPU Scheduler`) scrambles the text into rapid, random alphabetical characters before mathematically resolving back to the real title.
- **Card Scaling:** Hovering over any Bento Card slightly scales it up towards the user, making the interface feel physical and responsive. 
- **Arrow Sliding Insights:** The sleek icons in the final "More to Explore" section smoothly glide diagonally upwards when hovering their respective cards.

## 📦 How to Run Local Development Server

1. Ensure you have [Node.js](https://nodejs.org/) installed.
2. Clone this repository.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`.

---
*Developed by Ayush Katewa.*
