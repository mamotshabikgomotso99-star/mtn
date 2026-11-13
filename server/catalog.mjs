const MTN_CATALOG_URL = 'https://www.mtn.co.za/api/ecommerce-fq/graphql'
const CACHE_DURATION_MS = 10 * 60 * 1000

const promotionsQuery = `
  query getPromotions($siteIds: [String!]) {
    promotions(promotionsInput: { siteIds: $siteIds }) {
      dealTypes
      promotionCategories {
        dealType
        categoryType
        rank
        promotions {
          ... on DeviceResponse {
            id
            price
            previousLeastOfferPrice
            callouts
            productDetails
            offerPrice
            rank
            storage
            storageUom
            deviceType
            brand
            model
            currencyCode
            defaultDuration: contractDuration
            duration
            promotionTag
            isPromotion
            offerCategory
            offerId
            compositeImage
            planName
            siteId: catalogId
            deviceTerms
            freebies: deviceFreebies {
              currencyCode
              description
              id
              imageUrl
              name
              price
            }
            specs: deviceSpecs {
              image: imageURL
            }
            plans {
              id
              name
              planPrice
              sms {
                name
                value
                uom
              }
              data {
                name
                value
                uom
              }
              airtime {
                name
                value
                uom
              }
              currencyCode
              planFreebies {
                id
                name
                description
                price
                currencyCode
              }
              minutes {
                name
                value
                uom
              }
              categoryName: pricePlanCategoryName
            }
          }
          ... on CatalogPlan {
            id
            name
            price
            categoryId
            categoryName
            defaultDuration
            leastPrice
            previousLeastOfferPrice
            callouts
            productDetails
            currencyCode
            rank
            siteId
            type
            isSimOnlyOffer
            paymentTypes
            totalAirtime
            totalAirtimeUom
            totalData
            totalDataUom
            totalMinutes
            totalMinutesUom
            totalSms
            totalSmsUom
            vatPrice
            serviceType
            promotionTag
            promotionIdentifier
            offerPlanRates
            offerId
            planTerms
            planFreebies {
              id
              name
              description
              currencyCode
              price
              data
              dataUom
              sms
              smsUom
              minutes
              minutesUom
            }
            smsBreakdown {
              name
              uom
              value
            }
            speedBreakdown {
              name
              uom
              value
            }
            airtimeBreakdown {
              name
              uom
              value
            }
            dataBreakdown {
              name
              uom
              value
            }
            minutesBreakdown {
              name
              uom
              value
            }
          }
        }
      }
    }
  }
`

function respond(response, status, payload, cacheControl = 'no-store') {
  response.statusCode = status
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', cacheControl)
  response.end(JSON.stringify(payload))
}

export function createCatalogHandler() {
  let cachedPromotions
  let cachedAt = 0

  return async (request, response) => {
    if (request.method !== 'GET') {
      response.setHeader('Allow', 'GET')
      return respond(response, 405, {
        error: {
          code: 'method_not_allowed',
          message: 'Use GET to load the MTN catalogue.',
        },
      })
    }

    if (cachedPromotions && Date.now() - cachedAt < CACHE_DURATION_MS) {
      return respond(
        response,
        200,
        { promotions: cachedPromotions, refreshedAt: new Date(cachedAt).toISOString() },
        'public, max-age=60',
      )
    }

    const token = process.env.MTN_CATALOG_TOKEN?.trim()
    if (!token) {
      return respond(response, 503, {
        error: {
          code: 'catalog_not_configured',
          message: 'MTN catalogue access is not configured on this server.',
        },
      })
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    try {
      const upstream = await fetch(MTN_CATALOG_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Origin: 'https://www.mtn.co.za',
          Referer: 'https://www.mtn.co.za/shop/deals/promotions',
        },
        body: JSON.stringify({
          query: promotionsQuery,
          variables: { siteIds: ['MTNSite'] },
        }),
        signal: controller.signal,
      })

      if (!upstream.ok) {
        console.error(`MTN catalog request failed with HTTP ${upstream.status}.`)
        return respond(response, 502, {
          error: {
            code: 'catalog_upstream_error',
            message: 'The MTN catalogue could not be loaded. Please try again later.',
          },
        })
      }

      const result = await upstream.json()
      if (result.errors?.length || !result.data?.promotions) {
        console.error('MTN catalog returned an incomplete GraphQL response.')
        return respond(response, 502, {
          error: {
            code: 'catalog_invalid_response',
            message: 'The MTN catalogue returned an invalid response.',
          },
        })
      }

      cachedPromotions = result.data.promotions
      cachedAt = Date.now()
      return respond(response, 200, {
        promotions: cachedPromotions,
        refreshedAt: new Date(cachedAt).toISOString(),
      }, 'public, max-age=60')
    } catch (error) {
      console.error('MTN catalog request failed:', error)
      return respond(response, 502, {
        error: {
          code: 'catalog_request_failed',
          message: 'The MTN catalogue could not be reached. Please try again later.',
        },
      })
    } finally {
      clearTimeout(timeout)
    }
  }
}
