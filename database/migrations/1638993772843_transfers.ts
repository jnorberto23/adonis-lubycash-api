import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Transfers extends BaseSchema {
  protected tableName = 'transfers'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('sender_cpf', 11).notNullable()
      table.string('beneficiary_cpf', 11).notNullable()
      table.string('value').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
