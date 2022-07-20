import { NextFunction, Response } from 'express'

import { CategoryView } from '../../Category/Views/CategoryView'
import { BaseController } from '../../Core/Controllers/BaseController'
import { Factory } from '../../Core/Factories/Factory'
import { CatalogRequest } from '../../Core/Models/Request/CatalogRequest'
import { CreatedResponse } from '../../Core/Models/Response/CreatedResponse'
import { ProductView } from '../Views/ProductView'

export class ProductController extends BaseController {
  constructor() {
    super()
    this.post = this.post.bind(this)
  }

  public async post(
    request: CatalogRequest,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const serviceFactory = Factory.getInstance().buildServiceFactory()

      const result = await serviceFactory
        .buildTransactionalService()
        .execute(async manager => {
          const productCreateService =
            serviceFactory.buildProductCreateService(manager)

          return await productCreateService.execute(
            request.context.storeId,
            request.body
          )
        })

      this.successResponseHandler(
        new CreatedResponse(new ProductView(new CategoryView()).render(result)),
        response
      )
    } catch (error) {
      next(error)
    }
  }
}
