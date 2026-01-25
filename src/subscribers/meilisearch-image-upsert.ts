import { SubscriberArgs, SubscriberConfig } from '@medusajs/framework'
import { ProductEvents } from '@medusajs/utils'
import { upsertImageWorkflow } from '../workflows/upsert-image'

export default async function meilisearchImageUpsertHandler({
  container,
  event: { data },
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve('logger')

  try {
    await upsertImageWorkflow(container).run({
      input: { id: data.id },
    })
  } catch (error) {
    logger.error(error)
    throw error
  }
}

export const config: SubscriberConfig = {
  event: [
    // Workflow events
    'product-image.created',
    'product-image.updated',
    // Module events
    ProductEvents.PRODUCT_IMAGE_CREATED,
    ProductEvents.PRODUCT_IMAGE_UPDATED,
  ],
}
