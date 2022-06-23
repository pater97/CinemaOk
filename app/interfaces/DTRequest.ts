/**
 *
 * @typedef {object} DTSearch
 * @property {string} value Value to search.
 * @property {boolean} regex Is it a regex?
 * @category DataTable
 */
interface DTSearch {
  value: string
  regex: boolean
}

/**
 *
 * @typedef {object} DTRequestColumn
 * @property {string} data Column name on db.
 * @property {string} name Column name to show on table.
 * @property {boolean} searchable Is it searchable?
 * @property {boolean} orderable Is it orderable?
 * @property {DTSearch} search Search model.
 * @category DataTable
 */
interface DTRequestColumn {
  data: string
  name: string
  searchable: boolean
  orderable: boolean
  search: DTSearch
}

/**
 *
 * @typedef {object} DTRequestOrder
 * @property {number} column Column name on db.
 * @property {('asc' | 'desc')} dir Sorting direction.
 * @category DataTable
 */
interface DTRequestOrder {
  column: number
  dir: 'asc' | 'desc'
}

/**
 *
 * @typedef {object} DTRequest
 * @property {number} draw Write version.
 * @property {Array<DTRequestColumn>} columns Array of required columns
 * @property {Array<DTRequestOrder>} order Array of sorting types.
 * @property {number} start Number of elements to discard.
 * @property {number} length Number of elements to filter.
 * @property {DTSearch} search Search model
 * @category DataTable
 */
interface DTRequest {
  draw: number
  columns: Array<DTRequestColumn>
  order: Array<DTRequestOrder>
  start: number
  length: number
  search: DTSearch
}

export default DTRequest
