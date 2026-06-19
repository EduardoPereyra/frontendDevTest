# Mobile Store - ITX Frontend Test

Single-page mobile-device catalogue built with Angular 22. It implements the two
required views (PLP and PDP), real-time filtering, product configuration, cart
count persistence and a one-hour client-side API cache.

## Requirements

- Node.js `^22.22.3`, `^24.15.0` or `>=26.0.0`
- npm 11+

Angular 22.0.2 does not support Node 24.13 or 24.14. Check the active runtime
with `node --version` before installing dependencies.

## Commands

```bash
npm install
npm start
npm run build
npm test
npm run lint
```

The development server runs at <http://localhost:4200>.

## Architecture

The code is organised by responsibility:

- `core/api`: typed HTTP boundary and API integration.
- `core/cache`: generic localStorage cache with one-hour TTL and safe fallback.
- `core/cart`: signal-based cart state persisted between routes and reloads.
- `core/models`: immutable API contracts.
- `features`: lazy-loaded product list and product detail screens.
- `shared`: reusable presentational components.

The app uses standalone components, signal-based local state, typed reactive
forms, `OnPush` change detection, native control flow and lazy routes. API
responses are cached at the service boundary, keeping caching concerns away
from UI components.

## Product decisions

- Filtering is immediate and case-insensitive across brand and model.
- Empty prices are rendered as "Price on request" instead of malformed currency.
- Loading, error, retry, empty-search and image-failure states are explicit.
- The first storage and colour values are selected by default, including
  single-option products.
- The cart badge consumes the count returned by `POST /api/cart` and persists it
  in localStorage.
- Responsive grids never exceed four products per row.
- Keyboard focus, semantic landmarks, live regions, reduced motion and a skip
  link are included for accessibility.

## API

The application consumes:

- `GET https://itx-frontend-test.onrender.com/api/product`
- `GET https://itx-frontend-test.onrender.com/api/product/:id`
- `POST https://itx-frontend-test.onrender.com/api/cart`

## Suggested commit history

For an evolutionary public repository, split the work into these milestones:

1. `chore: scaffold Angular 22 application`
2. `feat: add typed product API and expiring cache`
3. `feat: implement responsive product catalogue and search`
4. `feat: implement product detail and cart flow`
5. `test: cover cache and critical user flows`
6. `docs: document architecture and delivery decisions`
