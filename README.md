# fullStackProject

## Requirements

- Node.js 22.12 or newer (the project uses Vite 8 and `better-sqlite3`)
- npm

## Launch the app

1. Open a terminal in the project folder.
2. Install dependencies for the root scripts, frontend, and backend:

```sh
npm ci
npm ci --prefix client
npm ci --prefix server
```

You only need to install dependencies the first time, or again after a dependency
change. If a lockfile has intentionally changed, `npm install` (with the same
directories) updates it; `npm ci` installs exactly what the lockfiles specify.

3. Start the frontend and API together from the project folder:

```sh
npm run dev
```

4. Open the local frontend URL printed by Vite in your browser. It is usually
   `http://localhost:5173`.
5. Use the app. The frontend sends `/api` requests through Vite to the API on
   `http://localhost:3000`; the root `npm run dev` command starts both services.
6. To stop both services, press `Ctrl+C` in the terminal running them.

The server creates `server/events.sqlite` and seeds the sample events the first
time it starts. That database is local and is not included in Git.

If startup fails because a port is already in use, stop the other process using
that port and run `npm run dev` again. The API defaults to port 3000, and Vite
prints the frontend URL it actually uses.
