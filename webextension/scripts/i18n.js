/* global chrome */

/**
 * Applies i18n translations to DOM elements using data attributes.
 *
 * Supported attributes:
 *   data-i18n="key"             → sets textContent
 *   data-i18n-placeholder="key" → sets placeholder
 *   data-i18n-title="key"       → sets title
 *   data-i18n-value="key"       → sets value (for input/button)
 *   data-i18n-aria-label="key"  → sets aria-label
 */
function applyI18n() {
  const attrMap = {
    'i18n': function (el, msg) { el.textContent = msg },
    'i18n-placeholder': function (el, msg) { el.placeholder = msg },
    'i18n-title': function (el, msg) { el.title = msg },
    'i18n-value': function (el, msg) { el.value = msg },
    'i18n-aria-label': function (el, msg) { el.setAttribute('aria-label', msg) }
  }

  Object.keys(attrMap).forEach(function (attr) {
    const selector = '[data-' + attr + ']'
    document.querySelectorAll(selector).forEach(function (el) {
      const key = el.getAttribute('data-' + attr)
      const msg = chrome.i18n.getMessage(key)
      if (msg) {
        attrMap[attr](el, msg)
      }
    })
  })
}

document.addEventListener('DOMContentLoaded', applyI18n)
