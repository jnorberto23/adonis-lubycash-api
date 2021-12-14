import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import jwt from 'jsonwebtoken'

export default class ClientAuth {
  public async handle(
    { request, params, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const reqToken = request.request.headers['authorization']
    const [, token] = reqToken!.toString().split(' ')
    try {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET)
      params.client = decoded
      await next()
    } catch {
      response.unauthorized({
        errors: [
          {
            message: 'E_UNAUTHORIZED_ACCESS: Unauthorized access',
          },
        ],
      })
    }
  }
}
