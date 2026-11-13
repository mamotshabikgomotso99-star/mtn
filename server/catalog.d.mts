import type { IncomingMessage, ServerResponse } from 'node:http'

export function createCatalogHandler(): (request: IncomingMessage, response: ServerResponse) => Promise<void>
