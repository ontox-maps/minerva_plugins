# ONTOX MINERVA plugins

MINERVA plugins developed in ONTOX. Each folder is an independent plugin with its own source,
build configuration, `package.json`, `CHANGELOG.md` and `LICENSE`.

| Plugin | Folder | Version | Load URL (paste into MINERVA) |
|---|---|---|---|
| DNT-IVB mapping | [`DNT_IVB_Mapping`](DNT_IVB_Mapping) | 0.5.2 | `https://raw.githubusercontent.com/ontox-maps/minerva_plugins/main/DNT_IVB_Mapping/plugin.js` |
| Nephrotox KE Mapper | [`Nephrotox_KE_Mapper`](Nephrotox_KE_Mapper) | 1.3.1 | `https://raw.githubusercontent.com/ontox-maps/minerva_plugins/main/Nephrotox_KE_Mapper/plugin.js` |
| Neurotox Data Mapper | [`Neurotox_Data_Mapper`](Neurotox_Data_Mapper) | 1.3.1 | `https://raw.githubusercontent.com/ontox-maps/minerva_plugins/main/Neurotox_Data_Mapper/plugin.js` |

MINERVA loads a plugin only if the URL declared inside its `plugin.js` is exactly the URL it is
loaded from, so use the URLs above without trailing spaces. Each plugin reads its data from a
public Google Sheet with the keyless Google Visualization export; no API key is used.

## Building a plugin

```
cd <folder>
npm ci
npm run build
cp dist/plugin.js plugin.js
```

Requires Node.js 20 or later. See each folder's README for configuration and details.

# Licencing

This project is dual-licensed:

-   **Code (MIT)**: all source code, build configuration and the built `plugin.js` files in this
    repository are released under the MIT License, Copyright (c) 2026 Luiz Ladeira (see
    `LICENSE` and the `LICENSE` file in each plugin folder).
-   **Data (CC BY 4.0)**: the datasets displayed by the plugins are not stored in this
    repository; they are read at runtime from public Google Sheets (linked in each plugin's
    README) and are made available under the Creative Commons Attribution 4.0 International
    licence (<https://creativecommons.org/licenses/by/4.0/>). The individual references cited in
    the datasets remain subject to their publishers' terms.

# References

-   [MINERVA API documentation](https://minerva.pages.uni.lu/doc/)
-   [Google Visualization API query language (gviz)](https://developers.google.com/chart/interactive/docs/querylanguage)
