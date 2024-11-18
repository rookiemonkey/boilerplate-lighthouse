
// https://github.com/GoogleChrome/lighthouse/blob/HEAD/docs/configuration.md
// DESKTOP - https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/config/lr-desktop-config.js
import constants from './constants.js'

export default {
  extends: 'lighthouse:default',
  settings: {
    maxWaitForFcp: 15 * 1000,
    maxWaitForLoad: 35 * 1000,
    formFactor: 'desktop',
    throttling: constants.throttling.desktopDense4G,
    screenEmulation: constants.screenEmulationMetrics.desktop,
    emulatedUserAgent: constants.userAgents.desktop,
    skipAudits: ['uses-http2'],
  }
}