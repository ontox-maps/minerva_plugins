# Changelog

## 1.3.0 (2026-11-19)

Security, MINERVA 22 and layout corrections, aligned with the KE Methods Mapper 1.8.1 and DNT-IVB mapping 0.5.1 plugins.

- Security: the Google API key is removed; the sheet is read through the keyless gviz export (`headers=1`, so all-text sheets keep their column names). The key committed in earlier versions must be revoked in Google Cloud Console.
- Security: every sheet value is HTML-escaped; links are built only from valid values (DOIs) and open with `noopener noreferrer`; event handlers are bound to the plugin's own elements.
- MINERVA 22: elements from `minerva.elements.data.getAll()`, otherwise the new API per map; the deprecated `api/.../models/*/bioEntities/elements/` endpoint is no longer called. No request is made with no project open.
- Markers: one marker per element; only the plugin's own markers are removed. Clean leaves the map without tags.
- Unload: markers, container, styles, timers, pending requests and listeners are removed, including before the data has loaded.
- Layout: same visual identity as the DNT-IVB mapping plugin with the DNT-IVB mapping palette (accent `#2563eb`, map pin `#d6336c`); search, dropdown filters, live tally, compact expandable rows, green/red mapping dots, row click opens the submap and zooms.
- Mapping: every copy of an entity drawn several times on the map is tagged.
- Folder renamed from `ONTOX_OligDev` to `Neurotox_Data_Mapper`. New load URL: `https://raw.githubusercontent.com/ontox-maps/minerva_plugins/main/Neurotox_Data_Mapper/plugin.js` (on the repository's `main` branch). The old `.../master/ONTOX_OligDev/plugin.js` URL stops working once the old folder is removed, so the plugin must be registered again in MINERVA with the new URL.
- Packaging: independent plugin folder with its own `package.json`, `package-lock.json`, `babel.config.js`, `LICENSE` (MIT) and `CHANGELOG.md`; `minervaAPI.js`, generated CSS and the repository-wide `Licence.md` are no longer used.

## 1.2.0

- Sheets API v4 fetch with an API key.
