# Docker / Nginx deploy — instructions (NOT TESTED in this sandbox)

From CHerakoi root:

```bash
docker compose up --build -d
# Open http://localhost:8080
docker compose logs -f cherakoi
docker compose down
```

No Node builder: this Docker image copies only the static HTML/CSS/JS into `nginx:1.27-alpine`.

For use from another computer or an institutional domain, use a TLS-enabled reverse proxy. **Camera permission requires HTTPS** on non-localhost origins; `http://remote-host:8080` will generally not work. The app requests pinned CDNs and the HandLandmarker model on the browser side; permit those URLs through network policies or vendor assets for offline operation. A dedicated TLS/CSP/telemetry review is required before public deployment.
