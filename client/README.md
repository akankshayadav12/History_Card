
# Institute Admin (HCR) — Vite + React + Tailwind

Beautiful, responsive admin built for a computer institute with **History Card Reports**, **Students**, **Faculties**, and **Courses**.
- Unique, animated UI (Framer Motion), professional look.
- Dark & Light theme toggle (persists).
- Global logo in navbar (replace `src/assets/logo.svg`).
- Search for every entity, date filters, and full CRUD.
- Everything rendered from `App.jsx` per your preference.

## Quick Start

1. **Install** (Node 18+ recommended)
   ```bash
   npm install
   npm run dev
   ```

2. **Backend URL**
   Create `.env` in project root:
   ```bash
   VITE_API_URL=http://localhost:5000
   ```

3. **Endpoints Expected**
   - Courses: `GET/POST /courses`, `GET/PUT/DELETE /courses/:id`
   - Teachers: `GET/POST /teachers`, `GET/PUT/DELETE /teachers/:id`
   - Students: `GET /students`, `POST /students/add`, `GET/PUT/DELETE /students/:id`
   - HCR (History Card): `GET/POST /hcrs`, `GET/PUT/DELETE /hcrs/:id`

   > Your uploaded backend already includes Teachers & Courses. Students routes look commented; HCR controllers exist—just wire routes like above in `Routes/routes.js`.

4. **Branding**
   - Replace `src/assets/logo.svg` with your institute logo (appears on every page).
   - Update title in `index.html` and `Navbar.jsx` if needed.

5. **Build**
   ```bash
   npm run build
   npm run preview
   ```

## Notes
- Tables are simple, fast, and responsive.
- Forms use controlled inputs and modal dialogs.
- Minimal dependencies to keep it lightweight and sellable.
