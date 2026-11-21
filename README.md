# Ptah official website

Static source for the Ptah official website. The deployment output is `public/`.

This repository is intentionally separate from Ptah's application-development repository. It contains only public website files.

## Cloudflare Pages

- Production branch: `main`
- Build command: none
- Build output directory: `public`
- Production URL: `https://ptah-official.pages.dev/`
- Deployment trigger: every push to `main`
- Build configuration is maintained in Cloudflare Pages; the site is built from the `public/` directory without a build command.
- Visitor counters use a Pages Function and the D1 database `ptah-visits`.
- The D1 binding name is `PTAH_VISITS`; `wrangler.toml` records the non-secret binding configuration.

## Updating the site

1. Edit files under `public/`.
2. Preview locally with `python3 -m http.server 8788 --directory public`.
3. Verify the desktop and mobile rendering, links, icons, `robots.txt`, `sitemap.xml`, `llms.txt`, and `llms-full.txt`.
4. Commit on `main` and push:

```sh
git add public
git commit -m "site: update public website"
git push origin main
```

Cloudflare Pages deploys the `main` commit automatically. The `public/` directory is the only deployment source.

## Visitor counting

The homepage counts one estimated human visit per 24-hour first-party cookie window.
It separately counts requests whose User-Agent explicitly matches a known AI
crawler or agent. Generic analytics bots are excluded. The implementation stores
only aggregate `human` and `ai` totals in D1; it does not store IP addresses,
identifiers, request paths, or browsing history.

The AI value is a heuristic request count, not a guarantee that a particular
visitor was an AI.

## Source provenance

The initial site was copied from the reviewed `039bdm-public-site` site target:

- Site target SHA: `03b5d10418f9112477b743c6d496e4d67e6dce91`
- Internal evidence and release ZIP files were intentionally excluded.
