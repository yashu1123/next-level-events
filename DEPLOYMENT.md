# Run and deploy

## Run locally (PowerShell)

```powershell
cd C:\Users\yaswa\Pictures\events-in\next-level-events
npm run install:ci
npm run dev
```

Open http://localhost:5173. Press `Ctrl+C` to stop.

## Run locally with Docker (PowerShell)

Start Docker Desktop first. Stop the development server to free port 5173.

```powershell
cd C:\Users\yaswa\Pictures\events-in\next-level-events
$env:PORT = "5173"
docker compose up -d --build
docker compose ps
```

Open http://localhost:5173.

To stop:

```powershell
docker compose down
```

## Push changes (PowerShell)

The deployment branch is `backup`.

```powershell
git status --short
git add DEPLOYMENT.md README.md
git commit -m "Update run and deploy commands"
git push origin backup
```

For website updates, add the changed source files before committing too.

## First server deployment

Requires Docker and Docker Compose installed on the server.

```bash
ssh yashu@178.236.185.36
sudo -i
cd /opt
git clone --branch backup https://github.com/yashu1123/next-level-events.git
cd /opt/next-level-events

# Create the server port mapping without editing the tracked Compose file.
sed 's/127.0.0.1:${PORT:-3000}:3000/0.0.0.0:5173:3000/' compose.yaml > compose.server.yaml
grep -qxF '/compose.server.yaml' .git/info/exclude || echo '/compose.server.yaml' >> .git/info/exclude

docker compose -f compose.server.yaml up -d --build --remove-orphans
docker compose -f compose.server.yaml ps
```

Open http://178.236.185.36:5173. Allow inbound TCP 5173 in your hosting provider's firewall if needed. This runs the Worker with local database/storage emulation over HTTP.

## Deploy updates

Push your changes first, then run:

```bash
ssh yashu@178.236.185.36
sudo -i
cd /opt/next-level-events

git status --short
git pull --ff-only origin backup
sed 's/127.0.0.1:${PORT:-3000}:3000/0.0.0.0:5173:3000/' compose.yaml > compose.server.yaml

docker compose -f compose.server.yaml up -d --build --remove-orphans
docker compose -f compose.server.yaml ps
```

## Verify on the server

```bash
curl -fsS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:5173/
docker compose -f compose.server.yaml logs --tail=100 app
```

The HTTP status should be `200`.

## Restart or stop on the server

Run from `/opt/next-level-events`:

```bash
# Restart
docker compose -f compose.server.yaml restart app

# Stop, keeping database and uploaded files
docker compose -f compose.server.yaml down
```
