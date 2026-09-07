# Move Forward Zambia

A React + Node campaign landing page concept for a Zambian digital inclusion grant.

## Structure

- `frontend/` - Vite + React user interface
- `backend/` - Express API for the eligibility check

## Run locally

```bash
npm install
npm run dev
```

Frontend: http://localhost:5173  
API: http://localhost:4000

This campaign concept is not an official World Bank, MTN, Airtel, or Zamtel website. The eligibility endpoint is intentionally in-memory and does not persist personal data.

## Telegram notifications

The backend can send an admin notification after an eligibility request. Configure the variables in `backend/.env.example` privately; never commit the real values.

## Deploy

### Backend on Render

1. Create a new Render Web Service from this repository.
2. Set the root directory to `backend`.
3. Use `npm install` as the build command and `npm start` as the start command.
4. Add `TELEGRAM_BOT_TOKEN` and `TELEGRAM_ADMIN_CHAT_ID` as secret environment variables.
5. Deploy and verify `https://YOUR-RENDER-SERVICE.onrender.com/api/health` returns JSON with `status: "ok"`.

The repository also includes `render.yaml`, which can be used with Render Blueprint deployment.

### Frontend on Vercel

1. Import this repository into Vercel.
2. Set the project root directory to `frontend`.
3. Vercel will detect Vite; use `npm run build` as the build command and `dist` as the output directory.
4. Add `VITE_API_URL` with the deployed Render URL, for example `https://YOUR-RENDER-SERVICE.onrender.com`.
5. Redeploy after saving the environment variable.

For local development, copy `frontend/.env.example` to `frontend/.env` and keep `VITE_API_URL=http://localhost:4000`. The Vite development proxy continues to support `npm run dev`.
