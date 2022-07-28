import { ProductSaveVariationDto } from './ProductSaveVariationDto'

export interface ProductCreateDto {
  title: string
  description: string
  active: boolean
  category: {
    id: string
  }
  brand: {
    id: string
  }
  id: string
  variations: ({ sku: string } & ProductSaveVariationDto)[]
}
