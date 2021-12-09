import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AdminAuthValidator from 'App/Validators/Auth/AdminAuthValidator'

import Hash from '@ioc:Adonis/Core/Hash'
import axios from 'axios'
import jwt from 'jsonwebtoken'

export default class AdminAuthController {
  public async adminLogin({ request, auth }: HttpContextContract) {
    await request.validate(AdminAuthValidator)
    const { email, password } = request.all()
    const token = await auth.attempt(email, password)
    return token
  }
  public async clientLogin({ request, response }: HttpContextContract) {
    const { cpf, password } = request.all()
    try {
      const user = await axios.get(`${process.env.MS_URL}/users/${cpf}`)

      const result = await Hash.verify(user.data.password, password)
      if (result) {
        const jwtToken = jwt.sign(
          {
            id: user.data.id,
            name: user.data.full_name,
            email: user.data.email,
            cpf: user.data.cpf_number,
            phone: user.data.phone,
            balance: user.data.current_balance,
          },
          process.env.JWT_SECRET
        )
        const [token] = jwtToken.split(' ')
        return { type: 'bearer', token: token }
      }
    } catch (err) {
      response.send(err)
      console.log(err)
    }
  }
}
