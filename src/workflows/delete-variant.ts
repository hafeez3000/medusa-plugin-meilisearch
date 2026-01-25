import { createWorkflow, WorkflowResponse } from '@medusajs/workflows-sdk'
import { deleteVariantStep } from './steps/delete-variant'

type WorkflowInput = {
  id: string
}

export const deleteVariantWorkflow = createWorkflow('meilisearch-delete-variant', ({ id }: WorkflowInput) => {
  const { products } = deleteVariantStep({ variantId: id })

  return new WorkflowResponse({
    products,
  })
})
