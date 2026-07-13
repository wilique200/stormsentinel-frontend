# StormSentinel AI — Frontend

Next.js frontend for StormSentinel v2. Consumes the FastAPI backend.

## Status

**Done:** project foundation — config, Tailwind design tokens (the 7 hazard
colors + threat scale as real tokens, not scattered hex values), typed API
client, auth context, React Query provider, root layout.

**Next:** login/signup pages, the main dashboard (search + hazard cards +
canvas animations, ported from the Streamlit version), saved locations,
history charts, chat interface.

## Setup

```bash
npm install
cp .env.example .env.local   # point NEXT_PUBLIC_API_URL at your Render backend
npm run dev
```

Visit `http://localhost:3000`.

## Design system

Colors and fonts are defined once in `tailwind.config.js` under `hazard.*`
and `threat.*` — every component should reference `text-hazard-wildfire`,
`bg-threat-elevated`, etc. rather than hardcoding hex values, so the palette
stays consistent and changeable from one place.

## Structure

```
app/
├── layout.tsx       # root layout — wraps everything in providers
├── page.tsx          # redirects to /login for now
├── globals.css        # Tailwind + font imports + scan-line effect
├── login/              # [next]
├── signup/              # [next]
└── dashboard/             # [next] — the main hazard dashboard

context/
├── AuthContext.tsx    # session management, login/signup/logout
└── QueryProvider.tsx   # React Query setup

lib/
└── api.ts               # typed API client — all backend calls go through here
```
