import { createWorkflow, WorkflowResponse } from '@medusajs/workflows-sdk'
import { upsertPriceStep } from './steps/upsert-price'

type WorkflowInput = {
  id: string
}

export const upsertPriceWorkflow = createWorkflow('meilisearch-upsert-price', ({ id }: WorkflowInput) => {
  const { products } = upsertPriceStep({ priceId: id })

  return new WorkflowResponse({ products })
})
