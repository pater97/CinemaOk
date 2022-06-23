/**
 *
 * @typedef {Object} DTResponse
 * @property {number} draw Write version.
 * @property {number} recordsTotal Total number of items for the entity.
 * @property {number} recordsFiltered Total number of filtered elements.
 * @property {Array<Object.<string, any>>} data Array of elements to show in table.
 * @property {string} error Error message.
 * @category DataTable
 */
interface DTResponse {
  draw: number
  recordsTotal: number
  recordsFiltered: number
  data: Array<{ [key: string]: any }>
  error?: string
}

export default DTResponse
