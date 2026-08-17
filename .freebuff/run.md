# Truckify — dev server run doc

## Reproduce artifacts
No `.env.local` or other secret/config files are required. `npm install` is the only setup step (dependencies are tracked in `package-lock.json`).

## Run the server
```bash
npm run dev
```

- Default port is **3000**. If it is taken, Next.js auto-increments (e.g. 3001, 54380) — pass `-- -p 3000` to pin it:
  ```bash
  npm run dev -- -p 3000
  ```
- Detach on Windows (PowerShell), stdout/stderr to separate files:
  ```powershell
  (Start-Process -FilePath 'npm.cmd' -ArgumentList 'run','dev','--','-p','3000' -RedirectStandardOutput '.freebuff\preview.log' -RedirectStandardError '.freebuff\preview.log.err' -WindowStyle Hidden -PassThru).Id
  ```
- Verify: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/` should print `200`.

## Notes
- `next.config.ts` sets `allowedDevOrigins: ["192.168.0.109"]` so dev/HMR works when the site is opened over the local network (Next blocks cross-origin dev resources by default; without this the page can wedge on its loading fallback).
- All app state is client-side (localStorage key `truckify-state-v1`); no backend or external credentials needed.
