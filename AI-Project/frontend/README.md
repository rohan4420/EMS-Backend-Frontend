# Make My Marriage frontend

Responsive Angular application scaffold for the Make My Marriage V1. It uses
standalone components, Angular Router, HttpClient, RxJS, strict TypeScript, and
the approved single-wedding product scope. Feature routes are placeholders;
authentication and wedding workflows are not implemented.

## Requirements

- Node.js `^22.22.3 || ^24.15.0 || >=26.0.0` (required by Angular 22)
- npm

Angular CLI: `22.2.5`  
Angular framework: `22.2.x`  
TypeScript: `~6.0.2` (installed `6.0.3`)

## Run locally

```powershell
npm install
npm start
```

Open `http://localhost:4200`. The development server proxies `/api` requests
to `http://localhost:8080`, the conventional local Spring Boot address. Update
`proxy.conf.json` if the backend uses another port.

## Validate

```powershell
npm run build
npm test -- --watch=false
```

No lint tool is configured in this scaffold.

## Configuration and structure

- `src/environments/` contains non-secret API configuration. The production
  build replaces `environment.ts` with `environment.production.ts`.
- `src/app/core/` contains auth/guard scaffolding, API models and services,
  plus loading and API-error interceptors.
- `src/app/shared/` contains reusable empty, loading and error states.
- `src/app/layouts/` contains separate public and organizer layouts.
- `src/app/features/placeholder-page/` provides the route-aware placeholder
  used by the initial public and organizer routes.
- `public/` is the Angular CLI static asset directory.

API calls use the documented `/api/v1` base path. Set the deployment API URL
in the appropriate environment file; do not put credentials or secrets in
frontend configuration.

The approved Stitch wireframes were not present in the repository, so the
initial shell uses a restrained burgundy palette as a temporary visual
baseline. Replace it with the approved wireframes when they are available.
