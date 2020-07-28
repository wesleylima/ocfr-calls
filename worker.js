const { handler } = require('./index');

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {
  const response = await handler();
  return new Response(JSON.stringify(response), {status: 200});
}
