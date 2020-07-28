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
  return new Response(response.body,
    {
      status: response.status,
      headers: response.headers,
    }
  );
}
