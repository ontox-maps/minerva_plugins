# Neurotox Data Mapper

MINERVA plugin, version 1.3.1. It loads a Google Sheet of disease evidence on entities of oligodendrocyte development and tags the corresponding elements of the ONTOX oligodendrocyte development map.

Load URL: <https://raw.githubusercontent.com/ontox-maps/minerva_plugins/main/Neurotox_Data_Mapper/plugin.js>

# Features

Same layout and features as the DNT-IVB mapping and KE Methods Mapper plugins, with the DNT-IVB mapping palette (accent `#2563eb`, stripe `#f1f5f9`, hover `#e8f0fe`, selected `#dbe7ff`, map pin `#d6336c`):

-   Data read from a public Google Sheet with the keyless Google Visualization (gviz) export; no API key.
-   Free-text search across all columns and dropdown filters, with a live tally of rows shown and mapped.
-   Compact table with a per-row detail panel, so no horizontal scrolling; columns added to the sheet
    appear in the detail panel automatically.
-   Green dot = row mapped to the map, red dot = not mapped (hover shows "Mapped" / "Not mapped").
-   Row click tags the element(s), opens the submap and zooms to them; search and filters update the tags.
-   "Access data" opens the Google Sheet; "Clean" resets search and filters and removes the plugin's tags.

# Configuration

-   **Google Sheet**: `1vF6tjvZdAThAq9NRxirWmjdL7ouFu3MNWkG6CGqdMfg`, tab `Data`, first row = column names. The sheet must be shared
    as "anyone with the link can view".
-   **Mapping**: `Entity`, matched against the element name (case- and whitespace-insensitive).
    An entity drawn several times on the map is tagged at every copy; a row click zooms to all of
    them. Rows whose entity is not on the map get a red dot and are listed in the browser console.
-   **Link column**: `Reference`, shown as a `https://doi.org/` link when the value is a DOI.
-   **Filters**: `Disease`, `Relevance`, `Origin`.
-   **Always-visible columns**: `Entity`, `Disease`, `Relevance`; the other columns open in a
    per-row detail panel.

# MINERVA compatibility

Written for the MINERVA 21.0.7 and 22.0.4 plugin APIs. Map elements are read with
`minerva.elements.data.getAll()` on MINERVA 22, otherwise from MINERVA's new API per map
(`new_api/projects/{id}/maps/{mapId}/bio_entities/elements/` on 22,
`.../bioEntities/elements/` on 21). The deprecated `api/.../models/*/bioEntities/elements/`
endpoint is not used. With no project open, no request is made.

# Building

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

# Versioning

-   **Plugin name**: Neurotox Data Mapper

-   **Version**: 1.3.1 (see `CHANGELOG.md`)

-   **Author**: Luiz Ladeira

-   Repository: <https://github.com/ontox-maps/minerva_plugins/tree/main/Neurotox_Data_Mapper>

-   Built on the Cardiotox AOP / KE Methods Mapper plugin, itself based on previous
    development by Hesam Korki - <https://github.com/HesamKorki>, and shares its layout with
    the DNT-IVB mapping plugin - <https://github.com/ontox-maps/minerva_plugins/tree/main/DNT_IVB_Mapping>

-   The compact expandable-row layout (narrow primary columns with the
    remaining fields in a per-row detail panel, to save horizontal space) is
    adapted from the MINERVA **Adverse Drug Reactions** (`drug-reactions`)
    plugin -
    <https://gitlab.com/uniluxembourg/lcsb/BioCore/minerva/plugins/drug-reactions>

------------------------------------------------------------------------

# Licencing

This project is dual-licensed:

-   **Code (MIT)**: all source code, build configuration and the built `plugin.js` in this
    repository are released under the MIT License, Copyright (c) 2026 Luiz Ladeira (see
    `LICENSE`).
-   **Data (CC BY 4.0)**: the oligodendrocyte development disease-evidence dataset displayed by the plugin is not stored in
    this repository; it is read at runtime from the public Google Sheet
    <https://docs.google.com/spreadsheets/d/1vF6tjvZdAThAq9NRxirWmjdL7ouFu3MNWkG6CGqdMfg>
    and is made available under the Creative Commons Attribution 4.0 International licence
    (<https://creativecommons.org/licenses/by/4.0/>). The individual references cited in
    the dataset remain subject to their publishers' terms.

------------------------------------------------------------------------

# References

-   [MINERVA API documentation](https://minerva.pages.uni.lu/doc/)
-   [Google Visualization API query language (gviz)](https://developers.google.com/chart/interactive/docs/querylanguage)
