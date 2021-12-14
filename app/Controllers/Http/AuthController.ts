import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AdminAuthValidator from 'App/Validators/Admins/Auth/AdminAuthValidator'

import Hash from '@ioc:Adonis/Core/Hash'
import jwt from 'jsonwebtoken'
import AxiosClients from 'App/Services/Axios/AxiosClients'

export default class AdminAuthController {
  public async adminLogin({ request, auth }: HttpContextContract) {
    await request.validate(AdminAuthValidator)
    const { email, password } = request.all()
    const token = await auth.attempt(email, password)
    return { type: token.type, token: token.token, role: 'admin' }
  }

  public async clientLogin({ request, response }: HttpContextContract) {
    const { cpf, password } = request.all()
    try {
      const { data: user } = await new AxiosClients().get(`cpf_number=${cpf}`)

      if (!user.length) {
        return response.forbidden({ error: { message: 'CPF não encontrado' } })
      }

      const result = await Hash.verify(user[0].password, password)

      if (result) {
        const jwtToken = jwt.sign(
          {
            id: user[0].id,
            name: user[0].full_name,
            email: user[0].email,
            cpf: user[0].cpf_number,
            phone: user[0].phone,
          },
          process.env.JWT_SECRET
        )
        const [token] = jwtToken.split(' ')
        return { type: 'bearer', token: token, role: 'client' }
      } else {
        return response.forbidden({ error: { message: 'Senha incorreta.' } })
      }
    } catch (err) {
      response.send(err)
    }
  }
}
