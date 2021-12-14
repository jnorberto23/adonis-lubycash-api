import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MessagesCustom from 'App/Validators/MessagesCustom'

export default class ForgotPasswordUpdateValidator extends MessagesCustom {
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public schema = schema.create({
    token: schema.string({}, [rules.exists({ table: 'admins', column: 'token' })]),
    password: schema.string({}, [rules.confirmed()]),
  })
}
