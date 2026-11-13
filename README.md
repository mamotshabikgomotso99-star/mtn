# MTN South Africa storefront

React, TypeScript and Tailwind storefront using MTN's official promotions GraphQL catalogue and Brighter Sans brand font.

## Run locally

- `npm install`
- `npm run dev`
- `npm run build`
- `npm start` (serves the production build on port 4173; set `PORT` to change it)

The promotions API requires authorized access. Set `MTN_CATALOG_TOKEN` in the server environment to a token supplied for an approved MTN integration. The token stays server-side and is never embedded in the browser bundle. Do not commit it or use a `VITE_` variable for it.

For example, in PowerShell before starting the development server:

```powershell
$env:MTN_CATALOG_TOKEN = '<authorized-token>'
npm run dev
```

The catalogue is cached server-side for 10 minutes to avoid querying MTN on every visitor request. Without an authorized token, the page displays the connection status and links to MTN's official promotions catalogue; it does not substitute sample prices or products.
