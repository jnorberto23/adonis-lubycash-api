import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Admin from 'App/Models/Admin'
import crypto from 'crypto'
import moment from 'moment'
//import MailDelivery from 'App/Services/Kafka/MailDelivery'
import updateValidator from 'App/Validators/Admins/ForgotPassword/UpdateValidator'
export default class ForgotPasswordsAdminsController {
  public async store({ request, response }: HttpContextContract) {
    try {
      const email = request.input('email')
      const admin = await Admin.findByOrFail('email', email)
      admin.token = crypto.randomBytes(10).toString('hex')
      admin.tokenCreatedAt = new Date()
      await admin.save()
      const link = `${request.input('redirect_url')}?token=${admin.token}`
      //await new MailDelivery().send(user, { link }, 'forgotPassword', 'Recupeção de senha')
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Algo não deu certo, esse e-mail existe?' } })
    }
  }

  public async update({ request, response }) {
    await request.validate(updateValidator)
    try {
      const { token, password } = request.all()
      const admin = await Admin.findByOrFail('token', token)

      const tokenExpired = moment().subtract('2', 'days').isAfter(admin.tokenCreatedAt)

      if (tokenExpired) {
        return response.status(401).send({
          error: {
            message: 'Ops, o token de recupeção está expirado, pois já se passaram 48 horas.',
          },
        })
      }

      admin.token = null as any
      admin.tokenCreatedAt = null as any
      admin.password = password

      await admin.save()
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Ops, algo deu errado ao tentar resetar sua senha :(' } })
    }
  }
}
