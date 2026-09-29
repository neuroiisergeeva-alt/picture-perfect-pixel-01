<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules

- Landing sections live in `src/components/landing/*` and are composed only in
  `src/routes/index.tsx` — keeps the single-page site readable and reorderable.
- Editable content (products, project gallery) lives in `src/data/catalog.ts`;
  contacts and the expert's name live in `src/config/site.ts` — so the owner's
  data can be updated in one place without touching markup.
- Scroll reveal animations use `src/hooks/use-reveal.ts` via the `Reveal`
  wrapper; no animation library is installed.

- The consultant chatbot streams from `src/routes/api/chat.ts` (logic and prompt in `src/lib/chat.server.ts`) and saves leads to the `leads` table via a server-side tool, so the AI key and lead data stay on the server.
