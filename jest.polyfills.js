require("whatwg-fetch")
const TextEncoder = require('node:util').TextEncoder
const TextDecoder = require('node:util').TextDecoder

Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder }
})
