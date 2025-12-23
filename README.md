
# EmpowerHer — React (Vite) Frontend

This is a smooth, responsive React frontend inspired by the EmpowerHer app.

## Prerequisites
- Node.js 18+ and npm

## Getting Started
```bash
npm install
npm run dev
```
The dev server opens at http://localhost:5173

## Production Build
```bash
npm run build
npm run preview
```

## Structure
- `src/components` — UI components (Navbar, Hero, Features, Programs, Testimonials, CTA, Footer)
- `src/styles.css` — global styles
- `src/assets` — SVG assets


---
## Troubleshooting (Windows / npm ERESOLVE)

1) Ensure Node.js version is 18 or 20 (LTS):
   ```powershell
   node -v
   ```
   If you are on Node 22+, consider switching to Node 20 LTS (use nvm-windows).

2) Clean install:
   ```powershell
   rd /s /q node_modules 2>$null
   del package-lock.json 2>$null
   npm cache clean --force
   npm install
   ```

3) If you still see `ERESOLVE`:
   ```powershell
   npm install --legacy-peer-deps
   ```

4) Start dev server:
   ```powershell
   npm run dev
   ```


---
## Windows + Node 22 network install tips

If you see `ECONNRESET` during `npm install`, try:
1. Use the project `.npmrc` (already included) which points to a stable mirror.
2. If still failing, run these and retry:
   ```powershell
   npm config set registry https://registry.npmmirror.com/
   npm config set fetch-timeout 600000
   npm config set fetch-retries 3
   npm cache clean --force
   npm install
   ```
3. If you're behind a proxy, configure it:
   ```powershell
   npm config set proxy http://USER:PASS@HOST:PORT
   npm config set https-proxy http://USER:PASS@HOST:PORT
   ```
4. Last resort (corporate SSL interception):
   ```powershell
   npm config set strict-ssl false
   ```
   Re-enable later with `npm config set strict-ssl true`.
