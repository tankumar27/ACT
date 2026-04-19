# ACT Forge

ACT Forge is a Next.js ACT learning site with:

- an updated furnished landing page focused on ACT prep
- dedicated Math, Science, English, and Reading section pages
- a practice page with instant answer checking
- an AI clarification route for missed questions
- a Gemini-backed chatbot that is restricted to a local knowledge file

## Local Review

Run the development server from this folder:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Useful routes:

- `/`
- `/practice`
- `/chat`
- `/subjects/math`
- `/subjects/science`
- `/subjects/english`
- `/subjects/reading`
- `/review/english-transition?answer=A`

## AI Knowledge Source

The chatbot reads from:

```txt
data/act-knowledge.txt
```

Update that file later to change what the AI is allowed to use.

The server-side API route is:

```txt
app/api/act-chat/route.ts
```

The Gemini key is expected in:

```txt
.env.local
```

using:

```txt
GEMINI_API_KEY=your_key_here
```

## Verification

- `npm run lint` passes
- `npx tsc --noEmit` passes

Production build currently hits a Next.js framework prerender bug in this workspace, but local dev review on `localhost:3000` is the intended path for checking the UI.
