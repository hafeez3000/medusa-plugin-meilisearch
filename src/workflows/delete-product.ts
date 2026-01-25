import { createWorkflow, WorkflowResponse } from '@medusajs/workflows-sdk'
import { deleteProductStep } from './steps/delete-product'

type WorkflowInput = {
  id: string
}

export const deleteProductWorkflow = createWorkflow('meilisearch-delete-product', ({ id }: WorkflowInput) => {
  deleteProductStep({ productId: id })

  return new WorkflowResponse({})
})
