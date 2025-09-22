/**
 * Minerva Plugin API definitions
 *
 * JSDoc typedefs for Minerva API objects (v18+).
 */

/**
 * @typedef {Object} MinervaApiUrls
 * @property {string} baseApiUrl
 * @property {string} baseNewApiUrl
 */

/**
 * @typedef {Object} MinervaProjectData
 * @property {function} getProjectId
 * @property {function():MinervaApiUrls} getApiUrls
 */

/**
 * @typedef {Object} MinervaProject
 * @property {MinervaProjectData} data
 */

/**
 * @typedef {Object} MinervaPluginRegisterData
 * @property {string} pluginName
 * @property {string} pluginVersion
 * @property {string} pluginUrl
 */

/**
 * @typedef {Object} MinervaPluginResultData
 * @property {HTMLDivElement} element
 * @property {Object} events
 * @property {function} events.addListener
 * @property {function} events.removeListener
 * @property {function} events.removeAllListeners
 */

/**
 * @typedef {Object} MinervaPlugin
 * @property {function(MinervaPluginRegisterData):MinervaPluginResultData} registerPlugin
 */

/**
 * @typedef {Object} MarkerData
 * @property {"pin"|"surface"|"ICON"|"line"} type
 * @property {string} id
 * @property {number} modelId
 * @property {string} [color]
 * @property {number} [opacity]
 * @property {number} [x]
 * @property {number} [y]
 * @property {number} [width]
 * @property {number} [height]
 */
