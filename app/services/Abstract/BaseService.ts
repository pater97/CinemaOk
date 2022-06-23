import {
  ExtractModelRelations,
  LucidModel,
  ModelAttributes,
  ModelPaginatorContract,
} from '@ioc:Adonis/Lucid/Orm'
import { SimplePaginatorContract } from '@ioc:Adonis/Lucid/Database'

import LucidRepository from 'App/Repositories/Abstract/LucidRepository'
import DataTableService from 'App/Services/DataTableService'
import DTResponse from 'App/Interfaces/DTResponse'
import DTRequest from 'App/Interfaces/DTRequest'

/**
 * This abstract class handles the basic operations performed on the various models.
 *
 * @class
 * @category Service
 * @abstract
 */
abstract class BaseService<T extends LucidModel> {
  protected repository: LucidRepository<T>

  protected constructor(repository: LucidRepository<T>) {
    this.repository = repository
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
    return this.repository.paginate(page, limit, preloads)
  }

  /**
   * Returns all models saved to DB.
   *
   * @returns {Promise<Array<InstanceType<T>>>} Array of models.
   */
  public async all(): Promise<Array<InstanceType<T>>> {
    return this.repository.all()
  }

  /**
   * Searches and returns a model, it is searched by id identifier.
   *
   * @param {number} id Entity identifier.
   * @returns {Promise<InstanceType<T> | null>} Entity or null
   */
  public async find(id: number): Promise<InstanceType<T> | null> {
    return this.findBy('id', id)
  }

  /**
   * Search and returns a model, it is searched by key name and value.
   *
   * @param {string} key Key to filter on.
   * @param {any} value Value to filter on.
   * @returns {Promise<InstanceType<T> | null>} Entity or null
   */
  public async findBy(key: string, value: any): Promise<InstanceType<T> | null> {
    return this.repository.findBy(key, value)
  }

  /**
   * Searches and returns a model, it is searched by id identifier. If it does not exist an exception is thrown.
   *
   * @param {number} id Entity identifier.
   * @returns {Promise<InstanceType<T>>} Entity.
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
    return this.repository.findByOrFail(key, value)
  }

  /**
   * Save a model to DB.
   *
   * @param {Partial<ModelAttributes<InstanceType<T>>>} data Object with the values of the entity to save.
   * @returns {Promise<InstanceType<T>>} Entity.
   */
  public async store(data: Partial<ModelAttributes<InstanceType<T>>>): Promise<InstanceType<T>> {
    return this.repository.store(data)
  }

  /**
   * Update a model by searching it via id.
   *
   * @param {number} id Entity identifier.
   * @param {Partial<ModelAttributes<InstanceType<T>>>} data Object with the values of the entity to update.
   * @returns {Promise<InstanceType<T>>}
   */
  public async update(
    id: number,
    data: Partial<ModelAttributes<InstanceType<T>>>
  ): Promise<InstanceType<T>> {
    return this.repository.update(id, data)
  }

  /**
   * Delete a model, it will be searched by identifying id.
   *
   * @param {number} id Entity identifier.
   * @returns {Promise<void>}
   */
  public async delete(id: number): Promise<void> {
    return this.repository.delete(id)
  }

  /**
   * Handles the request to DataTable.
   *
   * @param {DTRequest} dtRequest DataTable Request
   * @returns {Promise<DTResponse>} DataTable Response
   */
  public async dataTables(dtRequest: DTRequest): Promise<DTResponse> {
    const dtService = new DataTableService(dtRequest, this.repository.model)
    return dtService.makeResponse()
  }
}

export default BaseService
