import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import axios from 'axios'
import jwt from 'jsonwebtoken'

export default class AdminAuthController {
  public async adminLogin({ request, auth }: HttpContextContract) {
    const { email, password } = request.all()
    const token = await auth.attempt(email, password)
    return token
  }
  public async clientLogin({ request, response }: HttpContextContract) {
    const { email, password } = request.all()
    try {
      const user = await axios.get(`${process.env.MS_URL}/users/${email}`)

      const result = await Hash.verify(user.data.password, password)
      if (result) {
        const jwtToken = jwt.sign(
          {
            id: user.data.id,
            email: user.data.email,
            cpf: user.data.cpf_number,
            phone: user.data.phone,
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
