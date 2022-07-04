//estende di default il baseschema
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('email', 255).notNullable().unique()
      table.string('username', 255).notNullable()
      table.string('password', 255).notNullable()
      table.boolean('is_admin').defaultTo(false)
      table.string('reset_token', 255).nullable
      table.timestamp('reset_token_expiration', { useTz: true }).nullable
      table.string('access_token', 255).nullable
      table.boolean('is_verified').nullable
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
