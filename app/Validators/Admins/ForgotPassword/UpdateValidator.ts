import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ForgotPasswordUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    token: schema.string({}, [rules.exists({ table: 'admins', column: 'token' })]),
    password: schema.string({}, [rules.confirmed()]),
  })
}
