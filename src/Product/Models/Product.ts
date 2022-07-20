import { randomUUID } from 'crypto'
import { Category } from '../../Category/Models/Category'

export class Product {
  private category: Category

  constructor(
    private storeId: string,
    private title: string,
    private description: string,
    private active: boolean,
    private id?: string,
    private createdAt?: Date,
    private updatedAt?: Date
  ) {
    if (!id) this.id = randomUUID()
  }

  public getStoreId(): string {
    return this.storeId
  }

  public getTitle(): string {
    return this.title
  }

  public getDescription(): string {
    return this.description
  }

  public isActive(): boolean {
    return this.active
  }

  public getCategory(): Category {
    return this.category
  }

  public setCategory(category: Category) {
    this.category = category
    return this
  }

  public getId(): string {
    return this.id
  }

  public getCreatedAt(): Date {
    return this.createdAt
  }

  public getUpdatedAt(): Date {
    return this.updatedAt
  }
}
