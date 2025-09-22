/**
 * Nephrotox KE Mapper Plugin for Minerva v18
 * Author: Luiz Ladeira & Hesam Korki
 *
 * Loads a Google Sheet with KE data, renders a searchable table,
 * and highlights corresponding BioEntities in the Minerva map when clicked.
 */

let $ = require("jquery");
require("../css/styles.css");
require("./minervaAPI");

/* globals minerva:MinervaAPI */

const PLUGIN_NAME = "Nephrotox KE Mapper";
const PLUGIN_VERSION = "1.1.0";
const PLUGIN_URL =
  "https://raw.githubusercontent.com/ontox-maps/minerva_plugins/master/AOP_Nephrotox/plugin.js";

const SPREADSHEET_ID = "1QA4EHdprLo3JCTRzE2U6E3DwBj-wYiwLTN-gc2eI7Hs";
const API_KEY = "AIzaSyAIaStdq_ebxgOE7l5K5mBrBSRrf3Ywayg";
const SPREADSHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`;

const KE_NAME_COLUMN = "Entity";

// ===== Utils =====
function normalizeName(name) {
  return (name || "").toLowerCase().replace(/\s+/g, " ").trim();
}

function buildEntityIndex(bioEntities) {
  const index = {};
  bioEntities.forEach((be) => {
    const keys = [
      normalizeName(be.name),
      ...(be.labels || []).map(normalizeName),
      ...(be.aliases || []).map(normalizeName),
    ];
    keys.forEach((k) => {
      if (k) index[k] = be;
    });
  });
  return index;
}

async function fetchSheetData() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Sheet1?key=${API_KEY}`;
  const resp = await fetch(url);
  if (!resp.ok)
    throw new Error(`Google Sheets fetch failed: ${resp.statusText}`);
  return await resp.json();
}

async function fetchElementDetails(element) {
  const url =
    minerva.project.data.getApiUrls().baseNewApiUrl +
    "/projects/" +
    minerva.project.data.getProjectId() +
    "/models/" +
    element.modelId +
    "/bioEntities/elements/" +
    element.id;
  return fetch(url).then((r) => r.json());
}

function elementToPinData(element) {
  return {
    id: "E" + element.id,
    modelId: element.modelId ? element.modelId : element.model,
    type: "pin",
    color: "#FF0000",
    opacity: 0.9,
    x: element.x + element.width / 2,
    y: element.y + element.height / 2,
  };
}

function deHighlightAll() {
  if (minerva?.data?.bioEntities?.removeAllMarkers) {
    minerva.data.bioEntities.removeAllMarkers();
  }
}

// ===== Core =====
async function highlightMultiple(matches) {
  deHighlightAll();
  for (const m of matches) {
    try {
      const full = await fetchElementDetails(m);
      const marker = elementToPinData(full);
      minerva.data.bioEntities.addSingleMarker(marker);
    } catch (err) {
      console.error("Error highlighting", m, err);
    }
  }
}

/**
 * Render KE table
 */
function renderUI(container, sheet, bioEntities) {
  const $el = $(container);
  $el.empty();

  const header = sheet.values[0];
  const rows = sheet.values.slice(1);

  const $controls = $(`
    <div class="d-flex justify-content-between mb-2">
      <input type="text" id="search-box" class="form-control form-control-sm w-50" placeholder="Search...">
      <div>
        <button class="btn btn-sm btn-primary access-btn">Access data</button>
        <button class="btn btn-sm btn-secondary clean-btn">Clean</button>
      </div>
    </div>
  `);

  const $wrapper = $('<div class="table-wrapper"></div>');
  const $table = $('<table class="table table-bordered table-sm"></table>');
  const $thead = $("<thead><tr></tr></thead>");
  const $tbody = $("<tbody></tbody>");

  header.forEach((h) => $thead.find("tr").append(`<th>${h}</th>`));

  const keNameIdx = header.indexOf(KE_NAME_COLUMN);
  const entityIndex = buildEntityIndex(bioEntities);

  // Build rows
  rows.forEach((row) => {
    const $row = $("<tr></tr>");
    row.forEach((cell, idx) => {
      let value = cell || "";
      if (header[idx].toLowerCase() === "url" && value) {
        value = `<a href="${value}" target="_blank" style="font-weight: normal;">${value}</a>`;
      }
      $row.append(`<td>${value}</td>`);
    });

    if (keNameIdx !== -1 && row[keNameIdx]) {
      const ke = row[keNameIdx];
      const match = entityIndex[normalizeName(ke)];
      if (match) {
        $row.css("cursor", "pointer");
        $row.on("click", async () => {
          console.log("Clicked KE:", ke, "-> match:", match);
          await highlightMultiple([match]); // only clicked KE
        });
      }
    }

    $tbody.append($row);
  });

  $table.append($thead).append($tbody);
  $wrapper.append($table);
  $el.append($controls, $wrapper);

  // ===== Events =====
  $(".access-btn").css("font-weight", "normal").on("click", () =>
    window.open(SPREADSHEET_URL, "_blank")
  );

  $(".clean-btn").on("click", () => {
    deHighlightAll();
    $("#search-box").val("");
    $tbody.find("tr").show();
  });

  $("#search-box").on("input", async function () {
    const val = $(this).val().toLowerCase();
    $tbody.find("tr").each(function () {
      const rowText = $(this).text().toLowerCase();
      $(this).toggle(rowText.includes(val));
    });

    // highlight only visible rows
    const visibleMatches = [];
    $tbody.find("tr:visible").each(function () {
      const rowCells = $(this).find("td");
      if (keNameIdx !== -1) {
        const ke = rowCells.eq(keNameIdx).text();
        const match = entityIndex[normalizeName(ke)];
        if (match) visibleMatches.push(match);
      }
    });
    await highlightMultiple(visibleMatches);
  });

  // ===== Initial highlight =====
  const allMatches = [];
  $tbody.find("tr").each(function () {
    const rowCells = $(this).find("td");
    if (keNameIdx !== -1) {
      const ke = rowCells.eq(keNameIdx).text();
      const match = entityIndex[normalizeName(ke)];
      if (match) allMatches.push(match);
    }
  });
  highlightMultiple(allMatches);
}

// ===== Main =====
async function register() {
  console.log(`Registering ${PLUGIN_NAME} plugin`);

  if (!minerva.plugins || !minerva.plugins.registerPlugin) {
    alert("Minerva v18 or later required");
    return;
  }

  const { element } = minerva.plugins.registerPlugin({
    pluginName: PLUGIN_NAME,
    pluginVersion: PLUGIN_VERSION,
    pluginUrl: PLUGIN_URL,
  });

  try {
    const [sheet, elements] = await Promise.all([
      fetchSheetData(),
      fetch(
        `${minerva.project.data.getApiUrls().baseApiUrl}/projects/${minerva.project.data.getProjectId()}/models/*/bioEntities/elements/`
      ).then((r) => r.json()),
    ]);

    renderUI(element, sheet, elements);
  } catch (err) {
    $(element).html(`<p style="color:red;">${err.message}</p>`);
    console.error(err);
  }
}

register();

