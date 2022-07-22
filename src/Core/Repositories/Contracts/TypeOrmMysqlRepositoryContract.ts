import {
  FindOptionsWhere,
  ObjectID,
  Repository as TypeOrmRepository,
  SelectQueryBuilder
} from 'typeorm'
import { EntityDataMapperContract } from '../../DataMappers/Contracts/EntityDataMapperContract'
import { DataNotFoundException } from '../../Models/Exceptions/DataNotFoundException'
import { IFilterDefault } from '../../Models/Interfaces/IFilterDefault'
import { IItemListModel } from '../../Models/Interfaces/IItemListModel'
import { RepositoryContract } from './RepositoryContract'

export abstract class TypeOrmMysqlRepositoryContract<
  TDomainEntity,
  TDaoEntity
> extends RepositoryContract<TDomainEntity, TDaoEntity> {
  constructor(
    protected readonly repository: TypeOrmRepository<TDaoEntity>,
    protected dataMapper: EntityDataMapperContract<TDomainEntity, TDaoEntity>,
    protected storeId: string | null,
    dataNotFoundException: DataNotFoundException
  ) {
    super(dataNotFoundException)
  }

  public async save(entity: TDomainEntity): Promise<TDomainEntity> {
    const result = await this.repository.save(
      this.dataMapper.toDaoEntity(entity)
    )

    return this.dataMapper.toDomainEntity(result)
  }

  public async delete(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectID
      | ObjectID[]
      | FindOptionsWhere<TDaoEntity>
  ): Promise<boolean> {
    await this.repository.delete(criteria)

    return true
  }

  public async findAll<TFilter extends IFilterDefault>(
    filter: TFilter
  ): Promise<IItemListModel<TDomainEntity>> {
    const query = this.applyPaginator(
      filter,
      this.customToFindAll(filter, this.repository.createQueryBuilder())
    )

    return {
      items: this.dataMapper.toDomainMany(await query.getMany()),
      total: await query.getCount()
    }
  }

  public applyPaginator(
    filter: IFilterDefault,
    query: SelectQueryBuilder<TDaoEntity>
  ): SelectQueryBuilder<TDaoEntity> {
    const skip = (this.getPage(filter) - 1) * this.getSize(filter)
    const size = this.getSize(filter)

    return query.skip(skip).take(size)
  }

  protected getPage(filter: IFilterDefault) {
    filter.page =
      typeof filter.page === 'string' ? parseInt(filter.page) : filter.page

    let page = 1
    if (filter.page > 0) {
      page =
        typeof filter.page === 'string' ? parseInt(filter.page) : filter.page
    }

    return page
  }

  protected getSize(filter: IFilterDefault) {
    filter.size =
      typeof filter.size === 'string' ? parseInt(filter.size) : filter.size

    let size = 15
    if (filter.size > 0) {
      size = filter.size
      if (filter.size > 100) {
        size = 100
      }
    }

    return size
  }

  protected customToFindAll(
    filter: IFilterDefault,
    query: SelectQueryBuilder<TDaoEntity>
  ): SelectQueryBuilder<TDaoEntity> {
    return query
  }

  protected hasColumn(columnName: string): boolean {
    return this.repository.metadata.columns
      .map(column => column.propertyName)
      .includes(columnName)
  }

  protected hasRelation(propertyName: string): boolean {
    return this.repository.metadata.relations
      .map(relation => relation.propertyName)
      .includes(propertyName)
  }

  protected getTableName(): string {
    return this.repository.metadata.targetName
  }
}
