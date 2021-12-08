import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import axios from 'axios'

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
      console.log('enviado: ', password, ', registrado do usuario: ', user.data.password)
      const result = await Hash.verify(user.data.password, password)
      return result
    } catch (err) {
      response.send(err)
      console.log(err)
    }
  }
}
