import { BaseController, CoreRequest, ResponseTypeEnum } from 'ecommsystem-core'
import { NextFunction, Response } from 'express'
import { Factory } from '../../Shared/Factories/Factory'

import { BrandFacade } from './BrandFacade'
import { BrandView } from './Views/BrandView'

export class BrandController extends BaseController {
  constructor() {
    super()
    this.post = this.post.bind(this)
    this.patch = this.patch.bind(this)
    this.get = this.get.bind(this)
    this.getOneById = this.getOneById.bind(this)
  }

  public async post(req: CoreRequest, res: Response, next: NextFunction) {
    await this.responseHandler(
      res,
      next,
      this.getFacade(req).create(req.context.storeId, req.body),
      ResponseTypeEnum.CREATED
    )
  }

  public async patch(req: CoreRequest, res: Response, next: NextFunction) {
    await this.responseHandler(
      res,
      next,
      this.getFacade(req).update(req.params.id, req.context.storeId, req.body),
      ResponseTypeEnum.OK
    )
  }

  public async get(req: CoreRequest, res: Response, next: NextFunction) {
    await this.responseHandler(
      res,
      next,
      this.getFacade(req).list(req.query),
      ResponseTypeEnum.OK
    )
  }

  public async getOneById(req: CoreRequest, res: Response, next: NextFunction) {
    await this.responseHandler(
      res,
      next,
      this.getFacade(req).getOneById(req.params.id),
      ResponseTypeEnum.OK
    )
  }

  protected getFacade(req: CoreRequest): BrandFacade {
    return Factory.getInstance()
      .buildFacadeFactory(req.context?.storeId)
      .buildBrandFacade()
  }

  protected getView() {
    return new BrandView()
  }
}
