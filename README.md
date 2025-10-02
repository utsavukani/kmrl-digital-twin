# Digital Twin Prototype — README

> **Project**: KMRL (Kerala Metro) Digital Twin — prototype

---

## 🔎 Project overview

This repository contains a lightweight interactive prototype for a **digital twin** of a metro system (KMRL). It combines a small static web UI (`index.html`, `app.js`, `style.css`) with dataset(s) and helper scripts (`kmrl_digital_twin.json`, `script.py`) used to prepare / ingest the metro network data. The goal of this README is to make it dead-simple to run, extend, and reuse the prototype for demos or further development.

Key capabilities included in this prototype:

* Static web visualization (HTML + JS) for viewing the network and station metadata.
* JSON dataset describing stations/segments and meta information.
* A Python helper script for generating / transforming the JSON used by the front-end.

---

## 🚀 Quickstart — run the demo locally

There are two simple ways to run the demo depending on whether you want a lightweight static server or to inspect/transform the JSON with Python.

### Option A — Open in browser (quickest)

1. Unzip `digital_twin/` and open `digital_twin/index.html` in your browser.
2. The page should load `app.js` and display the simple interactive map / network UI.

> If the browser blocks local file requests (CORS) or assets do not load, use the static server method below.

### Option B — Serve locally with Python (recommended)

From the folder that contains `digital_twin/` run:

```bash
# Python 3
cd digital_twin
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

### Option C — Serve with Node (if you prefer)

If you have Node installed you can run a quick static server:

```bash
npx http-server digital_twin -p 8000
# open http://localhost:8000
```

---

## 🧩 What’s in this repository (file map)

```
digital_twin/
├─ .git/                     # git metadata (not required to run)
├─ index.html                # main HTML page for the demo
├─ app.js                    # frontend JS logic
├─ app_1.js                  # alternate/legacy frontend script
├─ style.css                 # styles for the demo UI
├─ kmrl_digital_twin.json    # primary JSON dataset used by the frontend
├─ kmrl-digital-twin.zip.zip # nested zip (probably packaged dataset)
├─ script.py                 # Python helper script to create/transform JSON
└─ README.md                 # (this file)
```

> Note: the repository contains a `.git/` folder. That can be removed for distribution if you are sending the prototype as a package.

---

## 🔧 Prerequisites

* A modern browser (Chrome / Firefox / Edge)
* Python 3.x (if you want to run `script.py` or use the `http.server` method)
* Optional: Node.js/npm if you want to use `http-server` or extend the JS toolchain

---

## 🏃 How to use the Python helper (script.py)

`script.py` appears to assemble and/or export the JSON used by the frontend. Typical flows:

```bash
# run the script (make sure you are inside the digital_twin folder)
cd digital_twin
python script.py
```

What it does (based on the prototype):

* reads station/segment metadata (or assembles them inline)
* writes a `kmrl_digital_twin.json` file with `meta` and `stations` / network entries

If you want to inspect the JSON structure quickly from shell:

```bash
python -c "import json; print(json.dumps(json.load(open('kmrl_digital_twin.json')), indent=2)[:2000])"
```

---

## 📄 Dataset format (observed)

The dataset `kmrl_digital_twin.json` uses a JSON object with a `meta` section and a list of station/network entries. Observed fields (examples) include:

* `meta.version` — dataset version (e.g., `1.0`)
* `meta.last_updated` — ISO timestamp of last update
* `meta.height` — example numeric property (e.g., tunnel/platform height)
* Entries (per station) such as:

  * `id` — numeric station id
  * `name` — station name (e.g., "Kaloor")
  * `code` — short station code (e.g., "KLR")
  * `chainage` — distance/chainage along line
  * `lat` / `lon` — approximate coordinates

> Tip: open the JSON in an editor or Jupyter notebook to inspect and validate the coordinate system and fields before importing into other tools.

---

## 🧪 Frontend notes

* `index.html` loads either `app.js` or `app_1.js`. `app_1.js` appears to be an alternate or earlier version — check which file `index.html` references by default.
* The frontend expects `kmrl_digital_twin.json` to be reachable from the same folder (same-origin). If running a server, ensure both files are in the served directory.
* The UI uses plain JS + HTML/CSS (no build step required). This makes it easy to extend or port into a React/Leaflet/Mapbox-based visualization later.

---

## 🛠 Development & extension ideas

Here are clean ways to evolve the prototype into a production-ready digital twin:

1. **Replace static coordinates with a proper geospatial layer** — use Leaflet or Mapbox GL to show stations and lines on a real map.
2. **Add time-series telemetry** — model vehicle positions, dwell times and energy/consumption metrics and feed them via a WebSocket for live updates.
3. **Split data into modules** — separate `stations.json`, `lines.json`, `assets.json` for clearer ingestion.
4. **Add a small backend** — Node/Flask app to serve data, run simulations and provide an API for telemetry and historic queries.
5. **Add validation & schema** — create a JSON Schema to validate the dataset and a small CLI to validate files before use.

---

## ✅ Common tasks & commands

* Serve locally: `python -m http.server 8000` (open `http://localhost:8000`)
* Pretty-print JSON: `python -m json.tool kmrl_digital_twin.json`
* Inspect the Python script: `less script.py` or open in VS Code
* Unpack nested zip: `unzip "kmrl-digital-twin.zip.zip" -d extracted_data`

---

## 🐞 Troubleshooting

* **Blank page / network errors**: serve the folder via `http.server` instead of opening `file://`.
* **JSON not loading**: open browser DevTools → Network and ensure `kmrl_digital_twin.json` returns `200` and valid JSON.
* **Coordinates incorrect**: confirm whether lat/lon are decimal degrees and whether the front-end expects `[lat, lon]` vs `[lon, lat]`.
