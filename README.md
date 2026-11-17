# Elsewhere

Elsewhere explores how a simple white T-shirt can support personal style. Its
brand promise is: **Express your individuality through everyday clothing while
thinking more carefully about your choices.** The site keeps the existing Sage
and Creator archetypes, Postmodernist direction, and “Less ordinary. More you.”
slogan.

## Explore the project

- **Welcome:** modernist details-first and postmodernist style-first directions.
- **Shop:** the $15 illustrative T-shirt, size and quantity controls, demo bag,
  free styling ideas, and simulated checkout.
- **Our Story:** the purpose and identity behind Elsewhere.
- **Research & Plan:** [three clothing-site comparisons, two positions, user
  stories, and observable checks](public/research.html).
- **[SPEC.md](SPEC.md):** project decisions, research, plan, and evidence.
- **[LEARNING.md](LEARNING.md):** short AI-assisted learning record; review it
  for accuracy before it is shared.

## Run locally

Use **Node.js 24 or newer** and npm. This project uses Node’s built-in SQLite;
it does not need an extra database package.

Install the existing project dependencies:

```powershell
npm ci
```

Start the local site and database-backed demo:

```powershell
npm run dev
```

Open the address printed by the server, normally `http://127.0.0.1:5173/`.
The server prints the SQLite database file location; by default, it is in the
system temporary folder.

### Save an order and find it after restart

1. Open `http://127.0.0.1:5173/shop.html?approach=b`.
2. Choose size **M**, set quantity to **2**, and add it to your bag. The demo
   total should be **$30.00**.
3. Keep the synthetic demo email `demo@example.test` and complete simulated
   checkout. Copy the reference shown in the confirmation.
4. Expand **Demo order history** and find that reference.
5. Stop the server with **Ctrl+C**. Run `npm run dev` again, reload the shop,
   and check the history for the same reference.

To choose a fixed local database file and port in PowerShell, use the same
values whenever you restart:

```powershell
$env:IS117_DEMO_PORT = "4174"
$env:IS117_DEMO_DB = "$env:TEMP\elsewhere-demo-orders.sqlite"
node server.mjs
```

Then open `http://127.0.0.1:4174/shop.html?approach=b`. Stop the server with
**Ctrl+C** when finished. Do not deploy this local teaching server as a public
service.

## Public preview and checkout limits

GitHub Pages serves static files and cannot run this SQLite server. In that
public preview, demo order history is saved in the current browser only. The
shop page labels whether it is using local SQLite or browser-only storage.

Checkout is simulated. The server checks the synthetic email but does not save
it. It calculates the total from the server’s $15 illustrative price and saves
only the demo order reference, size, quantity, total, and timestamp. It does
not take payment, place a real order, create an account, or arrange delivery.
The shirt images are concepts, not product photography; no unverified fabric,
fit, manufacturing, or sustainability claims are made.

## Checks

Run the project checks with:

```powershell
npm run check
```

This checks formatting, HTML/CSS/JavaScript, the local server and SQLite
behavior, and browser flows in Chromium. Automated checks do not replace a
human review of the two approaches, small-screen layout, or the learning
record.
