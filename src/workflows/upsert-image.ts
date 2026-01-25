import { createWorkflow, WorkflowResponse } from '@medusajs/workflows-sdk'
import { upsertImageStep } from './steps/upsert-image'

type WorkflowInput = {
  id: string
}

export const upsertImageWorkflow = createWorkflow('meilisearch-upsert-image', ({ id }: WorkflowInput) => {
  const { products } = upsertImageStep({ imageId: id })
  return new WorkflowResponse({ products })
})
