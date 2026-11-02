# Julklapsspelet

A Secret Santa web app (in Swedish) running at [julklapp.party](https://julklapp.party). Someone creates a game with everyone's names, shares the link, and each person draws who they buy a present for. Nobody ever sees the full list of who drew whom.

Built with SvelteKit and Tailwind, running on Cloudflare Workers with a D1 (SQLite) database.

## How it works

1. **Create a game** on the front page: a title, an admin password and the participants' names (up to 50).
2. **Share the link** `/spel/<id>`. Each person picks their own name and spins the wheel to draw someone. The admin can also copy a personal link for each name.
3. **The draw is remembered in that browser** with a cookie, so the person can come back later and see who they drew. A name can only be drawn once, and nobody can draw themselves.
4. **Admin page** `/spel/<id>/admin`: log in with the password to rename the game, add, rename or remove participants, reset the draw or delete the game.

### Privacy

- The game page only shows names and how many have drawn, never who has drawn or what they got.
- Admin passwords are hashed with PBKDF2. Admin session and browser tokens are stored only as SHA-256 hashes.
- A unique index on `participants.gives_to` prevents two people from drawing the same person, even if they draw at the same moment.

## Project structure

```
src/
  routes/
    +page.svelte / +page.server.ts         create a game
    spel/[id]/                             draw page
    spel/[id]/admin/                       admin page
  lib/
    server/game.ts                         DB access, sessions, draw logic
    server/crypto.ts                       hashing and random tokens
    illustrations/                         SVG art and the spinning wheel
migrations/                                D1 schema (SQL)
wrangler.jsonc                             Worker and D1 config
```

## Developing

```sh
npm install
npx wrangler d1 migrations apply julklapp --local   # create tables in the local DB
npm run dev
```

The local database lives in `.wrangler/` and is git-ignored.

Other scripts:

| Command           | What it does                                                    |
| ----------------- | --------------------------------------------------------------- |
| `npm run check`   | Generate Worker types and type-check                            |
| `npm run lint`    | Prettier and ESLint                                             |
| `npm run format`  | Format with Prettier                                            |
| `npm run gen`     | Regenerate `worker-configuration.d.ts` (git-ignored, generated) |
| `npm run build`   | Production build                                                |
| `npm run preview` | Run the production build locally with Wrangler                  |

## Database changes

Add a new numbered SQL file in `migrations/` (e.g. `0002_something.sql`), then apply it locally:

```sh
npx wrangler d1 migrations apply julklapp --local
```

Production gets it automatically on the next deploy. The new code goes live slightly before the migration runs, so keep migrations compatible with the code that is already running.

## Deploying

Deploys run on Cloudflare Workers Builds, connected to this GitHub repo:

- **Push to `main`** builds and deploys to production with `npm run deploy`, which runs `wrangler deploy` and then applies any new D1 migrations.
- **Other branches** get preview URLs. Previews use the same production database and do not run migrations.

No `database_id` is set in `wrangler.jsonc`: on the first deploy Wrangler creates the `julklapp` D1 database automatically, and later deploys reuse it.
