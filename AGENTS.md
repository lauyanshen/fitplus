# Fit+ migration conventions

- Preserve the existing Fit+ features, age-aware guidance, languages, layout and calculations.
- `app/page.tsx` is shared by the original Sites app and GitHub Pages client.
- Never place OpenAI keys, Sites bypass tokens, cookies or source credentials in frontend code or the repository.
- The GitHub client uses the authenticated `/ai-connect` page at the existing Sites origin. Only `https://lauyanshen.github.io` may use its message channel.
- Keep `app/api/ai/route.ts` server-only. The static bundle must not import it.
- GitHub Pages output is `dist/github-pages` and uses `/fitplus/` by default.
- The original Sites app and its current access permissions remain in place for the AI service. Do not make it public to work around authentication.
- Browser records stay on each origin. Do not copy real profile or health records into fixtures or commits.
