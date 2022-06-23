import { LucidModel } from '@ioc:Adonis/Lucid/Orm'
import Database from '@ioc:Adonis/Lucid/Database'
import { string } from '@ioc:Adonis/Core/Helpers'

import { isEmpty } from 'App/Helpers/YouDontNeedLodash'
import DTResponse from 'App/Interfaces/DTResponse'
import DTRequest from 'App/Interfaces/DTRequest'

/**
 *
 *
 * @typedef {object} DTFilter
 * @property {string} column Column name.
 * @property {string} value Column value.
 * @property {boolean} isRegex Is it a regex?
 * @category DataTable
 */
interface DTFilter {
  column: string
  value: string
  isRegex: boolean
}

/**
 * This service manages the DataTable request.
 *
 * @class
 * @category DataTable
 */
class DataTableService {
  /**
   * @type {DTRequest} DataTable Request
   * @private
   */
  private readonly dtRequest: DTRequest & any

  /**
   * @type {string} Table name
   * @private
   */
  private readonly table: string

  /**
   * @type {Array<string>} Array of column name
   * @private
   */
  private readonly columns: Array<string>

  /**
   * @type {Array<DTFilter>} Array of DataTable filter
   * @private
   */
  private readonly filters: Array<DTFilter>

  /**
   * @type {any}
   * @private
   */
  private readonly query: any

  /**
   * @type {number} Total number of filtered elements.
   * @private
   */
  private recordsFiltered: number

  /**
   * @type {Array<Object<string, any>>} Array of elements to return.
   * @private
   */
  private data: Array<{ [key: string]: any }>

  /**
   * @param {DTRequest} dtRequest DataTable Request
   * @param {LucidModel} model Lucid model on which to perform the operations.
   */
  constructor(dtRequest: DTRequest, model: LucidModel) {
    this.dtRequest = dtRequest
    this.table = model.table
    this.query = Database.from(this.table)
    this.columns = this.getColumns()
    this.filters = this.getFilters()

    this.recordsFiltered = 0
    this.data = []
  }

  /**
   * @returns {Array<string>} Array of column names.
   * @private
   */
  private getColumns(): Array<string> {
    if (isEmpty(this.dtRequest.columns)) return []

    return this.dtRequest.columns
      .filter((column) => {
        if (column.data.includes('.')) return false // relation field
        return column.searchable
      })
      .map((column) => column.data)
  }

  /**
   * @returns {Array<DTFilter>} Array of filter.
   * @private
   */
  private getFilters(): Array<DTFilter> {
    if (isEmpty(this.dtRequest.columns)) return []

    return this.dtRequest.columns
      .filter((column) => {
        if (column.data.includes('.')) return false // relation field
        return column.search.value !== ''
      })
      .map((column) => {
        return {
          column: column.data,
          value: column.search.value,
          isRegex: column.search.regex,
        }
      })
  }

  /**
   * Returns filtered data based on the request.
   *
   * @returns {Promise<DTResponse>} DataTable Response
   */
  public async makeResponse(): Promise<DTResponse> {
    // get total query records data
    this.data = await this.processData()

    // bind relations if any
    await this.processRelations()

    // get total records from database
    const recordsTotal = (await Database.query().count('*').from(this.table))[0]['count(*)']

    return {
      draw: this.dtRequest.draw,
      recordsTotal: recordsTotal,
      recordsFiltered: this.recordsFiltered,
      data: this.data,
    }
  }

  /**
   * Process request data and build the response.
   *
   * @returns {Promise<any>} Returns the built query.
   * @private
   */
  private async processData() {
    await this.processFilter()
    await this.processSearch()
    await this.processSoftDelete()
    await this.processReOrder()

    let response = await this.query
    this.recordsFiltered = response.length

    await this.processPaginate()

    return this.query
  }

  /**
   * Process relationships between models.
   *
   * @returns {Promise<void>}
   * @private
   */
  private async processRelations() {
    if (isEmpty(this.dtRequest.with)) return

    for (let record of this.data) {
      for (let relation of this.dtRequest.with) {
        record[relation.entity] = await DataTableService.loadRelation(record, relation)
      }
    }
  }

  private static async loadRelation(record: any, relation: any) {
    // handle belongsTo
    const isSingular = string.singularize(relation.entity) === relation.entity
    if (isSingular) {
      return Database.from(string.pluralize(relation.entity))
        .where('id', record[relation.lk])
        .first()
    }

    // handle hasMany
    return Database.from(relation.entity).where(
      `${relation.entity}.${relation.fk}`,
      record[relation.lk]
    )
  }

  /**
   * Process filters.
   *
   * @returns {Promise<void>}
   * @private
   */
  private async processFilter() {
    for (let filter of this.filters) {
      if (isEmpty(filter.value) || isEmpty(filter.column)) {
        continue
      }

      if (filter.isRegex) {
        this.query.andWhere(filter.column, 'like', '%' + filter.value + '%')
      } else {
        this.query.andWhere(filter.column, filter.value)
      }
    }
  }

  /**
   * Processes pagination.
   *
   * @returns {Promise<void>}
   * @private
   */
  private async processPaginate() {
    this.query.offset(this.dtRequest.start).limit(this.dtRequest.length)
  }

  /**
   * Process the search.
   *
   * @returns {Promise<void>}
   * @private
   */
  private async processSearch() {
    if (isEmpty(this.dtRequest.search.value)) {
      return
    }

    this.query.where((q) => {
      for (let column of this.columns) {
        if (this.dtRequest.columns.find((c) => c.data === column)?.searchable === 'false') {
          continue
        }

        if (this.dtRequest.search.regex) {
          q.orWhere(column, 'like', '%' + this.dtRequest.search.value + '%')
        } else {
          q.orWhere(column, this.dtRequest.search.value)
        }
      }
    })
  }

  /**
   * Processes sorting.
   *
   * @returns {Promise<void>}
   * @private
   */
  private async processReOrder() {
    if (isEmpty(this.dtRequest.order)) return

    this.query.orderBy(this.columns[this.dtRequest.order[0].column], this.dtRequest.order[0].dir)
  }

  /**
   * Processes soft delete models.
   *
   * @returns {Promise<void>}
   * @private
   */
  private async processSoftDelete() {
    let result = (
      await Database.rawQuery(`show columns from ${this.table} where Field = 'deleted_at'`)
    )[0]
    if (result && result.length > 0) {
      if (isEmpty(this.dtRequest.with_trashed) || this.dtRequest.with_trashed === 'false') {
        this.query.whereNull('deleted_at')
      }
    }
  }
}

export default DataTableService
