// plugins/polyfill-global.client.js
if (typeof global === 'undefined') {
  window.global = window;
}
