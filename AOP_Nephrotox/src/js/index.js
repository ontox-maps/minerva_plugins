/**
 * KE Methods Mapper Plugin for Minerva v18
 * Author: Luiz Ladeira
 *
 * Loads a Google Sheet with KE data, renders a searchable table,
 * and highlights corresponding BioEntities in the Minerva map when clicked.
 */

let $ = require("jquery");
require("../css/styles.css");
require("./minervaAPI");

/* globals minerva:MinervaAPI */

const PLUGIN_NAME = "KE Methods Mapper";
const PLUGIN_VERSION = "1.6.2";
const PLUGIN_URL = "https://raw.githubusercontent.com/luiz-ladeira/cardiotox_aop_minerva_plugin/master/plugin.js";

const SPREADSHEET_ID = "1lYtwYLNLfGlhj7gbbkaNCwYNsuGKM5L6uJSydlXEGLE";
const API_KEY = "AIzaSyAIaStdq_ebxgOE7l5K5mBrBSRrf3Ywayg";
const SPREADSHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`;

const KE_NAME_COLUMN = "ke_name";

// ===== Utils =====
function normalizeName(name) {
  return (name || "").toLowerCase().replace(/\s+/g, " ").trim();
}

function buildEntityIndex(bioEntities) {
  const index = {};
  bioEntities.forEach((be) => {
    const entityName = be.name || (be.bioEntity && be.bioEntity.name) || "";
    const keys = [
      normalizeName(entityName),
      ...(be.labels || []).map(normalizeName),
      ...(be.aliases || []).map(normalizeName),
    ];
    keys.forEach((k) => { if (k) index[k] = be; });
  });
  return index;
}

async function fetchSheetData() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Data?key=${API_KEY}`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Google Sheets fetch failed: ${resp.statusText}`);
  return await resp.json();
}

function elementToPinData(element) {
  const geometry = element.bounds ? element.bounds : element;
  const w = parseFloat(geometry.width) || 0;
  const h = parseFloat(geometry.height) || 0;
  const x = parseFloat(geometry.x) || 0;
  const y = parseFloat(geometry.y) || 0;

  return {
    id: "E" + element.id,
    modelId: element.modelId || element.model,
    type: "pin",
    color: "#FF0000",
    opacity: 0.9,
    x: x + (w / 2),
    y: y + (h / 2),
  };
}

function deHighlightAll() {
  if (minerva?.data?.bioEntities?.removeAllMarkers) {
    minerva.data.bioEntities.removeAllMarkers();
  }
}

async function highlightMultiple(matches) {
  deHighlightAll();
  for (const m of matches) {
    try {
      const marker = elementToPinData(m);
      if (!isNaN(marker.x) && !isNaN(marker.y)) {
        minerva.data.bioEntities.addSingleMarker(marker);
      }
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
  $el.addClass('ke-plugin-root');

  const header = sheet.values[0];
  const rows = sheet.values.slice(1);
  const keNameIdx = header.indexOf(KE_NAME_COLUMN);
  const entityIndex = buildEntityIndex(bioEntities);

  // nicer layout: Fixed Top Section
  const $headerSection = $(`
    <div class="ke-fixed-top border-bottom bg-light p-2">
      <div class="input-group input-group-sm mb-2">
        <div class="input-group-prepend">
          <span class="input-group-text"><i class="fas fa-search"></i> Search</span>
        </div>
        <input type="text" id="search-box" class="form-control" placeholder="Type to filter map...">
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-sm btn-outline-primary flex-grow-1 access-btn">
           Access Data
        </button>
        <button class="btn btn-sm btn-outline-danger clean-btn" style="margin-left:5px;">
           Clean Map
        </button>
      </div>
    </div>
  `);

  // Scrollable Section
  const $scrollSection = $('<div class="ke-scroll-content"></div>');
  const $table = $('<table class="table table-hover table-sm mb-0"></table>');
  const $thead = $('<thead class="thead-light"><tr></tr></thead>');
  const $tbody = $("<tbody></tbody>");

  header.forEach((h) => $thead.find("tr").append(`<th>${h}</th>`));

  rows.forEach((row) => {
    const $row = $("<tr></tr>");
    row.forEach((cell, idx) => {
      let value = cell || "";
      if (header[idx].toLowerCase() === "url" && value) {
        value = `<a href="${value}" target="_blank" class="btn btn-xs btn-link p-0 text-truncate" style="max-width:100px;">View</a>`;
      }
      $row.append(`<td>${value}</td>`);
    });

    if (keNameIdx !== -1 && row[keNameIdx]) {
      const ke = row[keNameIdx];
      const match = entityIndex[normalizeName(ke)];
      if (match) {
        $row.addClass('clickable-row').on("click", async () => {
          await highlightMultiple([match]);
        });
      }
    }
    $tbody.append($row);
  });

  $table.append($thead).append($tbody);
  $scrollSection.append($table);
  $el.append($headerSection, $scrollSection);

  // Events
  $(".access-btn").on("click", () => window.open(SPREADSHEET_URL, "_blank"));
  $(".clean-btn").on("click", () => {
    deHighlightAll();
    $("#search-box").val("");
    $tbody.find("tr").show();
  });

  $("#search-box").on("input", function () {
    const val = $(this).val().toLowerCase();
    const visibleMatches = [];

    $tbody.find("tr").each(function () {
      const rowText = $(this).text().toLowerCase();
      const isVisible = rowText.includes(val);
      $(this).toggle(isVisible);

      if (isVisible && keNameIdx !== -1) {
        const keName = $(this).find("td").eq(keNameIdx).text();
        const match = entityIndex[normalizeName(keName)];
        if (match) visibleMatches.push(match);
      }
    });

    highlightMultiple(visibleMatches);
  });

  // Initial highlight
  const allMatches = [];
  $tbody.find("tr").each(function () {
    if (keNameIdx !== -1) {
      const keName = $(this).find("td").eq(keNameIdx).text();
      const match = entityIndex[normalizeName(keName)];
      if (match) allMatches.push(match);
    }
  });
  highlightMultiple(allMatches);
}

// Babel-compatible Synchronous registration
function register() {
  if (!minerva.plugins || !minerva.plugins.registerPlugin) return;

  const pluginData = minerva.plugins.registerPlugin({
    pluginName: PLUGIN_NAME,
    pluginVersion: PLUGIN_VERSION,
    pluginUrl: PLUGIN_URL,
  });

  const baseUrl = minerva.project.data.getApiUrls().baseApiUrl;
  const projectId = minerva.project.data.getProjectId();

  Promise.all([
    fetchSheetData(),
    fetch(`${baseUrl}/projects/${projectId}/models/*/bioEntities/elements/`).then(r => r.json())
  ]).then(results => {
    renderUI(pluginData.element, results[0], results[1]);
  }).catch(err => {
    $(pluginData.element).html(`<p style="color:red; padding: 10px;">${err.message}</p>`);
  });
}

register();