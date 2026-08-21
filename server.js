/**
 * Not the Hostinger entry. LiteSpeed require()s the entry file; ESM + TLA breaks
 * with ERR_REQUIRE_ASYNC_MODULE. Use server.cjs instead.
 */
console.error(
  '[server] Wrong entry file. Set Hostinger Entry to server.cjs (not server.js).',
)
process.exit(1)
