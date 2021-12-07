import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AdminAuthController {
  public async login({ request, auth }: HttpContextContract) {
    const { email, password } = request.all()
    const token = await auth.attempt(email, password)
    return token
  }
}
