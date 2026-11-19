# Neurotox Data Mapper

MINERVA plugin, version 1.3.0. It loads a Google Sheet of disease evidence on entities of oligodendrocyte development and tags the corresponding elements of the ONTOX oligodendrocyte development map.

Load URL: <https://raw.githubusercontent.com/ontox-maps/minerva_plugins/main/Neurotox_Data_Mapper/plugin.js>

## Features

Same layout and features as the DNT-IVB mapping and KE Methods Mapper plugins, with the DNT-IVB mapping palette (accent `#2563eb`, stripe `#f1f5f9`, hover `#e8f0fe`, selected `#dbe7ff`, map pin `#d6336c`):

-   Data read from a public Google Sheet with the keyless Google Visualization (gviz) export; no API key.
-   Free-text search across all columns and dropdown filters, with a live tally of rows shown and mapped.
-   Compact table with a per-row detail panel, so no horizontal scrolling; columns added to the sheet
    appear in the detail panel automatically.
-   Green dot = row mapped to the map, red dot = not mapped (hover shows "Mapped" / "Not mapped").
-   Row click tags the element(s), opens the submap and zooms to them; search and filters update the tags.
-   "Access data" opens the Google Sheet; "Clean" resets search and filters and removes the plugin's tags.

## Configuration

-   **Google Sheet**: `1vF6tjvZdAThAq9NRxirWmjdL7ouFu3MNWkG6CGqdMfg`, tab `Data`, first row = column names. The sheet must be shared
    as "anyone with the link can view".
-   **Mapping**: `Entity`, matched against the element name (case- and whitespace-insensitive).
    An entity drawn several times on the map is tagged at every copy; a row click zooms to all of
    them. Rows whose entity is not on the map get a red dot and are listed in the browser console.
-   **Link column**: `Reference`, shown as a `https://doi.org/` link when the value is a DOI.
-   **Filters**: `Disease`, `Relevance`, `Origin`.
-   **Always-visible columns**: `Entity`, `Disease`, `Relevance`; the other columns open in a
    per-row detail panel.

## MINERVA compatibility

Written for the MINERVA 21.0.7 and 22.0.4 plugin APIs. Map elements are read with
`minerva.elements.data.getAll()` on MINERVA 22, otherwise from MINERVA's new API per map
(`new_api/projects/{id}/maps/{mapId}/bio_entities/elements/` on 22,
`.../bioEntities/elements/` on 21). The deprecated `api/.../models/*/bioEntities/elements/`
endpoint is not used. With no project open, no request is made.

## Building

```
npm ci
npm run build
cp dist/plugin.js plugin.js
```

Requires Node.js 20 or later. MINERVA only loads the plugin if the URL declared inside `plugin.js`
is exactly the URL it is loaded from. To host a build elsewhere:

```
PLUGIN_URL=https://example.org/plugin.js npm run build
```

## Licencing

-   **Code (MIT)**: source code, build configuration and the built `plugin.js` are released under the
    MIT License, Copyright (c) 2026 Luiz Ladeira (see `LICENSE`).
-   **Data (CC BY 4.0)**: the oligodendrocyte development disease-evidence table is not stored in this repository; it is read at runtime from the
    public Google Sheet <https://docs.google.com/spreadsheets/d/1vF6tjvZdAThAq9NRxirWmjdL7ouFu3MNWkG6CGqdMfg> and is made available
    under the Creative Commons Attribution 4.0 International licence
    (<https://creativecommons.org/licenses/by/4.0/>). Cited sources remain subject to their own terms.

## Credits

-   Authors: Luiz Ladeira, Hesam Korki (<https://github.com/HesamKorki/serving-purposes>).
-   Layout shared with the DNT-IVB mapping plugin
    (<https://github.com/luiz-ladeira/DNT-IVB_mapping_minerva_plugin>) and the KE Methods Mapper
    plugin (<https://github.com/luiz-ladeira/cardiotox_aop_minerva_plugin>); the compact
    expandable-row layout is adapted from the MINERVA Adverse Drug Reactions (`drug-reactions`)
    plugin (<https://gitlab.com/uniluxembourg/lcsb/BioCore/minerva/plugins/drug-reactions>).

## References

-   Hoksza D, Gawron P, Ostaszewski M, Smula E, Schneider R. MINERVA API and plugins: opening molecular
    network analysis and visualization to the community. Bioinformatics, 2019;35(21):4496-4498.
    <https://doi.org/10.1093/bioinformatics/btz286>
