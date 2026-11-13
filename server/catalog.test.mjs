import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import test from 'node:test'
import { createCatalogHandler } from './catalog.mjs'

const requestFetch = globalThis.fetch

async function requestHandler(handler, method = 'GET') {
  const server = createServer(handler)
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()

  try {
    const response = await requestFetch(`http://127.0.0.1:${address.port}/api/mtn/promotions`, { method })
    return { response, payload: await response.json() }
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()))
    })
  }
}

test('requires a server-side MTN token and rejects other methods', async () => {
  const previousToken = process.env.MTN_CATALOG_TOKEN
  const previousFetch = globalThis.fetch
  delete process.env.MTN_CATALOG_TOKEN
  globalThis.fetch = async () => {
    throw new Error('The upstream must not be called without a token.')
  }

  try {
    const handler = createCatalogHandler()
    const getResult = await requestHandler(handler)
    assert.equal(getResult.response.status, 503)
    assert.equal(getResult.payload.error.code, 'catalog_not_configured')

    const postResult = await requestHandler(handler, 'POST')
    assert.equal(postResult.response.status, 405)
    assert.equal(postResult.response.headers.get('allow'), 'GET')
  } finally {
    globalThis.fetch = previousFetch
    if (previousToken === undefined) delete process.env.MTN_CATALOG_TOKEN
    else process.env.MTN_CATALOG_TOKEN = previousToken
  }
})

test('loads and caches official promotions through the authenticated server feed', async () => {
  const previousToken = process.env.MTN_CATALOG_TOKEN
  const previousFetch = globalThis.fetch
  process.env.MTN_CATALOG_TOKEN = 'test-token'
  let upstreamCalls = 0
  globalThis.fetch = async (url, options) => {
    upstreamCalls += 1
    assert.equal(url, 'https://www.mtn.co.za/api/ecommerce-fq/graphql')
    assert.equal(options.headers.Authorization, 'Bearer test-token')
    return new Response(JSON.stringify({
      data: {
        promotions: {
          promotionCategories: [
            {
              dealType: 'contract',
              categoryType: 'phones',
              promotions: [{ id: 'device-1', brand: 'Samsung', model: 'Galaxy' }],
            },
          ],
        },
      },
    }), { status: 200 })
  }

  try {
    const handler = createCatalogHandler()
    const first = await requestHandler(handler)
    const cached = await requestHandler(handler)
    assert.equal(first.response.status, 200)
    assert.equal(first.payload.promotions.promotionCategories[0].promotions[0].model, 'Galaxy')
    assert.equal(cached.response.status, 200)
    assert.equal(cached.response.headers.get('cache-control'), 'public, max-age=60')
    assert.equal(upstreamCalls, 1)
  } finally {
    globalThis.fetch = previousFetch
    if (previousToken === undefined) delete process.env.MTN_CATALOG_TOKEN
    else process.env.MTN_CATALOG_TOKEN = previousToken
  }
})
