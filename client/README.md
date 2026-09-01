# DriveOn frontend

A complete Vite + React frontend for the car-rental API in `../server`.

## Run locally

```bash
cd client
npm install
npm run dev
```

The Vite development server proxies `/api` requests to `http://localhost:3000`, matching the `PORT=3000` in the supplied server `.env`. Start the API separately with:

```bash
cd server
npm run server
```

For a separately deployed API, set `VITE_API_URL` to the API base URL including `/api`, for example:

```bash
VITE_API_URL=https://api.example.com/api
```

To use a different local API port, start Vite with a matching proxy target:

```bash
VITE_API_PROXY_TARGET=http://localhost:10000 npm run dev
```

## Included routes

The client includes the public discovery, car detail, booking, compare, marketing, support, authentication, customer account, host, admin, receipt, legal and not-found screens shown in the supplied page list. Shared UI lives in `src/components`, sample data is isolated in `src/data/cars.js`, and API calls are prepared in `src/services/api.js`.
