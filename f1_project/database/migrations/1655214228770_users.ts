//estende di default il baseschema
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('email',255).notNullable().unique()
      table.string('password',50).notNullable()
      table.string('name',255).notNullable()
      table.string('surname',255).notNullable()
      table.string('avatar',255).nullable().defaultTo('noimage')
      table.boolean('isAdmin').defaultTo(false)
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
