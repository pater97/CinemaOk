import {
  ExtractModelRelations,
  LucidModel,
  ModelAttributes,
  ModelPaginatorContract,
} from '@ioc:Adonis/Lucid/Orm'
import { SimplePaginatorContract } from '@ioc:Adonis/Lucid/Database'

/**
 * This abstract class handles standard DataBase operations performed on entities of type Lucid.
 *
 * @class
 * @category Repository
 * @abstract
 */
abstract class LucidRepository<T extends LucidModel> {
  public model: T

  /**
   * @param {T extends LucidModel} model
   * @protected
   */
  protected constructor(model: T) {
    this.model = model
  }

  /**
   * Returns a paginated query.
   *
   * @param {number} page Page number.
   * @param {number} limit Elements per page.
   * @param {Array<ExtractModelRelations<InstanceType<T>>>} preloads Array of templates to preload.
   * @returns {Promise<SimplePaginatorContract<InstanceType<T>>>} Query paginated.
   */
  public async paginate(
    page: number,
    limit: number,
    preloads?: Array<ExtractModelRelations<InstanceType<T>>>
  ): Promise<ModelPaginatorContract<InstanceType<T>> | SimplePaginatorContract<InstanceType<T>>> {
    const query = this.model.query()
    if (preloads) {
      for (const preload of preloads) {
        query.preload(preload)
      }
    }
    return query.paginate(page, limit)
  }

  /**
   * Returns all models saved to DB.
   *
   * @returns {Promise<Array<InstanceType<T>>>} Array of entities.
   */
  public async all(): Promise<Array<InstanceType<T>>> {
    return this.model.all()
  }

  /**
   * Searches and returns a model, it is searched by id identifier.
   *
   * @param {number} id Entity identifier.
   * @returns {Promise<InstanceType<T> | null>} Entity or null.
   */
  public async find(id: number): Promise<InstanceType<T> | null> {
    return this.findBy('id', id)
  }

  /**
   * Search and returns a model, it is searched by key name and value.
   *
   * @param {string} key Key to filter on.
   * @param {any} value Value to filter on.
   * @returns {Promise<InstanceType<T> | null>} Entity or null.
   */
  public async findBy(key: string, value: any): Promise<InstanceType<T> | null> {
    return this.model.findBy(key, value)
  }

  /**
   * Searches and returns a model, it is searched by id identifier. If it does not exist an exception is thrown.
   *
   * @param {number} id Entity identifier.
   * @returns {Promise<Array<InstanceType<T>>>} Entity.
   */
  public async findOrFail(id: number): Promise<InstanceType<T>> {
    return this.findByOrFail('id', id)
  }

  /**
   * Search and returns a model, it is searched by key name and value. If it does not exist an exception is thrown.
   *
   * @param {string} key Key to filter on.
   * @param {any} value Value to filter on.
   * @returns {Promise<InstanceType<T>>} Entity.
   */
  public async findByOrFail(key: string, value: any): Promise<InstanceType<T>> {
    return this.model.findByOrFail(key, value)
  }

  /**
   * Save a model to DB.
   *
   * @param {Partial<ModelAttributes<InstanceType<T>>>} data Object with the values of the entity to save.
   * @returns {Promise<InstanceType<T>>} Entity.
   */
  public async store(data: Partial<ModelAttributes<InstanceType<T>>>): Promise<InstanceType<T>> {
    return this.model.create(this.onlyFillable(data))
  }

  /**
   * Update a model by searching it via id.
   *
   * @param {number} id Entity identifier.
   * @param {Partial<ModelAttributes<InstanceType<T>>>} data Object with the values of the entity to update.
   * @returns {Promise<InstanceType<T>>} Entity.
   */
  public async update(
    id: number,
    data: Partial<ModelAttributes<InstanceType<T>>>
  ): Promise<InstanceType<T>> {
    const model = await this.findOrFail(id)
    model.merge(this.onlyFillable(data))
    return model.save()
  }

  /**
   * Delete a model, it will be searched by identifying id.
   *
   * @param {number} id Entity identifier.
   * @returns {Promise<void>}
   */
  public async delete(id: number): Promise<void> {
    const model = await this.model.findOrFail(id)
    return model.delete()
  }

  /**
   * Get only fillable data
   *
   * @param {Object} object Object to filter.
   * @return {Promise<Object>} Filtered object.
   * @private
   */
  private onlyFillable(object) {
    const keys = Array.from(this.model.$columnsDefinitions.keys())

    return keys.reduce((obj, key) => {
      if (object && object.hasOwnProperty(key)) {
        obj[key] = object[key]
      }
      return obj
    }, {})
  }
}

export default LucidRepository
