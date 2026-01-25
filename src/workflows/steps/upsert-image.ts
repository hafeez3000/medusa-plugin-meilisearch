import { createStep, StepResponse } from '@medusajs/workflows-sdk'
import { ContainerRegistrationKeys, SearchUtils } from '@medusajs/utils'
import { MEILISEARCH_MODULE, MeiliSearchService } from '../../modules/meilisearch'

type StepInput = {
  imageId: string
}

export const upsertImageStep = createStep('upsert-image', async ({ imageId }: StepInput, { container }) => {
  const queryService = container.resolve(ContainerRegistrationKeys.QUERY)
  const meilisearchService: MeiliSearchService = container.resolve(MEILISEARCH_MODULE)

  const { data: images } = await queryService.graph({
    entity: 'product_image',
    fields: ['product_images.product_id'],
    filters: { id: imageId },
  })

  const productIds = images
    .flatMap((img) => img.product_images?.map((pi: { product_id: string }) => pi.product_id) || [])
    .filter(Boolean)

  if (!productIds.length) {
    return new StepResponse({ products: [] })
  }

  const productFields = await meilisearchService.getFieldsForType(SearchUtils.indexTypes.PRODUCTS)
  const productIndexes = await meilisearchService.getIndexesByType(SearchUtils.indexTypes.PRODUCTS)

  const { data: products } = await queryService.graph({
    entity: 'product',
    fields: productFields,
    filters: { id: [...new Set(productIds)] },
  })

  await Promise.all(
    products.map(async (product) => {
      if (!product.status || product.status === 'published') {
        await Promise.all(productIndexes.map((indexKey) => meilisearchService.addDocuments(indexKey, [product])))
      } else {
        await Promise.all(productIndexes.map((indexKey) => meilisearchService.deleteDocument(indexKey, product.id)))
      }
    }),
  )

  return new StepResponse({ products })
})
